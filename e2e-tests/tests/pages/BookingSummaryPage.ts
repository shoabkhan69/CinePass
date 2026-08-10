import { type Page, type Locator, expect } from "@playwright/test";

export class BookingSummaryPage {
  readonly page: Page;
  readonly confirmButton: Locator;
  readonly changeSeatsButton: Locator;
  readonly heading: Locator;

  constructor(page: Page) {
    this.page = page;
    this.confirmButton = page.getByRole("button", { name: "Confirm Booking" });
    this.changeSeatsButton = page.getByRole("button", { name: "Change seats" });
    this.heading = page.getByRole("heading", { name: "Confirm your booking" });
  }

  async expectLoaded() {
    await expect(this.heading).toBeVisible();
  }

  async confirm() {
    await this.confirmButton.click();
  }
}
