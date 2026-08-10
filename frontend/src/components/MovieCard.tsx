import { Card, CardActionArea, CardContent, Box, Typography, Chip, Stack } from "@mui/material";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import ScheduleRoundedIcon from "@mui/icons-material/ScheduleRounded";
import { useNavigate } from "react-router-dom";
import type { Movie } from "../types";
import { formatDuration } from "../utils/formatters";

export default function MovieCard({ movie }: { movie: Movie }) {
  const navigate = useNavigate();

  return (
    <Card
      elevation={0}
      sx={{
        bgcolor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 3,
        overflow: "hidden",
        height: "100%",
        transition: "transform 180ms ease, box-shadow 180ms ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: (t) => `0 12px 24px -8px ${t.palette.mode === "dark" ? "rgba(0,0,0,0.6)" : "rgba(0,0,0,0.2)"}`,
        },
      }}
    >
      <CardActionArea onClick={() => navigate(`/movies/${movie.id}`)} sx={{ height: "100%" }}>
        <Box
          sx={{
            position: "relative",
            aspectRatio: "2 / 3",
            bgcolor: "grey.900",
            backgroundImage: `url(${movie.posterUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <Chip
            size="small"
            icon={<StarRoundedIcon sx={{ fontSize: 16 }} />}
            label={movie.rating.toFixed(1)}
            sx={{
              position: "absolute",
              top: 10,
              right: 10,
              bgcolor: "rgba(11,12,16,0.75)",
              color: "#F7F4EC",
              fontWeight: 700,
              backdropFilter: "blur(4px)",
            }}
          />
        </Box>
        <CardContent>
          <Typography variant="h6" noWrap title={movie.title} sx={{ fontSize: "1.05rem" }}>
            {movie.title}
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5, color: "text.secondary" }}>
            <Typography variant="body2" noWrap>
              {movie.genre}
            </Typography>
            <Box sx={{ width: 3, height: 3, borderRadius: "50%", bgcolor: "text.secondary" }} />
            <Stack direction="row" spacing={0.5} alignItems="center">
              <ScheduleRoundedIcon sx={{ fontSize: 15 }} />
              <Typography variant="body2">{formatDuration(movie.duration)}</Typography>
            </Stack>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
