import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Typography, Button, Stack, Paper, Skeleton } from "@mui/material";
import { useSnackbar } from "notistack";
import SeatGrid from "../components/SeatGrid";
import ErrorState from "../components/ErrorState";
import { showtimeService } from "../services/showtimeService";
import { useBookingDraft } from "../context/BookingDraftContext";
import type { SeatMap } from "../types";
import { MAX_SEATS_PER_BOOKING } from "../constants";
import { formatShowDate, formatShowTime, formatCurrency } from "../utils/formatters";

export default function SeatSelectionPage() {
  const { showtimeId } = useParams<{ showtimeId: string }>();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { draft, setSelectedSeats } = useBookingDraft();

  const [seatMap, setSeatMap] = useState<SeatMap | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = () => {
    if (!showtimeId) return;
    setLoading(true);
    setError(false);
    showtimeService
      .getSeatMap(showtimeId)
      .then(setSeatMap)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showtimeId]);

  // Guard: if someone lands here directly without going through Movie Detail first,
  // there's no draft (movie/showtime context) to book against.
  if (!draft || String(draft.showtime.id) !== showtimeId) {
    return (
      <ErrorState
        message="Please choose a showtime from the movie page first."
        onRetry={() => navigate("/")}
      />
    );
  }

  const selectedSeats = draft.selectedSeats;

  const toggleSeat = (seat: string) => {
    if (!seatMap) return;
    const isSelected = selectedSeats.includes(seat);
    if (isSelected) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seat));
      return;
    }
    if (selectedSeats.length >= MAX_SEATS_PER_BOOKING) {
      enqueueSnackbar(`You can select up to ${MAX_SEATS_PER_BOOKING} seats`, { variant: "warning" });
      return;
    }
    setSelectedSeats([...selectedSeats, seat]);
  };

  const handleContinue = () => {
    if (selectedSeats.length === 0) {
      enqueueSnackbar("Select at least one seat to continue", { variant: "warning" });
      return;
    }
    navigate("/booking/summary");
  };

  const total = draft.showtime.ticketPrice * selectedSeats.length;

  return (
    <Box>
      <Typography variant="h3" sx={{ fontSize: "1.8rem" }}>
        {draft.movie.title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        {draft.showtime.theatreName} · {formatShowDate(draft.showtime.showDate)} ·{" "}
        {formatShowTime(draft.showtime.showTime)}
      </Typography>

      {loading ? (
        <Skeleton variant="rounded" height={340} />
      ) : error || !seatMap ? (
        <ErrorState message="We couldn't load the seat map." onRetry={load} />
      ) : (
        <SeatGrid bookedSeats={seatMap.bookedSeats} selectedSeats={selectedSeats} onToggleSeat={toggleSeat} />
      )}

      <Paper
        elevation={0}
        sx={{
          mt: 5,
          p: 2.5,
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Stack>
          <Typography variant="caption" color="text.secondary">
            {selectedSeats.length} of {MAX_SEATS_PER_BOOKING} seats selected
          </Typography>
          <Typography variant="h5" sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: "1.4rem" }}>
            {formatCurrency(total)}
          </Typography>
        </Stack>
        <Button variant="contained" size="large" onClick={handleContinue} disabled={selectedSeats.length === 0}>
          Continue to Summary
        </Button>
      </Paper>
    </Box>
  );
}
