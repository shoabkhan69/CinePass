import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { RegisterPage } from "../pages/RegisterPage";
import { NavBar } from "../pages/NavBar";
import { newTestUser, seededAdmin } from "../fixtures/test-data";

test.describe("Access control", () => {
  test("an anonymous visitor is redirected to login from protected pages", async ({ page }) => {
    await page.goto("/my-bookings");
    await expect(page).toHaveURL(/\/login/);

    await page.goto("/booking/summary");
    await expect(page).toHaveURL(/\/login/);
  });

  test("an anonymous visitor is redirected to login from the admin area", async ({ page }) => {
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/login/);
  });

  test("a logged-in regular user cannot reach the admin area", async ({ page }) => {
    const registerPage = new RegisterPage(page);
    const nav = new NavBar(page);
    const user = newTestUser();

    await registerPage.goto();
    await registerPage.register(user.name, user.email, user.password);

    // A non-admin should never even see the Admin link.
    await expect(nav.adminLink).toHaveCount(0);

    // And direct navigation should show the "Admins only" message rather than the dashboard,
    // without silently granting access.
    await page.goto("/admin");
    await expect(page).toHaveURL("/admin");
    await expect(page.getByText("Admins only")).toBeVisible();
    await expect(page.getByText("Admin Dashboard")).toHaveCount(0);
  });

  test("the seeded admin sees the Admin link and can reach the dashboard", async ({ page }) => {
    const loginPage = new LoginPage(page);
    const nav = new NavBar(page);

    await loginPage.goto();
    await loginPage.login(seededAdmin.email, seededAdmin.password);

    await expect(nav.adminLink).toBeVisible();
    await nav.goToAdmin();
    await expect(page).toHaveURL("/admin");
    await expect(page.getByRole("heading", { name: "Admin Dashboard" })).toBeVisible();
  });
});
