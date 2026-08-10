import { useEffect, useState } from "react";
import { Box, Typography, Stack, Chip, Button, Skeleton } from "@mui/material";
import { useSnackbar } from "notistack";
import TicketStub from "../components/TicketStub";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";
import ConfirmDialog from "../components/ConfirmDialog";
import { bookingService } from "../services/bookingService";
import { extractErrorMessage } from "../api/apiClient";
import type { Booking } from "../types";
import ConfirmationNumberRoundedIcon from "@mui/icons-material/ConfirmationNumberRounded";

export default function MyBookingsPage() {
  const { enqueueSnackbar } = useSnackbar();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [cancelTarget, setCancelTarget] = useState<Booking | null>(null);
  const [cancelling, setCancelling] = useState(false);

  const load = () => {
    setLoading(true);
    setError(false);
    bookingService
      .getMine()
      .then(setBookings)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleCancel = async () => {
    if (!cancelTarget) return;
    setCancelling(true);
    try {
      await bookingService.cancel(cancelTarget.id);
      setBookings((prev) =>
        prev.map((b) => (b.id === cancelTarget.id ? { ...b, status: "CANCELLED" } : b))
      );
      enqueueSnackbar("Booking cancelled. Your seats are now available again.", { variant: "success" });
      setCancelTarget(null);
    } catch (err) {
      enqueueSnackbar(extractErrorMessage(err, "Could not cancel this booking"), { variant: "error" });
    } finally {
      setCancelling(false);
    }
  };

  return (
    <Box>
      <Typography variant="h3" sx={{ fontSize: "1.8rem", mb: 3 }}>
        My Bookings
      </Typography>

      {loading ? (
        <Stack spacing={2}>
          {[1, 2].map((i) => (
            <Skeleton key={i} variant="rounded" height={160} />
          ))}
        </Stack>
      ) : error ? (
        <ErrorState message="We couldn't load your bookings." onRetry={load} />
      ) : bookings.length === 0 ? (
        <EmptyState
          icon={<ConfirmationNumberRoundedIcon fontSize="inherit" />}
          title="No bookings yet"
          description="Once you book a show, it'll show up here."
        />
      ) : (
        <Stack spacing={3}>
          {bookings.map((booking) => (
            <Box key={booking.id} sx={{ position: "relative" }}>
              <TicketStub
                movie={{ title: booking.movieTitle, posterUrl: booking.posterUrl }}
                showtime={{
                  theatreName: booking.theatreName,
                  showDate: booking.showDate,
                  showTime: booking.showTime,
                }}
                seats={booking.seatCodes}
                totalAmount={booking.totalAmount}
                bookingId={booking.id}
              />
              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mt: 1.5 }}>
                <Chip
                  size="small"
                  label={booking.status === "CONFIRMED" ? "Confirmed" : "Cancelled"}
                  color={booking.status === "CONFIRMED" ? "success" : "default"}
                  variant={booking.status === "CONFIRMED" ? "filled" : "outlined"}
                />
                {booking.status === "CONFIRMED" && (
                  <Button size="small" color="error" onClick={() => setCancelTarget(booking)}>
                    Cancel booking
                  </Button>
                )}
              </Stack>
            </Box>
          ))}
        </Stack>
      )}

      <ConfirmDialog
        open={!!cancelTarget}
        title="Cancel this booking?"
        description={
          cancelTarget
            ? `Seats ${cancelTarget.seatCodes.join(", ")} for ${cancelTarget.movieTitle} will be released back for other guests.`
            : ""
        }
        confirmLabel="Cancel booking"
        loading={cancelling}
        onConfirm={handleCancel}
        onClose={() => setCancelTarget(null)}
      />
    </Box>
  );
}
