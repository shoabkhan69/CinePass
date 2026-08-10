import { Box, Typography, Button } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <Box sx={{ textAlign: "center", py: 10 }}>
      <Typography variant="h1" sx={{ fontSize: "6rem", color: "primary.main" }}>
        404
      </Typography>
      <Typography variant="h4" sx={{ mb: 1 }}>
        This showtime doesn't exist.
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        The page you're looking for may have been moved or never existed.
      </Typography>
      <Button component={RouterLink} to="/" variant="contained" size="large">
        Back to Now Showing
      </Button>
    </Box>
  );
}
