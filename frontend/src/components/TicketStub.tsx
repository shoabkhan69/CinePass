import { Box, Typography, Stack, Divider } from "@mui/material";
import type { Movie, Showtime } from "../types";
import { formatShowDate, formatShowTime, formatCurrency } from "../utils/formatters";

interface TicketStubProps {
  movie: Pick<Movie, "title" | "posterUrl">;
  showtime: Pick<Showtime, "theatreName" | "showDate" | "showTime">;
  seats: string[];
  totalAmount: number;
  bookingId?: number;
}

export default function TicketStub({ movie, showtime, seats, totalAmount, bookingId }: TicketStubProps) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        bgcolor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 3,
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          width: { xs: "100%", sm: 140 },
          height: { xs: 180, sm: "auto" },
          flexShrink: 0,
          backgroundImage: `url(${movie.posterUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Perforated divider */}
      <Box
        sx={{
          display: { xs: "block", sm: "block" },
          width: { xs: "100%", sm: "1px" },
          height: { xs: "1px", sm: "auto" },
          position: "relative",
          borderLeft: { sm: "2px dashed" },
          borderTop: { xs: "2px dashed", sm: "none" },
          borderColor: "divider",
        }}
      />

      <Box sx={{ p: 3, flex: 1 }}>
        <Typography variant="h4" sx={{ fontSize: "1.8rem", mb: 0.5 }}>
          {movie.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {showtime.theatreName}
        </Typography>

        <Stack direction="row" spacing={4} sx={{ mb: 2 }}>
          <Field label="Date" value={formatShowDate(showtime.showDate)} />
          <Field label="Time" value={formatShowTime(showtime.showTime)} />
        </Stack>

        <Field label="Seats" value={seats.slice().sort().join(", ")} />

        <Divider sx={{ my: 2, borderStyle: "dashed" }} />

        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box>
            {bookingId && (
              <Typography
                sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: "0.75rem", color: "text.secondary" }}
              >
                BOOKING #{String(bookingId).padStart(6, "0")}
              </Typography>
            )}
          </Box>
          <Typography variant="h5" sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: "1.3rem" }}>
            {formatCurrency(totalAmount)}
          </Typography>
        </Stack>
      </Box>
    </Box>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <Box>
      <Typography
        variant="overline"
        sx={{ display: "block", lineHeight: 1.4, color: "text.secondary", fontSize: "0.65rem" }}
      >
        {label}
      </Typography>
      <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: "0.95rem" }}>{value}</Typography>
    </Box>
  );
}
