import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import CartDrawer from './CartDrawer.jsx';

export default function Navbar() {
  const { cartCount } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/restaurants?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setMenuOpen(false);
  };

  return (
    <>
      <nav style={{
        position: 'sticky', top: 0, zIndex: 50,
        backgroundColor: '#fff',
        borderBottom: '1px solid #f3f4f6',
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
      }}>
        <div className="page-container">
          {/* Main row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '4rem' }}>

            {/* Logo */}
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', flexShrink: 0 }}>
              <div style={{
                width: '2.25rem', height: '2.25rem',
                backgroundColor: '#16a34a', borderRadius: '0.75rem',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 2px 6px rgba(22,163,74,0.3)',
                fontSize: '1.1rem',
              }}>🍛</div>
              <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#111827' }}>
                Resto<span style={{ color: '#16a34a' }}>ra</span>
              </span>
            </Link>

            {/* Search bar — desktop */}
            <form onSubmit={handleSearch} style={{
              display: 'none', flex: 1, maxWidth: '28rem', margin: '0 1.5rem',
            }} className="md-search-form">
              <div style={{ position: 'relative', width: '100%' }}>
                <svg style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', width: '1rem', height: '1rem', color: '#9ca3af' }}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search restaurants or food..."
                  style={{
                    width: '100%',
                    padding: '0.5rem 1rem 0.5rem 2.25rem',
                    fontSize: '0.875rem',
                    border: '1px solid #e5e7eb',
                    borderRadius: '9999px',
                    backgroundColor: '#f9fafb',
                    outline: 'none',
                    color: '#111827',
                  }}
                />
              </div>
            </form>

            {/* Right actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              {/* Cart */}
              <button
                id="cart-button"
                onClick={() => setDrawerOpen(true)}
                style={{
                  position: 'relative',
                  padding: '0.5rem',
                  borderRadius: '9999px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                aria-label="Open cart"
              >
                <svg style={{ width: '1.5rem', height: '1.5rem', color: '#374151' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.4 7h12.8M9 20a1 1 0 100 2 1 1 0 000-2zm7 0a1 1 0 100 2 1 1 0 000-2z" />
                </svg>
                {cartCount > 0 && (
                  <span style={{
                    position: 'absolute', top: '-0.25rem', right: '-0.25rem',
                    backgroundColor: '#16a34a', color: '#fff',
                    fontSize: '0.65rem', fontWeight: 700,
                    borderRadius: '9999px',
                    width: '1.2rem', height: '1.2rem',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </button>

              {/* Auth */}
              {isAuthenticated ? (
                <div style={{ position: 'relative' }}>
                  <button
                    id="profile-menu-button"
                    onClick={() => setMenuOpen(!menuOpen)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '0.5rem',
                      padding: '0.375rem 0.75rem',
                      borderRadius: '9999px',
                      backgroundColor: '#f0fdf4',
                      border: 'none', cursor: 'pointer',
                      transition: 'background 0.2s',
                    }}
                  >
                    <div style={{
                      width: '1.75rem', height: '1.75rem', borderRadius: '9999px',
                      backgroundColor: '#16a34a',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#fff', fontSize: '0.75rem', fontWeight: 700,
                    }}>
                      {user?.name?.[0]?.toUpperCase() ?? 'U'}
                    </div>
                    <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#374151', maxWidth: '6rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {user?.name}
                    </span>
                    <svg style={{ width: '1rem', height: '1rem', color: '#6b7280' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {menuOpen && (
                    <div style={{
                      position: 'absolute', right: 0, top: 'calc(100% + 0.5rem)',
                      width: '11rem',
                      backgroundColor: '#fff',
                      borderRadius: '0.75rem',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                      border: '1px solid #f3f4f6',
                      overflow: 'hidden',
                      zIndex: 50,
                    }}>
                      <Link to="/orders" onClick={() => setMenuOpen(false)} style={{
                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                        padding: '0.75rem 1rem', fontSize: '0.875rem', color: '#374151',
                        textDecoration: 'none', transition: 'background 0.15s',
                      }}>
                        📋 My Orders
                      </Link>
                      <button id="logout-button" onClick={handleLogout} style={{
                        width: '100%', display: 'flex', alignItems: 'center', gap: '0.5rem',
                        padding: '0.75rem 1rem', fontSize: '0.875rem', color: '#ef4444',
                        background: 'none', border: 'none', cursor: 'pointer',
                      }}>
                        🚪 Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Link to="/login" style={{ fontSize: '0.875rem', fontWeight: 500, color: '#6b7280', textDecoration: 'none' }}>
                    Login
                  </Link>
                  <Link to="/register" style={{
                    fontSize: '0.875rem', fontWeight: 700,
                    padding: '0.5rem 1.25rem',
                    backgroundColor: '#16a34a', color: '#fff',
                    borderRadius: '9999px', textDecoration: 'none',
                    boxShadow: '0 2px 6px rgba(22,163,74,0.25)',
                    transition: 'background 0.2s',
                  }}>
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile search */}
          <form onSubmit={handleSearch} style={{ paddingBottom: '0.75rem' }} className="mobile-search-form">
            <div style={{ position: 'relative' }}>
              <svg style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', width: '1rem', height: '1rem', color: '#9ca3af' }}
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search restaurants or food..."
                style={{
                  width: '100%', padding: '0.5rem 1rem 0.5rem 2.25rem',
                  fontSize: '0.875rem', border: '1px solid #e5e7eb',
                  borderRadius: '9999px', backgroundColor: '#f9fafb',
                  outline: 'none', color: '#111827',
                }}
              />
            </div>
          </form>
        </div>
      </nav>

      <CartDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
      {menuOpen && <div style={{ position: 'fixed', inset: 0, zIndex: 40 }} onClick={() => setMenuOpen(false)} />}

      <style>{`
        @media (min-width: 768px) {
          .md-search-form { display: flex !important; }
          .mobile-search-form { display: none !important; }
        }
      `}</style>
    </>
  );
}
