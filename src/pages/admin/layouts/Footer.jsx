export default function AdminFooter() {
  const year = new Date().getFullYear();

  return (
    <>
      <style>{`
        .admin-footer {
          border-top: 1px solid #e2e8f0;
          background: #fff;
          padding: 0.875rem 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 0.5rem;
          flex-shrink: 0;
        }

        .admin-footer-left {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .admin-footer-brand {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          font-size: 0.8125rem;
          font-weight: 600;
          color: #0f172a;
          text-decoration: none;
        }
        .admin-footer-brand-icon {
          width: 22px;
          height: 22px;
          background: linear-gradient(135deg, #16a34a, #22c55e);
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.625rem;
        }
        .admin-footer-copy {
          font-size: 0.75rem;
          color: #94a3b8;
        }

        .admin-footer-links {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .admin-footer-link {
          font-size: 0.75rem;
          color: #64748b;
          text-decoration: none;
          transition: color 0.2s;
        }
        .admin-footer-link:hover { color: #16a34a; }

        .admin-footer-version {
          font-size: 0.6875rem;
          color: #94a3b8;
          background: #f1f5f9;
          padding: 0.1875rem 0.5rem;
          border-radius: 4px;
        }

        @media (max-width: 640px) {
          .admin-footer {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.375rem;
          }
          .admin-footer-links { display: none; }
        }
      `}</style>

      <footer className="admin-footer">
        <div className="admin-footer-left">
          <a href="/admin" className="admin-footer-brand">
            <div className="admin-footer-brand-icon">🍽️</div>
            Restora Admin
          </a>
          <span className="admin-footer-copy">© {year} All rights reserved.</span>
        </div>

        <div className="admin-footer-links">
          <a href="#" className="admin-footer-link">Documentation</a>
          <a href="#" className="admin-footer-link">Support</a>
          <a href="#" className="admin-footer-link">Privacy</a>
          <span className="admin-footer-version">v1.0.0</span>
        </div>
      </footer>
    </>
  );
}