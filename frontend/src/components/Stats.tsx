import { useState } from "react";
import api from "../services/api";

function Stats() {
  const [code, setCode] = useState("");
  const [stats, setStats] = useState<{ original_url: string; clicks: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  // Extract code from URL input (just in case they paste the whole short URL instead of just the code)
  const extractCode = (input: string): string => {
    const trimmed = input.trim();
    if (!trimmed) return "";
    
    // If it is a full URL, get the last part
    if (trimmed.includes("/")) {
      const parts = trimmed.split("/");
      return parts[parts.length - 1] || "";
    }
    return trimmed;
  };

  async function getStatistics(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setStats(null);
    setCopied(false);

    const cleanCode = extractCode(code);
    if (!cleanCode) {
      setError("Please enter a short code or short URL.");
      return;
    }

    try {
      setLoading(true);
      const response = await api.get(`/stats/${cleanCode}`);
      if (response.data) {
        setStats(response.data);
      } else {
        setError("Failed to fetch statistics. Please check the code and try again.");
      }
    } catch (err: any) {
      console.error("Stats fetching error:", err);
      if (err.code === "ERR_NETWORK") {
        setError("Cannot connect to the backend server. Please verify the backend Go server is running on port 8080.");
      } else if (err.response && err.response.status === 404) {
        setError("Short URL code not found. Please check spelling.");
      } else {
        setError("Something went wrong while fetching stats.");
      }
    } finally {
      setLoading(false);
    }
  }

  const handleCopyLink = () => {
    if (!stats) return;
    const cleanCode = extractCode(code);
    const fullUrl = `${api.defaults.baseURL}/${cleanCode}`;
    navigator.clipboard.writeText(fullUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div>
      <h2 style={{ textAlign: "left", marginBottom: "0.5rem" }}>Analytics Lookup</h2>
      <p style={{ textAlign: "left", color: "var(--text-secondary)", marginBottom: "2rem" }}>
        Enter a shortened URL or its 6-character code below to track visitor click-through metrics in real time.
      </p>

      <form onSubmit={getStatistics}>
        <div className="form-group">
          <label htmlFor="code-input" className="form-label">Short Code / Short URL</label>
          <div className="input-wrapper">
            <svg className="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            <input
              id="code-input"
              className="form-input"
              type="text"
              placeholder="e.g. Ab12Cd or https://shrinklt-url-shortener.onrender.com/Ab12Cd"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              disabled={loading}
              autoComplete="off"
            />
          </div>
        </div>

        <button
          className="submit-btn"
          type="submit"
          disabled={loading}
        >
          {loading ? (
            <>
              <div className="spinner"></div>
              <span>Fetching analytics...</span>
            </>
          ) : (
            <>
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
              <span>Get Stats</span>
            </>
          )}
        </button>
      </form>

      {/* Error message */}
      {error && (
        <div className="alert alert-error">
          <svg className="alert-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
          </svg>
          <span>{error}</span>
        </div>
      )}

      {/* Stats Display Grid */}
      {stats && (
        <div className="stats-info-grid">
          {/* Clicks Metric */}
          <div className="stat-metric-card">
            <div className="stat-icon-container clicks">
              <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
              </svg>
            </div>
            <span className="metric-value">{stats.clicks}</span>
            <span className="metric-label">Total Clicks</span>
            <span className="metric-meta" style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>Real-time updates</span>
          </div>

          {/* Original Link Metric */}
          <div className="stat-metric-card" style={{ gridColumn: "span 2" }}>
            <div className="stat-icon-container domain">
              <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
              </svg>
            </div>
            <a
              href={stats.original_url}
              target="_blank"
              rel="noopener noreferrer"
              className="metric-value"
              style={{ fontSize: "1.1rem", color: "var(--primary)", wordBreak: "break-all", maxHeight: "60px", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}
            >
              {stats.original_url}
            </a>
            <span className="metric-label">Destination URL</span>
            <span className="metric-meta" title={stats.original_url}>
              Domain: {new URL(stats.original_url).hostname}
            </span>
          </div>

          {/* Short Link Card */}
          <div className="stat-metric-card" style={{ gridColumn: "span 3", flexDirection: "row", justifyContent: "space-between", textAlign: "left", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <span className="metric-label" style={{ display: "block", marginBottom: "0.25rem" }}>Short Link Code</span>
              <code style={{ fontSize: "1.2rem", padding: "0.25rem 0.5rem", borderRadius: "6px", background: "rgba(0, 0, 0, 0.2)", color: "var(--accent)" }}>
                {extractCode(code)}
              </code>
            </div>
            <div className="action-buttons" style={{ alignSelf: "center" }}>
              <button
                className={`action-btn ${copied ? "copied" : ""}`}
                onClick={handleCopyLink}
                title={copied ? "Copied!" : "Copy Short URL"}
                type="button"
              >
                {copied ? (
                  <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                ) : (
                  <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path>
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Stats;