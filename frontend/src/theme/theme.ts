import { createTheme, type PaletteMode, type ThemeOptions } from "@mui/material/styles";

// Design tokens
// -------------
// Marquee gold  #E8B44C  - primary accent, ticket-stub gold foil
// Velvet red    #B33951  - secondary accent, cancel / live indicators
// Ink (dark bg) #0B0C10  - near-black with a warm undertone, not pure black
// Screen grey   #16181D  - dark surface
// Reel cream    #F5F2EA  - light bg / dark-mode text
// Muted slate   #8B8F98  - secondary text

const marqueeGold = "#E8B44C";
const velvetRed = "#C1445C";
const inkBg = "#0B0C10";
const screenSurface = "#15171D";
const reelCream = "#F7F4EC";
const lightSurface = "#FFFFFF";

export function getDesignTokens(mode: PaletteMode): ThemeOptions {
  const isDark = mode === "dark";

  return {
    palette: {
      mode,
      primary: {
        main: marqueeGold,
        contrastText: "#1A1200",
      },
      secondary: {
        main: velvetRed,
        contrastText: "#FFFFFF",
      },
      background: {
        default: isDark ? inkBg : "#F3F1EC",
        paper: isDark ? screenSurface : lightSurface,
      },
      text: {
        primary: isDark ? reelCream : "#1C1B1A",
        secondary: isDark ? "#9A9DA6" : "#5D5A52",
      },
      success: { main: "#3FA66A" },
      error: { main: "#D64545" },
      divider: isDark ? "rgba(247,244,236,0.10)" : "rgba(28,27,26,0.10)",
    },
    shape: {
      borderRadius: 10,
    },
    typography: {
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      h1: { fontFamily: '"Bebas Neue", sans-serif', letterSpacing: "0.02em", fontWeight: 400 },
      h2: { fontFamily: '"Bebas Neue", sans-serif', letterSpacing: "0.02em", fontWeight: 400 },
      h3: { fontFamily: '"Bebas Neue", sans-serif', letterSpacing: "0.02em", fontWeight: 400 },
      h4: { fontFamily: '"Bebas Neue", sans-serif', letterSpacing: "0.015em", fontWeight: 400 },
      h5: { fontWeight: 700 },
      h6: { fontWeight: 700 },
      button: { textTransform: "none", fontWeight: 600 },
      overline: {
        fontFamily: '"IBM Plex Mono", monospace',
        letterSpacing: "0.12em",
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: { borderRadius: 8, paddingInline: 20 },
          containedPrimary: {
            boxShadow: "none",
            "&:hover": { boxShadow: "none" },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: { backgroundImage: "none" },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
          },
        },
      },
    },
  };
}

export function buildTheme(mode: PaletteMode) {
  return createTheme(getDesignTokens(mode));
}

export const ticketMonoFont = '"IBM Plex Mono", monospace';
