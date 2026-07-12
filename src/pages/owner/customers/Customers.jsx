import { useState, useEffect, useCallback } from 'react';
import { getOwnerCustomers } from '../../../api/index.js';

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

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [meta, setMeta] = useState({});

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getOwnerCustomers(1, search);
      setCustomers(data.data ?? data);
      setMeta(data);
    } catch {
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => { fetchCustomers(); }, [fetchCustomers]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>👥 My Customers</div>
          <div style={{ fontSize: '0.8125rem', color: '#94a3b8', marginTop: '0.125rem' }}>View customers who have ordered from you</div>
        </div>
      </div>

      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: '1rem 1.25rem', display: 'flex', gap: '0.75rem' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '0.875rem' }}>🔍</span>
          <input
            style={{ width: '100%', padding: '0.5625rem 0.75rem 0.5625rem 2.25rem', border: '1px solid #e2e8f0', borderRadius: 9, fontSize: '0.8125rem', outline: 'none', boxSizing: 'border-box' }}
            placeholder="Search by name, email, or phone…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && fetchCustomers()}
          />
        </div>
        <button onClick={() => fetchCustomers()} style={{
          padding: '0.5625rem 1.125rem', background: '#0f172a', color: '#fff',
          border: 'none', borderRadius: 10, fontWeight: 600, fontSize: '0.8125rem', cursor: 'pointer'
        }}>
          Search
        </button>
      </div>

      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, overflow: 'hidden' }}>
        <div style={{ padding: '1rem 1.375rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.9375rem' }}>Customers</span>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 500 }}>{meta.total ?? customers.length} total</span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
            <thead>
              <tr>
                <th style={{ padding: '0.6875rem 1.25rem', textAlign: 'left', fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', color: '#94a3b8', background: '#f8fafc' }}>Customer</th>
                <th style={{ padding: '0.6875rem 1.25rem', textAlign: 'left', fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', color: '#94a3b8', background: '#f8fafc' }}>Email</th>
                <th style={{ padding: '0.6875rem 1.25rem', textAlign: 'left', fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', color: '#94a3b8', background: '#f8fafc' }}>Phone</th>
                <th style={{ padding: '0.6875rem 1.25rem', textAlign: 'left', fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', color: '#94a3b8', background: '#f8fafc' }}>Joined</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={4} style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>Loading...</td></tr>
              ) : customers.length === 0 ? (
                <tr><td colSpan={4} style={{ padding: '4rem 1rem', textAlign: 'center', color: '#94a3b8' }}>No customers found</td></tr>
              ) : (
                customers.map(c => (
                  <tr key={c.id} style={{ borderTop: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '0.875rem 1.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                        <Avatar name={c.name} />
                        <div>
                          <div style={{ fontWeight: 600, color: '#0f172a' }}>{c.name}</div>
                          <div style={{ fontSize: '0.6875rem', color: '#94a3b8' }}>#{c.id}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '0.875rem 1.25rem', color: '#374151' }}>{c.email}</td>
                    <td style={{ padding: '0.875rem 1.25rem', color: '#64748b' }}>{c.phone || '—'}</td>
                    <td style={{ padding: '0.875rem 1.25rem', color: '#94a3b8', fontSize: '0.75rem' }}>
                      {c.created_at ? new Date(c.created_at).toLocaleDateString() : '—'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
