import { useState, useEffect, useCallback } from 'react';
import { getAdminOrders, adminUpdateOrderStatus, adminDeleteOrder } from '../../../api/index.js';

const STATUS_COLORS = {
  pending: { bg: 'rgba(37,99,235,0.12)', color: '#2563eb' },
  confirmed: { bg: 'rgba(124,58,237,0.12)', color: '#7c3aed' },
  preparing: { bg: 'rgba(234,179,8,0.15)', color: '#ca8a04' },
  on_the_way: { bg: 'rgba(234,88,12,0.12)', color: '#ea580c' },
  delivered: { bg: 'rgba(22,163,74,0.12)', color: '#16a34a' },
  cancelled: { bg: 'rgba(239,68,68,0.12)', color: '#dc2626' },
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [toast, setToast] = useState(null);
  const [meta, setMeta] = useState({});

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchOrders = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      const data = await getAdminOrders(1, search, statusFilter);
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
      await adminUpdateOrderStatus(id, newStatus);
      showToast('Order status updated');
      fetchOrders();
    } catch {
      showToast('Failed to update status', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;
    try {
      await adminDeleteOrder(id);
      showToast('Order deleted');
      fetchOrders();
    } catch {
      showToast('Failed to delete order', 'error');
    }
  };

  return (
    <>
      <style>{`
        .om-wrap { padding: 1.5rem; display: flex; flex-direction: column; gap: 1.25rem; }
        .om-header { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.75rem; }
        .om-title { font-size: 1.25rem; font-weight: 800; color: #0f172a; }
        .om-subtitle { font-size: 0.8125rem; color: #94a3b8; margin-top: 0.125rem; }
        .om-filters { background: #fff; border: 1px solid #e2e8f0; border-radius: 14px; padding: 1rem 1.25rem; display: flex; gap: 0.75rem; flex-wrap: wrap; align-items: center; }
        .om-search-wrap { position: relative; flex: 1; min-width: 200px; }
        .om-search-icon { position: absolute; left: 0.75rem; top: 50%; transform: translateY(-50%); color: #94a3b8; font-size: 0.875rem; }
        .om-search { width: 100%; padding: 0.5625rem 0.75rem 0.5625rem 2.25rem; border: 1px solid #e2e8f0; border-radius: 9px; font-size: 0.8125rem; color: #0f172a; background: #f8fafc; outline: none; }
        .om-search:focus { border-color: #16a34a; background: #fff; }
        .om-select { padding: 0.5625rem 0.875rem; border: 1px solid #e2e8f0; border-radius: 9px; font-size: 0.8125rem; color: #374151; background: #f8fafc; outline: none; cursor: pointer; }
        .om-panel { background: #fff; border: 1px solid #e2e8f0; border-radius: 14px; overflow: hidden; }
        .om-panel-header { padding: 1rem 1.375rem; border-bottom: 1px solid #f1f5f9; display: flex; justify-content: space-between; }
        .om-table { width: 100%; border-collapse: collapse; font-size: 0.8125rem; }
        .om-table th { padding: 0.6875rem 1.25rem; text-align: left; font-size: 0.6875rem; font-weight: 700; text-transform: uppercase; color: #94a3b8; background: #f8fafc; }
        .om-table td { padding: 0.875rem 1.25rem; border-top: 1px solid #f1f5f9; color: #374151; }
        .om-status-select { padding: 0.25rem 0.5rem; border-radius: 6px; font-size: 0.75rem; font-weight: 600; cursor: pointer; border: 1px solid transparent; outline: none; }
        .om-toast { position: fixed; bottom: 1.5rem; right: 1.5rem; z-index: 9999; padding: 0.875rem 1.25rem; border-radius: 12px; font-size: 0.8125rem; font-weight: 600; color: #fff; box-shadow: 0 8px 24px rgba(0,0,0,0.15); animation: slideUp 0.25s ease; }
        @keyframes slideUp { from{transform:translateY(12px);opacity:0} to{transform:translateY(0);opacity:1} }
      `}</style>

      {toast && (
        <div className="om-toast" style={{ background: toast.type === 'error' ? '#dc2626' : '#16a34a' }}>
          {toast.type === 'error' ? '❌' : '✅'} {toast.msg}
        </div>
      )}

      <div className="om-wrap">
        <div className="om-header">
          <div>
            <div className="om-title">📋 Global Orders</div>
            <div className="om-subtitle">Monitor and manage all orders across the platform</div>
          </div>
        </div>

        <div className="om-filters">
          <div className="om-search-wrap">
            <span className="om-search-icon">🔍</span>
            <input className="om-search" placeholder="Search order code or customer..." value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === 'Enter' && fetchOrders()} />
          </div>
          <select className="om-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="">All Statuses</option>
            {Object.keys(STATUS_COLORS).map(s => <option key={s} value={s}>{s.replace('_', ' ').toUpperCase()}</option>)}
          </select>
          <button className="om-select" onClick={() => fetchOrders()} style={{ background: '#0f172a', color: '#fff', border: 'none' }}>Search</button>
        </div>

        <div className="om-panel">
          <div className="om-panel-header">
            <span style={{ fontWeight: 700, color: '#0f172a' }}>All Orders</span>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{meta.total ?? orders.length} total</span>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="om-table">
              <thead>
                <tr>
                  <th>Order Code</th>
                  <th>Customer</th>
                  <th>Restaurant</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={7} style={{ textAlign: 'center', padding: '2rem' }}>Loading orders...</td></tr>
                ) : orders.length === 0 ? (
                  <tr><td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>No orders found</td></tr>
                ) : (
                  orders.map(o => (
                    <tr key={o.id}>
                      <td style={{ fontWeight: 600, color: '#0f172a' }}>{o.order_code}</td>
                      <td>
                        <div style={{ fontWeight: 500 }}>{o.delivery_name || o.user?.name || 'Guest'}</div>
                        <div style={{ fontSize: '0.6875rem', color: '#94a3b8' }}>{o.delivery_phone}</div>
                      </td>
                      <td>{o.restaurant?.name || '—'}</td>
                      <td style={{ fontWeight: 600 }}>${Number(o.total_amount).toFixed(2)}</td>
                      <td>
                        <select 
                          className="om-status-select" 
                          value={o.status}
                          onChange={(e) => handleStatusChange(o.id, e.target.value)}
                          style={{
                            background: STATUS_COLORS[o.status]?.bg || '#f1f5f9',
                            color: STATUS_COLORS[o.status]?.color || '#64748b'
                          }}
                        >
                          {Object.keys(STATUS_COLORS).map(s => (
                            <option key={s} value={s}>{s.replace('_', ' ').toUpperCase()}</option>
                          ))}
                        </select>
                      </td>
                      <td style={{ fontSize: '0.75rem', color: '#64748b', whiteSpace: 'nowrap' }}>
                        {new Date(o.created_at).toLocaleString()}
                      </td>
                      <td>
                        <button onClick={() => handleDelete(o.id)} style={{ padding: '0.25rem 0.5rem', background: 'rgba(239,68,68,0.1)', color: '#dc2626', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }}>Delete</button>
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
