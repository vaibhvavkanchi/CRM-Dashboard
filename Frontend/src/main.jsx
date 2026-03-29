import React from "react";
import ReactDOM from "react-dom/client";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { NotificationProvider } from "./context/NotificationContext";
import { LoadingProvider } from "./context/LoadingContext";
import theme from "./theme";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <LoadingProvider>
          <AuthProvider>
            <NotificationProvider>
              <App />
              <Toaster
                position="top-right"
                toastOptions={{
                  style: {
                    background: "rgba(15, 23, 42, 0.75)",
                    color: "rgba(255,255,255,0.95)",
                    border: "1px solid rgba(255,255,255,0.16)",
                    backdropFilter: "blur(18px)",
                  },
                }}
              />
            </NotificationProvider>
          </AuthProvider>
        </LoadingProvider>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>,
);
