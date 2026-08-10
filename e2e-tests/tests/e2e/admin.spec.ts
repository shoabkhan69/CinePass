import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { AdminMoviesPage } from "../pages/AdminMoviesPage";
import { AdminShowtimesPage } from "../pages/AdminShowtimesPage";
import { HomePage } from "../pages/HomePage";
import { MovieDetailPage } from "../pages/MovieDetailPage";
import { SeatSelectionPage } from "../pages/SeatSelectionPage";
import { BookingSummaryPage } from "../pages/BookingSummaryPage";
import { RegisterPage } from "../pages/RegisterPage";
import { newTestMovie, newTestUser, seededAdmin, farFutureDate } from "../fixtures/test-data";

test.describe("Admin panel", () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(seededAdmin.email, seededAdmin.password);
  });

  test("admin can create, edit, and delete a movie with no showtimes", async ({ page }) => {
    const adminMovies = new AdminMoviesPage(page);
    const movie = newTestMovie();

    await adminMovies.goto();
    await adminMovies.expectLoaded();

    await adminMovies.createMovie(movie);
    await adminMovies.expectMovieVisible(movie.title);

    // Edit: change the genre and confirm it's reflected in the row.
    await adminMovies.rowByTitle(movie.title).getByRole("button", { name: "Edit movie" }).click();
    const dialog = page.getByRole("dialog");
    await expect(dialog.getByText("Edit Movie")).toBeVisible();
    await dialog.getByLabel("Genre").fill("Comedy");
    await dialog.getByRole("button", { name: "Save Changes" }).click();
    await expect(adminMovies.rowByTitle(movie.title)).toContainText("Comedy");

    // Delete: this movie has no showtimes, so it should succeed outright.
    await adminMovies.deleteMovie(movie.title);
    await adminMovies.expectMovieNotVisible(movie.title);
  });

  test("admin can schedule and remove a showtime", async ({ page }) => {
    const adminMovies = new AdminMoviesPage(page);
    const adminShowtimes = new AdminShowtimesPage(page);
    const movie = newTestMovie();

    await adminMovies.goto();
    await adminMovies.createMovie(movie);
    await adminMovies.expectMovieVisible(movie.title);

    await adminShowtimes.goto();
    await adminShowtimes.expectLoaded();

    const theatreName = `QA Test Theatre ${Date.now()}`;
    await adminShowtimes.createShowtime({
      movieTitle: movie.title,
      theatreName,
      showDate: farFutureDate(),
      showTime: "20:00",
      ticketPrice: 300,
    });
    await adminShowtimes.expectShowtimeVisible(theatreName);

    // No bookings against it yet, so deletion should succeed.
    await adminShowtimes.deleteShowtime(theatreName);
    await adminShowtimes.expectShowtimeNotVisible(theatreName);

    // Cleanup: the movie now has no showtimes again, so it can be deleted too.
    await adminMovies.goto();
    await adminMovies.deleteMovie(movie.title);
    await adminMovies.expectMovieNotVisible(movie.title);
  });

  test("cannot delete a movie that still has a showtime scheduled", async ({ page }) => {
    const adminMovies = new AdminMoviesPage(page);
    const adminShowtimes = new AdminShowtimesPage(page);
    const movie = newTestMovie();
    const theatreName = `QA Guardrail Theatre ${Date.now()}`;

    await adminMovies.goto();
    await adminMovies.createMovie(movie);

    await adminShowtimes.goto();
    await adminShowtimes.createShowtime({
      movieTitle: movie.title,
      theatreName,
      showDate: farFutureDate(),
      showTime: "18:30",
      ticketPrice: 280,
    });
    await adminShowtimes.expectShowtimeVisible(theatreName);

    await adminMovies.goto();
    await adminMovies.deleteMovie(movie.title);
    await adminMovies.expectDeleteBlockedError("still has showtimes scheduled");
    // The movie must still be there - the delete was rejected, not silently ignored.
    await adminMovies.expectMovieVisible(movie.title);

    // Cleanup for future test runs: remove the showtime, then the movie.
    await adminShowtimes.goto();
    await adminShowtimes.deleteShowtime(theatreName);
    await adminMovies.goto();
    await adminMovies.deleteMovie(movie.title);
  });

  test("cannot delete a showtime that already has a booking against it", async ({ page, context }) => {
    const adminMovies = new AdminMoviesPage(page);
    const adminShowtimes = new AdminShowtimesPage(page);
    const movie = newTestMovie();
    const theatreName = `QA Booked Theatre ${Date.now()}`;

    await adminMovies.goto();
    await adminMovies.createMovie(movie);

    await adminShowtimes.goto();
    await adminShowtimes.createShowtime({
      movieTitle: movie.title,
      theatreName,
      showDate: farFutureDate(),
      showTime: "21:15",
      ticketPrice: 260,
    });

    // Book a seat against this new showtime as a separate (non-admin) user, in a fresh
    // browser context so we don't disturb the admin's own logged-in session.
    const userContext = await context.browser()!.newContext();
    const userPage = await userContext.newPage();
    const registerPage = new RegisterPage(userPage);
    const homePage = new HomePage(userPage);
    const detailPage = new MovieDetailPage(userPage);
    const seatPage = new SeatSelectionPage(userPage);
    const summaryPage = new BookingSummaryPage(userPage);
    const user = newTestUser();

    await registerPage.goto();
    await registerPage.register(user.name, user.email, user.password);
    await homePage.goto();
    await homePage.openMovieByTitle(movie.title);
    await detailPage.expectLoaded(movie.title);
    await detailPage.selectFirstShowtime();
    await seatPage.selectFirstAvailableSeats(1);
    await seatPage.continueToSummary();
    await summaryPage.confirm();
    await expect(userPage).toHaveURL(/\/booking\/success\/\d+/);
    await userContext.close();

    // Back on the admin side: deleting this showtime should now be blocked.
    await adminShowtimes.goto();
    await adminShowtimes.deleteShowtime(theatreName);
    await adminShowtimes.expectShowtimeVisible(theatreName);
    await expect(page.getByText(/already has bookings/)).toBeVisible();
  });
});
