import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { adminGetUser, adminDeleteUser } from '../../../api/index.js';

const ROLE_CONFIG = {
  admin:            { label: 'Admin',    bg: 'rgba(124,58,237,0.12)', color: '#7c3aed', icon: '🛡️' },
  restaurant_owner: { label: 'Owner',   bg: 'rgba(234,88,12,0.12)',  color: '#ea580c', icon: '🍽️' },
  customer:         { label: 'Customer',bg: 'rgba(37,99,235,0.12)',  color: '#2563eb', icon: '👤' },
};
const STATUS_CONFIG = {
  active:   { bg: 'rgba(22,163,74,0.12)',  color: '#16a34a', label: 'Active' },
  inactive: { bg: 'rgba(239,68,68,0.12)', color: '#dc2626', label: 'Inactive' },
};

function Avatar({ name, size = 72 }) {
  const initials = name ? name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() : '?';
  const hue = (name || '').split('').reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: `linear-gradient(135deg, hsl(${hue},55%,50%), hsl(${(hue+40)%360},60%,60%))`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#fff', fontWeight: 800, fontSize: size * 0.35,
      flexShrink: 0, boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
      letterSpacing: '0.03em',
    }}>{initials}</div>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <div style={{ display: 'flex', gap: '0.875rem', padding: '0.75rem 0', borderBottom: '1px solid #f1f5f9', alignItems: 'flex-start' }}>
      <span style={{ width: 32, textAlign: 'center', fontSize: '1.125rem', flexShrink: 0, marginTop: 1 }}>{icon}</span>
      <div>
        <div style={{ fontSize: '0.6875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#94a3b8', marginBottom: '0.125rem' }}>{label}</div>
        <div style={{ fontSize: '0.875rem', color: '#1e293b', fontWeight: 500 }}>{value || '—'}</div>
      </div>
    </div>
  );
}

function DeleteModal({ user, onConfirm, onCancel, loading }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 999,
      background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(3px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
    }}>
      <div style={{ background: '#fff', borderRadius: 16, padding: '2rem', maxWidth: 400, width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
        <div style={{ fontSize: '2.5rem', textAlign: 'center', marginBottom: '1rem' }}>⚠️</div>
        <h3 style={{ textAlign: 'center', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>Delete User</h3>
        <p style={{ textAlign: 'center', color: '#64748b', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
          Are you sure you want to delete <strong>{user.name}</strong>? This cannot be undone.
        </p>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={onCancel} disabled={loading} style={{ flex: 1, padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: 10, fontWeight: 600, cursor: 'pointer', background: '#fff', color: '#374151' }}>Cancel</button>
          <button onClick={onConfirm} disabled={loading} style={{ flex: 1, padding: '0.75rem', border: 'none', borderRadius: 10, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', background: loading ? '#fca5a5' : '#dc2626', color: '#fff' }}>
            {loading ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}

function SkeletonShow() {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 760 }}>
      <div style={{ display: 'flex', gap: '1.25rem' }}>
        <div style={{ width: 280, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#e2e8f0' }} />
          {Array.from({ length: 3 }).map((_, i) => <div key={i} style={{ height: 12, width: ['60%','40%','80%'][i], background: '#f1f5f9', borderRadius: 6 }} />)}
        </div>
        <div style={{ flex: 1, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {Array.from({ length: 6 }).map((_, i) => <div key={i} style={{ height: 48, background: '#f1f5f9', borderRadius: 9 }} />)}
        </div>
      </div>
      <style>{`@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }`}</style>
    </div>
  );
}

export default function UserShow() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser]             = useState(null);
  const [loading, setLoading]       = useState(true);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleting, setDeleting]     = useState(false);
  const [toast, setToast]           = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    adminGetUser(id)
      .then(data => setUser(data.data ?? data))
      .catch(() => showToast('Failed to load user.', 'error'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await adminDeleteUser(id);
      showToast('User deleted.');
      setTimeout(() => navigate('/admin/users'), 1200);
    } catch {
      showToast('Failed to delete user.', 'error');
      setDeleting(false);
      setDeleteModal(false);
    }
  };

  if (loading) return <SkeletonShow />;
  if (!user)   return <div style={{ padding: '2rem', color: '#dc2626' }}>User not found.</div>;

  const role   = ROLE_CONFIG[user.role]   || { label: user.role, bg: '#f1f5f9', color: '#64748b', icon: '👤' };
  const status = STATUS_CONFIG[user.status] || { bg: '#f1f5f9', color: '#64748b', label: user.status };

  return (
    <>
      <style>{`
        .us-wrap { padding: 1.5rem; max-width: 760px; }
        .us-breadcrumb { display: flex; align-items: center; gap: 0.375rem; font-size: 0.8125rem; color: #94a3b8; margin-bottom: 1.25rem; }
        .us-breadcrumb a { color: #16a34a; text-decoration: none; font-weight: 500; }
        .us-breadcrumb a:hover { text-decoration: underline; }
        .us-layout { display: grid; grid-template-columns: 260px 1fr; gap: 1.25rem; }
        @media(max-width:640px){ .us-layout { grid-template-columns: 1fr; } }
        .us-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; }
        .us-profile-card { padding: 1.75rem 1.25rem; display: flex; flex-direction: column; align-items: center; gap: 1rem; text-align: center; }
        .us-actions-bar { display: flex; gap: 0.625rem; flex-wrap: wrap; padding: 1rem 1.25rem; border-top: 1px solid #f1f5f9; }
        .us-btn {
          flex: 1; min-width: 80px; padding: 0.5625rem 0.875rem; border-radius: 9px;
          font-size: 0.8125rem; font-weight: 600; cursor: pointer;
          border: none; font-family: inherit; transition: all 0.15s; text-align: center;
        }
        .us-btn-edit   { background: rgba(22,163,74,0.12);  color: #16a34a; }
        .us-btn-delete { background: rgba(239,68,68,0.12); color: #dc2626; }
        .us-btn-edit:hover   { background: rgba(22,163,74,0.22); }
        .us-btn-delete:hover { background: rgba(239,68,68,0.22); }
        .us-detail-card { display: flex; flex-direction: column; }
        .us-detail-header { padding: 1.125rem 1.375rem; border-bottom: 1px solid #f1f5f9; font-size: 0.9375rem; font-weight: 700; color: #0f172a; }
        .us-detail-body { padding: 0 1.375rem; }
        .us-restaurant-box {
          margin: 1rem 1.375rem; padding: 1rem;
          background: rgba(234,88,12,0.05); border: 1.5px solid rgba(234,88,12,0.2);
          border-radius: 12px;
        }
        .us-toast {
          position: fixed; bottom: 1.5rem; right: 1.5rem; z-index: 9999;
          padding: 0.875rem 1.25rem; border-radius: 12px; color: #fff;
          font-size: 0.8125rem; font-weight: 600;
          box-shadow: 0 8px 24px rgba(0,0,0,0.15);
          animation: slideUp 0.25s ease;
        }
        @keyframes slideUp { from{transform:translateY(12px);opacity:0} to{transform:translateY(0);opacity:1} }
      `}</style>

      {toast && (
        <div className="us-toast" style={{ background: toast.type === 'error' ? '#dc2626' : '#16a34a' }}>
          {toast.type === 'error' ? '❌' : '✅'} {toast.msg}
        </div>
      )}
      {deleteModal && (
        <DeleteModal user={user} onConfirm={handleDelete} onCancel={() => setDeleteModal(false)} loading={deleting} />
      )}

      <div className="us-wrap">
        <div className="us-breadcrumb">
          <Link to="/admin/dashboard">Dashboard</Link> /
          <Link to="/admin/users">Users</Link> /
          <span style={{ color: '#374151' }}>{user.name}</span>
        </div>

        <div className="us-layout">
          {/* Profile Card */}
          <div className="us-card">
            <div className="us-profile-card">
              <Avatar name={user.name} size={72} />
              <div>
                <div style={{ fontWeight: 800, fontSize: '1rem', color: '#0f172a' }}>{user.name}</div>
                <div style={{ fontSize: '0.8125rem', color: '#64748b', marginTop: '0.125rem' }}>{user.email}</div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '0.2rem 0.625rem', borderRadius: 20, fontSize: '0.6875rem', fontWeight: 600, background: role.bg, color: role.color }}>
                  {role.icon} {role.label}
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '0.2rem 0.625rem', borderRadius: 20, fontSize: '0.6875rem', fontWeight: 600, background: status.bg, color: status.color }}>
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'currentColor', display: 'inline-block' }} />
                  {status.label}
                </span>
              </div>
              {user.created_at && (
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                  Joined {new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
              )}
            </div>
            <div className="us-actions-bar">
              <button className="us-btn us-btn-edit" onClick={() => navigate(`/admin/users/${id}/edit`)}>✏️ Edit</button>
              <button className="us-btn us-btn-delete" onClick={() => setDeleteModal(true)}>🗑️ Delete</button>
            </div>
          </div>

          {/* Detail Card */}
          <div className="us-card us-detail-card">
            <div className="us-detail-header">👤 User Details</div>
            <div className="us-detail-body">
              <InfoRow icon="🪪" label="User ID"       value={`#${user.id}`} />
              <InfoRow icon="📛" label="Full Name"     value={user.name} />
              <InfoRow icon="📧" label="Email"         value={user.email} />
              <InfoRow icon="📱" label="Phone"         value={user.phone} />
              <InfoRow icon="🎭" label="Role"          value={`${role.icon} ${role.label}`} />
              <InfoRow icon="⚡" label="Status"        value={status.label} />
              <InfoRow icon="📅" label="Joined"        value={user.created_at ? new Date(user.created_at).toLocaleString() : null} />
              <InfoRow icon="🔄" label="Last Updated"  value={user.updated_at ? new Date(user.updated_at).toLocaleString() : null} />
            </div>

            {user.restaurant && (
              <div className="us-restaurant-box">
                <div style={{ fontWeight: 700, color: '#ea580c', fontSize: '0.875rem', marginBottom: '0.75rem' }}>
                  🍽️ Restaurant
                </div>
                <InfoRow icon="🏪" label="Name"    value={user.restaurant.name} />
                <InfoRow icon="📍" label="Address" value={user.restaurant.address} />
                {user.restaurant.description && (
                  <InfoRow icon="📝" label="Description" value={user.restaurant.description} />
                )}
                <InfoRow icon="⚡" label="Status" value={user.restaurant.status} />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
