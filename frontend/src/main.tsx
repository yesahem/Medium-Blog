import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ToastContainer } from "react-custom-alert";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <>
      <App />
      <ToastContainer floatingTime={3500} />
    </>
  </React.StrictMode>
);
