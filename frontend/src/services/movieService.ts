import { apiClient } from "../api/apiClient";
import type { Movie } from "../types";

export const movieService = {
  async getAll(): Promise<Movie[]> {
    const { data } = await apiClient.get<Movie[]>("/movies");
    return data;
  },

  async getById(id: number | string): Promise<Movie> {
    const { data } = await apiClient.get<Movie>(`/movies/${id}`);
    return data;
  },

  async create(movie: Omit<Movie, "id">): Promise<Movie> {
    const { data } = await apiClient.post<Movie>("/movies", movie);
    return data;
  },

  async update(id: number, movie: Omit<Movie, "id">): Promise<Movie> {
    const { data } = await apiClient.put<Movie>(`/movies/${id}`, movie);
    return data;
  },

  async remove(id: number): Promise<void> {
    await apiClient.delete(`/movies/${id}`);
  },
};
