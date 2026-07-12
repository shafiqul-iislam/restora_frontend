import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAdminRestaurants, adminDeleteRestaurant } from '../../../api/index.js';

const STATUS_CONFIG = {
  open:   { bg: 'rgba(22,163,74,0.12)',  color: '#16a34a' },
  closed: { bg: 'rgba(239,68,68,0.12)', color: '#dc2626' },
};

function DeleteModal({ restaurant, onConfirm, onCancel, loading }) {
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
          Delete Restaurant
        </h3>
        <p style={{ textAlign: 'center', color: '#64748b', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
          Are you sure you want to delete <strong>{restaurant.name}</strong>? This action cannot be undone.
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

export default function Restaurants() {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting]   = useState(false);
  const [toast, setToast]         = useState(null);
  const [meta, setMeta]           = useState({});

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchRestaurants = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      const data = await getAdminRestaurants(1, search, statusFilter);
      setRestaurants(data.data ?? data);
      setMeta(data);
    } catch {
      setRestaurants([]);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => { fetchRestaurants(); }, [fetchRestaurants]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await adminDeleteRestaurant(deleteTarget.id);
      showToast(`${deleteTarget.name} deleted successfully.`);
      setDeleteTarget(null);
      fetchRestaurants();
    } catch {
      showToast('Failed to delete restaurant.', 'error');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <style>{`
        .rm-wrap { padding: 1.5rem; display: flex; flex-direction: column; gap: 1.25rem; }
        .rm-header { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.75rem; }
        .rm-title { font-size: 1.25rem; font-weight: 800; color: #0f172a; }
        .rm-subtitle { font-size: 0.8125rem; color: #94a3b8; margin-top: 0.125rem; }
        .rm-btn-primary {
          display: inline-flex; align-items: center; gap: 0.375rem;
          padding: 0.5625rem 1.125rem;
          background: linear-gradient(135deg, #16a34a, #22c55e);
          color: #fff; border: none; border-radius: 10px;
          font-weight: 600; font-size: 0.8125rem; cursor: pointer;
          text-decoration: none; font-family: inherit;
          transition: opacity 0.2s, transform 0.15s;
        }
        .rm-btn-primary:hover { opacity: 0.9; transform: translateY(-1px); }
        .rm-filters {
          background: #fff; border: 1px solid #e2e8f0; border-radius: 14px;
          padding: 1rem 1.25rem; display: flex; gap: 0.75rem; flex-wrap: wrap; align-items: center;
        }
        .rm-search-wrap { position: relative; flex: 1; min-width: 200px; }
        .rm-search-icon { position: absolute; left: 0.75rem; top: 50%; transform: translateY(-50%); color: #94a3b8; font-size: 0.875rem; }
        .rm-search {
          width: 100%; padding: 0.5625rem 0.75rem 0.5625rem 2.25rem;
          border: 1px solid #e2e8f0; border-radius: 9px;
          font-size: 0.8125rem; color: #0f172a; background: #f8fafc;
          outline: none; box-sizing: border-box;
          transition: border-color 0.15s;
        }
        .rm-search:focus { border-color: #16a34a; background: #fff; }
        .rm-select {
          padding: 0.5625rem 0.875rem; border: 1px solid #e2e8f0;
          border-radius: 9px; font-size: 0.8125rem; color: #374151;
          background: #f8fafc; outline: none; cursor: pointer;
          transition: border-color 0.15s;
        }
        .rm-select:focus { border-color: #16a34a; }
        .rm-panel { background: #fff; border: 1px solid #e2e8f0; border-radius: 14px; overflow: hidden; }
        .rm-panel-header {
          padding: 1rem 1.375rem; border-bottom: 1px solid #f1f5f9;
          display: flex; align-items: center; justify-content: space-between;
        }
        .rm-count { font-size: 0.75rem; color: #94a3b8; font-weight: 500; }
        .rm-table-wrap { overflow-x: auto; }
        .rm-table { width: 100%; border-collapse: collapse; font-size: 0.8125rem; }
        .rm-table th {
          padding: 0.6875rem 1.25rem; text-align: left;
          font-size: 0.6875rem; font-weight: 700; text-transform: uppercase;
          letter-spacing: 0.06em; color: #94a3b8; background: #f8fafc;
          white-space: nowrap;
        }
        .rm-table td { padding: 0.875rem 1.25rem; border-top: 1px solid #f1f5f9; color: #374151; }
        .rm-table tr:hover td { background: #f8fafc; }
        .rm-badge {
          display: inline-flex; align-items: center; gap: 0.3125rem;
          padding: 0.1875rem 0.625rem; border-radius: 20px;
          font-size: 0.6875rem; font-weight: 600;
        }
        .rm-actions { display: flex; gap: 0.375rem; }
        .rm-action-btn {
          padding: 0.375rem 0.75rem; border-radius: 8px; font-size: 0.75rem;
          font-weight: 600; cursor: pointer; border: none; transition: all 0.15s;
          font-family: inherit;
        }
        .rm-action-btn.edit   { background: rgba(22,163,74,0.1);  color: #16a34a; }
        .rm-action-btn.del    { background: rgba(239,68,68,0.1);  color: #dc2626; }
        .rm-action-btn:hover  { filter: brightness(0.92); }
        .rm-empty { padding: 4rem 1rem; text-align: center; color: #94a3b8; }
        .rm-skeleton { background: linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%); background-size: 200% 100%; animation: shimmer 1.4s infinite; border-radius: 6px; }
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        .rm-toast {
          position: fixed; bottom: 1.5rem; right: 1.5rem; z-index: 9999;
          padding: 0.875rem 1.25rem; border-radius: 12px;
          font-size: 0.8125rem; font-weight: 600; color: #fff;
          box-shadow: 0 8px 24px rgba(0,0,0,0.15);
          animation: slideUp 0.25s ease;
        }
        @keyframes slideUp { from{transform:translateY(12px);opacity:0} to{transform:translateY(0);opacity:1} }
      `}</style>

      {toast && (
        <div className="rm-toast" style={{ background: toast.type === 'error' ? '#dc2626' : '#16a34a' }}>
          {toast.type === 'error' ? '❌' : '✅'} {toast.msg}
        </div>
      )}
      {deleteTarget && (
        <DeleteModal
          restaurant={deleteTarget}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={deleting}
        />
      )}

      <div className="rm-wrap">
        {/* Header */}
        <div className="rm-header">
          <div>
            <div className="rm-title">🍽️ Restaurant Management</div>
            <div className="rm-subtitle">Manage all partnered restaurants</div>
          </div>
          <Link to="/admin/restaurants/create" className="rm-btn-primary">+ Add Restaurant</Link>
        </div>

        {/* Filters */}
        <div className="rm-filters">
          <div className="rm-search-wrap">
            <span className="rm-search-icon">🔍</span>
            <input
              className="rm-search"
              placeholder="Search by name…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && fetchRestaurants()}
            />
          </div>
          <select className="rm-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="">All Status</option>
            <option value="open">Open</option>
            <option value="closed">Closed</option>
          </select>
          <button className="rm-btn-primary" onClick={() => fetchRestaurants()} style={{ background: '#0f172a' }}>
            Search
          </button>
        </div>

        {/* Table */}
        <div className="rm-panel">
          <div className="rm-panel-header">
            <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.9375rem' }}>All Restaurants</span>
            <span className="rm-count">{meta.total ?? restaurants.length} total</span>
          </div>
          <div className="rm-table-wrap">
            <table className="rm-table">
              <thead>
                <tr>
                  <th>Restaurant</th>
                  <th>Owner</th>
                  <th>Address</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <tr key={i}>
                      {Array.from({ length: 6 }).map((_, j) => (
                        <td key={j}><div className="rm-skeleton" style={{ height: 16, width: j === 0 ? 120 : 80 }} /></td>
                      ))}
                    </tr>
                  ))
                ) : restaurants.length === 0 ? (
                  <tr><td colSpan={6} className="rm-empty">
                    <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🔍</div>
                    <div>No restaurants found</div>
                  </td></tr>
                ) : (
                  restaurants.map(r => {
                    const status = STATUS_CONFIG[r.status] || { bg: '#f1f5f9', color: '#64748b' };
                    return (
                      <tr key={r.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                            <div style={{ width: 36, height: 36, borderRadius: 8, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem' }}>
                              🍽️
                            </div>
                            <div>
                              <div style={{ fontWeight: 600, color: '#0f172a', whiteSpace: 'nowrap' }}>{r.name}</div>
                              <div style={{ fontSize: '0.6875rem', color: '#94a3b8' }}>#{r.id}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ color: '#374151' }}>{r.user?.name || '—'}</td>
                        <td style={{ color: '#64748b' }}>{r.address || '—'}</td>
                        <td>
                          <span className="rm-badge" style={{ background: status.bg, color: status.color }}>
                            <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'currentColor', display: 'inline-block' }} />
                            {r.status}
                          </span>
                        </td>
                        <td style={{ color: '#94a3b8', fontSize: '0.75rem', whiteSpace: 'nowrap' }}>
                          {r.created_at ? new Date(r.created_at).toLocaleDateString() : '—'}
                        </td>
                        <td>
                          <div className="rm-actions">
                            <button className="rm-action-btn edit" onClick={() => navigate(`/admin/restaurants/${r.id}/edit`)}>Edit</button>
                            <button className="rm-action-btn del" onClick={() => setDeleteTarget(r)}>Delete</button>
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
