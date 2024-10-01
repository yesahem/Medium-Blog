import React, { useState, useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Signup from "./routes/Signup";
import SignIn from "./routes/SignIn";
import Blog from "./routes/Blogs";
import Index from "./routes/Index";
import Home from "./routes/Home";
import Test from "./routes/Test";
import Fetch from "./components/Fetch";
import UploadBlogs from "./routes/UploadBlogs";

const routes = createBrowserRouter([
  // your routes here
]);

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  return (
    <div>
      <button
        onClick={toggleDarkMode}
        className="p-2 bg-blue-500 text-white rounded"
      >
        Toggle Dark Mode
      </button>
      <RouterProvider router={routes} />
    </div>
  );
}

export default App;
