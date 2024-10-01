import { Link, useNavigate } from "react-router-dom";
import DarkModeToggle from "./DarkModeToggle"; // Import the DarkModeToggle component

export default function Header() {
  const isLoggedIn = localStorage.getItem("isLogin") === "true"; // Check if logged in
  const navigate = useNavigate(); // For programmatic navigation

  const handleIconClick = () => {
    if (isLoggedIn) {
      navigate("/blog"); // Navigate to /blog if logged in
    } else {
      navigate("/home"); // Navigate to /signin if not logged in
    }
  };

  const handleLogout = () => {
    localStorage.setItem("isLogin", "false"); // Log out the user
    localStorage.removeItem("jwt-token"); // Remove the JWT token from local storage
    localStorage.removeItem("isLogin"); // Remove the isLogin flag from local storage
    navigate("/signin"); // Redirect to /signin after logging out
  };

  return (
    <header className="bg-gray-100 px-4 lg:px-6 h-14 flex items-center border-b">
      {/* Logo/Icon with conditional navigation */}
      <div
        onClick={handleIconClick}
        className="flex items-center justify-center cursor-pointer"
      >
        <img
          src="https://cdn3.iconfinder.com/data/icons/social-rounded-2/72/Codepen-512.png"
          alt="codepen"
          className="h-6 w-6"
        />
        <span className="sr-only">Icon</span>
      </div>

      {/* Conditional navigation links based on login status */}
      <nav className="ml-auto flex gap-4 sm:gap-6">
        {isLoggedIn ? (
          <>
            {/* Links shown when user is logged in */}
            <Link to="/blog" className="text-sm font-medium hover:underline">
              Home
            </Link>
            <div>
              <button
                onClick={handleLogout}
                className="text-sm font-medium hover:underline"
              >
                Logout
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Links shown when user is not logged in */}
            <Link to="/home" className="text-sm font-medium hover:underline">
              Home
            </Link>
            <Link to="/signin" className="text-sm font-medium hover:underline">
              Sign In
            </Link>
            <Link to="/signup" className="text-sm font-medium hover:underline">
              Sign Up
            </Link>
            <Link to="/blog" className="text-sm font-medium hover:underline">
              Blogs
            </Link>
          </>
        )}
      </nav>

      {/* Dark Mode Toggle Button */}
      <DarkModeToggle />
    </header>
  );
}