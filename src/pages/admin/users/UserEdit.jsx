import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { adminGetUser, adminUpdateUser } from '../../../api/index.js';

const ROLES = [
  { value: 'customer', label: '👤 Customer' },
  { value: 'restaurant_owner', label: '🍽️ Restaurant Owner' },
];

const inputStyle = {
  width: '100%', padding: '0.625rem 0.875rem',
  border: '1.5px solid #e2e8f0', borderRadius: 9,
  fontSize: '0.875rem', color: '#0f172a', background: '#f8fafc',
  outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
  transition: 'border-color 0.15s',
};
const errInput = { ...inputStyle, borderColor: '#fca5a5', background: '#fff5f5' };
const labelStyle = { display: 'block', fontWeight: 600, fontSize: '0.8125rem', color: '#374151', marginBottom: '0.375rem' };

function Field({ label, error, required, hint, children }) {
  return (
    <div>
      <label style={labelStyle}>{label}{required && <span style={{ color: '#dc2626' }}>*</span>}</label>
      {children}
      {hint && !error && <p style={{ fontSize: '0.6875rem', color: '#94a3b8', marginTop: '0.25rem' }}>{hint}</p>}
      {error && <p style={{ fontSize: '0.75rem', color: '#dc2626', marginTop: '0.25rem' }}>{error}</p>}
    </div>
  );
}

function SkeletonEdit() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 700 }}>
      <div style={{ height: 16, width: 220, background: '#e2e8f0', borderRadius: 6, marginBottom: '1.5rem', animation: 'shimmer 1.4s infinite', backgroundSize: '200% 100%', backgroundImage: 'linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%)' }} />
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} style={{ height: 40, background: '#f1f5f9', borderRadius: 9, animation: 'shimmer 1.4s infinite', backgroundSize: '200% 100%', backgroundImage: 'linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%)' }} />
        ))}
      </div>
      <style>{`@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }`}</style>
    </div>
  );
}

export default function UserEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    adminGetUser(id)
      .then(data => {
        const u = data.data ?? data;
        setForm({
          name: u.name ?? '',
          email: u.email ?? '',
          password: '',
          phone: u.phone ?? '',
          role: u.role ?? 'customer',
          status: u.status ?? 'active',
          restaurant_name: u.restaurant?.name ?? '',
          restaurant_address: u.restaurant?.address ?? '',
          restaurant_description: u.restaurant?.description ?? '',
        });
      })
      .catch(() => showToast('Failed to load user.', 'error'))
      .finally(() => setLoading(false));
  }, [id]);

  const set = (key, val) => {
    setForm(p => ({ ...p, [key]: val }));
    setErrors(p => ({ ...p, [key]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    try {
      const payload = {
        name: form.name, email: form.email,
        phone: form.phone || null,
        role: form.role, status: form.status,
      };
      if (form.password) payload.password = form.password;
      if (form.role === 'restaurant_owner') {
        payload.restaurant_name = form.restaurant_name;
        payload.restaurant_address = form.restaurant_address || null;
        payload.restaurant_description = form.restaurant_description || null;
      }
      await adminUpdateUser(id, payload);
      showToast('User updated successfully!');
      setTimeout(() => navigate('/admin/users'), 1200);
    } catch (err) {
      if (err?.errors) {
        const mapped = {};
        Object.entries(err.errors).forEach(([k, v]) => { mapped[k] = Array.isArray(v) ? v[0] : v; });
        setErrors(mapped);
      } else {
        showToast(err?.message ?? 'Failed to update user.', 'error');
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <SkeletonEdit />;
  if (!form) return <div style={{ padding: '2rem', color: '#dc2626' }}>User not found.</div>;

  const isOwner = form.role === 'restaurant_owner';

  return (
    <>
      <style>{`
        .ue-wrap { padding: 1.5rem; max-width: 700px; }
        .ue-breadcrumb { display: flex; align-items: center; gap: 0.375rem; font-size: 0.8125rem; color: #94a3b8; margin-bottom: 1.25rem; }
        .ue-breadcrumb a { color: #16a34a; text-decoration: none; font-weight: 500; }
        .ue-breadcrumb a:hover { text-decoration: underline; }
        .ue-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; }
        .ue-card-header { padding: 1.375rem 1.5rem; border-bottom: 1px solid #f1f5f9; display: flex; align-items: center; justify-content: space-between; }
        .ue-card-title { font-size: 1.0625rem; font-weight: 800; color: #0f172a; }
        .ue-card-sub { font-size: 0.8125rem; color: #94a3b8; margin-top: 0.25rem; }
        .ue-body { padding: 1.5rem; display: flex; flex-direction: column; gap: 1.25rem; }
        .ue-section-title {
          font-size: 0.75rem; font-weight: 700; text-transform: uppercase;
          letter-spacing: 0.06em; color: #94a3b8;
          padding-bottom: 0.5rem; border-bottom: 1px solid #f1f5f9; margin-bottom: 0.875rem;
        }
        .ue-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        @media(max-width:600px){ .ue-grid { grid-template-columns: 1fr; } }
        .ue-footer { padding: 1.125rem 1.5rem; border-top: 1px solid #f1f5f9; display: flex; gap: 0.75rem; justify-content: flex-end; }
        .ue-btn {
          padding: 0.625rem 1.375rem; border-radius: 10px;
          font-size: 0.875rem; font-weight: 600; cursor: pointer;
          border: none; font-family: inherit; transition: all 0.15s;
        }
        .ue-btn-cancel { background: #f1f5f9; color: #374151; }
        .ue-btn-cancel:hover { background: #e2e8f0; }
        .ue-btn-submit {
          background: linear-gradient(135deg, #16a34a, #22c55e);
          color: #fff; display: flex; align-items: center; gap: 0.5rem;
        }
        .ue-btn-submit:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
        .ue-btn-submit:disabled { opacity: 0.6; cursor: not-allowed; }
        .ue-owner-box {
          background: rgba(234,88,12,0.04); border: 1.5px solid rgba(234,88,12,0.2);
          border-radius: 12px; padding: 1.125rem;
        }
        .ue-role-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 0.625rem; }
        @media(max-width:500px){ .ue-role-grid { grid-template-columns: 1fr; } }
        .ue-role-card {
          border: 2px solid #e2e8f0; border-radius: 10px; padding: 0.75rem;
          cursor: pointer; text-align: center; transition: all 0.15s;
          background: #fff;
        }
        .ue-role-card.active { border-color: #16a34a; background: rgba(22,163,74,0.05); }
        .ue-toast {
          position: fixed; bottom: 1.5rem; right: 1.5rem; z-index: 9999;
          padding: 0.875rem 1.25rem; border-radius: 12px; color: #fff;
          font-size: 0.8125rem; font-weight: 600;
          box-shadow: 0 8px 24px rgba(0,0,0,0.15);
          animation: slideUp 0.25s ease;
        }
        @keyframes slideUp { from{transform:translateY(12px);opacity:0} to{transform:translateY(0);opacity:1} }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
      `}</style>

      {toast && (
        <div className="ue-toast" style={{ background: toast.type === 'error' ? '#dc2626' : '#16a34a' }}>
          {toast.type === 'error' ? '❌' : '✅'} {toast.msg}
        </div>
      )}

      <div className="ue-wrap">
        <div className="ue-breadcrumb">
          <Link to="/admin/dashboard">Dashboard</Link> /
          <Link to="/admin/users">Users</Link> /
          <Link to={`/admin/users/${id}`}>#{id}</Link> /
          <span style={{ color: '#374151' }}>Edit</span>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="ue-card">
            <div className="ue-card-header">
              <div>
                <div className="ue-card-title">✏️ Edit User #{id}</div>
                <div className="ue-card-sub">Update user information and settings</div>
              </div>
              <Link to={`/admin/users/${id}`} style={{
                padding: '0.5rem 1rem', borderRadius: 9,
                fontSize: '0.8125rem', fontWeight: 600,
                background: 'rgba(37,99,235,0.1)', color: '#2563eb',
                textDecoration: 'none',
              }}>View Profile</Link>
            </div>

            <div className="ue-body">
              {/* Personal Info */}
              <div>
                <div className="ue-section-title">Personal Information</div>
                <div className="ue-grid">
                  <Field label="Full Name" error={errors.name} required>
                    <input style={errors.name ? errInput : inputStyle} value={form.name}
                      onChange={e => set('name', e.target.value)} placeholder="John Doe"
                      onFocus={e => e.target.style.borderColor = '#16a34a'}
                      onBlur={e => e.target.style.borderColor = errors.name ? '#fca5a5' : '#e2e8f0'}
                    />
                  </Field>
                  <Field label="Email Address" error={errors.email} required>
                    <input type="email" style={errors.email ? errInput : inputStyle} value={form.email}
                      onChange={e => set('email', e.target.value)} placeholder="john@example.com"
                      onFocus={e => e.target.style.borderColor = '#16a34a'}
                      onBlur={e => e.target.style.borderColor = errors.email ? '#fca5a5' : '#e2e8f0'}
                    />
                  </Field>
                  <Field label="New Password" error={errors.password} hint="Leave blank to keep current password">
                    <input type="password" style={errors.password ? errInput : inputStyle} value={form.password}
                      onChange={e => set('password', e.target.value)} placeholder="••••••••"
                      onFocus={e => e.target.style.borderColor = '#16a34a'}
                      onBlur={e => e.target.style.borderColor = errors.password ? '#fca5a5' : '#e2e8f0'}
                    />
                  </Field>
                  <Field label="Phone Number" error={errors.phone}>
                    <input type="tel" style={errors.phone ? errInput : inputStyle} value={form.phone}
                      onChange={e => set('phone', e.target.value)} placeholder="+880 1XXX-XXXXXX"
                      onFocus={e => e.target.style.borderColor = '#16a34a'}
                      onBlur={e => e.target.style.borderColor = errors.phone ? '#fca5a5' : '#e2e8f0'}
                    />
                  </Field>
                </div>
              </div>

              {/* Role & Status */}
              <div>
                <div className="ue-section-title">Role & Status</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <Field label="User Role" error={errors.role} required>
                    <div className="ue-role-grid">
                      {ROLES.map(r => (
                        <div key={r.value} className={`ue-role-card${form.role === r.value ? ' active' : ''}`}
                          onClick={() => set('role', r.value)}>
                          <div style={{ fontSize: '1.375rem', marginBottom: '0.25rem' }}>{r.label.split(' ')[0]}</div>
                          <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#374151' }}>{r.label.split(' ').slice(1).join(' ')}</div>
                        </div>
                      ))}
                    </div>
                  </Field>
                  <Field label="Account Status" error={errors.status} required>
                    <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap' }}>
                      {['active', 'inactive'].map(s => (
                        <label key={s} style={{
                          display: 'flex', alignItems: 'center', gap: '0.5rem',
                          padding: '0.5rem 1rem', borderRadius: 9, cursor: 'pointer',
                          border: `2px solid ${form.status === s ? (s === 'active' ? '#16a34a' : '#dc2626') : '#e2e8f0'}`,
                          background: form.status === s ? (s === 'active' ? 'rgba(22,163,74,0.06)' : 'rgba(239,68,68,0.06)') : '#f8fafc',
                          fontSize: '0.8125rem', fontWeight: 600,
                          color: form.status === s ? (s === 'active' ? '#16a34a' : '#dc2626') : '#64748b',
                        }}>
                          <input type="radio" name="status" value={s} checked={form.status === s} onChange={() => set('status', s)} style={{ accentColor: '#16a34a' }} />
                          {s === 'active' ? '✅' : '🚫'} {s.charAt(0).toUpperCase() + s.slice(1)}
                        </label>
                      ))}
                    </div>
                  </Field>
                </div>
              </div>

              {/* Restaurant Owner section */}
              {isOwner && (
                <div className="ue-owner-box">
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#ea580c', marginBottom: '0.875rem' }}>
                    🍽️ Restaurant Information
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                    <Field label="Restaurant Name" error={errors.restaurant_name} required>
                      <input style={errors.restaurant_name ? errInput : inputStyle}
                        value={form.restaurant_name} placeholder="e.g. The Green Grill"
                        onChange={e => set('restaurant_name', e.target.value)}
                        onFocus={e => e.target.style.borderColor = '#ea580c'}
                        onBlur={e => e.target.style.borderColor = errors.restaurant_name ? '#fca5a5' : '#e2e8f0'}
                      />
                    </Field>
                    <Field label="Restaurant Address" error={errors.restaurant_address}>
                      <input style={inputStyle} value={form.restaurant_address} placeholder="123 Main St, Dhaka"
                        onChange={e => set('restaurant_address', e.target.value)}
                        onFocus={e => e.target.style.borderColor = '#ea580c'}
                        onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                      />
                    </Field>
                    <Field label="Description" error={errors.restaurant_description}>
                      <textarea rows={3} style={{ ...inputStyle, resize: 'none', lineHeight: 1.6 }}
                        value={form.restaurant_description} placeholder="Brief description…"
                        onChange={e => set('restaurant_description', e.target.value)}
                        onFocus={e => e.target.style.borderColor = '#ea580c'}
                        onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                      />
                    </Field>
                  </div>
                </div>
              )}
            </div>

            <div className="ue-footer">
              <button type="button" className="ue-btn ue-btn-cancel" onClick={() => navigate('/admin/users')}>
                Cancel
              </button>
              <button type="submit" className="ue-btn ue-btn-submit" disabled={saving}>
                {saving ? (
                  <>
                    <svg style={{ width: '1rem', height: '1rem', animation: 'spin 1s linear infinite' }} fill="none" viewBox="0 0 24 24">
                      <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Saving…
                  </>
                ) : '💾 Save Changes'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
