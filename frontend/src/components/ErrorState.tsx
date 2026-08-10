import { Box, Typography, Button } from "@mui/material";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export default function ErrorState({ message = "We couldn't load this. Please try again.", onRetry }: ErrorStateProps) {
  return (
    <Box
      sx={{
        textAlign: "center",
        py: 8,
        px: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 1.5,
      }}
    >
      <ErrorOutlineRoundedIcon sx={{ fontSize: 44, color: "error.main" }} />
      <Typography variant="body1" color="text.secondary">
        {message}
      </Typography>
      {onRetry && (
        <Button variant="outlined" color="error" onClick={onRetry}>
          Try again
        </Button>
      )}
    </Box>
  );
}
