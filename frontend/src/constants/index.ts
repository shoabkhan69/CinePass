export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

export const MAX_SEATS_PER_BOOKING = 6;

export const SEAT_ROWS = ["A", "B", "C", "D", "E"] as const;
export const SEATS_PER_ROW = 10;

export const AUTH_TOKEN_KEY = "cinepass_token";
export const AUTH_USER_KEY = "cinepass_user";
