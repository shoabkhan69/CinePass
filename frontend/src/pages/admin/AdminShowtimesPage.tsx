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
  Skeleton,
  Stack,
} from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import EventBusyRoundedIcon from "@mui/icons-material/EventBusyRounded";
import { useSnackbar } from "notistack";
import EmptyState from "../../components/EmptyState";
import ErrorState from "../../components/ErrorState";
import ConfirmDialog from "../../components/ConfirmDialog";
import ShowtimeFormDialog from "./ShowtimeFormDialog";
import { showtimeService } from "../../services/showtimeService";
import { movieService } from "../../services/movieService";
import { extractErrorMessage } from "../../api/apiClient";
import type { Movie, Showtime } from "../../types";
import type { ShowtimeFormValues } from "../../utils/validationSchemas";
import { formatShowDate, formatShowTime, formatCurrency } from "../../utils/formatters";

export default function AdminShowtimesPage() {
  const { enqueueSnackbar } = useSnackbar();
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [formOpen, setFormOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<Showtime | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = () => {
    setLoading(true);
    setError(false);
    Promise.all([showtimeService.getAll(), movieService.getAll()])
      .then(([st, mv]) => {
        setShowtimes(st);
        setMovies(mv);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleFormSubmit = async (values: ShowtimeFormValues) => {
    setSubmitting(true);
    setFormError(null);
    try {
      const created = await showtimeService.create(values);
      setShowtimes((prev) =>
        [...prev, created].sort((a, b) => (a.showDate + a.showTime).localeCompare(b.showDate + b.showTime))
      );
      enqueueSnackbar("Showtime created", { variant: "success" });
      setFormOpen(false);
    } catch (err) {
      setFormError(extractErrorMessage(err, "Couldn't create this showtime"));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await showtimeService.remove(deleteTarget.id);
      setShowtimes((prev) => prev.filter((s) => s.id !== deleteTarget.id));
      enqueueSnackbar("Showtime deleted", { variant: "success" });
      setDeleteTarget(null);
    } catch (err) {
      enqueueSnackbar(extractErrorMessage(err, "Couldn't delete this showtime"), { variant: "error" });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h3" sx={{ fontSize: "1.8rem" }}>
          Showtimes
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddRoundedIcon />}
          onClick={() => {
            setFormError(null);
            setFormOpen(true);
          }}
          disabled={movies.length === 0}
        >
          Add Showtime
        </Button>
      </Stack>

      {loading ? (
        <Skeleton variant="rounded" height={320} />
      ) : error ? (
        <ErrorState message="Couldn't load showtimes." onRetry={load} />
      ) : showtimes.length === 0 ? (
        <EmptyState
          icon={<EventBusyRoundedIcon fontSize="inherit" />}
          title="No showtimes yet"
          description="Add a showtime once you have at least one movie."
        />
      ) : (
        <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid", borderColor: "divider" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Movie</TableCell>
                <TableCell>Theatre</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Time</TableCell>
                <TableCell>Price</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {showtimes.map((st) => (
                <TableRow key={st.id} hover>
                  <TableCell>{st.movieTitle}</TableCell>
                  <TableCell>{st.theatreName}</TableCell>
                  <TableCell>{formatShowDate(st.showDate)}</TableCell>
                  <TableCell>{formatShowTime(st.showTime)}</TableCell>
                  <TableCell>{formatCurrency(st.ticketPrice)}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => setDeleteTarget(st)}
                      aria-label="Delete showtime"
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

      <ShowtimeFormDialog
        open={formOpen}
        movies={movies}
        submitting={submitting}
        serverError={formError}
        onSubmit={handleFormSubmit}
        onClose={() => setFormOpen(false)}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete this showtime?"
        description={
          deleteTarget
            ? `${deleteTarget.movieTitle} · ${formatShowDate(deleteTarget.showDate)} at ${formatShowTime(
                deleteTarget.showTime
              )} will be removed. This only works if it has no bookings yet.`
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
