export default function Topbar({ onMobileMenuToggle, pageTitle }) {
  return (
    <>
      <style>{`
        .topbar {
          position: sticky;
          top: 0;
          z-index: 50;
          height: 68px;
          background: rgba(255,255,255,0.92);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 1.5rem;
          gap: 1rem;
          box-shadow: 0 1px 12px rgba(0,0,0,0.06);
        }

        .topbar-left {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .topbar-menu-btn {
          display: none;
          width: 38px;
          height: 38px;
          background: transparent;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          cursor: pointer;
          align-items: center;
          justify-content: center;
          font-size: 1.1rem;
          color: #64748b;
          transition: all 0.2s;
        }
        .topbar-menu-btn:hover {
          background: #f1f5f9;
          color: #0f172a;
        }
        @media (max-width: 768px) {
          .topbar-menu-btn { display: flex; }
        }

        .topbar-breadcrumb {
          display: flex;
          flex-direction: column;
          gap: 0.1rem;
        }
        .topbar-page-title {
          font-size: 1.125rem;
          font-weight: 700;
          color: #0f172a;
          line-height: 1;
        }
        .topbar-page-sub {
          font-size: 0.75rem;
          color: #94a3b8;
        }

        .topbar-right {
          display: flex;
          align-items: center;
          gap: 0.625rem;
        }

        .topbar-search {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          padding: 0.4375rem 0.875rem;
          transition: all 0.2s;
        }
        .topbar-search:focus-within {
          border-color: #22c55e;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(34,197,94,0.12);
        }
        .topbar-search-icon {
          color: #94a3b8;
          font-size: 0.875rem;
          flex-shrink: 0;
        }
        .topbar-search-input {
          border: none;
          outline: none;
          background: transparent;
          font-size: 0.8125rem;
          color: #374151;
          width: 180px;
          font-family: inherit;
        }
        .topbar-search-input::placeholder { color: #94a3b8; }
        @media (max-width: 640px) {
          .topbar-search { display: none; }
        }

        .topbar-icon-btn {
          position: relative;
          width: 38px;
          height: 38px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 1rem;
          color: #64748b;
          transition: all 0.2s;
          text-decoration: none;
        }
        .topbar-icon-btn:hover {
          background: #f1f5f9;
          color: #0f172a;
          border-color: #cbd5e1;
        }
        .topbar-badge {
          position: absolute;
          top: -4px;
          right: -4px;
          width: 16px;
          height: 16px;
          background: #ef4444;
          color: #fff;
          font-size: 0.5625rem;
          font-weight: 700;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid #fff;
          line-height: 1;
        }

        .topbar-avatar-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 0.25rem 0.5rem;
          border-radius: 10px;
          transition: background 0.2s;
        }
        .topbar-avatar-btn:hover { background: #f1f5f9; }
        .topbar-avatar {
          width: 34px;
          height: 34px;
          background: linear-gradient(135deg, #16a34a, #22c55e);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.875rem;
          font-weight: 700;
          color: #fff;
          box-shadow: 0 2px 8px rgba(22,163,74,0.3);
        }
        .topbar-avatar-info {
          text-align: left;
          line-height: 1.2;
        }
        .topbar-avatar-name {
          font-size: 0.8125rem;
          font-weight: 600;
          color: #0f172a;
        }
        .topbar-avatar-role {
          font-size: 0.6875rem;
          color: #94a3b8;
        }
        @media (max-width: 480px) {
          .topbar-avatar-info { display: none; }
        }

        .topbar-date {
          font-size: 0.75rem;
          color: #94a3b8;
          white-space: nowrap;
          padding: 0.25rem 0.625rem;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
        }
        @media (max-width: 768px) {
          .topbar-date { display: none; }
        }
      `}</style>

      <header className="topbar">
        <div className="topbar-left">
          <button className="topbar-menu-btn" onClick={onMobileMenuToggle} title="Toggle Menu">
            ☰
          </button>
          <div className="topbar-breadcrumb">
            <span className="topbar-page-title">{pageTitle || 'Dashboard'}</span>
            <span className="topbar-page-sub">Admin Portal · Restora</span>
          </div>
        </div>

        <div className="topbar-right">
          {/* Search */}
          <div className="topbar-search">
            <span className="topbar-search-icon">🔍</span>
            <input
              className="topbar-search-input"
              type="text"
              placeholder="Search anything..."
            />
          </div>

          {/* Date */}
          <span className="topbar-date">
            {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
          </span>

          {/* Notifications */}
          <button className="topbar-icon-btn" title="Notifications">
            🔔
            <span className="topbar-badge">5</span>
          </button>

          {/* Messages */}
          <button className="topbar-icon-btn" title="Messages">
            ✉️
            <span className="topbar-badge">2</span>
          </button>

          {/* Avatar */}
          <button className="topbar-avatar-btn">
            <div className="topbar-avatar">A</div>
            <div className="topbar-avatar-info">
              <div className="topbar-avatar-name">Admin</div>
              <div className="topbar-avatar-role">Super Admin</div>
            </div>
          </button>
        </div>
      </header>
    </>
  );
}