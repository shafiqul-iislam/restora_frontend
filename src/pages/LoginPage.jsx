import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

function EyeIcon({ open }) {
  return open ? (
    <svg style={{ width: '1rem', height: '1rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
  ) : (
    <svg style={{ width: '1rem', height: '1rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );
}

const inputStyle = (hasError) => ({
  width: '100%',
  padding: '0.7rem 1rem',
  fontSize: '0.875rem',
  border: `1.5px solid ${hasError ? '#fca5a5' : '#e5e7eb'}`,
  borderRadius: '0.75rem',
  backgroundColor: hasError ? '#fff5f5' : '#f9fafb',
  outline: 'none',
  color: '#111827',
  boxSizing: 'border-box',
  transition: 'border-color 0.15s',
});

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirect = new URLSearchParams(location.search).get('redirect') || '/';

  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPass, setShowPass] = useState(false);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError('');

    try {
      const data = await login(form);

      console.log('Login successful:', data);

      const role = (data.user ?? data.data?.user)?.role;

      if (role === 'admin') {
        navigate('/admin/dashboard');
      } else if (role === 'restaurant_owner') {
        navigate('/owner/dashboard');
      } else {
        navigate(redirect);
      }

    } catch (err) {
      setError(
        err?.errors
          ? Object.values(err.errors).flat().join(' ')
          : err?.message ?? 'Invalid email or password.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f0fdf4 0%, #fff 60%, #f0fdf4 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '3rem 1rem',
    }}>
      <div style={{ width: '100%', maxWidth: '22rem' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', marginBottom: '1rem' }}>
            <div style={{
              width: '2.75rem', height: '2.75rem',
              backgroundColor: '#16a34a', borderRadius: '1rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.4rem',
              boxShadow: '0 4px 14px rgba(22,163,74,0.35)',
            }}>🍛</div>
            <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111827' }}>
              Resto<span style={{ color: '#16a34a' }}>ra</span>
            </span>
          </Link>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827', margin: 0 }}>Welcome back!</h1>
          <p style={{ fontSize: '0.875rem', color: '#9ca3af', marginTop: '0.375rem' }}>Sign in to your account to continue</p>
        </div>

        {/* Card */}
        <div style={{
          backgroundColor: '#fff',
          borderRadius: '1.25rem',
          border: '1px solid #f3f4f6',
          boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
          padding: '1.75rem',
        }}>
          {/* Error */}
          {error && (
            <div style={{
              display: 'flex', gap: '0.625rem', alignItems: 'flex-start',
              padding: '0.75rem 1rem',
              backgroundColor: '#fef2f2', border: '1px solid #fecaca',
              borderRadius: '0.75rem', marginBottom: '1.25rem',
              fontSize: '0.875rem', color: '#dc2626',
            }}>
              <span style={{ fontSize: '1rem', flexShrink: 0 }}>⚠️</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            {/* Email */}
            <div>
              <label htmlFor="login-email" style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.5rem' }}>
                Email address
              </label>
              <input
                id="login-email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                autoComplete="email"
                style={inputStyle(false)}
                onFocus={e => e.target.style.borderColor = '#16a34a'}
                onBlur={e => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="login-password" style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.5rem' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="login-password"
                  name="password"
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  style={{ ...inputStyle(false), paddingRight: '2.75rem' }}
                  onFocus={e => e.target.style.borderColor = '#16a34a'}
                  onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  aria-label="Toggle password"
                  style={{
                    position: 'absolute', right: '0.75rem', top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: '#9ca3af', display: 'flex', alignItems: 'center',
                  }}
                >
                  <EyeIcon open={showPass} />
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              id="login-submit-button"
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '0.8rem',
                backgroundColor: loading ? '#86efac' : '#16a34a',
                color: '#fff', border: 'none', borderRadius: '0.75rem',
                fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '0.95rem',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                boxShadow: '0 4px 14px rgba(22,163,74,0.3)',
                marginTop: '0.5rem',
                transition: 'background 0.2s',
              }}
            >
              {loading ? (
                <>
                  <svg style={{ width: '1rem', height: '1rem', animation: 'spin 1s linear infinite' }} fill="none" viewBox="0 0 24 24">
                    <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Signing in...
                </>
              ) : 'Sign In'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', fontSize: '0.875rem', color: '#6b7280', marginTop: '1.5rem' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ fontWeight: 600, color: '#16a34a', textDecoration: 'none' }}>
            Create one →
          </Link>
        </p>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
