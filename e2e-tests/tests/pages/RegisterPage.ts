import { type Page, type Locator, expect } from "@playwright/test";

export class RegisterPage {
  readonly page: Page;
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly submitButton: Locator;
  readonly errorAlert: Locator;

  constructor(page: Page) {
    this.page = page;
    this.nameInput = page.getByLabel("Full name");
    this.emailInput = page.getByLabel("Email");
    this.passwordInput = page.getByLabel("Password", { exact: true });
    this.confirmPasswordInput = page.getByLabel("Confirm password");
    this.submitButton = page.getByRole("button", { name: "Sign up" });
    this.errorAlert = page.getByRole("alert");
  }

  async goto() {
    await this.page.goto("/register");
  }

  async register(name: string, email: string, password: string, confirmPassword = password) {
    await this.nameInput.fill(name);
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.confirmPasswordInput.fill(confirmPassword);
    await this.submitButton.click();
  }

  async expectFieldError(fieldLabel: string, messageContains: string) {
    // React Hook Form renders the error as MUI helper text right under the field.
    const field = this.page.getByLabel(fieldLabel, { exact: true });
    const fieldId = await field.getAttribute("id");
    await expect(this.page.locator(`#${fieldId}-helper-text`)).toContainText(messageContains);
  }
}
