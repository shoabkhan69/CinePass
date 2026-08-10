import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().min(1, "Email is required").email("Enter a valid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;

export const movieSchema = z.object({
  title: z.string().min(1, "Title is required"),
  genre: z.string().min(1, "Genre is required"),
  duration: z
    .number({ error: "Duration is required" })
    .int("Duration must be a whole number")
    .positive("Duration must be positive"),
  rating: z
    .number({ error: "Rating is required" })
    .min(0, "Rating must be at least 0")
    .max(5, "Rating must be at most 5"),
  posterUrl: z.string().url("Enter a valid URL").or(z.literal("")).optional(),
  synopsis: z.string().min(1, "Synopsis is required"),
  cast: z.string().optional(),
});

export type MovieFormValues = z.infer<typeof movieSchema>;

export const showtimeSchema = z.object({
  movieId: z.number({ error: "Movie is required" }).positive("Movie is required"),
  theatreName: z.string().min(1, "Theatre name is required"),
  showDate: z.string().min(1, "Show date is required"),
  showTime: z.string().min(1, "Show time is required"),
  ticketPrice: z
    .number({ error: "Ticket price is required" })
    .positive("Ticket price must be positive"),
});

export type ShowtimeFormValues = z.infer<typeof showtimeSchema>;
