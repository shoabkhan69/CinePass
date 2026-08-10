import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { Movie, Showtime } from "../types";

interface BookingDraft {
  movie: Movie;
  showtime: Showtime;
  selectedSeats: string[];
}

interface BookingDraftContextValue {
  draft: BookingDraft | null;
  startDraft: (movie: Movie, showtime: Showtime) => void;
  setSelectedSeats: (seats: string[]) => void;
  clearDraft: () => void;
}

const BookingDraftContext = createContext<BookingDraftContextValue | undefined>(undefined);

export function BookingDraftProvider({ children }: { children: ReactNode }) {
  const [draft, setDraft] = useState<BookingDraft | null>(null);

  const startDraft = (movie: Movie, showtime: Showtime) => {
    setDraft({ movie, showtime, selectedSeats: [] });
  };

  const setSelectedSeats = (seats: string[]) => {
    setDraft((prev) => (prev ? { ...prev, selectedSeats: seats } : prev));
  };

  const clearDraft = () => setDraft(null);

  const value = useMemo(() => ({ draft, startDraft, setSelectedSeats, clearDraft }), [draft]);

  return <BookingDraftContext.Provider value={value}>{children}</BookingDraftContext.Provider>;
}

export function useBookingDraft(): BookingDraftContextValue {
  const ctx = useContext(BookingDraftContext);
  if (!ctx) throw new Error("useBookingDraft must be used within a BookingDraftProvider");
  return ctx;
}
