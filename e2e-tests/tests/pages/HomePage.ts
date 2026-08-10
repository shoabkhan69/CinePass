import { type Page, type Locator, expect } from "@playwright/test";

export class HomePage {
  readonly page: Page;
  readonly heading: Locator;
  readonly movieCards: Locator;
  readonly allGenresChip: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole("heading", { name: "Now Showing" });
    this.movieCards = page.locator(".MuiCard-root");
    this.allGenresChip = page.getByText("All genres");
  }

  async goto() {
    await this.page.goto("/");
  }

  async expectMoviesLoaded(minimumCount = 1) {
    await expect(this.heading).toBeVisible();
    await expect(this.movieCards.first()).toBeVisible();
    expect(await this.movieCards.count()).toBeGreaterThanOrEqual(minimumCount);
  }

  async filterByGenre(genre: string) {
    await this.page.getByText(genre, { exact: true }).click();
  }

  async openMovieByTitle(title: string) {
    await this.page.getByText(title, { exact: true }).click();
  }

  movieCardByTitle(title: string): Locator {
    return this.movieCards.filter({ hasText: title });
  }
}
