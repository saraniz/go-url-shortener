import { useState } from "react";
import api from "../services/api";

interface UrlFormProps {
  onShortenSuccess: (originalUrl: string, shortUrl: string) => void;
}

function URLForm({ onShortenSuccess }: UrlFormProps) {
  const [originalURL, setOriginalURL] = useState("");
  const [shortURL, setShortURL] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);

  // Validate and format URL
  const formatURL = (url: string): string => {
    let trimmed = url.trim();
    if (!trimmed) return "";
    
    // Automatically prepend https:// if it doesn't start with http:// or https://
    if (!/^https?:\/\//i.test(trimmed)) {
      trimmed = "https://" + trimmed;
    }
    
    return trimmed;
  };

  async function handleShorten(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setShortURL("");
    setCopied(false);
    setShowQR(false);

    const formattedURL = formatURL(originalURL);
    if (!formattedURL) {
      setError("Please enter a valid URL to shorten.");
      return;
    }

    try {
      setLoading(true);
      const response = await api.post("/shorten", {
        original_url: formattedURL
      });

      if (response.data && response.data.short_url) {
        const short = response.data.short_url;
        setShortURL(short);
        onShortenSuccess(formattedURL, short);
      } else {
        setError("The backend returned an unexpected response. Please try again.");
      }
    } catch (err: any) {
      console.error("Shortening error:", err);
      if (err.code === "ERR_NETWORK") {
        setError("Cannot connect to the backend server. Please verify the backend Go server is running on port 8080.");
      } else if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError("Failed to shorten URL. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  }

  const handleCopy = () => {
    if (!shortURL) return;
    navigator.clipboard.writeText(shortURL).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div>
      <h2 style={{ textAlign: "left", marginBottom: "0.5rem" }}>Shorten a Long Link</h2>
      <p style={{ textAlign: "left", color: "var(--text-secondary)", marginBottom: "2rem" }}>
        Enter your long destination link. We will build a short, lightweight alias.
      </p>

      <form onSubmit={handleShorten}>
        <div className="form-group">
          <label htmlFor="url-input" className="form-label">Destination URL</label>
          <div className="input-wrapper">
            <svg className="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
            </svg>
            <input
              id="url-input"
              className="form-input"
              type="text"
              placeholder="e.g. github.com/google/deepmind"
              value={originalURL}
              onChange={(e) => setOriginalURL(e.target.value)}
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
              <span>Shortening link...</span>
            </>
          ) : (
            <>
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
              </svg>
              <span>Shorten URL</span>
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

      {/* Result box */}
      {shortURL && (
        <div className="result-card">
          <span className="result-header">Your shortened link is ready!</span>
          <div className="result-content-wrapper">
            <div className="short-url-display">
              <a
                href={shortURL}
                className="short-url-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                {shortURL}
              </a>
              <div className="action-buttons">
                <button
                  className={`action-btn ${copied ? "copied" : ""}`}
                  onClick={handleCopy}
                  title={copied ? "Copied!" : "Copy link"}
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
                <button
                  className={`action-btn ${showQR ? "copied" : ""}`}
                  onClick={() => setShowQR(!showQR)}
                  title="Toggle QR Code"
                  type="button"
                >
                  <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path>
                  </svg>
                </button>
                <a
                  href={shortURL}
                  className="action-btn"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Open link"
                >
                  <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {showQR && (
            <div className="qr-section">
              <img
                className="qr-code-img"
                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(shortURL)}`}
                alt="Short link QR Code"
                width="150"
                height="150"
              />
              <span className="qr-label">Scan to open URL</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default URLForm;