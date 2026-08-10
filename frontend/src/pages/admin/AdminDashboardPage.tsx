import { useEffect, useState } from "react";
import { Box, Typography, Grid, Paper, Stack } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import LocalMoviesRoundedIcon from "@mui/icons-material/LocalMoviesRounded";
import EventRoundedIcon from "@mui/icons-material/EventRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import { movieService } from "../../services/movieService";
import { showtimeService } from "../../services/showtimeService";

export default function AdminDashboardPage() {
  const [movieCount, setMovieCount] = useState<number | null>(null);
  const [showtimeCount, setShowtimeCount] = useState<number | null>(null);

  useEffect(() => {
    movieService
      .getAll()
      .then((m) => setMovieCount(m.length))
      .catch(() => setMovieCount(0));
    showtimeService
      .getAll()
      .then((s) => setShowtimeCount(s.length))
      .catch(() => setShowtimeCount(0));
  }, []);

  const cards = [
    {
      to: "/admin/movies",
      icon: <LocalMoviesRoundedIcon sx={{ fontSize: 32 }} />,
      title: "Movies",
      count: movieCount,
      description: "Add, edit, or remove movies from the catalog.",
    },
    {
      to: "/admin/showtimes",
      icon: <EventRoundedIcon sx={{ fontSize: 32 }} />,
      title: "Showtimes",
      count: showtimeCount,
      description: "Schedule or remove showtimes across theatres.",
    },
  ];

  return (
    <Box>
      <Typography variant="h3" sx={{ fontSize: "1.8rem", mb: 0.5 }}>
        Admin Dashboard
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Manage movies and showtimes for CinePass.
      </Typography>

      <Grid container spacing={3}>
        {cards.map((card) => (
          <Grid key={card.to} size={{ xs: 12, sm: 6 }}>
            <Paper
              component={RouterLink}
              to={card.to}
              elevation={0}
              sx={{
                display: "block",
                textDecoration: "none",
                color: "text.primary",
                p: 3,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 3,
                transition: "border-color 150ms ease, transform 150ms ease",
                "&:hover": { borderColor: "primary.main", transform: "translateY(-2px)" },
              }}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                <Box sx={{ color: "primary.main" }}>{card.icon}</Box>
                <ChevronRightRoundedIcon sx={{ color: "text.secondary" }} />
              </Stack>
              <Typography variant="h4" sx={{ fontSize: "1.5rem", mt: 2 }}>
                {card.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                {card.description}
              </Typography>
              <Typography
                sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: "0.85rem", color: "text.secondary" }}
              >
                {card.count === null ? "Loading…" : `${card.count} total`}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
