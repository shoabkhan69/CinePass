import { type Page, type Locator, expect } from "@playwright/test";

export class NavBar {
  readonly page: Page;
  readonly logInLink: Locator;
  readonly signUpLink: Locator;
  readonly nowShowingLink: Locator;
  readonly myBookingsLink: Locator;
  readonly adminLink: Locator;
  readonly avatarButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.logInLink = page.getByRole("link", { name: "Log in" });
    this.signUpLink = page.getByRole("link", { name: "Sign up" });
    this.nowShowingLink = page.getByRole("link", { name: "Now Showing" });
    this.myBookingsLink = page.getByRole("link", { name: "My Bookings" });
    this.adminLink = page.getByRole("link", { name: "Admin", exact: true });
    // Avatar button has no accessible name of its own; target the icon button
    // that wraps the MUI Avatar element directly.
    this.avatarButton = page.locator("button:has(.MuiAvatar-root)");
  }

  async logOut() {
    await this.avatarButton.click();
    await this.page.getByRole("menuitem", { name: "Log out" }).click();
  }

  async goToMyBookings() {
    await this.myBookingsLink.click();
  }

  async goToAdmin() {
    await this.adminLink.click();
  }

  async expectLoggedInAs(email: string) {
    await this.avatarButton.click();
    await expect(this.page.getByRole("menuitem", { name: email })).toBeVisible();
    await this.page.keyboard.press("Escape");
  }

  async expectLoggedOut() {
    await expect(this.logInLink).toBeVisible();
    await expect(this.signUpLink).toBeVisible();
  }
}
