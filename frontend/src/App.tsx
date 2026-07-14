import { useState, useEffect } from 'react';
import URLForm from './components/UrlForm';
import Stats from './components/Stats';
import './App.css';

interface ShortenedLink {
  original_url: string;
  short_url: string;
  short_code: string;
  clicks: number;
  created_at: string;
}

function App() {
  const [activeTab, setActiveTab] = useState<'shorten' | 'stats'>('shorten');
  const [recentLinks, setRecentLinks] = useState<ShortenedLink[]>([]);

  // Load shortened links from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('shrinkit_history');
    if (saved) {
      try {
        setRecentLinks(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse history', e);
      }
    }
  }, []);

  // Save link to history
  const handleShortenSuccess = (originalUrl: string, shortUrl: string) => {
    // Extract short code from shortUrl
    const parts = shortUrl.split('/');
    const shortCode = parts[parts.length - 1] || '';

    const newLink: ShortenedLink = {
      original_url: originalUrl,
      short_url: shortUrl,
      short_code: shortCode,
      clicks: 0,
      created_at: new Date().toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    const updated = [newLink, ...recentLinks.filter(item => item.short_code !== shortCode)].slice(0, 10);
    setRecentLinks(updated);
    localStorage.setItem('shrinkit_history', JSON.stringify(updated));
  };

  // Clear history
  const handleClearHistory = () => {
    setRecentLinks([]);
    localStorage.removeItem('shrinkit_history');
  };

  // Copy to clipboard helper
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const handleCopyLink = (url: string, code: string) => {
    navigator.clipboard.writeText(url).then(() => {
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    });
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="logo-container">
          <svg className="logo-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
          </svg>
          <span className="logo-text">ShrinkIt</span>
        </div>
        <p className="subtitle">
          A fast, secure, and modern URL shortener. Make long, ugly URLs clean and easily trackable in seconds.
        </p>
      </header>

      {/* Tab Navigation */}
      <nav className="tab-navigation">
        <button
          onClick={() => setActiveTab('shorten')}
          className={`tab-btn ${activeTab === 'shorten' ? 'active' : ''}`}
          type="button"
        >
          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
          </svg>
          Shorten URL
        </button>
        <button
          onClick={() => setActiveTab('stats')}
          className={`tab-btn ${activeTab === 'stats' ? 'active' : ''}`}
          type="button"
        >
          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
          </svg>
          Analytics Lookup
        </button>
      </nav>

      {/* Main Form Section */}
      <main className="dashboard-panel">
        {activeTab === 'shorten' ? (
          <URLForm onShortenSuccess={handleShortenSuccess} />
        ) : (
          <Stats />
        )}
      </main>

      {/* Recent History Section */}
      {activeTab === 'shorten' && (
        <section className="history-section">
          <div className="history-header">
            <h3 className="history-title">
              <svg className="history-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              Recent Links
            </h3>
            {recentLinks.length > 0 && (
              <button onClick={handleClearHistory} className="clear-btn" type="button">
                <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-12v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
                Clear History
              </button>
            )}
          </div>

          {recentLinks.length > 0 ? (
            <div className="history-list">
              {recentLinks.map((link) => (
                <div key={link.short_code} className="history-item">
                  <div className="history-details">
                    <div className="history-links">
                      <a href={link.short_url} target="_blank" rel="noopener noreferrer" className="history-short">
                        {link.short_url.replace(/^https?:\/\//, '')}
                      </a>
                      <span className="history-arrow">→</span>
                      <span className="history-long" title={link.original_url}>
                        {link.original_url}
                      </span>
                    </div>
                    <div className="history-meta">
                      <span className="history-badge">
                        <svg className="history-item-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                        {link.created_at}
                      </span>
                      <span className="history-badge">
                        <span className="history-short-code">Code: <strong>{link.short_code}</strong></span>
                      </span>
                    </div>
                  </div>

                  <div className="history-actions">
                    <button
                      onClick={() => handleCopyLink(link.short_url, link.short_code)}
                      className={`action-btn ${copiedCode === link.short_code ? 'copied' : ''}`}
                      title={copiedCode === link.short_code ? 'Copied!' : 'Copy to clipboard'}
                      type="button"
                    >
                      {copiedCode === link.short_code ? (
                        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                      ) : (
                        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path>
                        </svg>
                      )}
                    </button>
                    <a
                      href={link.short_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="action-btn"
                      title="Open shortened URL"
                    >
                      <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                      </svg>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-history">
              <svg className="empty-history-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
              </svg>
              <p>No URLs shortened yet. Enter a long URL above to get started!</p>
            </div>
          )}
        </section>
      )}
    </div>
  );
}

export default App;
