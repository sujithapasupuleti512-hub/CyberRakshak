import { useCallback, useEffect, useState } from "react";
import Card from "../components/Card.jsx";
import Loading from "../components/Loading.jsx";
import RiskBadge from "../components/RiskBadge.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { api } from "../services/api";

export default function RiskDashboard() {
  const { token } = useAuth();
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(() => {
    setLoading(true);
    setError("");
    api
      .getScans(token)
      .then(setScans)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [token]);

  useEffect(() => {
    load();
  }, [load]);

  async function clearHistory() {
    if (!window.confirm("Are you sure you want to clear all scan history?")) return;
    try {
      await api.clearScans(token);
      setScans([]);
    } catch (err) {
      setError(err.message);
    }
  }

  const total = scans.length;
  const high = scans.filter((scan) => scan.risk === "High Risk").length;
  const caution = scans.filter((scan) => scan.risk === "Caution").length;
  const low = scans.filter((scan) => scan.risk === "Low Risk").length;

  if (loading) return <Loading label="Loading scan history…" />;

  return (
    <div className="page">
      <header className="page__head">
        <div>
          <h1>📊 Risk Dashboard</h1>
          <p>Overview of your saved URL and domain analyses.</p>
        </div>
      </header>

      {error && (
        <p className="form-message form-message--error" role="alert">
          {error}
        </p>
      )}

      <section className="stat-grid">
        <Card title="Total Scans" value={total} icon="🔍" tone="cyan" />
        <Card title="High Risk" value={high} icon="🚨" tone="red" />
        <Card title="Caution" value={caution} icon="⚠️" tone="amber" />
        <Card title="Low Risk" value={low} icon="🛡️" tone="green" />
      </section>

      <section className="panel">
        <div className="panel__head">
          <h2>Scan history</h2>
          <button
            type="button"
            className="btn btn--danger"
            onClick={clearHistory}
            disabled={total === 0}
          >
            Clear history
          </button>
        </div>

        {total === 0 ? (
          <p className="muted">No scans yet. Analyze a URL or domain to see results here.</p>
        ) : (
          <ul className="scan-list">
            {scans.map((scan) => (
              <li key={scan.id}>
                <div className="scan-list__main">
                  <strong>{scan.target}</strong>
                  <small>
                    {scan.scan_type} • {new Date(scan.created_at).toLocaleString()}
                  </small>
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
