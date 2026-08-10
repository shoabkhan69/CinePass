import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { RegisterPage } from "../pages/RegisterPage";
import { HomePage } from "../pages/HomePage";
import { NavBar } from "../pages/NavBar";
import { newTestUser, seededAdmin } from "../fixtures/test-data";

test.describe("Authentication", () => {
  test("a new user can register and lands logged in", async ({ page }) => {
    const registerPage = new RegisterPage(page);
    const nav = new NavBar(page);
    const user = newTestUser();

    await registerPage.goto();
    await registerPage.register(user.name, user.email, user.password);

    await expect(page).toHaveURL("/");
    await nav.expectLoggedInAs(user.email);
  });

  test("registering with a too-short password shows a validation error", async ({ page }) => {
    const registerPage = new RegisterPage(page);
    const user = newTestUser();

    await registerPage.goto();
    await registerPage.register(user.name, user.email, "short", "short");

    await registerPage.expectFieldError("Password", "at least 8 characters");
    await expect(page).toHaveURL("/register");
  });

  test("registering with mismatched passwords shows a validation error", async ({ page }) => {
    const registerPage = new RegisterPage(page);
    const user = newTestUser();

    await registerPage.goto();
    await registerPage.register(user.name, user.email, user.password, "SomethingElse123");

    await registerPage.expectFieldError("Confirm password", "do not match");
  });

  test("the seeded admin can log in", async ({ page }) => {
    const loginPage = new LoginPage(page);
    const nav = new NavBar(page);

    await loginPage.goto();
    await loginPage.login(seededAdmin.email, seededAdmin.password);

    await expect(page).toHaveURL("/");
    await nav.expectLoggedInAs(seededAdmin.email);
    await expect(nav.adminLink).toBeVisible();
  });

  test("logging in with the wrong password is rejected", async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login(seededAdmin.email, "DefinitelyWrongPassword1");

    await loginPage.expectError("Invalid email or password");
    await expect(page).toHaveURL("/login");
  });

  test("a logged-in user can log out and loses access to protected pages", async ({ page }) => {
    const registerPage = new RegisterPage(page);
    const nav = new NavBar(page);
    const homePage = new HomePage(page);
    const user = newTestUser();

    await registerPage.goto();
    await registerPage.register(user.name, user.email, user.password);
    await homePage.goto();

    await nav.logOut();
    await nav.expectLoggedOut();

    await page.goto("/my-bookings");
    await expect(page).toHaveURL(/\/login/);
  });
});
