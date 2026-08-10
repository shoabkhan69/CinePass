import { Box, Container, Typography } from "@mui/material";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function MainLayout() {
  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column", bgcolor: "background.default" }}>
      <Navbar />
      <Container component="main" maxWidth="lg" sx={{ flex: 1, py: { xs: 3, md: 5 } }}>
        <Outlet />
      </Container>
      <Box component="footer" sx={{ borderTop: "1px solid", borderColor: "divider", py: 3 }}>
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary" align="center">
            CinePass · Your seat is always waiting.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}
