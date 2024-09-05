import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="flex flex-col sm:flex-row py-6 w-full items-center px-4 md:px-6 border-t">
      <p className="text-xs text-gray-500">
        &copy; 2024 Made By Shishu with ❤️
      </p>
      <nav className="sm:ml-auto flex gap-4 sm:gap-6">
        <Link to="#" className="text-xs hover:underline">
          Thanks to GPT and google for help
        </Link>
        <Link to="#" className="text-xs hover:underline">
          Privacy jaisa kuch nahi hota
        </Link>
      </nav>
    </footer>
  )
}
