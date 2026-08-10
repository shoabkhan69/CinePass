import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  useMediaQuery,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Divider,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import LocalActivityRoundedIcon from "@mui/icons-material/LocalActivityRounded";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useColorMode } from "../context/ColorModeContext";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { mode, toggleMode } = useColorMode();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleLogout = () => {
    setAnchorEl(null);
    logout();
    navigate("/");
  };

  const navLinks = (
    <>
      <Button component={RouterLink} to="/" color="inherit">
        Now Showing
      </Button>
      {isAuthenticated && (
        <Button component={RouterLink} to="/my-bookings" color="inherit">
          My Bookings
        </Button>
      )}
      {user?.isAdmin && (
        <Button component={RouterLink} to="/admin" color="inherit">
          Admin
        </Button>
      )}
    </>
  );

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: "background.paper",
        borderBottom: "1px solid",
        borderColor: "divider",
      }}
    >
      <Toolbar sx={{ gap: 1 }}>
        {isMobile && (
          <IconButton edge="start" color="inherit" onClick={() => setDrawerOpen(true)} sx={{ mr: 1 }}>
            <MenuRoundedIcon />
          </IconButton>
        )}

        <Box
          component={RouterLink}
          to="/"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            textDecoration: "none",
            color: "text.primary",
            flexGrow: { xs: 1, sm: 0 },
          }}
        >
          <LocalActivityRoundedIcon sx={{ color: "primary.main" }} />
          <Typography variant="h4" sx={{ fontSize: "1.6rem", lineHeight: 1 }}>
            CinePass
          </Typography>
        </Box>

        {!isMobile && <Box sx={{ display: "flex", gap: 0.5, ml: 3 }}>{navLinks}</Box>}

        <Box sx={{ flexGrow: 1 }} />

        <IconButton onClick={toggleMode} color="inherit" aria-label="Toggle dark mode">
          {mode === "dark" ? <LightModeRoundedIcon /> : <DarkModeRoundedIcon />}
        </IconButton>

        {isAuthenticated ? (
          <>
            <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ ml: 1 }}>
              <Avatar sx={{ width: 32, height: 32, bgcolor: "primary.main", color: "primary.contrastText" }}>
                {user?.name?.[0]?.toUpperCase() ?? "U"}
              </Avatar>
            </IconButton>
            <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={() => setAnchorEl(null)}>
              <MenuItem disabled>{user?.email}</MenuItem>
              <Divider />
              {user?.isAdmin && (
                <MenuItem
                  onClick={() => {
                    setAnchorEl(null);
                    navigate("/admin");
                  }}
                >
                  Admin Dashboard
                </MenuItem>
              )}
              <MenuItem
                onClick={() => {
                  setAnchorEl(null);
                  navigate("/my-bookings");
                }}
              >
                My Bookings
              </MenuItem>
              <MenuItem onClick={handleLogout}>Log out</MenuItem>
            </Menu>
          </>
        ) : (
          <Box sx={{ display: "flex", gap: 1, ml: 1 }}>
            <Button component={RouterLink} to="/login" color="inherit">
              Log in
            </Button>
            <Button component={RouterLink} to="/register" variant="contained" color="primary">
              Sign up
            </Button>
          </Box>
        )}
      </Toolbar>

      <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 240 }} role="presentation" onClick={() => setDrawerOpen(false)}>
          <List>
            <ListItemButton component={RouterLink} to="/">
              <ListItemText primary="Now Showing" />
            </ListItemButton>
            {isAuthenticated && (
              <ListItemButton component={RouterLink} to="/my-bookings">
                <ListItemText primary="My Bookings" />
              </ListItemButton>
            )}
            {user?.isAdmin && (
              <ListItemButton component={RouterLink} to="/admin">
                <ListItemText primary="Admin" />
              </ListItemButton>
            )}
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
}
