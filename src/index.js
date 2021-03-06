import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { MantineProvider } from "@mantine/core";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <MantineProvider
    theme={{
      colorScheme: "dark",
      fontFamily: "Tahoma, sans-serif",
      primaryColor: "gray",
      headings: {
        fontFamily: "Tahoma, sans-serif",
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
