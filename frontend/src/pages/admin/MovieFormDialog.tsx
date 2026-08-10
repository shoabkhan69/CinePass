import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Alert,
} from "@mui/material";
import { movieSchema, type MovieFormValues } from "../../utils/validationSchemas";
import type { Movie } from "../../types";

interface MovieFormDialogProps {
  open: boolean;
  initialMovie?: Movie | null;
  submitting: boolean;
  serverError: string | null;
  onSubmit: (values: MovieFormValues) => void;
  onClose: () => void;
}

const emptyValues: MovieFormValues = {
  title: "",
  genre: "",
  duration: 120,
  rating: 4,
  posterUrl: "",
  synopsis: "",
  cast: "",
};

export default function MovieFormDialog({
  open,
  initialMovie,
  submitting,
  serverError,
  onSubmit,
  onClose,
}: MovieFormDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MovieFormValues>({ resolver: zodResolver(movieSchema), defaultValues: emptyValues });

  useEffect(() => {
    if (open) {
      reset(
        initialMovie
          ? {
              title: initialMovie.title,
              genre: initialMovie.genre,
              duration: initialMovie.duration,
              rating: initialMovie.rating,
              posterUrl: initialMovie.posterUrl,
              synopsis: initialMovie.synopsis,
              cast: initialMovie.cast ?? "",
            }
          : emptyValues
      );
    }
  }, [open, initialMovie, reset]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <DialogTitle>{initialMovie ? "Edit Movie" : "Add Movie"}</DialogTitle>
        <DialogContent dividers>
          {serverError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {serverError}
            </Alert>
          )}
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid size={12}>
              <TextField
                label="Title"
                fullWidth
                {...register("title")}
                error={!!errors.title}
                helperText={errors.title?.message}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Genre"
                fullWidth
                {...register("genre")}
                error={!!errors.genre}
                helperText={errors.genre?.message}
              />
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <TextField
                label="Duration (min)"
                type="number"
                fullWidth
                {...register("duration", { valueAsNumber: true })}
                error={!!errors.duration}
                helperText={errors.duration?.message}
              />
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <TextField
                label="Rating (0-5)"
                type="number"
                inputProps={{ step: 0.1, min: 0, max: 5 }}
                fullWidth
                {...register("rating", { valueAsNumber: true })}
                error={!!errors.rating}
                helperText={errors.rating?.message}
              />
            </Grid>
            <Grid size={12}>
              <TextField
                label="Poster URL"
                fullWidth
                {...register("posterUrl")}
                error={!!errors.posterUrl}
                helperText={errors.posterUrl?.message}
              />
            </Grid>
            <Grid size={12}>
              <TextField
                label="Synopsis"
                fullWidth
                multiline
                minRows={3}
                {...register("synopsis")}
                error={!!errors.synopsis}
                helperText={errors.synopsis?.message}
              />
            </Grid>
            <Grid size={12}>
              <TextField label="Cast (comma-separated)" fullWidth {...register("cast")} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={submitting}>
            {submitting ? "Saving..." : initialMovie ? "Save Changes" : "Create Movie"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
