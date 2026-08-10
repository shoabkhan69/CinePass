import { defineConfig, devices } from "@playwright/test";

/**
 * Runs against a CinePass instance that's already up:
 *   frontend: npm run dev        (default http://localhost:5173)
 *   backend:  mvn spring-boot:run (default http://localhost:8080)
 *
 * Override with env vars if you're pointing at a different environment:
 *   BASE_URL=http://localhost:5173 API_BASE_URL=http://localhost:8080/api npx playwright test
 */
const BASE_URL = process.env.BASE_URL || "http://localhost:5173";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false, // booking/seat tests share backend state - keep this deterministic
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  reporter: [["html", { open: "never" }], ["list"]],
  timeout: 30_000,
  expect: { timeout: 8_000 },

  use: {
    baseURL: BASE_URL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
