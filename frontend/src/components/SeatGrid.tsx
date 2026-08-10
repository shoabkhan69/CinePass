import { Box, Typography, Stack } from "@mui/material";
import { SEAT_ROWS, SEATS_PER_ROW, MAX_SEATS_PER_BOOKING } from "../constants";

interface SeatGridProps {
  bookedSeats: string[];
  selectedSeats: string[];
  onToggleSeat: (seat: string) => void;
}

export default function SeatGrid({ bookedSeats, selectedSeats, onToggleSeat }: SeatGridProps) {
  const bookedSet = new Set(bookedSeats);
  const selectedSet = new Set(selectedSeats);

  return (
    <Box>
      {/* Curved screen indicator - the signature element */}
      <Box sx={{ display: "flex", justifyContent: "center", mb: 5 }}>
        <Box sx={{ width: "100%", maxWidth: 480 }}>
          <Box
            sx={{
              height: 36,
              borderRadius: "50% 50% 0 0 / 100% 100% 0 0",
              background: (t) =>
                `linear-gradient(180deg, ${t.palette.primary.main}55 0%, transparent 100%)`,
              borderTop: "2px solid",
              borderColor: "primary.main",
              mb: 1,
            }}
          />
          <Typography
            align="center"
            sx={{
              fontFamily: '"IBM Plex Mono", monospace',
              fontSize: "0.7rem",
              letterSpacing: "0.3em",
              color: "text.secondary",
            }}
          >
            SCREEN THIS WAY
          </Typography>
        </Box>
      </Box>

      <Stack spacing={1.25} alignItems="center">
        {SEAT_ROWS.map((row) => (
          <Stack key={row} direction="row" spacing={1} alignItems="center">
            <Typography
              sx={{
                width: 20,
                fontFamily: '"IBM Plex Mono", monospace',
                color: "text.secondary",
                fontSize: "0.8rem",
              }}
            >
              {row}
            </Typography>
            {Array.from({ length: SEATS_PER_ROW }, (_, i) => i + 1).map((num) => {
              const code = `${row}${num}`;
              const isBooked = bookedSet.has(code);
              const isSelected = selectedSet.has(code);
              const atLimit = selectedSet.size >= MAX_SEATS_PER_BOOKING && !isSelected;
              const disabled = isBooked || atLimit;

              return (
                <Box
                  key={code}
                  component="button"
                  type="button"
                  disabled={disabled}
                  onClick={() => onToggleSeat(code)}
                  title={code}
                  sx={{
                    width: 26,
                    height: 26,
                    borderRadius: "6px 6px 3px 3px",
                    border: "1.5px solid",
                    borderColor: isSelected ? "primary.main" : isBooked ? "error.main" : "success.main",
                    bgcolor: isSelected ? "primary.main" : "transparent",
                    color: isSelected ? "primary.contrastText" : "transparent",
                    opacity: isBooked ? 0.35 : atLimit ? 0.4 : 1,
                    cursor: disabled ? "not-allowed" : "pointer",
                    fontSize: "0.55rem",
                    p: 0,
                    transition: "transform 120ms ease",
                    "&:hover": disabled ? {} : { transform: "scale(1.12)" },
                  }}
                />
              );
            })}
          </Stack>
        ))}
      </Stack>

      <Stack direction="row" spacing={3} justifyContent="center" sx={{ mt: 4 }}>
        <LegendItem color="success.main" label="Available" />
        <LegendItem color="primary.main" label="Selected" filled />
        <LegendItem color="error.main" label="Booked" faded />
      </Stack>
    </Box>
  );
}

function LegendItem({ color, label, filled, faded }: { color: string; label: string; filled?: boolean; faded?: boolean }) {
  return (
    <Stack direction="row" spacing={0.75} alignItems="center">
      <Box
        sx={{
          width: 14,
          height: 14,
          borderRadius: "4px 4px 2px 2px",
          border: "1.5px solid",
          borderColor: color,
          bgcolor: filled ? color : "transparent",
          opacity: faded ? 0.4 : 1,
        }}
      />
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
    </Stack>
  );
}
