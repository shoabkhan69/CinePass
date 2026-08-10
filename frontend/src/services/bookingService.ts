import { apiClient } from "../api/apiClient";
import type { Booking } from "../types";

export const bookingService = {
  async create(showtimeId: number, seatCodes: string[]): Promise<Booking> {
    const { data } = await apiClient.post<Booking>("/bookings", { showtimeId, seatCodes });
    return data;
  },

  async getMine(): Promise<Booking[]> {
    const { data } = await apiClient.get<Booking[]>("/bookings/mine");
    return data;
  },

  async cancel(id: number): Promise<void> {
    await apiClient.delete(`/bookings/${id}`);
  },
};
