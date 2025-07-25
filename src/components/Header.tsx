import { Menu, Sun, Moon, Bell, UserCircle } from "lucide-react";

interface HeaderProps {
  pageTitle: string;
  toggleSidebar: () => void;
  toggleDarkMode: () => void;
  darkMode: boolean;
}

export default function Header({ pageTitle, toggleSidebar, toggleDarkMode, darkMode }: HeaderProps) {
  return (
    <header className="sticky top-0 bg-white dark:bg-gray-800 shadow flex justify-between items-center px-6 py-4 z-30">
      <div className="flex items-center gap-4">
        <button
          className="md:hidden text-gray-700 dark:text-gray-200"
          onClick={toggleSidebar}
        >
          <Menu />
        </button>
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">{pageTitle}</h1>
      </div>
      <div className="flex items-center gap-4">
        <button className="relative text-gray-700 dark:text-gray-200">
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 inline-block w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <button className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
          <UserCircle className="h-6 w-6" />
        </button>
        <button onClick={toggleDarkMode} className="text-gray-700 dark:text-gray-200">
          {darkMode ? <Sun /> : <Moon />}
        </button>
      </div>
    </header>
  );
}
