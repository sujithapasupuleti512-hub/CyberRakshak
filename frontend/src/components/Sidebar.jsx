import { NavLink, useNavigate } from "react-router-dom";
import {
  BarChart3,
  Globe,
  LayoutDashboard,
  Link2,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import Logo from "./Logo.jsx";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/domain", label: "Domain Detection", icon: Globe },
  { to: "/url", label: "URL Analyzer", icon: Link2 },
  { to: "/risk", label: "Risk Dashboard", icon: BarChart3 },
];

export default function Sidebar({ onNavigate }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <Logo to="/dashboard" />
      </div>

      <nav className="sidebar__nav" aria-label="Main navigation">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onNavigate}
            className={({ isActive }) => `sidebar__link${isActive ? " is-active" : ""}`}
          >
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar__footer">
        {user && (
          <div className="sidebar__user">
            <span className="sidebar__avatar" aria-hidden="true">
              <ShieldCheck size={16} />
            </span>
            <div className="sidebar__user-info">
              <strong>{user.name}</strong>
              <small>{user.email}</small>
            </div>
          </div>
        )}
        <button type="button" className="btn btn--ghost btn--block" onClick={handleLogout}>
          <LogOut size={16} />
          <span>Sign out</span>
        </button>
      </div>
    </aside>
  );
}
