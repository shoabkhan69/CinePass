import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Paper, Typography, TextField, Button, Link, Alert } from "@mui/material";
import { Link as RouterLink, useNavigate, useLocation } from "react-router-dom";
import { useSnackbar } from "notistack";
import { useAuth } from "../context/AuthContext";
import { loginSchema, type LoginFormValues } from "../utils/validationSchemas";
import { extractErrorMessage } from "../api/apiClient";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { enqueueSnackbar } = useSnackbar();
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  const from = (location.state as { from?: Location })?.from?.pathname ?? "/";

  const onSubmit = async (values: LoginFormValues) => {
    setServerError(null);
    setSubmitting(true);
    try {
      await login(values);
      enqueueSnackbar("Welcome back!", { variant: "success" });
      navigate(from, { replace: true });
    } catch (err) {
      setServerError(extractErrorMessage(err, "Invalid email or password"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 420, mx: "auto", mt: { xs: 2, md: 6 } }}>
      <Paper
        elevation={0}
        sx={{ p: 4, border: "1px solid", borderColor: "divider", borderRadius: 3 }}
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <Typography variant="h3" sx={{ mb: 0.5 }}>
          Welcome back
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Log in to book your next show.
        </Typography>

        {serverError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {serverError}
          </Alert>
        )}

        <TextField
          label="Email"
          type="email"
          fullWidth
          margin="normal"
          autoComplete="email"
          {...register("email")}
          error={!!errors.email}
          helperText={errors.email?.message}
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          autoComplete="current-password"
          {...register("password")}
          error={!!errors.password}
          helperText={errors.password?.message}
        />

        <Button type="submit" fullWidth variant="contained" size="large" disabled={submitting} sx={{ mt: 2, py: 1.3 }}>
          {submitting ? "Logging in..." : "Log in"}
        </Button>

        <Typography variant="body2" align="center" sx={{ mt: 3 }} color="text.secondary">
          New to CinePass?{" "}
          <Link component={RouterLink} to="/register">
            Create an account
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
}
