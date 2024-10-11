import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

export default function DarkModeToggle() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    if (isDarkMode) {
      // console.log("dark mode document element", document.documentElement)
      // console.log("document class list", document.documentElement.classList);
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <button onClick={toggleDarkMode} className="p-2 dark:text-white">
      {/* {isDarkMode ? 'Light Mode' : 'Dark Mode'} */}
      {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}