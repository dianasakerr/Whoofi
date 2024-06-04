import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import WindowSetter from "./WindowSetter.tsx";
import { ThemeProvider } from "@emotion/react";
import theme from "./styles/theme.js";
import "./styles/styles.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <Router>
        <WindowSetter />
      </Router>
    </ThemeProvider>
  </React.StrictMode>
);
