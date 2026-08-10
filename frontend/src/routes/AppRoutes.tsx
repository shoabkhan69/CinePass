import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import ProtectedRoute from "../components/ProtectedRoute";
import AdminRoute from "../components/AdminRoute";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import MovieDetailPage from "../pages/MovieDetailPage";
import SeatSelectionPage from "../pages/SeatSelectionPage";
import BookingSummaryPage from "../pages/BookingSummaryPage";
import BookingSuccessPage from "../pages/BookingSuccessPage";
import MyBookingsPage from "../pages/MyBookingsPage";
import NotFoundPage from "../pages/NotFoundPage";
import AdminDashboardPage from "../pages/admin/AdminDashboardPage";
import AdminMoviesPage from "../pages/admin/AdminMoviesPage";
import AdminShowtimesPage from "../pages/admin/AdminShowtimesPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/movies/:id" element={<MovieDetailPage />} />

        {/* Seat selection itself is public to browse, but booking onward requires auth */}
        <Route path="/showtimes/:showtimeId/seats" element={<SeatSelectionPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/booking/summary" element={<BookingSummaryPage />} />
          <Route path="/booking/success/:bookingId" element={<BookingSuccessPage />} />
          <Route path="/my-bookings" element={<MyBookingsPage />} />
        </Route>

        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/admin/movies" element={<AdminMoviesPage />} />
          <Route path="/admin/showtimes" element={<AdminShowtimesPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
