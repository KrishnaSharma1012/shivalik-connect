import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// Disable browser scroll restoration so page always starts at top on refresh
if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);