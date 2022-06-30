import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { MantineProvider } from "@mantine/core";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <MantineProvider
    theme={{ fontFamily: "Open Sans", colorScheme: "dark" }}
    withGlobalStyles
    withNormalizeCSS
  >
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </MantineProvider>
);
