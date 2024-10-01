// src/main.tsx
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ToastContainer } from "react-custom-alert";

const rootElement = document.getElementById("root")!;

// Check local storage for dark mode preference
if (localStorage.getItem('dark-mode') === 'true') {
  document.documentElement.classList.add('dark');
}

const ToggleDarkModeButton = () => {
  const toggleDarkMode = () => {
    document.documentElement.classList.toggle('dark');
    const isDarkMode = document.documentElement.classList.contains('dark');
    localStorage.setItem('dark-mode', isDarkMode.toString());
  };

  return (
    <button 
      onClick={toggleDarkMode} 
      className="p-2 bg-gray-300 rounded dark:bg-gray-700 dark:text-white"
    >
      Toggle Dark Mode
    </button>
  );
};

createRoot(rootElement).render(
  <React.StrictMode>
    <>
      <App />
      <ToggleDarkModeButton />
      <ToastContainer floatingTime={3500} />
    </>
  </React.StrictMode>
);
