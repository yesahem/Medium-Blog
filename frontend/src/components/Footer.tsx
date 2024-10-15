import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="flex flex-col sm:flex-row py-6 w-full items-center px-4 md:px-6 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 transition-colors duration-300">
      <div className="flex items-center space-x-4">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          &copy; 2024 Made By Shishu with ❤️
        </p>
      </div>
      <nav className="sm:ml-auto flex gap-4 sm:gap-6 mt-4 sm:mt-0">
        <Link to="#" className="text-xs hover:underline text-gray-600 dark:text-gray-300">
          Thanks to GPT and google for help
        </Link>
        <Link to="#" className="text-xs hover:underline text-gray-600 dark:text-gray-300">
          Privacy jaisa kuch nahi hota
        </Link>
      </nav>
    </footer>
  )
}