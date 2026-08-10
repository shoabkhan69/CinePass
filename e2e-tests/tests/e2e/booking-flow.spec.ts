import { test, expect } from "@playwright/test";
import { HomePage } from "../pages/HomePage";
import { MovieDetailPage } from "../pages/MovieDetailPage";
import { SeatSelectionPage } from "../pages/SeatSelectionPage";
import { BookingSummaryPage } from "../pages/BookingSummaryPage";
import { BookingSuccessPage } from "../pages/BookingSuccessPage";
import { MyBookingsPage } from "../pages/MyBookingsPage";
import { RegisterPage } from "../pages/RegisterPage";
import { LoginPage } from "../pages/LoginPage";
import { newTestUser } from "../fixtures/test-data";

test.describe("Booking flow", () => {
  test("browsing and seat selection work without an account, but confirming requires login", async ({ page }) => {
    const homePage = new HomePage(page);
    const detailPage = new MovieDetailPage(page);
    const seatPage = new SeatSelectionPage(page);

    await homePage.goto();
    await homePage.openMovieByTitle("Nebula Drift");
    await detailPage.expectLoaded("Nebula Drift");

    await detailPage.selectFirstShowtime();
    await expect(page).toHaveURL(/\/showtimes\/\d+\/seats/);

    await seatPage.selectFirstAvailableSeats(1);
    await seatPage.expectSelectedCount(1);
    await seatPage.continueToSummary();

    // No account yet - ProtectedRoute should bounce this to /login rather than the summary page.
    await expect(page).toHaveURL(/\/login/);
  });

  test("selecting more than 6 seats is prevented", async ({ page }) => {
    const homePage = new HomePage(page);
    const detailPage = new MovieDetailPage(page);
    const seatPage = new SeatSelectionPage(page);

    await homePage.goto();
    await homePage.openMovieByTitle("Nebula Drift");
    await detailPage.selectFirstShowtime();

    const availableBefore = await seatPage.getAvailableSeatCodes();
    test.skip(availableBefore.length <= 6, "Not enough available seats left on this showtime to test the cap");

    const picked = await seatPage.selectFirstAvailableSeats(6);
    expect(picked.length).toBe(6);
    await seatPage.expectSelectedCount(6);

    // Any seat that was available *before* selecting, but wasn't one of the 6 picked,
    // should now be disabled purely because of the 6-seat cap (not because it's booked).
    const stillUnpickedButAvailableBefore = availableBefore.filter((code) => !picked.includes(code));
    expect(stillUnpickedButAvailableBefore.length).toBeGreaterThan(0);

    for (const code of stillUnpickedButAvailableBefore.slice(0, 3)) {
      await expect(seatPage.seat(code)).toBeDisabled();
    }
  });

  test("a logged-in user can complete a booking end to end and see it in My Bookings", async ({ page }) => {
    const homePage = new HomePage(page);
    const detailPage = new MovieDetailPage(page);
    const seatPage = new SeatSelectionPage(page);
    const summaryPage = new BookingSummaryPage(page);
    const successPage = new BookingSuccessPage(page);
    const myBookingsPage = new MyBookingsPage(page);
    const registerPage = new RegisterPage(page);

    const user = newTestUser();
    await registerPage.goto();
    await registerPage.register(user.name, user.email, user.password);

    await homePage.goto();
    await homePage.openMovieByTitle("Nebula Drift");
    await detailPage.selectFirstShowtime();

    const seats = await seatPage.selectFirstAvailableSeats(2);
    await seatPage.continueToSummary();

    await summaryPage.expectLoaded();
    await summaryPage.confirm();

    await expect(page).toHaveURL(/\/booking\/success\/\d+/);
    await successPage.expectLoaded();

    await successPage.viewBookingsButton.click();
    await myBookingsPage.expectLoaded();
    await expect(page.getByText(seats.join(", "))).toBeVisible();
    await expect(page.getByText("Confirmed").first()).toBeVisible();
  });

  test("a returning user is sent back to the summary page after logging in mid-flow", async ({ page }) => {
    const homePage = new HomePage(page);
    const detailPage = new MovieDetailPage(page);
    const seatPage = new SeatSelectionPage(page);
    const loginPage = new LoginPage(page);
    const registerPage = new RegisterPage(page);
    const summaryPage = new BookingSummaryPage(page);

    // Create the account first (separately), then log out implicitly by using a fresh context
    // isn't available here, so instead: register, then navigate away, then simulate "returning"
    // by clearing storage and logging back in from the seat-selection continue redirect.
    const user = newTestUser();
    await registerPage.goto();
    await registerPage.register(user.name, user.email, user.password);
    await page.evaluate(() => localStorage.clear());
    await page.reload();

    await homePage.goto();
    await homePage.openMovieByTitle("Nebula Drift");
    await detailPage.selectFirstShowtime();
    await seatPage.selectFirstAvailableSeats(1);
    await seatPage.continueToSummary();

    await expect(page).toHaveURL(/\/login/);
    await loginPage.login(user.email, user.password);

    await summaryPage.expectLoaded();
  });
});
