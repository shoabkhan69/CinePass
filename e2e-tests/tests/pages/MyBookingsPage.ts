import { type Page, type Locator, expect } from "@playwright/test";

export class MyBookingsPage {
  readonly page: Page;
  readonly heading: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole("heading", { name: "My Bookings" });
  }

  async goto() {
    await this.page.goto("/my-bookings");
  }

  async expectLoaded() {
    await expect(this.heading).toBeVisible();
  }

  /** Scopes to the ticket-stub block for a given booking id, e.g. "#000482". */
  bookingBlockByNumber(bookingId: number | string): Locator {
    const padded = String(bookingId).padStart(6, "0");
    return this.page.locator("div", { hasText: `BOOKING #${padded}` }).last();
  }

  async cancelBooking(bookingId: number | string) {
    const block = this.bookingBlockByNumber(bookingId);
    await block.getByRole("button", { name: "Cancel booking" }).click();
    const dialog = this.page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await dialog.getByRole("button", { name: "Cancel booking" }).click();
  }

  async expectBookingStatus(bookingId: number | string, status: "Confirmed" | "Cancelled") {
    const block = this.bookingBlockByNumber(bookingId);
    await expect(block.getByText(status, { exact: true })).toBeVisible();
  }
}
