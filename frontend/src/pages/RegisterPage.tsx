import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Paper, Typography, TextField, Button, Link, Alert } from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { useAuth } from "../context/AuthContext";
import { registerSchema, type RegisterFormValues } from "../utils/validationSchemas";
import { extractErrorMessage } from "../api/apiClient";

export default function RegisterPage() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({ resolver: zodResolver(registerSchema) });

  const onSubmit = async (values: RegisterFormValues) => {
    setServerError(null);
    setSubmitting(true);
    try {
      await registerUser({ name: values.name, email: values.email, password: values.password });
      enqueueSnackbar("Account created — welcome to CinePass!", { variant: "success" });
      navigate("/", { replace: true });
    } catch (err) {
      setServerError(extractErrorMessage(err, "Could not create your account"));
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
          Create your account
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Join CinePass to start booking seats.
        </Typography>

        {serverError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {serverError}
          </Alert>
        )}

        <TextField
          label="Full name"
          fullWidth
          margin="normal"
          autoComplete="name"
          {...register("name")}
          error={!!errors.name}
          helperText={errors.name?.message}
        />
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
          autoComplete="new-password"
          {...register("password")}
          error={!!errors.password}
          helperText={errors.password?.message}
        />
        <TextField
          label="Confirm password"
          type="password"
          fullWidth
          margin="normal"
          autoComplete="new-password"
          {...register("confirmPassword")}
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword?.message}
        />

        <Button type="submit" fullWidth variant="contained" size="large" disabled={submitting} sx={{ mt: 2, py: 1.3 }}>
          {submitting ? "Creating account..." : "Sign up"}
        </Button>

        <Typography variant="body2" align="center" sx={{ mt: 3 }} color="text.secondary">
          Already have an account?{" "}
          <Link component={RouterLink} to="/login">
            Log in
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
}
