import { Box, Skeleton, Grid } from "@mui/material";

export default function MovieGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <Grid container spacing={3}>
      {Array.from({ length: count }, (_, i) => (
        <Grid key={i} size={{ xs: 6, sm: 4, md: 3 }}>
          <Box>
            <Skeleton variant="rounded" sx={{ aspectRatio: "2 / 3", width: "100%", borderRadius: 3 }} />
            <Skeleton variant="text" sx={{ mt: 1, fontSize: "1.1rem" }} />
            <Skeleton variant="text" width="60%" />
          </Box>
        </Grid>
      ))}
    </Grid>
  );
}
