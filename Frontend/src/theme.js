import { alpha, createTheme } from "@mui/material/styles";

const glassBorder = "1px solid rgba(255,255,255,0.18)";
const glassBackground = "rgba(255,255,255,0.08)";
const glassSelectBackground = "rgba(15, 23, 42, 0.4)";
const glassMenuBackground = "rgba(15, 23, 42, 0.7)";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#8b5cf6",
      light: "#a78bfa",
    },
    secondary: {
      main: "#38bdf8",
      light: "#7dd3fc",
    },
    background: {
      default: "#0f172a",
      paper: glassBackground,
    },
    text: {
      primary: "rgba(255,255,255,0.96)",
      secondary: "rgba(255,255,255,0.74)",
    },
    divider: "rgba(255,255,255,0.12)",
  },
  typography: {
    fontFamily: 'Inter, Poppins, "Segoe UI", Roboto, sans-serif',
    h4: { fontWeight: 700, letterSpacing: -0.5 },
    h6: { fontWeight: 700 },
    button: { textTransform: "none", fontWeight: 600 },
  },
  shape: {
    borderRadius: 18,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          minHeight: "100vh",
          background:
            "linear-gradient(135deg, #0f172a 0%, #1e293b 45%, #312e81 100%)",
          color: "rgba(255,255,255,0.96)",
        },
        "#root": {
          minHeight: "100vh",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: glassBackground,
          border: glassBorder,
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          boxShadow: "0 12px 40px rgba(15, 23, 42, 0.35)",
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: "rgba(15, 23, 42, 0.72)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          borderRight: glassBorder,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: "rgba(15, 23, 42, 0.5)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          borderBottom: glassBorder,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          transition: "all 0.3s ease",
        },
        contained: {
          background:
            "linear-gradient(135deg, rgba(139,92,246,0.95), rgba(56,189,248,0.92))",
          boxShadow: "0 10px 28px rgba(56, 189, 248, 0.22)",
          "&:hover": {
            transform: "translateY(-1px)",
            boxShadow: "0 14px 34px rgba(139, 92, 246, 0.3)",
          },
        },
        outlined: {
          borderColor: "rgba(255,255,255,0.2)",
          background: "rgba(255,255,255,0.06)",
          "&:hover": {
            borderColor: "rgba(255,255,255,0.3)",
            background: "rgba(255,255,255,0.1)",
          },
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: "outlined",
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          background: glassSelectBackground,
          borderRadius: 14,
          transition: "all 0.3s ease",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          "& fieldset": {
            borderColor: "rgba(255,255,255,0.14)",
          },
          "&:hover fieldset": {
            borderColor: "rgba(255,255,255,0.26)",
          },
          "&.Mui-focused": {
            boxShadow: "0 0 0 4px rgba(139, 92, 246, 0.12)",
          },
        },
        input: {
          color: "rgba(255,255,255,0.96)",
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        icon: {
          color: "rgba(255,255,255,0.7)",
        },
        select: {
          paddingTop: 8,
          paddingBottom: 8,
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          marginTop: 8,
          borderRadius: 14,
          background: glassMenuBackground,
          border: "1px solid rgba(255,255,255,0.16)",
          boxShadow: "0 20px 50px rgba(15, 23, 42, 0.45)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          color: "rgba(255,255,255,0.9)",
        },
        list: {
          paddingTop: 4,
          paddingBottom: 4,
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          marginInline: 4,
          marginBlock: 2,
          textTransform: "capitalize",
          "&.Mui-selected": {
            backgroundColor: "rgba(255,255,255,0.18)",
          },
          "&.Mui-selected:hover": {
            backgroundColor: "rgba(255,255,255,0.24)",
          },
          "&:hover": {
            backgroundColor: "rgba(255,255,255,0.12)",
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: "rgba(255,255,255,0.7)",
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          background: "rgba(15, 23, 42, 0.74)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: glassBorder,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          background: "rgba(255,255,255,0.1)",
          border: glassBorder,
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          marginInline: 8,
          transition: "all 0.3s ease",
          "&.Mui-selected": {
            background: alpha("#8b5cf6", 0.2),
            border: glassBorder,
          },
          "&:hover": {
            background: "rgba(255,255,255,0.08)",
          },
        },
      },
    },
  },
});

export default theme;
