/** Generates a unique-enough identifier per test run so re-running the suite
 * against a real (non-reset) database doesn't collide on "email already registered". */
function runId(): string {
  return `${Date.now()}${Math.floor(Math.random() * 1000)}`;
}

export function newTestUser() {
  const id = runId();
  return {
    name: `QA Test User ${id}`,
    email: `qa.user.${id}@cinepass-test.com`,
    password: "TestPass1234",
  };
}

export function newTestMovie() {
  const id = runId();
  return {
    title: `QA Automation Movie ${id}`,
    genre: "Drama",
    duration: 110,
    rating: 4.2,
    posterUrl: "https://image.tmdb.org/t/p/w500/qa-automation-poster.jpg",
    synopsis: "A movie created by the QA automation suite to verify admin CRUD flows end to end.",
    cast: "QA Bot, Test Runner",
  };
}

export const seededAdmin = {
  email: "admin@cinepass.com",
  password: "Admin@123",
};

/** Tomorrow's date in YYYY-MM-DD, used so new showtimes never collide with seeded ones. */
export function farFutureDate(daysAhead = 30): string {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  return d.toISOString().slice(0, 10);
}
