import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { MantineProvider } from "@mantine/core";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <MantineProvider
    theme={{
      colorScheme: "dark",
      fontFamily: "monospace",
      primaryColor: "green",
      headings: {
        fontFamily: "monospace",
      },
    }}
    withGlobalStyles
    withNormalizeCSS
  >
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </MantineProvider>
);
