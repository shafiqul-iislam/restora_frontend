import { useState, useEffect } from 'react';
import { getOwnerDashboard } from '../../api/index.js';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const data = await getOwnerDashboard();
        setStats(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading dashboard...</div>;

  const statCards = [
    { label: 'Total Orders', value: stats?.total_orders ?? 0, icon: '📦', color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
    { label: "Today's Orders", value: stats?.today_orders ?? 0, icon: '📅', color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)' },
    { label: 'Pending Orders', value: stats?.pending_orders ?? 0, icon: '⏳', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
    { label: 'Total Revenue', value: `$${parseFloat(stats?.total_revenue ?? 0).toFixed(2)}`, icon: '💰', color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
        {statCards.map((card, idx) => (
          <div key={idx} style={{
            background: '#fff', borderRadius: 16, padding: '1.5rem',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -2px rgba(0,0,0,0.05)',
            display: 'flex', alignItems: 'center', gap: '1.25rem'
          }}>
            <div style={{
              width: 56, height: 56, borderRadius: 14, background: card.bg, color: card.color,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem'
            }}>
              {card.icon}
            </div>
            <div>
              <div style={{ color: '#64748b', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                {card.label}
              </div>
              <div style={{ color: '#0f172a', fontSize: '1.75rem', fontWeight: 800 }}>
                {card.value}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div style={{ background: '#fff', borderRadius: 16, padding: '2rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
        <h2 style={{ marginTop: 0, color: '#0f172a', fontSize: '1.25rem' }}>Welcome to your Restaurant Dashboard</h2>
        <p style={{ color: '#64748b', lineHeight: 1.6, margin: 0 }}>
          Manage your menu items, track incoming orders, and keep an eye on your best customers.
          Use the sidebar to navigate through your management tools.
        </p>
      </div>
    </div>
  );
}
