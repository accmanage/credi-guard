import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

function ErrorBoundary({ children }: { children: React.ReactNode }) {
  try {
    return <>{children}</>;
  } catch (e) {
    console.error("Runtime error:", e);
    return <div style={{ color: "red" }}>Error: {String(e)}</div>;
  }
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
