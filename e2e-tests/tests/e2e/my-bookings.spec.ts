import { test, expect } from "@playwright/test";
import { HomePage } from "../pages/HomePage";
import { MovieDetailPage } from "../pages/MovieDetailPage";
import { SeatSelectionPage } from "../pages/SeatSelectionPage";
import { BookingSummaryPage } from "../pages/BookingSummaryPage";
import { MyBookingsPage } from "../pages/MyBookingsPage";
import { RegisterPage } from "../pages/RegisterPage";
import { newTestUser } from "../fixtures/test-data";

test.describe("My Bookings & cancellation", () => {
  test("cancelling a booking immediately frees its seat for someone else", async ({ page }) => {
    const homePage = new HomePage(page);
    const detailPage = new MovieDetailPage(page);
    const seatPage = new SeatSelectionPage(page);
    const summaryPage = new BookingSummaryPage(page);
    const myBookingsPage = new MyBookingsPage(page);
    const registerPage = new RegisterPage(page);

    const user = newTestUser();
    await registerPage.goto();
    await registerPage.register(user.name, user.email, user.password);

    await homePage.goto();
    await homePage.openMovieByTitle("Nebula Drift");
    await detailPage.selectFirstShowtime();

    const [seatCode] = await seatPage.selectFirstAvailableSeats(1);
    await seatPage.continueToSummary();
    await summaryPage.expectLoaded();
    await summaryPage.confirm();

    await expect(page).toHaveURL(/\/booking\/success\/(\d+)/);
    const bookingId = page.url().split("/").pop()!;

    await myBookingsPage.goto();
    await myBookingsPage.expectBookingStatus(bookingId, "Confirmed");

    await myBookingsPage.cancelBooking(bookingId);
    await myBookingsPage.expectBookingStatus(bookingId, "Cancelled");

    // Re-enter the same showtime and confirm the seat is bookable again.
    await homePage.goto();
    await homePage.openMovieByTitle("Nebula Drift");
    await detailPage.selectFirstShowtime();
    await expect(seatPage.seat(seatCode)).toBeEnabled();
  });

  test("a user only sees their own bookings", async ({ page }) => {
    const registerPage = new RegisterPage(page);
    const myBookingsPage = new MyBookingsPage(page);
    const user = newTestUser();

    await registerPage.goto();
    await registerPage.register(user.name, user.email, user.password);
    await myBookingsPage.goto();
    await myBookingsPage.expectLoaded();

    // A brand-new account should start with no bookings at all.
    await expect(page.getByText("No bookings yet")).toBeVisible();
  });
});
