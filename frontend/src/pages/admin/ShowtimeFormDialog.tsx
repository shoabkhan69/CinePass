import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
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
  MenuItem,
} from "@mui/material";
import { showtimeSchema, type ShowtimeFormValues } from "../../utils/validationSchemas";
import type { Movie } from "../../types";

interface ShowtimeFormDialogProps {
  open: boolean;
  movies: Movie[];
  submitting: boolean;
  serverError: string | null;
  onSubmit: (values: ShowtimeFormValues) => void;
  onClose: () => void;
}

const emptyValues: ShowtimeFormValues = {
  movieId: 0,
  theatreName: "",
  showDate: "",
  showTime: "",
  ticketPrice: 250,
};

export default function ShowtimeFormDialog({
  open,
  movies,
  submitting,
  serverError,
  onSubmit,
  onClose,
}: ShowtimeFormDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<ShowtimeFormValues>({ resolver: zodResolver(showtimeSchema), defaultValues: emptyValues });

  useEffect(() => {
    if (open) reset(emptyValues);
  }, [open, reset]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <DialogTitle>Add Showtime</DialogTitle>
        <DialogContent dividers>
          {serverError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {serverError}
            </Alert>
          )}
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid size={12}>
              <Controller
                name="movieId"
                control={control}
                render={({ field }) => (
                  <TextField
                    select
                    label="Movie"
                    fullWidth
                    value={field.value || ""}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    error={!!errors.movieId}
                    helperText={errors.movieId?.message}
                  >
                    {movies.map((m) => (
                      <MenuItem key={m.id} value={m.id}>
                        {m.title}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>
            <Grid size={12}>
              <TextField
                label="Theatre Name"
                fullWidth
                {...register("theatreName")}
                error={!!errors.theatreName}
                helperText={errors.theatreName?.message}
              />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <TextField
                label="Show Date"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                {...register("showDate")}
                error={!!errors.showDate}
                helperText={errors.showDate?.message}
              />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <TextField
                label="Show Time"
                type="time"
                fullWidth
                InputLabelProps={{ shrink: true }}
                {...register("showTime")}
                error={!!errors.showTime}
                helperText={errors.showTime?.message}
              />
            </Grid>
            <Grid size={12}>
              <TextField
                label="Ticket Price"
                type="number"
                fullWidth
                {...register("ticketPrice", { valueAsNumber: true })}
                error={!!errors.ticketPrice}
                helperText={errors.ticketPrice?.message}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={submitting}>
            {submitting ? "Saving..." : "Create Showtime"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
