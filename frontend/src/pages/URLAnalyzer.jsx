import { useState } from "react";
import RiskBadge from "../components/RiskBadge.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { api } from "../services/api";

export default function URLAnalyzer() {
  const { token } = useAuth();
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [scanning, setScanning] = useState(false);

  async function handleAnalyze(event) {
    event.preventDefault();
    const input = url.trim();
    setError("");
    setResult(null);

    if (!input) {
      setError("Please enter a URL first.");
      return;
    }

    setScanning(true);
    try {
      const data = await api.scanUrl(input, token);
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
          <h1>🔎 URL Analyzer</h1>
          <p>Analyze a URL for common suspicious patterns.</p>
        </div>
      </header>

      <form className="scan-form" onSubmit={handleAnalyze}>
        <input
          type="text"
          value={url}
          onChange={(event) => {
            setUrl(event.target.value);
            setResult(null);
            setError("");
          }}
          placeholder="Enter URL, e.g. https://google.com"
          aria-label="URL"
        />
        <button type="submit" className="btn btn--primary" disabled={scanning}>
          {scanning ? "Analyzing…" : "Analyze URL"}
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
        This is a basic pattern checker, not a live security database. A low risk
        result does not guarantee a URL is safe.
      </p>
    </div>
  );
}
