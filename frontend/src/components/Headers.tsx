import { Link } from "react-router-dom";


export default function Header() {
  return (
    <header className="bg-gray-100 px-4 lg:px-6 h-14 flex items-center border-b">
      <Link to="/" className="flex items-center justify-center">
        <img src="https://cdn3.iconfinder.com/data/icons/social-rounded-2/72/Codepen-512.png" alt="codepen" className="h-6 w-6" />
        <span className="sr-only">Acme Inc</span>
      </Link>

      <nav className="ml-auto flex gap-4 sm:gap-6">
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
      </nav>
    </header >
  )
}
