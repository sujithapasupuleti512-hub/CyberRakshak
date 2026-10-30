import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Bar, BarChart, Cell, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { ArrowRight, Globe, Link2 } from "lucide-react";
import Card from "../components/Card.jsx";
import Loading from "../components/Loading.jsx";
import RiskBadge from "../components/RiskBadge.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { api } from "../services/api";

const CHART_COLORS = ["#f87171", "#fbbf24", "#4ade80"];

export default function DashboardPage() {
  const { token, user } = useAuth();
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    api
      .getDashboardStats(token)
      .then((data) => {
        if (active) setStats(data);
      })
      .catch((err) => {
        if (active) setError(err.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [token]);

  if (loading) return <Loading label="Loading your dashboard…" />;

  if (error) {
    return (
      <div className="page">
        <p className="form-message form-message--error" role="alert">
          {error}
        </p>
      </div>
    );
  }

  const chartData = [
    { name: "High", value: stats.high },
    { name: "Caution", value: stats.caution },
    { name: "Low", value: stats.low },
  ];

  return (
    <div className="page">
      <header className="page__head">
        <div>
          <h1>Welcome back{user ? `, ${user.name.split(" ")[0]}` : ""} 👋</h1>
          <p>Here is an overview of your security activity.</p>
        </div>
      </header>

      <section className="stat-grid">
        <Card title="Total Scans" value={stats.total} icon="🔍" tone="cyan" />
        <Card title="High Risk" value={stats.high} icon="🚨" tone="red" />
        <Card title="Caution" value={stats.caution} icon="⚠️" tone="amber" />
        <Card title="Low Risk" value={stats.low} icon="🛡️" tone="green" />
      </section>

      <section className="panel-grid">
        <article className="panel">
          <h2>Risk breakdown</h2>
          {stats.total === 0 ? (
            <p className="muted">No scans yet. Run your first scan to see results here.</p>
          ) : (
            <div className="chart">
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={chartData}>
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis allowDecimals={false} stroke="#94a3b8" />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={entry.name} fill={CHART_COLORS[index]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </article>

        <article className="panel">
          <h2>Quick actions</h2>
          <div className="quick-actions">
            <Link to="/url" className="quick-action">
              <Link2 size={18} />
              <div>
                <strong>Analyze a URL</strong>
                <small>Check a link for phishing indicators</small>
              </div>
              <ArrowRight size={16} />
            </Link>
            <Link to="/domain" className="quick-action">
              <Globe size={18} />
              <div>
                <strong>Detect a domain</strong>
                <small>Scan a domain for suspicious patterns</small>
              </div>
              <ArrowRight size={16} />
            </Link>
          </div>
        </article>
      </section>

      <section className="panel">
        <div className="panel__head">
          <h2>Recent scans</h2>
          <Link to="/risk" className="panel__link">
            View all
          </Link>
        </div>

        {stats.recent.length === 0 ? (
          <p className="muted">Your scan history is empty.</p>
        ) : (
          <ul className="scan-list">
            {stats.recent.map((scan) => (
              <li key={scan.id}>
                <div className="scan-list__main">
                  <strong>{scan.target}</strong>
                  <small>{new Date(scan.created_at).toLocaleString()}</small>
                </div>
                <RiskBadge risk={scan.risk} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
