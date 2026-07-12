import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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

const inputBase = {
  width: '100%',
  padding: '0.7rem 1rem',
  fontSize: '0.875rem',
  border: '1.5px solid #e5e7eb',
  borderRadius: '0.75rem',
  backgroundColor: '#f9fafb',
  outline: 'none',
  color: '#111827',
  boxSizing: 'border-box',
};

const inputError = {
  ...inputBase,
  borderColor: '#fca5a5',
  backgroundColor: '#fff5f5',
};

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', password_confirmation: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [showPass, setShowPass] = useState(false);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
    setFieldErrors(prev => ({ ...prev, [e.target.name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.password_confirmation) {
      setFieldErrors({ password_confirmation: 'Passwords do not match.' });
      return;
    }
    setLoading(true);
    setError('');
    setFieldErrors({});
    try {
      await register(form);
      navigate('/');
    } catch (err) {
      if (err?.errors) {
        const mapped = {};
        Object.entries(err.errors).forEach(([k, v]) => { mapped[k] = Array.isArray(v) ? v[0] : v; });
        setFieldErrors(mapped);
      } else {
        setError(err?.message ?? 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { id: 'reg-name', name: 'name', label: 'Full Name', type: 'text', placeholder: 'John Doe', autocomplete: 'name' },
    { id: 'reg-email', name: 'email', label: 'Email address', type: 'email', placeholder: 'you@example.com', autocomplete: 'email' },
    { id: 'reg-phone', name: 'phone', label: 'Phone Number', type: 'tel', placeholder: '+880 1XXX-XXXXXX', autocomplete: 'tel', required: false },
  ];

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
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827', margin: 0 }}>Create your account</h1>
          <p style={{ fontSize: '0.875rem', color: '#9ca3af', marginTop: '0.375rem' }}>Join thousands of food lovers today</p>
        </div>

        {/* Card */}
        <div style={{
          backgroundColor: '#fff',
          borderRadius: '1.25rem',
          border: '1px solid #f3f4f6',
          boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
          padding: '1.75rem',
        }}>
          {error && (
            <div style={{
              display: 'flex', gap: '0.625rem', alignItems: 'flex-start',
              padding: '0.75rem 1rem',
              backgroundColor: '#fef2f2', border: '1px solid #fecaca',
              borderRadius: '0.75rem', marginBottom: '1.25rem',
              fontSize: '0.875rem', color: '#dc2626',
            }}>
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Basic fields */}
            {fields.map(f => (
              <div key={f.name}>
                <label htmlFor={f.id} style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.4rem' }}>
                  {f.label}
                </label>
                <input
                  id={f.id}
                  name={f.name}
                  type={f.type}
                  value={form[f.name]}
                  onChange={handleChange}
                  placeholder={f.placeholder}
                  required={f.required !== false}
                  autoComplete={f.autocomplete}
                  style={fieldErrors[f.name] ? inputError : inputBase}
                  onFocus={e => { if (!fieldErrors[f.name]) e.target.style.borderColor = '#16a34a'; }}
                  onBlur={e => { if (!fieldErrors[f.name]) e.target.style.borderColor = '#e5e7eb'; }}
                />
                {fieldErrors[f.name] && (
                  <p style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '0.25rem' }}>{fieldErrors[f.name]}</p>
                )}
              </div>
            ))}

            {/* Password */}
            <div>
              <label htmlFor="reg-password" style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.4rem' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="reg-password"
                  name="password"
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Min. 8 characters"
                  required
                  autoComplete="new-password"
                  style={{ ...(fieldErrors.password ? inputError : inputBase), paddingRight: '2.75rem' }}
                  onFocus={e => { if (!fieldErrors.password) e.target.style.borderColor = '#16a34a'; }}
                  onBlur={e => { if (!fieldErrors.password) e.target.style.borderColor = '#e5e7eb'; }}
                />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{
                  position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af',
                  display: 'flex', alignItems: 'center',
                }}>
                  <EyeIcon open={showPass} />
                </button>
              </div>
              {fieldErrors.password && <p style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '0.25rem' }}>{fieldErrors.password}</p>}
            </div>

            {/* Confirm password */}
            <div>
              <label htmlFor="reg-password-confirm" style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.4rem' }}>
                Confirm Password
              </label>
              <input
                id="reg-password-confirm"
                name="password_confirmation"
                type={showPass ? 'text' : 'password'}
                value={form.password_confirmation}
                onChange={handleChange}
                placeholder="Re-enter password"
                required
                autoComplete="new-password"
                style={fieldErrors.password_confirmation ? inputError : inputBase}
                onFocus={e => { if (!fieldErrors.password_confirmation) e.target.style.borderColor = '#16a34a'; }}
                onBlur={e => { if (!fieldErrors.password_confirmation) e.target.style.borderColor = '#e5e7eb'; }}
              />
              {fieldErrors.password_confirmation && (
                <p style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '0.25rem' }}>{fieldErrors.password_confirmation}</p>
              )}
            </div>

            {/* Submit */}
            <button
              id="register-submit-button"
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
              }}
            >
              {loading ? (
                <>
                  <svg style={{ width: '1rem', height: '1rem', animation: 'spin 1s linear infinite' }} fill="none" viewBox="0 0 24 24">
                    <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Creating Account...
                </>
              ) : 'Create Account'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', fontSize: '0.875rem', color: '#6b7280', marginTop: '1.5rem' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ fontWeight: 600, color: '#16a34a', textDecoration: 'none' }}>
            Sign in →
          </Link>
        </p>
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
