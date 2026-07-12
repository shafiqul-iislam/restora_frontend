import { useState } from 'react';
import Sidebar from './layouts/Sidebar.jsx';
import Topbar from './layouts/Topbar.jsx';
import AdminFooter from './layouts/Footer.jsx';

export default function AdminLayout({ children, pageTitle }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const sidebarWidth = collapsed ? 68 : 240;

  return (
    <>
      <style>{`
        .admin-layout {
          display: flex;
          min-height: 100vh;
          background: #f8fafc;
          font-family: 'Inter', system-ui, sans-serif;
        }
        .admin-main {
          display: flex;
          flex-direction: column;
          flex: 1;
          min-width: 0;
          transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .admin-content {
          flex: 1;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
        }
        /* Mobile overlay */
        .admin-mobile-overlay {
          display: none;
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.45);
          z-index: 99;
          backdrop-filter: blur(2px);
        }
        @media (max-width: 768px) {
          .admin-mobile-overlay.active { display: block; }
          .admin-main { margin-left: 0 !important; }
        }
      `}</style>

      <div className="admin-layout">
        {/* Sidebar */}
        <Sidebar
          collapsed={collapsed}
          onToggle={() => setCollapsed(c => !c)}
        />

        {/* Mobile overlay */}
        <div
          className={`admin-mobile-overlay${mobileOpen ? ' active' : ''}`}
          onClick={() => setMobileOpen(false)}
        />

        {/* Main area shifts right to make room for sidebar */}
        <div
          className="admin-main"
          style={{ marginLeft: `${sidebarWidth}px` }}
        >
          <Topbar
            pageTitle={pageTitle}
            onMobileMenuToggle={() => setMobileOpen(o => !o)}
          />
          <div className="admin-content">
            {children}
          </div>
          <AdminFooter />
        </div>
      </div>
    </>
  );
}
