import { test, expect } from "@playwright/test";
import { HomePage } from "../pages/HomePage";
import { MovieDetailPage } from "../pages/MovieDetailPage";

test.describe("Browsing (no login required)", () => {
  test("home page loads the movie catalog", async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();
    await homePage.expectMoviesLoaded(1);
  });

  test("filtering by genre narrows the results", async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();
    await homePage.expectMoviesLoaded(1);

    const totalBefore = await homePage.movieCards.count();
    // "Sci-Fi" is one of the seeded genres (Nebula Drift).
    await homePage.filterByGenre("Sci-Fi");

    const totalAfter = await homePage.movieCards.count();
    expect(totalAfter).toBeGreaterThan(0);
    expect(totalAfter).toBeLessThanOrEqual(totalBefore);
  });

  test("opening a movie shows its synopsis and showtimes", async ({ page }) => {
    const homePage = new HomePage(page);
    const detailPage = new MovieDetailPage(page);

    await homePage.goto();
    await homePage.expectMoviesLoaded(1);
    await homePage.openMovieByTitle("Nebula Drift");

    await expect(page).toHaveURL(/\/movies\/\d+/);
    await detailPage.expectLoaded("Nebula Drift");
  });

  test("a non-existent route shows the 404 page", async ({ page }) => {
    await page.goto("/this-page-does-not-exist");
    await expect(page.getByText("404")).toBeVisible();
    await expect(page.getByRole("link", { name: "Back to Now Showing" })).toBeVisible();
  });
});
