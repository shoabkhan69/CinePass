import { type Page, type Locator, expect } from "@playwright/test";

export interface MovieFormData {
  title: string;
  genre: string;
  duration: number;
  rating: number;
  posterUrl: string;
  synopsis: string;
  cast?: string;
}

export class AdminMoviesPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly addMovieButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole("heading", { name: "Movies" });
    this.addMovieButton = page.getByRole("button", { name: "Add Movie" });
  }

  async goto() {
    await this.page.goto("/admin/movies");
  }

  async expectLoaded() {
    await expect(this.heading).toBeVisible();
  }

  async openCreateDialog() {
    await this.addMovieButton.click();
    await expect(this.page.getByRole("dialog").getByText("Add Movie")).toBeVisible();
  }

  async fillMovieForm(movie: MovieFormData) {
    const dialog = this.page.getByRole("dialog");
    await dialog.getByLabel("Title").fill(movie.title);
    await dialog.getByLabel("Genre").fill(movie.genre);
    await dialog.getByLabel("Duration (min)").fill(String(movie.duration));
    await dialog.getByLabel("Rating (0-5)").fill(String(movie.rating));
    await dialog.getByLabel("Poster URL").fill(movie.posterUrl);
    await dialog.getByLabel("Synopsis").fill(movie.synopsis);
    if (movie.cast) {
      await dialog.getByLabel("Cast (comma-separated)").fill(movie.cast);
    }
  }

  async submitForm() {
    await this.page.getByRole("dialog").getByRole("button", { name: "Create Movie" }).click();
  }

  async createMovie(movie: MovieFormData) {
    await this.openCreateDialog();
    await this.fillMovieForm(movie);
    await this.submitForm();
  }

  rowByTitle(title: string): Locator {
    return this.page.getByRole("row", { name: new RegExp(title) });
  }

  async deleteMovie(title: string) {
    await this.rowByTitle(title).getByRole("button", { name: "Delete movie" }).click();
    const dialog = this.page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await dialog.getByRole("button", { name: "Delete" }).click();
  }

  async expectDeleteBlockedError(messageContains: string) {
    // Deletion failures surface as a toast (notistack), not the dialog itself.
    await expect(this.page.getByText(messageContains)).toBeVisible();
  }

  async expectMovieVisible(title: string) {
    await expect(this.rowByTitle(title)).toBeVisible();
  }

  async expectMovieNotVisible(title: string) {
    await expect(this.rowByTitle(title)).toHaveCount(0);
  }
}
