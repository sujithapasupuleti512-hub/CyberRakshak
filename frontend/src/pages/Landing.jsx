import { Link, useNavigate } from "react-router-dom";
import { BarChart3, Globe, Link2, Lock, ShieldCheck } from "lucide-react";

const FEATURES = [
  {
    icon: Globe,
    title: "Domain Detection",
    description: "Check website domains for common suspicious patterns.",
  },
  {
    icon: Link2,
    title: "URL Analyzer",
    description: "Inspect links for phishing indicators before you click.",
  },
  {
    icon: BarChart3,
    title: "Risk Dashboard",
    description: "Review your scan history and risk breakdown in one place.",
  },
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="landing">
      <nav className="landing__nav">
        <div className="logo logo--static">
          <span className="logo__mark" aria-hidden="true">
            <ShieldCheck size={24} />
          </span>
          <span className="logo__text">CyberRakshak</span>
        </div>

        <div className="landing__nav-actions">
          <Link to="/login" className="btn btn--ghost">
            Login
          </Link>
          <Link to="/signup" className="btn btn--primary">
            Sign Up
          </Link>
        </div>
      </nav>

      <main>
        <section className="landing__hero">
          <span className="pill">YOUR DIGITAL SAFETY STARTS HERE</span>

          <h1>
            Protect Your Digital World
            <span> with CyberRakshak</span>
          </h1>

          <p className="landing__description">
            Your Digital World, Our Protection. Explore digital risk protection tools
            designed to help you identify suspicious websites and understand online threats.
          </p>

          <div className="landing__actions">
            <button type="button" className="btn btn--primary btn--lg" onClick={() => navigate("/signup")}>
              Get Started →
            </button>
            <button type="button" className="btn btn--outline btn--lg" onClick={() => navigate("/login")}>
              Login to Dashboard
            </button>
          </div>

          <p className="landing__note">
            <Lock size={14} aria-hidden="true" />
            Building awareness for a safer digital experience
          </p>
        </section>

        <section className="landing__features">
          <div className="section-heading">
            <p>OUR CAPABILITIES</p>
            <h2>Explore CyberRakshak</h2>
            <span>Tools to help you recognize and understand digital risks.</span>
          </div>

          <div className="landing__grid">
            {FEATURES.map(({ icon: Icon, title, description }) => (
              <article className="feature-card" key={title}>
                <span className="feature-card__icon" aria-hidden="true">
                  <Icon size={22} />
                </span>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </section>
      </main>

      <footer className="landing__footer">
        <div className="logo logo--static">
          <span className="logo__mark" aria-hidden="true">
            <ShieldCheck size={20} />
          </span>
          <span className="logo__text">CyberRakshak</span>
        </div>
        <p>Your Digital World, Our Protection.</p>
        <small>© {new Date().getFullYear()} CyberRakshak</small>
      </footer>
    </div>
  );
}
