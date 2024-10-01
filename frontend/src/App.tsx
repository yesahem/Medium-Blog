// src/App.tsx
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
  {
    path: "/",
    element: <Index />,
    children: [
      { path: "", element: <Home /> },
      { path: "home", element: <Home /> },
      {
        path: "blog",
        element: <Blog />,
        children: [
          { path: ":id", element: <Fetch /> },
        ],
      },
      { path: "signin", element: <SignIn /> },
      { path: "signup", element: <Signup /> },
      { path: "test", element: <Test /> },
      { path: "upload_blogs", element: <UploadBlogs /> },
    ],
  },
]);

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

function App() {
  // Check local storage for dark mode preference
  if (localStorage.getItem('dark-mode') === 'true') {
    document.documentElement.classList.add('dark');
  }

  return (
    <>
      <ToggleDarkModeButton />
      <RouterProvider router={routes} />
    </>
  );
}

export default App;
