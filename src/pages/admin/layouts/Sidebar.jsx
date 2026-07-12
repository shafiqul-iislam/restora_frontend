import { useState } from 'react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { icon: '🏠', label: 'Dashboard',    to: '/admin/dashboard' },
  { icon: '🍽️', label: 'Restaurants',  to: '/admin/restaurants' },
  { icon: '📋', label: 'Orders',        to: '/admin/orders' },
  { icon: '👥', label: 'Users',         to: '/admin/users' },
  { icon: '⭐', label: 'Reviews',       to: '/admin/reviews' },
  { icon: '⚙️', label: 'Settings',      to: '/admin/settings' },
];

export default function Sidebar({ collapsed, onToggle }) {
  return (
    <>
      <style>{`
        .sidebar {
          position: fixed;
          top: 0;
          left: 0;
          height: 100vh;
          background: linear-gradient(180deg, #0f172a 0%, #1e293b 100%);
          display: flex;
          flex-direction: column;
          transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 100;
          box-shadow: 4px 0 24px rgba(0,0,0,0.2);
          overflow: hidden;
        }
        .sidebar.expanded { width: 240px; }
        .sidebar.collapsed { width: 68px; }

        .sidebar-logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1.25rem 1rem;
          border-bottom: 1px solid rgba(255,255,255,0.08);
          text-decoration: none;
          min-height: 68px;
          flex-shrink: 0;
        }
        .sidebar-logo-icon {
          width: 36px;
          height: 36px;
          background: linear-gradient(135deg, #16a34a, #22c55e);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.1rem;
          flex-shrink: 0;
          box-shadow: 0 4px 12px rgba(22,163,74,0.4);
        }
        .sidebar-logo-text {
          font-size: 1.125rem;
          font-weight: 800;
          color: #fff;
          letter-spacing: -0.02em;
          white-space: nowrap;
          overflow: hidden;
          opacity: 1;
          transition: opacity 0.2s;
        }
        .sidebar.collapsed .sidebar-logo-text { opacity: 0; width: 0; }

        .sidebar-nav {
          flex: 1;
          overflow-y: auto;
          overflow-x: hidden;
          padding: 0.75rem 0;
          scrollbar-width: none;
        }
        .sidebar-nav::-webkit-scrollbar { display: none; }

        .sidebar-section-label {
          font-size: 0.625rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #64748b;
          padding: 0.75rem 1.25rem 0.375rem;
          white-space: nowrap;
          overflow: hidden;
          transition: opacity 0.2s;
        }
        .sidebar.collapsed .sidebar-section-label { opacity: 0; }

        .sidebar-link {
          display: flex;
          align-items: center;
          gap: 0.875rem;
          padding: 0.6875rem 1rem;
          margin: 0.125rem 0.5rem;
          border-radius: 10px;
          text-decoration: none;
          color: #94a3b8;
          font-size: 0.875rem;
          font-weight: 500;
          transition: all 0.2s;
          white-space: nowrap;
          overflow: hidden;
          position: relative;
        }
        .sidebar-link:hover {
          background: rgba(255,255,255,0.07);
          color: #fff;
        }
        .sidebar-link.active {
          background: linear-gradient(135deg, rgba(22,163,74,0.3), rgba(34,197,94,0.15));
          color: #4ade80;
          box-shadow: inset 0 0 0 1px rgba(34,197,94,0.2);
        }
        .sidebar-link.active .sidebar-link-icon { filter: drop-shadow(0 0 6px rgba(34,197,94,0.5)); }

        .sidebar-link-icon {
          font-size: 1.125rem;
          flex-shrink: 0;
          width: 20px;
          text-align: center;
        }
        .sidebar-link-label {
          opacity: 1;
          transition: opacity 0.2s;
          overflow: hidden;
        }
        .sidebar.collapsed .sidebar-link-label { opacity: 0; width: 0; }

        .sidebar-active-indicator {
          position: absolute;
          right: 0.75rem;
          width: 6px;
          height: 6px;
          background: #22c55e;
          border-radius: 50%;
          box-shadow: 0 0 6px #22c55e;
        }
        .sidebar.collapsed .sidebar-active-indicator { display: none; }

        .sidebar-toggle {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          border-top: 1px solid rgba(255,255,255,0.08);
          flex-shrink: 0;
        }
        .sidebar-toggle-btn {
          width: 36px;
          height: 36px;
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #94a3b8;
          font-size: 0.875rem;
          transition: all 0.2s;
        }
        .sidebar-toggle-btn:hover {
          background: rgba(255,255,255,0.12);
          color: #fff;
        }

        .sidebar-user {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.875rem 1rem;
          border-top: 1px solid rgba(255,255,255,0.08);
          flex-shrink: 0;
        }
        .sidebar-user-avatar {
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
          flex-shrink: 0;
        }
        .sidebar-user-info {
          overflow: hidden;
          opacity: 1;
          transition: opacity 0.2s;
        }
        .sidebar.collapsed .sidebar-user-info { opacity: 0; width: 0; }
        .sidebar-user-name {
          font-size: 0.8125rem;
          font-weight: 600;
          color: #f1f5f9;
          white-space: nowrap;
        }
        .sidebar-user-role {
          font-size: 0.6875rem;
          color: #64748b;
          white-space: nowrap;
        }

        /* Mobile overlay */
        .sidebar-overlay {
          display: none;
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.5);
          z-index: 99;
          backdrop-filter: blur(2px);
        }
        @media (max-width: 768px) {
          .sidebar { width: 240px !important; }
          .sidebar.mobile-hidden { transform: translateX(-100%); }
          .sidebar.mobile-visible { transform: translateX(0); }
          .sidebar-logo-text, .sidebar-link-label, .sidebar-user-info { opacity: 1 !important; width: auto !important; }
          .sidebar-section-label { opacity: 1 !important; }
          .sidebar-overlay.visible { display: block; }
        }
      `}</style>

      <aside className={`sidebar ${collapsed ? 'collapsed' : 'expanded'}`} id="admin-sidebar">
        {/* Logo */}
        <a href="/admin" className="sidebar-logo">
          <div className="sidebar-logo-icon">🍽️</div>
          <span className="sidebar-logo-text">Restora</span>
        </a>

        {/* Navigation */}
        <nav className="sidebar-nav">
          <div className="sidebar-section-label">Main Menu</div>
          {navItems.slice(0, 5).map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/admin'}
              className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
            >
              <span className="sidebar-link-icon">{item.icon}</span>
              <span className="sidebar-link-label">{item.label}</span>
              {/* active dot placeholder — real activeClassName handles styling */}
            </NavLink>
          ))}

          <div className="sidebar-section-label">System</div>
          {navItems.slice(5).map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
            >
              <span className="sidebar-link-icon">{item.icon}</span>
              <span className="sidebar-link-label">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* User Info */}
        <div className="sidebar-user">
          <div className="sidebar-user-avatar">A</div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">Admin User</div>
            <div className="sidebar-user-role">Super Admin</div>
          </div>
        </div>

        {/* Collapse toggle */}
        <div className="sidebar-toggle">
          <button className="sidebar-toggle-btn" onClick={onToggle} title="Toggle Sidebar">
            {collapsed ? '→' : '←'}
          </button>
        </div>
      </aside>
    </>
  );
}