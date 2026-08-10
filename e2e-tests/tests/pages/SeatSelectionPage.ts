import { type Page, type Locator, expect } from "@playwright/test";

export class SeatSelectionPage {
  readonly page: Page;
  readonly continueButton: Locator;
  readonly seatCountLabel: Locator;

  constructor(page: Page) {
    this.page = page;
    this.continueButton = page.getByRole("button", { name: "Continue to Summary" });
    this.seatCountLabel = page.getByText(/seats selected/);
  }

  /** Seats render as unlabeled <button> elements with a title attribute equal to their code, e.g. "C4". */
  seat(code: string): Locator {
    return this.page.locator(`button[title="${code}"]`);
  }

  async selectSeats(codes: string[]) {
    for (const code of codes) {
      await this.seat(code).click();
    }
  }

  /** Returns the seat codes that are currently clickable (available), for snapshotting state before/after an action. */
  async getAvailableSeatCodes(): Promise<string[]> {
    const allSeatButtons = this.page.locator("button[title]");
    const total = await allSeatButtons.count();
    const available: string[] = [];
    for (let i = 0; i < total; i++) {
      const button = allSeatButtons.nth(i);
      if (await button.isEnabled()) {
        const code = await button.getAttribute("title");
        if (code) available.push(code);
      }
    }
    return available;
  }

  /**
   * Picks the first `count` seats that are currently enabled (available), rather than
   * hardcoding seat codes - which seats are already booked varies across repeated runs
   * against a persistent database.
   */
  async selectFirstAvailableSeats(count: number): Promise<string[]> {
    const available = await this.getAvailableSeatCodes();
    if (available.length < count) {
      throw new Error(`Only ${available.length} available seats, needed ${count}`);
    }
    const picked = available.slice(0, count);
    for (const code of picked) {
      await this.seat(code).click();
    }
    return picked;
  }

  async expectSeatBooked(code: string) {
    await expect(this.seat(code)).toBeDisabled();
  }

  async expectSelectedCount(count: number) {
    await expect(this.seatCountLabel).toContainText(`${count} of 6 seats selected`);
  }

  async continueToSummary() {
    await this.continueButton.click();
  }
}
