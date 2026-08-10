import { type Page, type Locator, expect } from "@playwright/test";

export class BookingSuccessPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly viewBookingsButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole("heading", { name: "You're all set!" });
    this.viewBookingsButton = page.getByRole("link", { name: "View My Bookings" });
  }

  async expectLoaded() {
    await expect(this.heading).toBeVisible();
    await expect(this.page.getByText(/Booking #\d+ is confirmed/)).toBeVisible();
  }
}
