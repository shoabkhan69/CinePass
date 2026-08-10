export interface User {
  id: number;
  name: string;
  email: string;
  isAdmin: boolean;
}

export interface AuthResponse {
  token: string;
  userId: number;
  name: string;
  email: string;
  isAdmin: boolean;
}

export interface Movie {
  id: number;
  title: string;
  genre: string;
  duration: number;
  rating: number;
  posterUrl: string;
  synopsis: string;
  cast?: string;
}

export interface Showtime {
  id: number;
  movieId: number;
  movieTitle: string;
  theatreName: string;
  showDate: string; // ISO date, e.g. 2026-07-24
  showTime: string; // e.g. 19:45:00
  ticketPrice: number;
}

export interface SeatMap {
  showtimeId: number;
  allSeats: string[];
  bookedSeats: string[];
}

export type BookingStatus = "CONFIRMED" | "CANCELLED";

export interface Booking {
  id: number;
  showtimeId: number;
  movieTitle: string;
  posterUrl: string;
  theatreName: string;
  showDate: string;
  showTime: string;
  seatCodes: string[];
  totalAmount: number;
  status: BookingStatus;
  bookingDate: string;
}

export interface ApiErrorResponse {
  timestamp?: string;
  path?: string;
  error?: string;
  message?: string;
  fieldErrors?: Record<string, string>;
}
