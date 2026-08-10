import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  IconButton,
  Avatar,
  Skeleton,
  Stack,
} from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import { useSnackbar } from "notistack";
import EmptyState from "../../components/EmptyState";
import ErrorState from "../../components/ErrorState";
import ConfirmDialog from "../../components/ConfirmDialog";
import MovieFormDialog from "./MovieFormDialog";
import { movieService } from "../../services/movieService";
import { extractErrorMessage } from "../../api/apiClient";
import type { Movie } from "../../types";
import type { MovieFormValues } from "../../utils/validationSchemas";
import LocalMoviesRoundedIcon from "@mui/icons-material/LocalMoviesRounded";

export default function AdminMoviesPage() {
  const { enqueueSnackbar } = useSnackbar();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [formOpen, setFormOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<Movie | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = () => {
    setLoading(true);
    setError(false);
    movieService
      .getAll()
      .then(setMovies)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditingMovie(null);
    setFormError(null);
    setFormOpen(true);
  };

  const openEdit = (movie: Movie) => {
    setEditingMovie(movie);
    setFormError(null);
    setFormOpen(true);
  };

  const handleFormSubmit = async (values: MovieFormValues) => {
    setSubmitting(true);
    setFormError(null);
    const payload = { ...values, posterUrl: values.posterUrl ?? "", cast: values.cast ?? "" };
    try {
      if (editingMovie) {
        const updated = await movieService.update(editingMovie.id, payload);
        setMovies((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
        enqueueSnackbar("Movie updated", { variant: "success" });
      } else {
        const created = await movieService.create(payload);
        setMovies((prev) => [...prev, created]);
        enqueueSnackbar("Movie created", { variant: "success" });
      }
      setFormOpen(false);
    } catch (err) {
      setFormError(extractErrorMessage(err, "Couldn't save this movie"));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await movieService.remove(deleteTarget.id);
      setMovies((prev) => prev.filter((m) => m.id !== deleteTarget.id));
      enqueueSnackbar("Movie deleted", { variant: "success" });
      setDeleteTarget(null);
    } catch (err) {
      enqueueSnackbar(extractErrorMessage(err, "Couldn't delete this movie"), { variant: "error" });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h3" sx={{ fontSize: "1.8rem" }}>
          Movies
        </Typography>
        <Button variant="contained" startIcon={<AddRoundedIcon />} onClick={openCreate}>
          Add Movie
        </Button>
      </Stack>

      {loading ? (
        <Skeleton variant="rounded" height={320} />
      ) : error ? (
        <ErrorState message="Couldn't load movies." onRetry={load} />
      ) : movies.length === 0 ? (
        <EmptyState
          icon={<LocalMoviesRoundedIcon fontSize="inherit" />}
          title="No movies yet"
          description="Add your first movie to get started."
          actionLabel="Add Movie"
          onAction={openCreate}
        />
      ) : (
        <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid", borderColor: "divider" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Movie</TableCell>
                <TableCell>Genre</TableCell>
                <TableCell>Duration</TableCell>
                <TableCell>Rating</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {movies.map((movie) => (
                <TableRow key={movie.id} hover>
                  <TableCell>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Avatar variant="rounded" src={movie.posterUrl} sx={{ width: 40, height: 56 }}>
                        {movie.title[0]}
                      </Avatar>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {movie.title}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>{movie.genre}</TableCell>
                  <TableCell>{movie.duration} min</TableCell>
                  <TableCell>{movie.rating.toFixed(1)}</TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={() => openEdit(movie)} aria-label="Edit movie">
                      <EditRoundedIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => setDeleteTarget(movie)}
                      aria-label="Delete movie"
                    >
                      <DeleteRoundedIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <MovieFormDialog
        open={formOpen}
        initialMovie={editingMovie}
        submitting={submitting}
        serverError={formError}
        onSubmit={handleFormSubmit}
        onClose={() => setFormOpen(false)}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete this movie?"
        description={
          deleteTarget
            ? `Delete "${deleteTarget.title}"? This only works if it has no showtimes scheduled — remove those first from the Showtimes page.`
            : ""
        }
        confirmLabel="Delete"
        loading={deleting}
        onConfirm={handleDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </Box>
  );
}
