import { type Page, type Locator, expect } from "@playwright/test";

export interface ShowtimeFormData {
  movieTitle: string;
  theatreName: string;
  showDate: string; // YYYY-MM-DD
  showTime: string; // HH:mm
  ticketPrice: number;
}

export class AdminShowtimesPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly addShowtimeButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole("heading", { name: "Showtimes" });
    this.addShowtimeButton = page.getByRole("button", { name: "Add Showtime" });
  }

  async goto() {
    await this.page.goto("/admin/showtimes");
  }

  async expectLoaded() {
    await expect(this.heading).toBeVisible();
  }

  async openCreateDialog() {
    await this.addShowtimeButton.click();
    await expect(this.page.getByRole("dialog").getByText("Add Showtime")).toBeVisible();
  }

  async fillShowtimeForm(data: ShowtimeFormData) {
    const dialog = this.page.getByRole("dialog");
    await dialog.getByLabel("Movie").click();
    await this.page.getByRole("option", { name: data.movieTitle }).click();
    await dialog.getByLabel("Theatre Name").fill(data.theatreName);
    await dialog.getByLabel("Show Date").fill(data.showDate);
    await dialog.getByLabel("Show Time").fill(data.showTime);
    await dialog.getByLabel("Ticket Price").fill(String(data.ticketPrice));
  }

  async submitForm() {
    await this.page.getByRole("dialog").getByRole("button", { name: "Create Showtime" }).click();
  }

  async createShowtime(data: ShowtimeFormData) {
    await this.openCreateDialog();
    await this.fillShowtimeForm(data);
    await this.submitForm();
  }

  rowByTheatre(theatreName: string): Locator {
    return this.page.getByRole("row", { name: new RegExp(theatreName) });
  }

  async deleteShowtime(theatreName: string) {
    await this.rowByTheatre(theatreName).getByRole("button", { name: "Delete showtime" }).click();
    const dialog = this.page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await dialog.getByRole("button", { name: "Delete" }).click();
  }

  async expectShowtimeVisible(theatreName: string) {
    await expect(this.rowByTheatre(theatreName)).toBeVisible();
  }

  async expectShowtimeNotVisible(theatreName: string) {
    await expect(this.rowByTheatre(theatreName)).toHaveCount(0);
  }
}
