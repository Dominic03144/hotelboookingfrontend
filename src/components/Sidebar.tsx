// ✅ src/components/Sidebar.tsx

import { useEffect } from "react";
import { motion } from "framer-motion";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Hotel,
  BedDouble,
  CalendarCheck2,
  Ticket,
  CreditCard,
  User,
  ChevronLeft,
  ChevronRight,
  X,
  ArrowLeft,
} from "lucide-react";

export interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

const navItems = [
  { path: "/admin", label: "Overview", icon: <LayoutDashboard className="w-5 h-5" /> },
  { path: "/admin/users", label: "Users", icon: <Users className="w-5 h-5" /> },
  { path: "/admin/hotels", label: "Hotels", icon: <Hotel className="w-5 h-5" /> },
  { path: "/admin/rooms", label: "Rooms", icon: <BedDouble className="w-5 h-5" /> },
  { path: "/admin/bookings", label: "Bookings", icon: <CalendarCheck2 className="w-5 h-5" /> },
  { path: "/admin/tickets", label: "Tickets", icon: <Ticket className="w-5 h-5" /> },
  { path: "/admin/payments", label: "Payments", icon: <CreditCard className="w-5 h-5" /> },
  { path: "/admin/profile", label: "Profile", icon: <User className="w-5 h-5" /> },
];

export default function Sidebar({
  open,
  setOpen,
  mobileOpen,
  setMobileOpen,
}: SidebarProps) {
  const navigate = useNavigate();

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [setMobileOpen]);

  const sidebarClasses = `fixed md:static z-50 bg-blue-800 text-white h-full transition-all duration-300 ${
    open ? "w-64" : "w-20"
  } ${mobileOpen ? "left-0" : "-left-64"} md:left-0`;

  return (
    <motion.aside
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      exit={{ x: -300 }}
      className={sidebarClasses}
    >
      <div className="flex justify-between items-center p-4 border-b border-blue-700">
        <h2
          className={`font-bold text-lg ${
            open ? "opacity-100" : "opacity-0 hidden md:block"
          }`}
        >
          Admin Panel
        </h2>
        <button className="md:hidden" onClick={() => setMobileOpen(false)}>
          <X className="w-5 h-5" />
        </button>
      </div>

      <nav className="mt-4 flex flex-col gap-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 mx-2 rounded transition-colors ${
                isActive ? "bg-blue-700" : "hover:bg-blue-700"
              }`
            }
          >
            {item.icon}
            {open && <span className="text-sm">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="absolute bottom-4 left-0 w-full flex flex-col items-end px-4 gap-2">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 bg-blue-700 p-2 rounded-full hover:bg-blue-600 transition"
          title="Go back"
        >
          <ArrowLeft className="w-5 h-5" />
          {open && <span className="text-xs">Back</span>}
        </button>

        <button
          onClick={() => setOpen(!open)}
          className="bg-blue-700 p-2 rounded-full hover:bg-blue-600 transition"
          title="Toggle sidebar"
        >
          {open ? (
            <ChevronLeft className="w-5 h-5" />
          ) : (
            <ChevronRight className="w-5 h-5" />
          )}
        </button>
      </div>
    </motion.aside>
  );
}
