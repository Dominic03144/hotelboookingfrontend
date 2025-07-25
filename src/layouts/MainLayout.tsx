// src/layouts/MainLayout.tsx
import { Outlet } from "react-router-dom";
import Navbar from "../layouts/NavBar"; // adjust path if needed

export default function MainLayout() {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
    </>
  );
}
