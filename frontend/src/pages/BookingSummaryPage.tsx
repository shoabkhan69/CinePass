import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button, Alert } from "@mui/material";
import { useSnackbar } from "notistack";
import TicketStub from "../components/TicketStub";
import ErrorState from "../components/ErrorState";
import { useBookingDraft } from "../context/BookingDraftContext";
import { bookingService } from "../services/bookingService";
import { extractErrorMessage } from "../api/apiClient";

export default function BookingSummaryPage() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { draft, clearDraft } = useBookingDraft();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!draft || draft.selectedSeats.length === 0) {
    return (
      <ErrorState
        message="Your seat selection has expired or wasn't found. Please pick your seats again."
        onRetry={() => navigate("/")}
      />
    );
  }

  const total = draft.showtime.ticketPrice * draft.selectedSeats.length;

  const handleConfirm = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const booking = await bookingService.create(draft.showtime.id, draft.selectedSeats);
      clearDraft();
      enqueueSnackbar("Booking confirmed!", { variant: "success" });
      navigate(`/booking/success/${booking.id}`, { state: { booking } });
    } catch (err) {
      setError(extractErrorMessage(err, "We couldn't complete your booking."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 640, mx: "auto" }}>
      <Typography variant="h3" sx={{ fontSize: "1.8rem", mb: 3 }}>
        Confirm your booking
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <TicketStub
        movie={draft.movie}
        showtime={draft.showtime}
        seats={draft.selectedSeats}
        totalAmount={total}
      />

      <Box sx={{ display: "flex", gap: 2, mt: 4, justifyContent: "flex-end" }}>
        <Button onClick={() => navigate(-1)} disabled={submitting}>
          ← Change seats
        </Button>
        <Button variant="contained" size="large" onClick={handleConfirm} disabled={submitting}>
          {submitting ? "Confirming..." : "Confirm Booking"}
        </Button>
      </Box>
    </Box>
  );
}
