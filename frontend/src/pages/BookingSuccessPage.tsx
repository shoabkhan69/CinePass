import { useLocation, useNavigate, useParams, Link as RouterLink } from "react-router-dom";
import { Box, Typography, Button, Stack } from "@mui/material";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import TicketStub from "../components/TicketStub";
import ErrorState from "../components/ErrorState";
import type { Booking } from "../types";

export default function BookingSuccessPage() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  const booking = (location.state as { booking?: Booking })?.booking;

  if (!booking) {
    return (
      <ErrorState
        message="We don't have the details for this booking session. Check My Bookings for your confirmed tickets."
        onRetry={() => navigate("/my-bookings")}
      />
    );
  }

  return (
    <Box sx={{ maxWidth: 640, mx: "auto", textAlign: "center" }}>
      <CheckCircleRoundedIcon sx={{ fontSize: 64, color: "success.main", mb: 1 }} />
      <Typography variant="h2" sx={{ fontSize: "2.4rem", mb: 1 }}>
        You're all set!
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Booking #{String(bookingId).padStart(6, "0")} is confirmed. Show this ticket at the entrance.
      </Typography>

      <Box sx={{ textAlign: "left" }}>
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
      </Box>

      <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 4 }}>
        <Button component={RouterLink} to="/my-bookings" variant="contained">
          View My Bookings
        </Button>
        <Button component={RouterLink} to="/">
          Browse More Movies
        </Button>
      </Stack>
    </Box>
  );
}
