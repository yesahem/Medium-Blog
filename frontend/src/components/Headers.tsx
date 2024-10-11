import { Link, useNavigate } from "react-router-dom";
import DarkModeToggle from "./DarkModeToggle";

export default function Header() {
  const isLoggedIn = localStorage.getItem("isLogin") === "true";
  const navigate = useNavigate();

  const handleIconClick = () => {
    navigate(isLoggedIn ? "/blog" : "/home");
  };

  const handleLogout = () => {
    localStorage.removeItem("jwt-token");
    localStorage.removeItem("isLogin");
    navigate("/signin");
  };

  return (
    <header className="bg-gray-100 dark:bg-gray-800 px-4 lg:px-6 h-14 flex items-center justify-between border-b">
      <div
        onClick={handleIconClick}
        className="flex items-center justify-center cursor-pointer"
      >
        <img
          src="https://cdn3.iconfinder.com/data/icons/social-rounded-2/72/Codepen-512.png"
          alt="Codepen logo"
          className="h-6 w-6"
        />
        <span className="sr-only">Navigate to {isLoggedIn ? 'Blog' : 'Home'}</span>
      </div>

      <nav className="flex items-center space-x-4">
        <Link to="/home" className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100">
          Home
        </Link>
        <Link to="/blog" className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100">
          Blogs
        </Link>
        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
          >
            Logout
          </button>
        ) : (
          <>
            <button
              onClick={() => navigate("/signin")}
              className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="px-3 py-2  text-sm text-white bg-gray-900 rounded hover:bg-gray-700 transition-colors duration-200"
            >
              Sign Up
            </button>
          </>
        )}
        <DarkModeToggle />
      </nav>
    </header>
  );
}