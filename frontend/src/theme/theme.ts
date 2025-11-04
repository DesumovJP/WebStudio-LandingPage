"use client";

import { createTheme } from "@mui/material/styles";

// Minimalistic black & white theme with subtle transitions and glassmorphism tokens
const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#0a0a0a", contrastText: "#ffffff" },
    secondary: { main: "#e0e0e0" },
    background: {
      default: "#f6f6f6",
      paper: "rgba(255,255,255,0.72)",
    },
    text: { primary: "#121212", secondary: "#5c5c5c" },
  },
  typography: {
    fontFamily: "var(--font-geist-sans), system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
    h1: { fontWeight: 600, letterSpacing: "-0.04em" },
    h2: { fontWeight: 600, letterSpacing: "-0.03em" },
    h3: { fontWeight: 600 },
    button: { textTransform: "none", fontWeight: 600 },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        ":root": {
          "--glass-bg": "rgba(255,255,255,0.7)",
          "--glass-border": "rgba(255,255,255,0.35)",
          "--glass-shadow": "0 0 1.5rem rgba(0,0,0,0.08)",
        },
        "*": {
          transition: "color 120ms ease, background-color 120ms ease, border-color 120ms ease",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "9999px",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
  },
});

export default theme;


