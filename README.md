# 🎬 CinePass

A movie ticket booking system — browse movies, pick a showtime, choose your seats, and book. Built as a thin, working vertical slice end-to-end (not the full admin suite yet — see "What's included" below).

- **Backend:** Java 21, Spring Boot 3, Spring Security + JWT, Spring Data JPA/Hibernate, MapStruct, springdoc/Swagger, H2 (dev) / PostgreSQL (prod)
- **Frontend:** React 19, TypeScript, Vite, MUI 7, React Router 7, Axios, React Hook Form + Zod, notistack

---

## What's included

This build covers the full **user booking flow** end-to-end:

Browse movies → Movie detail → Pick a showtime → Select seats → Log in (if needed) → Booking summary → Confirm → Success screen → My Bookings (cancel a booking)

It also includes a full **admin panel**:

- `/admin` — dashboard with movie/showtime counts
- `/admin/movies` — create, edit, and delete movies
- `/admin/showtimes` — create and delete showtimes (schedule a movie into a theatre/date/time/price)

Admin routes are gated client-side by an `AdminRoute` guard and enforced server-side via `ROLE_ADMIN` on the write endpoints — so even if someone bypasses the frontend, the API rejects non-admin requests. Log in as the seeded admin (`admin@cinepass.com` / `Admin@123`) and the "Admin" link appears in the nav.

A couple of guardrails worth knowing about: deleting a movie is blocked while it still has showtimes scheduled (delete those first), and deleting a showtime is blocked once it has bookings against it — both return a clear error message rather than a raw database error.

Also included: registration/login with JWT + BCrypt, a 50-seat (5×10) seat map per showtime with live availability, max-6-seats validation, cancellation that frees seats back up, dark/light theme toggle, skeleton loaders, empty/error states, and toast notifications.

**Not yet built:** automated tests (JUnit/RTL) and a couple of bonus features (PDF ticket, search, favorites). Showtimes can't be edited once created — only deleted and recreated — matching the original API spec (no PUT endpoint for showtimes).

---

## Project structure

```
cinepass/
  backend/     Spring Boot API
  frontend/    React + Vite app
```

Backend package layout: `controller / service / repository / entity / dto / mapper / config / security / exception`
Frontend layout: `components / pages / layouts / hooks / context / services / api / utils / constants / types / theme / routes`

---

## Backend setup

### Prerequisites
- Java 21
- Maven (or use the included `mvnw` if present in your environment)

### Run with H2 (fastest — no install needed)

H2 is the default profile. It's an in-memory database, so data resets every restart, and the seed data (below) reloads automatically.

```bash
cd backend
mvn spring-boot:run
```

The API starts on **http://localhost:8080**. The H2 console is available at `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:mem:cinepass`, user: `sa`, no password).

### Run with PostgreSQL

1. Create a database and user:
   ```sql
   CREATE DATABASE cinepass;
   CREATE USER cinepass WITH ENCRYPTED PASSWORD 'cinepass';
   GRANT ALL PRIVILEGES ON DATABASE cinepass TO cinepass;
   ```
2. Run with the `postgres` profile active:
   ```bash
   cd backend
   export DB_URL=jdbc:postgresql://localhost:5432/cinepass
   export DB_USERNAME=cinepass
   export DB_PASSWORD=cinepass
   mvn spring-boot:run -Dspring-boot.run.profiles=postgres
   ```

Tables are created/updated automatically (`ddl-auto: update`) and the same seed data loads on first run.

### Environment variables

| Variable | Default | Purpose |
|---|---|---|
| `CINEPASS_JWT_SECRET` | (demo key baked into `application.yml`) | Base64 HMAC key signing JWTs — **override this in any real deployment** |
| `CINEPASS_CORS_ORIGINS` | `http://localhost:5173` | Comma-separated allowed origins for the frontend |
| `DB_URL`, `DB_USERNAME`, `DB_PASSWORD` | — | Only used with the `postgres` profile |

### Swagger / API docs

Once running: **http://localhost:8080/swagger-ui.html**
Click "Authorize" and paste a JWT (from `/api/auth/login`) to call protected endpoints directly from the UI.

### Seed data

On first boot (when the users table is empty) the app seeds:
- **Admin user:** `admin@cinepass.com` / `Admin@123`
- **10 movies** across 10 genres, each with **3 showtimes** over the next 3 days, rotating across 3 theatres and 4 time slots

### API summary

| Method | Path | Auth |
|---|---|---|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| POST | `/api/auth/logout` | Public |
| GET | `/api/movies` | Public |
| GET | `/api/movies/{id}` | Public |
| POST / PUT / DELETE | `/api/movies[/{id}]` | Admin |
| GET | `/api/movies/{id}/showtimes` | Public |
| GET | `/api/showtimes` | Admin (lists all, for the admin panel) |
| GET | `/api/showtimes/{id}/seats` | Public |
| POST / DELETE | `/api/showtimes[/{id}]` | Admin |
| POST | `/api/bookings` | User (logged in) |
| GET | `/api/bookings/mine` | User (logged in) |
| DELETE | `/api/bookings/{id}` | Owner or Admin |

All error responses share one shape: `{ timestamp, path, error, message, fieldErrors? }`.

---

## Frontend setup

### Prerequisites
- Node.js 20+

### Run

```bash
cd frontend
npm install
cp .env.example .env   # defaults to http://localhost:8080/api — edit if your API runs elsewhere
npm run dev
```

Opens on **http://localhost:5173**. Make sure the backend is running first (or you'll see the app's built-in error states, not a crash).

### Build for production

```bash
npm run build   # outputs to dist/
npm run preview # serve the production build locally
```

### Environment variables

| Variable | Default | Purpose |
|---|---|---|
| `VITE_API_BASE_URL` | `http://localhost:8080/api` | Base URL the frontend calls |

---

## Trying it out

1. Start the backend (H2 profile is simplest).
2. Start the frontend.
3. Browse movies on the home page, open one, pick a showtime.
4. Select up to 6 seats — you'll be asked to log in/register before confirming.
5. Register a new account, or log in as the seeded admin (`admin@cinepass.com` / `Admin@123`) to see the **Admin** link in the nav — use it to add a movie and schedule a showtime for it.
6. Confirm the booking, see the success screen, then check **My Bookings** to cancel it and watch the seats free back up on the seat map.

---

## Design notes

The frontend uses a custom "cinema marquee" design system rather than default MUI styling: a warm near-black palette with a marquee-gold accent, a condensed display face for titles, and an IBM Plex Mono treatment for ticket-stub details (showtimes, seat codes, prices) to evoke an actual paper ticket. The seat map includes a curved "screen" indicator as its signature visual element.

## Known limitations / next steps

- No automated test suite yet (JUnit/Mockito on the backend, RTL on the frontend)
- No PDF ticket export, movie search, or favorites (bonus features from the original brief)
- Showtimes can only be created/deleted, not edited in place (no PUT endpoint, matching the original API spec)
- Bundle isn't code-split yet (single ~725KB JS chunk) — fine for this slice, worth splitting by route before scaling further
