import { apiClient } from "../api/apiClient";
import type { SeatMap, Showtime } from "../types";

export const showtimeService = {
  /** Admin-only endpoint - lists every showtime across all movies. */
  async getAll(): Promise<Showtime[]> {
    const { data } = await apiClient.get<Showtime[]>("/showtimes");
    return data;
  },

  async getByMovie(movieId: number | string): Promise<Showtime[]> {
    const { data } = await apiClient.get<Showtime[]>(`/movies/${movieId}/showtimes`);
    return data;
  },

  async getSeatMap(showtimeId: number | string): Promise<SeatMap> {
    const { data } = await apiClient.get<SeatMap>(`/showtimes/${showtimeId}/seats`);
    return data;
  },

  async create(showtime: {
    movieId: number;
    theatreName: string;
    showDate: string;
    showTime: string;
    ticketPrice: number;
  }): Promise<Showtime> {
    const { data } = await apiClient.post<Showtime>("/showtimes", showtime);
    return data;
  },

  async remove(id: number): Promise<void> {
    await apiClient.delete(`/showtimes/${id}`);
  },
};
