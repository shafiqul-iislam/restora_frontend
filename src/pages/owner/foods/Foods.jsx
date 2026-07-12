import { useState, useEffect, useCallback } from 'react';
import { getOwnerFoods, deleteOwnerFood } from '../../../api/index.js';

export default function Foods() {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchFoods = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getOwnerFoods({ search });
      setFoods(data.data ?? data);
    } catch {
      setFoods([]);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => { fetchFoods(); }, [fetchFoods]);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete ${name}?`)) return;
    try {
      await deleteOwnerFood(id);
      showToast(`${name} deleted successfully.`);
      fetchFoods();
    } catch {
      showToast('Failed to delete food item.', 'error');
    }
  };

  return (
    <>
      <style>{`
        .f-wrap { padding: 1.5rem; display: flex; flex-direction: column; gap: 1.25rem; }
        .f-header { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.75rem; }
        .f-title { font-size: 1.25rem; font-weight: 800; color: #0f172a; }
        .f-subtitle { font-size: 0.8125rem; color: #94a3b8; margin-top: 0.125rem; }
        .f-btn-primary { padding: 0.5625rem 1.125rem; background: linear-gradient(135deg, #ea580c, #f97316); color: #fff; border: none; border-radius: 10px; font-weight: 600; font-size: 0.8125rem; cursor: pointer; text-decoration: none; }
        .f-filters { background: #fff; border: 1px solid #e2e8f0; border-radius: 14px; padding: 1rem 1.25rem; display: flex; gap: 0.75rem; align-items: center; }
        .f-search-wrap { position: relative; flex: 1; min-width: 200px; }
        .f-search-icon { position: absolute; left: 0.75rem; top: 50%; transform: translateY(-50%); color: #94a3b8; font-size: 0.875rem; }
        .f-search { width: 100%; padding: 0.5625rem 0.75rem 0.5625rem 2.25rem; border: 1px solid #e2e8f0; border-radius: 9px; font-size: 0.8125rem; outline: none; box-sizing: border-box; }
        .f-panel { background: #fff; border: 1px solid #e2e8f0; border-radius: 14px; overflow: hidden; }
        .f-panel-header { padding: 1rem 1.375rem; border-bottom: 1px solid #f1f5f9; display: flex; justify-content: space-between; }
        .f-count { font-size: 0.75rem; color: #94a3b8; font-weight: 500; }
        .f-table { width: 100%; border-collapse: collapse; font-size: 0.8125rem; }
        .f-table th { padding: 0.6875rem 1.25rem; text-align: left; font-size: 0.6875rem; font-weight: 700; text-transform: uppercase; color: #94a3b8; background: #f8fafc; }
        .f-table td { padding: 0.875rem 1.25rem; border-top: 1px solid #f1f5f9; color: #374151; }
        .f-actions { display: flex; gap: 0.375rem; }
        .f-action-btn { padding: 0.375rem 0.75rem; border-radius: 8px; font-size: 0.75rem; font-weight: 600; cursor: pointer; border: none; font-family: inherit; }
        .f-action-btn.del { background: rgba(239,68,68,0.1); color: #dc2626; }
        .f-toast { position: fixed; bottom: 1.5rem; right: 1.5rem; z-index: 9999; padding: 0.875rem 1.25rem; border-radius: 12px; font-size: 0.8125rem; font-weight: 600; color: #fff; box-shadow: 0 8px 24px rgba(0,0,0,0.15); }
      `}</style>

      {toast && (
        <div className="f-toast" style={{ background: toast.type === 'error' ? '#dc2626' : '#16a34a' }}>
          {toast.type === 'error' ? '❌' : '✅'} {toast.msg}
        </div>
      )}

      <div className="f-wrap">
        <div className="f-header">
          <div>
            <div className="f-title">🍽️ Menu Items</div>
            <div className="f-subtitle">Manage your restaurant's food offerings</div>
          </div>
          <button className="f-btn-primary" onClick={() => showToast('Create Food functionality coming soon!', 'error')}>
            + Add New Item
          </button>
        </div>

        <div className="f-filters">
          <div className="f-search-wrap">
            <span className="f-search-icon">🔍</span>
            <input
              className="f-search"
              placeholder="Search food name…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && fetchFoods()}
            />
          </div>
          <button className="f-btn-primary" style={{ background: '#0f172a' }} onClick={() => fetchFoods()}>Search</button>
        </div>

        <div className="f-panel">
          <div className="f-panel-header">
            <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.9375rem' }}>All Items</span>
            <span className="f-count">{foods.length} total</span>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="f-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Price</th>
                  <th>Created At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>Loading...</td></tr>
                ) : foods.length === 0 ? (
                  <tr><td colSpan={5} style={{ padding: '4rem 1rem', textAlign: 'center', color: '#94a3b8' }}>No menu items found</td></tr>
                ) : (
                  foods.map(f => (
                    <tr key={f.id}>
                      <td>
                        <div style={{ fontWeight: 600, color: '#0f172a' }}>{f.name}</div>
                      </td>
                      <td style={{ color: '#64748b', maxWidth: 250, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {f.description || '—'}
                      </td>
                      <td style={{ fontWeight: 600, color: '#10b981' }}>${parseFloat(f.price).toFixed(2)}</td>
                      <td style={{ color: '#94a3b8', fontSize: '0.75rem' }}>
                        {new Date(f.created_at).toLocaleDateString()}
                      </td>
                      <td>
                        <div className="f-actions">
                          <button className="f-action-btn del" onClick={() => handleDelete(f.id, f.name)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
