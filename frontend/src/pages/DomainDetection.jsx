import { useState } from "react";
import RiskBadge from "../components/RiskBadge.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { api } from "../services/api";

export default function DomainDetection() {
  const { token } = useAuth();
  const [domain, setDomain] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [scanning, setScanning] = useState(false);

  async function handleScan(event) {
    event.preventDefault();
    const input = domain.trim();
    setError("");
    setResult(null);

    if (!input) {
      setError("Please enter a domain name.");
      return;
    }

    setScanning(true);
    try {
      const data = await api.scanDomain(input, token);
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setScanning(false);
    }
  }

  return (
    <div className="page">
      <header className="page__head">
        <div>
          <h1>🛡️ Domain Detection</h1>
          <p>Enter a domain name to check for common suspicious patterns.</p>
        </div>
      </header>

      <form className="scan-form" onSubmit={handleScan}>
        <input
          type="text"
          value={domain}
          onChange={(event) => {
            setDomain(event.target.value);
            setResult(null);
            setError("");
          }}
          placeholder="Enter domain, e.g. example.com"
          aria-label="Domain name"
        />
        <button type="submit" className="btn btn--primary" disabled={scanning}>
          {scanning ? "Scanning…" : "Scan Domain"}
        </button>
      </form>

      {error && (
        <p className="form-message form-message--error" role="alert">
          {error}
        </p>
      )}

      {result && (
        <section className="result-card" aria-live="polite">
          <div className="result-card__head">
            <h2>{result.target}</h2>
            <RiskBadge risk={result.risk} />
          </div>

          <h3>Analysis details</h3>
          <ul className="result-list">
            {result.details.map((check, index) => (
              <li key={index}>{check}</li>
            ))}
          </ul>

          <p className="muted">This scan was saved to your dashboard history.</p>
        </section>
      )}

      <p className="muted small">
        This tool checks common domain patterns only. It does not contact a live
        security database. A low risk result does not guarantee a domain is safe.
      </p>
    </div>
  );
}
