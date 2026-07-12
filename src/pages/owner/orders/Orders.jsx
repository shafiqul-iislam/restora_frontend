import { useState, useEffect, useCallback } from 'react';
import { getOwnerOrders, ownerUpdateOrderStatus } from '../../../api/index.js';

const STATUS_COLORS = {
  pending:    { bg: 'rgba(37,99,235,0.12)',  color: '#2563eb' },
  confirmed:  { bg: 'rgba(139,92,246,0.12)', color: '#8b5cf6' },
  preparing:  { bg: 'rgba(245,158,11,0.12)', color: '#f59e0b' },
  on_the_way: { bg: 'rgba(14,165,233,0.12)', color: '#0ea5e9' },
  delivered:  { bg: 'rgba(22,163,74,0.12)',  color: '#16a34a' },
  cancelled:  { bg: 'rgba(239,68,68,0.12)',  color: '#dc2626' },
};

const STATUS_OPTIONS = ['pending', 'confirmed', 'preparing', 'on_the_way', 'delivered', 'cancelled'];

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [meta, setMeta] = useState({});
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getOwnerOrders(1, search, statusFilter);
      setOrders(data.data ?? data);
      setMeta(data);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await ownerUpdateOrderStatus(id, newStatus);
      showToast(`Order #${id} status updated to ${newStatus}`);
      fetchOrders();
    } catch {
      showToast('Failed to update status', 'error');
    }
  };

  return (
    <>
      <style>{`
        .o-wrap { padding: 1.5rem; display: flex; flex-direction: column; gap: 1.25rem; }
        .o-header { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.75rem; }
        .o-title { font-size: 1.25rem; font-weight: 800; color: #0f172a; }
        .o-subtitle { font-size: 0.8125rem; color: #94a3b8; margin-top: 0.125rem; }
        .o-filters { background: #fff; border: 1px solid #e2e8f0; border-radius: 14px; padding: 1rem 1.25rem; display: flex; gap: 0.75rem; flex-wrap: wrap; align-items: center; }
        .o-search-wrap { position: relative; flex: 1; min-width: 200px; }
        .o-search-icon { position: absolute; left: 0.75rem; top: 50%; transform: translateY(-50%); color: #94a3b8; font-size: 0.875rem; }
        .o-search { width: 100%; padding: 0.5625rem 0.75rem 0.5625rem 2.25rem; border: 1px solid #e2e8f0; border-radius: 9px; font-size: 0.8125rem; outline: none; box-sizing: border-box; }
        .o-select { padding: 0.5625rem 0.875rem; border: 1px solid #e2e8f0; border-radius: 9px; font-size: 0.8125rem; background: #f8fafc; outline: none; cursor: pointer; }
        .o-btn-primary { padding: 0.5625rem 1.125rem; background: #0f172a; color: #fff; border: none; border-radius: 10px; font-weight: 600; font-size: 0.8125rem; cursor: pointer; }
        .o-panel { background: #fff; border: 1px solid #e2e8f0; border-radius: 14px; overflow: hidden; }
        .o-panel-header { padding: 1rem 1.375rem; border-bottom: 1px solid #f1f5f9; display: flex; justify-content: space-between; }
        .o-count { font-size: 0.75rem; color: #94a3b8; font-weight: 500; }
        .o-table { width: 100%; border-collapse: collapse; font-size: 0.8125rem; }
        .o-table th { padding: 0.6875rem 1.25rem; text-align: left; font-size: 0.6875rem; font-weight: 700; text-transform: uppercase; color: #94a3b8; background: #f8fafc; white-space: nowrap; }
        .o-table td { padding: 0.875rem 1.25rem; border-top: 1px solid #f1f5f9; color: #374151; }
        .o-badge { display: inline-flex; align-items: center; gap: 0.3125rem; padding: 0.1875rem 0.625rem; border-radius: 20px; font-size: 0.6875rem; font-weight: 600; text-transform: capitalize; }
        .o-toast { position: fixed; bottom: 1.5rem; right: 1.5rem; z-index: 9999; padding: 0.875rem 1.25rem; border-radius: 12px; font-size: 0.8125rem; font-weight: 600; color: #fff; box-shadow: 0 8px 24px rgba(0,0,0,0.15); }
      `}</style>

      {toast && (
        <div className="o-toast" style={{ background: toast.type === 'error' ? '#dc2626' : '#16a34a' }}>
          {toast.type === 'error' ? '❌' : '✅'} {toast.msg}
        </div>
      )}

      <div className="o-wrap">
        <div className="o-header">
          <div>
            <div className="o-title">📋 Orders Management</div>
            <div className="o-subtitle">Manage live orders and update statuses</div>
          </div>
        </div>

        <div className="o-filters">
          <div className="o-search-wrap">
            <span className="o-search-icon">🔍</span>
            <input
              className="o-search"
              placeholder="Search order code, phone, name…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && fetchOrders()}
            />
          </div>
          <select className="o-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="">All Statuses</option>
            {STATUS_OPTIONS.map(s => (
              <option key={s} value={s}>{s.replace('_', ' ')}</option>
            ))}
          </select>
          <button className="o-btn-primary" onClick={() => fetchOrders()}>Search</button>
        </div>

        <div className="o-panel">
          <div className="o-panel-header">
            <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.9375rem' }}>Recent Orders</span>
            <span className="o-count">{meta.total ?? orders.length} total</span>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="o-table">
              <thead>
                <tr>
                  <th>Order Code</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Placed At</th>
                  <th>Update Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>Loading...</td></tr>
                ) : orders.length === 0 ? (
                  <tr><td colSpan={6} style={{ padding: '4rem 1rem', textAlign: 'center', color: '#94a3b8' }}>No orders found</td></tr>
                ) : (
                  orders.map(o => {
                    const status = STATUS_COLORS[o.status] || { bg: '#f1f5f9', color: '#64748b' };
                    return (
                      <tr key={o.id}>
                        <td>
                          <div style={{ fontWeight: 600, color: '#0f172a' }}>{o.order_code}</div>
                        </td>
                        <td>
                          <div style={{ fontWeight: 500, color: '#374151' }}>{o.delivery_name}</div>
                          <div style={{ fontSize: '0.6875rem', color: '#64748b' }}>{o.delivery_phone}</div>
                        </td>
                        <td style={{ fontWeight: 600, color: '#10b981' }}>${parseFloat(o.total_amount).toFixed(2)}</td>
                        <td>
                          <span className="o-badge" style={{ background: status.bg, color: status.color }}>
                            {o.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td style={{ color: '#94a3b8', fontSize: '0.75rem' }}>
                          {new Date(o.created_at).toLocaleString()}
                        </td>
                        <td>
                          <select 
                            className="o-select" 
                            style={{ padding: '0.375rem 0.5rem', fontSize: '0.75rem' }}
                            value={o.status}
                            onChange={(e) => handleStatusChange(o.id, e.target.value)}
                          >
                            {STATUS_OPTIONS.map(s => (
                              <option key={s} value={s}>{s.replace('_', ' ')}</option>
                            ))}
                          </select>
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
