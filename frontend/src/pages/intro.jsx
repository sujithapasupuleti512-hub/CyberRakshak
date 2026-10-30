import React from "react";
import { useNavigate } from "react-router-dom";
import "./Intro.css";

export default function Intro() {
  const navigate = useNavigate();

  const features = [
    {
      icon: "🔍",
      title: "Domain Detection",
      description:
        "Check website domains for basic suspicious patterns.",
    },
    {
      icon: "🎣",
      title: "Phishing Detection",
      description:
        "Identify potential phishing warning signs and suspicious links.",
    },
    {
      icon: "🛡️",
      title: "Digital Risk Protection",
      description:
        "Explore tools designed to help you stay safer online.",
    },
  ];

  return (
    <div className="intro-page">
      <nav className="intro-navbar">
        <div className="intro-logo">
          <span>🛡️</span> CyberRaksha
        </div>

        <div className="intro-nav-actions">
          <button
            className="intro-login-btn"
            onClick={() => navigate("/login")}
          >
            Login
          </button>

          <button
            className="intro-signup-btn"
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </button>
        </div>
      </nav>

      <main>
        <section className="intro-hero">
          <div className="intro-badge">
            YOUR DIGITAL SAFETY STARTS HERE
          </div>

          <h1>
            Protect Your Digital World
            <span> with CyberRaksha</span>
          </h1>

          <p className="intro-description">
            Your Digital World, Our Protection.
            Explore digital risk protection tools designed to help
            you identify suspicious websites and understand online threats.
          </p>

          <div className="intro-hero-actions">
            <button
              className="intro-primary-btn"
              onClick={() => navigate("/signup")}
            >
              Get Started →
            </button>

            <button
              className="intro-secondary-btn"
              onClick={() => navigate("/login")}
            >
              Login to Dashboard
            </button>
          </div>

          <div className="intro-security-note">
            <span>🔐</span>
            Building awareness for a safer digital experience
          </div>
        </section>

        <section className="intro-features">
          <div className="intro-section-heading">
            <p>OUR CAPABILITIES</p>
            <h2>Explore CyberRaksha</h2>
            <span>
              Tools to help you recognize and understand digital risks.
            </span>
          </div>

          <div className="intro-feature-grid">
            {features.map((feature) => (
              <article
                className="intro-feature-card"
                key={feature.title}
              >
                <div className="intro-feature-icon">
                  {feature.icon}
                </div>

                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </article>
            ))}
          </div>
        </section>
      </main>

      <footer className="intro-footer">
        <div className="intro-logo">
          <span>🛡️</span> CyberRaksha
        </div>

        <p>Your Digital World, Our Protection.</p>
        <small>© {new Date().getFullYear()} CyberRaksha</small>
      </footer>
    </div>
  );
}