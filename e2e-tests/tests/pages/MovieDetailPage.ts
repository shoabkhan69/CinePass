import { type Page, type Locator, expect } from "@playwright/test";

export class MovieDetailPage {
  readonly page: Page;
  readonly showtimesHeading: Locator;

  constructor(page: Page) {
    this.page = page;
    this.showtimesHeading = page.getByRole("heading", { name: "Showtimes" });
  }

  async expectLoaded(movieTitle: string) {
    await expect(this.page.getByRole("heading", { name: movieTitle })).toBeVisible();
    await expect(this.showtimesHeading).toBeVisible();
  }

  /** Clicks the first available showtime slot (a Paper "button" showing time/theatre/price). */
  async selectFirstShowtime() {
    const firstShowtime = this.page.locator("button").filter({ hasText: /AM|PM/ }).first();
    await firstShowtime.click();
  }
}
