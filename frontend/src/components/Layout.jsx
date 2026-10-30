import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import Logo from "./Logo.jsx";

export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="app-shell">
      <div className="app-shell__sidebar">
        <Sidebar />
      </div>

      <div className="app-shell__main">
        <header className="mobile-bar">
          <Logo to="/dashboard" />
          <button
            type="button"
            className="mobile-bar__toggle"
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </header>

        {menuOpen && (
          <div className="mobile-drawer">
            <Sidebar onNavigate={() => setMenuOpen(false)} />
          </div>
        )}

        <main className="app-shell__content" key={location.pathname}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
