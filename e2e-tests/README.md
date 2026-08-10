# CinePass — E2E QA Automation Suite

Playwright end-to-end tests that drive a real browser against a running CinePass instance
(frontend + backend), covering the actual user-facing flows — not mocked API responses.

## What's covered (24 tests across 6 files)

| File | Covers |
|---|---|
| `auth.spec.ts` | Register, login, logout, validation errors, wrong-password rejection |
| `browsing.spec.ts` | Home page catalog load, genre filter, movie detail, 404 page |
| `booking-flow.spec.ts` | Full browse → seat select → login gate → summary → confirm → success flow; the 6-seat cap; returning to the flow after logging in mid-way |
| `my-bookings.spec.ts` | Viewing bookings, cancelling a booking, confirming the seat becomes bookable again |
| `admin.spec.ts` | Movie/showtime CRUD, and both data-integrity guardrails (can't delete a movie with showtimes; can't delete a showtime with bookings) |
| `access-control.spec.ts` | Anonymous users redirected to login; non-admins blocked from `/admin`; the seeded admin can reach it |

Each test that needs a movie/showtime/user creates its own throwaway fixture (via `tests/fixtures/test-data.ts`) with a timestamp-based unique name, so the suite is safe to run repeatedly against a real, persistent database — it doesn't require a fresh H2 reset between runs.

## Structure

```
e2e-tests/
├── playwright.config.ts
├── tests/
│   ├── pages/        Page Object Models (one class per screen)
│   ├── fixtures/      test-data.ts — unique user/movie/showtime generators
│   └── e2e/           the 6 spec files above
```

Page Object Models keep every selector in one place per screen, so if you change a label or button
text in the React app, you fix it in one file instead of hunting through every test.

## Running it

You need the full stack up first:

```bash
# Terminal 1
cd backend && mvn spring-boot:run

# Terminal 2
cd frontend && npm run dev
```

Then, in a third terminal:

```bash
cd e2e-tests
npm install
npx playwright install chromium   # one-time browser download
npm test                          # headless run
npm run test:headed               # watch it click through the app
npm run test:ui                   # Playwright's interactive test runner
npm run report                    # open the HTML report from the last run
```

Point it at a different environment if needed:

```bash
BASE_URL=http://localhost:5173 npx playwright test
```

## A note on how far this was verified

I don't have a way to run a full Java backend in the environment that built this suite, so these
tests have **not** been executed against a live CinePass instance yet. What was verified instead:

- Every spec and page object **type-checks cleanly** (`npm run typecheck`)
- Playwright successfully **parses and lists all 24 tests** with no config/syntax errors
- Every selector (labels, button text, roles) was **cross-checked against the actual React component
  source**, not guessed from memory — field labels, button text, and dialog titles were pulled directly
  from `frontend/src/pages` and `frontend/src/components`

Run it once locally with the full stack up before trusting it in CI — first-run failures at that point
are most likely to be small selector timing issues (e.g. a toast disappearing before an assertion runs),
not structural problems.
