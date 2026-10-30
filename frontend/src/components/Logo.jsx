import { Link } from "react-router-dom";
import { ShieldCheck } from "lucide-react";

export default function Logo({ to = "/dashboard", compact = false }) {
  return (
    <Link to={to} className="logo" aria-label="CyberRakshak home">
      <span className="logo__mark" aria-hidden="true">
        <ShieldCheck size={compact ? 20 : 24} />
      </span>
      {!compact && <span className="logo__text">CyberRakshak</span>}
    </Link>
  );
}
