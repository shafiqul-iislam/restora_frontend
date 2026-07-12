import { Link, useLocation } from 'react-router-dom';
import { logoutUser } from '../../../api/index.js';
import { useAuth } from '../../../context/AuthContext.jsx';

const navItems = [
  { icon: '🏠', label: 'Dashboard',    to: '/owner/dashboard' },
  { icon: '🍽️', label: 'My Foods',     to: '/owner/foods' },
  { icon: '📋', label: 'Orders',       to: '/owner/orders' },
  { icon: '👥', label: 'Customers',    to: '/owner/customers' },
];

export default function OwnerSidebar() {
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logoutUser();
      logout();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{
      width: 280, height: '100vh', background: '#0f172a',
      color: '#fff', display: 'flex', flexDirection: 'column',
      flexShrink: 0, position: 'sticky', top: 0,
    }}>
      {/* Brand */}
      <div style={{
        padding: '2rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)',
        display: 'flex', alignItems: 'center', gap: '0.75rem',
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg, #ea580c, #f97316)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.25rem', fontWeight: 800, boxShadow: '0 4px 12px rgba(234,88,12,0.3)',
        }}>
          O
        </div>
        <div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em' }}>Owner Panel</div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Manage your restaurant</div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', overflowY: 'auto' }}>
        {navItems.map(item => {
          const isActive = location.pathname.startsWith(item.to);
          return (
            <Link key={item.to} to={item.to} style={{
              display: 'flex', alignItems: 'center', gap: '1rem',
              padding: '0.875rem 1rem', borderRadius: 12,
              color: isActive ? '#fff' : '#94a3b8',
              background: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
              textDecoration: 'none', fontWeight: 600, fontSize: '0.9375rem',
              transition: 'all 0.2s',
            }}>
              <span style={{ fontSize: '1.25rem', filter: isActive ? 'drop-shadow(0 0 8px rgba(255,255,255,0.4))' : 'none' }}>
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer User Profile */}
      <div style={{ padding: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <div style={{
            width: 36, height: 36, borderRadius: '50%', background: '#334155',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, fontSize: '0.875rem',
          }}>
            {user?.name?.[0] || 'O'}
          </div>
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <div style={{ fontWeight: 600, fontSize: '0.875rem', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
              {user?.name || 'Owner'}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
              {user?.email}
            </div>
          </div>
        </div>
        <button onClick={handleLogout} style={{
          width: '100%', padding: '0.75rem', borderRadius: 10,
          background: 'rgba(239,68,68,0.1)', color: '#ef4444',
          border: '1px solid rgba(239,68,68,0.2)', fontWeight: 600,
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
          transition: 'all 0.2s',
        }}>
          🚪 Logout
        </button>
      </div>
    </div>
  );
}
