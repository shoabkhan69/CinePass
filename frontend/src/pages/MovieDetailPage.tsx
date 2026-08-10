import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Grid,
  Typography,
  Chip,
  Stack,
  Skeleton,
  Paper,
  Divider,
  Button,
} from "@mui/material";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import ScheduleRoundedIcon from "@mui/icons-material/ScheduleRounded";
import EventBusyRoundedIcon from "@mui/icons-material/EventBusyRounded";
import ErrorState from "../components/ErrorState";
import EmptyState from "../components/EmptyState";
import { movieService } from "../services/movieService";
import { showtimeService } from "../services/showtimeService";
import { useBookingDraft } from "../context/BookingDraftContext";
import type { Movie, Showtime } from "../types";
import { formatDuration, formatShowDate, formatShowTime, formatCurrency } from "../utils/formatters";

export default function MovieDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { startDraft } = useBookingDraft();

  const [movie, setMovie] = useState<Movie | null>(null);
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = () => {
    if (!id) return;
    setLoading(true);
    setError(false);
    Promise.all([movieService.getById(id), showtimeService.getByMovie(id)])
      .then(([movieData, showtimeData]) => {
        setMovie(movieData);
        setShowtimes(showtimeData);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const showtimesByDate = useMemo(() => {
    const groups = new Map<string, Showtime[]>();
    for (const st of showtimes) {
      const list = groups.get(st.showDate) ?? [];
      list.push(st);
      groups.set(st.showDate, list);
    }
    return Array.from(groups.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [showtimes]);

  const handleSelectShowtime = (showtime: Showtime) => {
    if (!movie) return;
    startDraft(movie, showtime);
    navigate(`/showtimes/${showtime.id}/seats`);
  };

  if (loading) {
    return (
      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Skeleton variant="rounded" sx={{ aspectRatio: "2/3", width: "100%", borderRadius: 3 }} />
        </Grid>
        <Grid size={{ xs: 12, md: 8 }}>
          <Skeleton variant="text" sx={{ fontSize: "3rem", width: "60%" }} />
          <Skeleton variant="text" width="40%" />
          <Skeleton variant="rounded" height={100} sx={{ mt: 2 }} />
        </Grid>
      </Grid>
    );
  }

  if (error || !movie) {
    return <ErrorState message="We couldn't load this movie." onRetry={load} />;
  }

  return (
    <Box>
      <Grid container spacing={4}>
        <Grid size={{ xs: 12, sm: 5, md: 4 }}>
          <Box
            sx={{
              aspectRatio: "2 / 3",
              borderRadius: 3,
              backgroundImage: `url(${movie.posterUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              border: "1px solid",
              borderColor: "divider",
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 7, md: 8 }}>
          <Typography variant="h1" sx={{ fontSize: { xs: "2.4rem", md: "3.2rem" }, lineHeight: 1 }}>
            {movie.title}
          </Typography>

          <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 1.5, mb: 2 }} flexWrap="wrap">
            <Chip
              size="small"
              icon={<StarRoundedIcon sx={{ fontSize: 16 }} />}
              label={`${movie.rating.toFixed(1)} / 5`}
              color="primary"
              variant="outlined"
            />
            <Chip size="small" label={movie.genre} variant="outlined" />
            <Stack direction="row" spacing={0.5} alignItems="center" color="text.secondary">
              <ScheduleRoundedIcon sx={{ fontSize: 16 }} />
              <Typography variant="body2">{formatDuration(movie.duration)}</Typography>
            </Stack>
          </Stack>

          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 640 }}>
            {movie.synopsis}
          </Typography>

          {movie.cast && (
            <Typography variant="body2" sx={{ mt: 2 }}>
              <Box component="span" sx={{ color: "text.secondary" }}>
                Cast:{" "}
              </Box>
              {movie.cast}
            </Typography>
          )}
        </Grid>
      </Grid>

      <Divider sx={{ my: 5 }} />

      <Typography variant="h3" sx={{ fontSize: "1.6rem", mb: 3 }}>
        Showtimes
      </Typography>

      {showtimesByDate.length === 0 ? (
        <EmptyState
          icon={<EventBusyRoundedIcon fontSize="inherit" />}
          title="No showtimes scheduled"
          description="Please check back later for available showtimes."
        />
      ) : (
        <Stack spacing={3}>
          {showtimesByDate.map(([date, times]) => (
            <Box key={date}>
              <Typography
                variant="overline"
                sx={{ color: "text.secondary", display: "block", mb: 1 }}
              >
                {formatShowDate(date)}
              </Typography>
              <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
                {times.map((st) => (
                  <Paper
                    key={st.id}
                    component="button"
                    onClick={() => handleSelectShowtime(st)}
                    elevation={0}
                    sx={{
                      border: "1px solid",
                      borderColor: "divider",
                      borderRadius: 2,
                      px: 2.5,
                      py: 1.5,
                      cursor: "pointer",
                      textAlign: "left",
                      bgcolor: "background.paper",
                      "&:hover": { borderColor: "primary.main" },
                    }}
                  >
                    <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontWeight: 600 }}>
                      {formatShowTime(st.showTime)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                      {st.theatreName}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "primary.main", fontWeight: 600 }}>
                      {formatCurrency(st.ticketPrice)}
                    </Typography>
                  </Paper>
                ))}
              </Stack>
            </Box>
          ))}
        </Stack>
      )}

      <Button sx={{ mt: 4 }} onClick={() => navigate(-1)}>
        ← Back
      </Button>
    </Box>
  );
}
