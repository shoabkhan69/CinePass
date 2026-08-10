import { useEffect, useMemo, useState } from "react";
import { Box, Typography, Grid, Chip, Stack } from "@mui/material";
import MovieCard from "../components/MovieCard";
import MovieGridSkeleton from "../components/MovieGridSkeleton";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";
import { movieService } from "../services/movieService";
import type { Movie } from "../types";
import LocalMoviesRoundedIcon from "@mui/icons-material/LocalMoviesRounded";

export default function HomePage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [genreFilter, setGenreFilter] = useState<string | null>(null);

  const loadMovies = () => {
    setLoading(true);
    setError(false);
    movieService
      .getAll()
      .then(setMovies)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadMovies();
  }, []);

  const genres = useMemo(() => Array.from(new Set(movies.map((m) => m.genre))).sort(), [movies]);
  const filteredMovies = genreFilter ? movies.filter((m) => m.genre === genreFilter) : movies;

  return (
    <Box>
      {/* Hero */}
      <Box
        sx={{
          borderRadius: 4,
          p: { xs: 4, md: 6 },
          mb: 5,
          position: "relative",
          overflow: "hidden",
          background: (t) =>
            t.palette.mode === "dark"
              ? "radial-gradient(120% 140% at 15% 20%, rgba(232,180,76,0.16) 0%, transparent 55%), #15171D"
              : "radial-gradient(120% 140% at 15% 20%, rgba(232,180,76,0.25) 0%, transparent 55%), #FFFFFF",
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography variant="overline" sx={{ color: "primary.main" }}>
          NOW BOOKING
        </Typography>
        <Typography variant="h1" sx={{ fontSize: { xs: "2.6rem", md: "4rem" }, maxWidth: 640, lineHeight: 1 }}>
          Your next great night out starts here.
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 2, maxWidth: 520 }}>
          Browse what's playing, pick your seats, and skip the box-office line entirely.
        </Typography>
      </Box>

      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h3" sx={{ fontSize: "1.8rem" }}>
          Now Showing
        </Typography>
      </Stack>

      {genres.length > 0 && (
        <Stack direction="row" spacing={1} sx={{ mb: 3, flexWrap: "wrap", gap: 1 }}>
          <Chip
            label="All genres"
            clickable
            color={genreFilter === null ? "primary" : "default"}
            onClick={() => setGenreFilter(null)}
          />
          {genres.map((g) => (
            <Chip
              key={g}
              label={g}
              clickable
              color={genreFilter === g ? "primary" : "default"}
              onClick={() => setGenreFilter(g)}
            />
          ))}
        </Stack>
      )}

      {loading ? (
        <MovieGridSkeleton />
      ) : error ? (
        <ErrorState message="We couldn't load movies right now." onRetry={loadMovies} />
      ) : filteredMovies.length === 0 ? (
        <EmptyState
          icon={<LocalMoviesRoundedIcon fontSize="inherit" />}
          title="No movies match this genre"
          description="Try a different genre or check back soon."
        />
      ) : (
        <Grid container spacing={3}>
          {filteredMovies.map((movie) => (
            <Grid key={movie.id} size={{ xs: 6, sm: 4, md: 3 }}>
              <MovieCard movie={movie} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
