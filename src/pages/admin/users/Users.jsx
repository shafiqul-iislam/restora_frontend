import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { adminGetUsers, adminDeleteUser } from '../../../api/index.js';

const ROLE_CONFIG = {
  admin:            { label: 'Admin',            bg: 'rgba(124,58,237,0.12)', color: '#7c3aed', icon: '🛡️' },
  restaurant_owner: { label: 'Owner',            bg: 'rgba(234,88,12,0.12)',  color: '#ea580c', icon: '🍽️' },
  customer:         { label: 'Customer',         bg: 'rgba(37,99,235,0.12)',  color: '#2563eb', icon: '👤' },
};
const STATUS_CONFIG = {
  active:   { bg: 'rgba(22,163,74,0.12)',  color: '#16a34a' },
  inactive: { bg: 'rgba(239,68,68,0.12)', color: '#dc2626' },
};

function Avatar({ name, size = 36 }) {
  const initials = name ? name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() : '?';
  const hue = (name || '').split('').reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: `hsl(${hue},55%,55%)`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#fff', fontWeight: 700, fontSize: size * 0.36,
      flexShrink: 0, letterSpacing: '0.03em',
    }}>{initials}</div>
  );
}

function DeleteModal({ user, onConfirm, onCancel, loading }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 999,
      background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(3px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
    }}>
      <div style={{
        background: '#fff', borderRadius: 16, padding: '2rem',
        maxWidth: 400, width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
      }}>
        <div style={{ fontSize: '2.5rem', textAlign: 'center', marginBottom: '1rem' }}>⚠️</div>
        <h3 style={{ textAlign: 'center', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
          Delete User
        </h3>
        <p style={{ textAlign: 'center', color: '#64748b', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
          Are you sure you want to delete <strong>{user.name}</strong>? This action cannot be undone.
        </p>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={onCancel} disabled={loading} style={{
            flex: 1, padding: '0.75rem', border: '1px solid #e2e8f0',
            borderRadius: 10, fontWeight: 600, cursor: 'pointer', background: '#fff', color: '#374151',
          }}>Cancel</button>
          <button onClick={onConfirm} disabled={loading} style={{
            flex: 1, padding: '0.75rem', border: 'none',
            borderRadius: 10, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
            background: loading ? '#fca5a5' : '#dc2626', color: '#fff',
          }}>{loading ? 'Deleting…' : 'Delete'}</button>
        </div>
      </div>
    </div>
  );
}

export default function Users() {
  const navigate = useNavigate();
  const [users, setUsers]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');
  const [roleFilter, setRoleFilter]     = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting]   = useState(false);
  const [toast, setToast]         = useState(null);
  const [meta, setMeta]           = useState({});

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchUsers = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      const data = await adminGetUsers({ search, role: roleFilter, status: statusFilter, ...params });
      setUsers(data.data ?? data);
      setMeta(data.meta ?? {});
    } catch {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [search, roleFilter, statusFilter]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await adminDeleteUser(deleteTarget.id);
      showToast(`${deleteTarget.name} deleted successfully.`);
      setDeleteTarget(null);
      fetchUsers();
    } catch {
      showToast('Failed to delete user.', 'error');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <style>{`
        .um-wrap { padding: 1.5rem; display: flex; flex-direction: column; gap: 1.25rem; }
        .um-header { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.75rem; }
        .um-title { font-size: 1.25rem; font-weight: 800; color: #0f172a; }
        .um-subtitle { font-size: 0.8125rem; color: #94a3b8; margin-top: 0.125rem; }
        .um-btn-primary {
          display: inline-flex; align-items: center; gap: 0.375rem;
          padding: 0.5625rem 1.125rem;
          background: linear-gradient(135deg, #16a34a, #22c55e);
          color: #fff; border: none; border-radius: 10px;
          font-weight: 600; font-size: 0.8125rem; cursor: pointer;
          text-decoration: none; font-family: inherit;
          transition: opacity 0.2s, transform 0.15s;
        }
        .um-btn-primary:hover { opacity: 0.9; transform: translateY(-1px); }
        .um-filters {
          background: #fff; border: 1px solid #e2e8f0; border-radius: 14px;
          padding: 1rem 1.25rem; display: flex; gap: 0.75rem; flex-wrap: wrap; align-items: center;
        }
        .um-search-wrap { position: relative; flex: 1; min-width: 200px; }
        .um-search-icon { position: absolute; left: 0.75rem; top: 50%; transform: translateY(-50%); color: #94a3b8; font-size: 0.875rem; }
        .um-search {
          width: 100%; padding: 0.5625rem 0.75rem 0.5625rem 2.25rem;
          border: 1px solid #e2e8f0; border-radius: 9px;
          font-size: 0.8125rem; color: #0f172a; background: #f8fafc;
          outline: none; box-sizing: border-box;
          transition: border-color 0.15s;
        }
        .um-search:focus { border-color: #16a34a; background: #fff; }
        .um-select {
          padding: 0.5625rem 0.875rem; border: 1px solid #e2e8f0;
          border-radius: 9px; font-size: 0.8125rem; color: #374151;
          background: #f8fafc; outline: none; cursor: pointer;
          transition: border-color 0.15s;
        }
        .um-select:focus { border-color: #16a34a; }
        .um-panel { background: #fff; border: 1px solid #e2e8f0; border-radius: 14px; overflow: hidden; }
        .um-panel-header {
          padding: 1rem 1.375rem; border-bottom: 1px solid #f1f5f9;
          display: flex; align-items: center; justify-content: space-between;
        }
        .um-count { font-size: 0.75rem; color: #94a3b8; font-weight: 500; }
        .um-table-wrap { overflow-x: auto; }
        .um-table { width: 100%; border-collapse: collapse; font-size: 0.8125rem; }
        .um-table th {
          padding: 0.6875rem 1.25rem; text-align: left;
          font-size: 0.6875rem; font-weight: 700; text-transform: uppercase;
          letter-spacing: 0.06em; color: #94a3b8; background: #f8fafc;
          white-space: nowrap;
        }
        .um-table td { padding: 0.875rem 1.25rem; border-top: 1px solid #f1f5f9; color: #374151; }
        .um-table tr:hover td { background: #f8fafc; }
        .um-badge {
          display: inline-flex; align-items: center; gap: 0.3125rem;
          padding: 0.1875rem 0.625rem; border-radius: 20px;
          font-size: 0.6875rem; font-weight: 600;
        }
        .um-actions { display: flex; gap: 0.375rem; }
        .um-action-btn {
          padding: 0.375rem 0.75rem; border-radius: 8px; font-size: 0.75rem;
          font-weight: 600; cursor: pointer; border: none; transition: all 0.15s;
          font-family: inherit;
        }
        .um-action-btn.view   { background: rgba(37,99,235,0.1);  color: #2563eb; }
        .um-action-btn.edit   { background: rgba(22,163,74,0.1);  color: #16a34a; }
        .um-action-btn.del    { background: rgba(239,68,68,0.1);  color: #dc2626; }
        .um-action-btn:hover  { filter: brightness(0.92); }
        .um-empty { padding: 4rem 1rem; text-align: center; color: #94a3b8; }
        .um-skeleton { background: linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%); background-size: 200% 100%; animation: shimmer 1.4s infinite; border-radius: 6px; }
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        .um-toast {
          position: fixed; bottom: 1.5rem; right: 1.5rem; z-index: 9999;
          padding: 0.875rem 1.25rem; border-radius: 12px;
          font-size: 0.8125rem; font-weight: 600; color: #fff;
          box-shadow: 0 8px 24px rgba(0,0,0,0.15);
          animation: slideUp 0.25s ease;
        }
        @keyframes slideUp { from{transform:translateY(12px);opacity:0} to{transform:translateY(0);opacity:1} }
      `}</style>

      {toast && (
        <div className="um-toast" style={{ background: toast.type === 'error' ? '#dc2626' : '#16a34a' }}>
          {toast.type === 'error' ? '❌' : '✅'} {toast.msg}
        </div>
      )}
      {deleteTarget && (
        <DeleteModal
          user={deleteTarget}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={deleting}
        />
      )}

      <div className="um-wrap">
        {/* Header */}
        <div className="um-header">
          <div>
            <div className="um-title">👥 User Management</div>
            <div className="um-subtitle">Manage all system users, roles, and access</div>
          </div>
          <Link to="/admin/users/create" className="um-btn-primary">+ Add New User</Link>
        </div>

        {/* Filters */}
        <div className="um-filters">
          <div className="um-search-wrap">
            <span className="um-search-icon">🔍</span>
            <input
              className="um-search"
              placeholder="Search by name or email…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && fetchUsers()}
            />
          </div>
          <select className="um-select" value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="restaurant_owner">Restaurant Owner</option>
            <option value="customer">Customer</option>
          </select>
          <select className="um-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <button className="um-btn-primary" onClick={() => fetchUsers()} style={{ background: '#0f172a' }}>
            Search
          </button>
        </div>

        {/* Table */}
        <div className="um-panel">
          <div className="um-panel-header">
            <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.9375rem' }}>All Users</span>
            <span className="um-count">{meta.total ?? users.length} total</span>
          </div>
          <div className="um-table-wrap">
            <table className="um-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Restaurant</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <tr key={i}>
                      {Array.from({ length: 8 }).map((_, j) => (
                        <td key={j}><div className="um-skeleton" style={{ height: 16, width: j === 0 ? 120 : 80 }} /></td>
                      ))}
                    </tr>
                  ))
                ) : users.length === 0 ? (
                  <tr><td colSpan={8} className="um-empty">
                    <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🔍</div>
                    <div>No users found</div>
                  </td></tr>
                ) : (
                  users.map(u => {
                    const role   = ROLE_CONFIG[u.role]   || { label: u.role, bg: '#f1f5f9', color: '#64748b', icon: '👤' };
                    const status = STATUS_CONFIG[u.status] || { bg: '#f1f5f9', color: '#64748b' };
                    return (
                      <tr key={u.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                            <Avatar name={u.name} />
                            <div>
                              <div style={{ fontWeight: 600, color: '#0f172a', whiteSpace: 'nowrap' }}>{u.name}</div>
                              <div style={{ fontSize: '0.6875rem', color: '#94a3b8' }}>#{u.id}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ color: '#374151' }}>{u.email}</td>
                        <td style={{ color: '#64748b' }}>{u.phone || '—'}</td>
                        <td>
                          <span className="um-badge" style={{ background: role.bg, color: role.color }}>
                            {role.icon} {role.label}
                          </span>
                        </td>
                        <td>
                          <span className="um-badge" style={{ background: status.bg, color: status.color }}>
                            <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'currentColor', display: 'inline-block' }} />
                            {u.status ?? 'active'}
                          </span>
                        </td>
                        <td style={{ color: '#64748b', fontSize: '0.8125rem' }}>
                          {u.restaurant?.name || '—'}
                        </td>
                        <td style={{ color: '#94a3b8', fontSize: '0.75rem', whiteSpace: 'nowrap' }}>
                          {u.created_at ? new Date(u.created_at).toLocaleDateString() : '—'}
                        </td>
                        <td>
                          <div className="um-actions">
                            <button className="um-action-btn view" onClick={() => navigate(`/admin/users/${u.id}`)}>View</button>
                            <button className="um-action-btn edit" onClick={() => navigate(`/admin/users/${u.id}/edit`)}>Edit</button>
                            <button className="um-action-btn del" onClick={() => setDeleteTarget(u)}>Delete</button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
