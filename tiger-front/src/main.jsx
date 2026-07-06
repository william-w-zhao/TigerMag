import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { PHProvider } from "./services/posthog.jsx";
import { PostHogErrorBoundary } from "@posthog/react";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <PHProvider>
      <PostHogErrorBoundary>
        <App />
      </PostHogErrorBoundary>
    </PHProvider>
  </React.StrictMode>
);