import { useState, useEffect } from 'react';
import { getAdminDashboard } from '../../api/index.js';

const statusColors = {
  Delivered: { bg: 'rgba(22,163,74,0.12)', color: '#16a34a' },
  Preparing: { bg: 'rgba(234,179,8,0.15)', color: '#ca8a04' },
  Pending:   { bg: 'rgba(37,99,235,0.12)', color: '#2563eb' },
  Cancelled: { bg: 'rgba(239,68,68,0.12)', color: '#dc2626' },
};

export default function Dashboard() {
  const [data, setData] = useState({
    stats: [],
    recentOrders: [],
    topRestaurants: [],
    activities: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminDashboard()
      .then(res => setData(res.data ?? res))
      .catch(err => console.error("Failed to load dashboard:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading dashboard...</div>;
  }

  const { stats, recentOrders, topRestaurants, activities } = data;

  return (
    <>
      <style>{`
        /* ── Dashboard Wrapper ─────────────────────── */
        .dash {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          padding: 1.5rem;
          min-height: calc(100vh - 68px - 52px);
          background: #f8fafc;
        }

        /* ── Welcome Banner ────────────────────────── */
        .dash-welcome {
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #16a34a 150%);
          border-radius: 16px;
          padding: 1.75rem 2rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
          position: relative;
          overflow: hidden;
        }
        .dash-welcome::before {
          content: '';
          position: absolute;
          top: -60px;
          right: -60px;
          width: 200px;
          height: 200px;
          background: rgba(34,197,94,0.12);
          border-radius: 50%;
        }
        .dash-welcome::after {
          content: '';
          position: absolute;
          bottom: -80px;
          right: 120px;
          width: 160px;
          height: 160px;
          background: rgba(34,197,94,0.07);
          border-radius: 50%;
        }
        .dash-welcome-left { position: relative; z-index: 1; }
        .dash-welcome-greeting {
          font-size: 0.8125rem;
          color: #86efac;
          font-weight: 500;
          margin-bottom: 0.25rem;
        }
        .dash-welcome-title {
          font-size: 1.5rem;
          font-weight: 800;
          color: #fff;
          margin-bottom: 0.375rem;
        }
        .dash-welcome-sub {
          font-size: 0.875rem;
          color: #94a3b8;
        }
        .dash-welcome-right {
          display: flex;
          gap: 0.75rem;
          position: relative;
          z-index: 1;
        }
        .dash-btn-primary {
          padding: 0.5625rem 1.25rem;
          background: linear-gradient(135deg, #16a34a, #22c55e);
          color: #fff;
          font-size: 0.8125rem;
          font-weight: 600;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          transition: opacity 0.2s, transform 0.15s;
          font-family: inherit;
          white-space: nowrap;
        }
        .dash-btn-primary:hover { opacity: 0.9; transform: translateY(-1px); }
        .dash-btn-secondary {
          padding: 0.5625rem 1.25rem;
          background: rgba(255,255,255,0.1);
          color: #fff;
          font-size: 0.8125rem;
          font-weight: 600;
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 10px;
          cursor: pointer;
          transition: background 0.2s;
          font-family: inherit;
          white-space: nowrap;
        }
        .dash-btn-secondary:hover { background: rgba(255,255,255,0.16); }

        /* ── Stats Grid ────────────────────────────── */
        .dash-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
        }
        @media (max-width: 1100px) { .dash-stats { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 540px)  { .dash-stats { grid-template-columns: 1fr; } }

        .stat-card {
          background: #fff;
          border-radius: 14px;
          padding: 1.375rem 1.25rem;
          border: 1px solid #e2e8f0;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          transition: transform 0.2s, box-shadow 0.2s;
          position: relative;
          overflow: hidden;
        }
        .stat-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.08);
        }
        .stat-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .stat-icon-wrap {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.25rem;
        }
        .stat-change {
          font-size: 0.75rem;
          font-weight: 600;
          padding: 0.1875rem 0.5rem;
          border-radius: 6px;
        }
        .stat-change.positive { background: rgba(22,163,74,0.1); color: #16a34a; }
        .stat-change.negative { background: rgba(239,68,68,0.1); color: #dc2626; }

        .stat-value {
          font-size: 1.75rem;
          font-weight: 800;
          color: #0f172a;
          line-height: 1;
        }
        .stat-label {
          font-size: 0.8125rem;
          font-weight: 500;
          color: #64748b;
        }
        .stat-desc {
          font-size: 0.6875rem;
          color: #94a3b8;
        }

        /* ── Main grid (orders + sidebar) ─────────── */
        .dash-main {
          display: grid;
          grid-template-columns: 1fr 320px;
          gap: 1.25rem;
        }
        @media (max-width: 1024px) { .dash-main { grid-template-columns: 1fr; } }

        /* ── Panel shared ──────────────────────────── */
        .panel {
          background: #fff;
          border-radius: 14px;
          border: 1px solid #e2e8f0;
          overflow: hidden;
        }
        .panel-header {
          padding: 1.125rem 1.375rem;
          border-bottom: 1px solid #f1f5f9;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
        }
        .panel-title {
          font-size: 0.9375rem;
          font-weight: 700;
          color: #0f172a;
        }
        .panel-subtitle {
          font-size: 0.75rem;
          color: #94a3b8;
        }
        .panel-action {
          font-size: 0.75rem;
          font-weight: 600;
          color: #16a34a;
          text-decoration: none;
          transition: opacity 0.2s;
          white-space: nowrap;
        }
        .panel-action:hover { opacity: 0.75; }

        /* ── Orders Table ──────────────────────────── */
        .orders-table-wrap {
          overflow-x: auto;
        }
        .orders-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.8125rem;
        }
        .orders-table th {
          padding: 0.75rem 1.375rem;
          text-align: left;
          font-size: 0.6875rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: #94a3b8;
          background: #f8fafc;
          white-space: nowrap;
        }
        .orders-table td {
          padding: 0.9375rem 1.375rem;
          border-top: 1px solid #f1f5f9;
          color: #374151;
          white-space: nowrap;
        }
        .orders-table tr:hover td { background: #f8fafc; }

        .order-id {
          font-weight: 700;
          color: #0f172a;
          font-family: monospace;
          font-size: 0.8125rem;
        }
        .order-customer { font-weight: 600; color: #1e293b; }
        .order-restaurant { color: #64748b; }
        .order-total { font-weight: 700; color: #0f172a; }
        .order-time { color: #94a3b8; font-size: 0.75rem; }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.3125rem;
          padding: 0.25rem 0.625rem;
          border-radius: 20px;
          font-size: 0.6875rem;
          font-weight: 600;
        }
        .status-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: currentColor;
          display: inline-block;
        }

        /* ── Right Sidebar panels ──────────────────── */
        .dash-side { display: flex; flex-direction: column; gap: 1.25rem; }

        /* Top Restaurants */
        .rest-list { padding: 0.5rem 0; }
        .rest-item {
          display: flex;
          align-items: center;
          gap: 0.875rem;
          padding: 0.6875rem 1.375rem;
          transition: background 0.15s;
        }
        .rest-item:hover { background: #f8fafc; }
        .rest-rank {
          font-size: 0.6875rem;
          font-weight: 700;
          color: #94a3b8;
          width: 16px;
          text-align: center;
          flex-shrink: 0;
        }
        .rest-emoji {
          width: 36px;
          height: 36px;
          background: #f1f5f9;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.125rem;
          flex-shrink: 0;
        }
        .rest-info { flex: 1; min-width: 0; }
        .rest-name {
          font-size: 0.8125rem;
          font-weight: 600;
          color: #0f172a;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .rest-meta {
          font-size: 0.6875rem;
          color: #94a3b8;
        }
        .rest-revenue {
          font-size: 0.8125rem;
          font-weight: 700;
          color: #16a34a;
          flex-shrink: 0;
        }

        /* Activity Feed */
        .activity-list { padding: 0.5rem 0; }
        .activity-item {
          display: flex;
          align-items: flex-start;
          gap: 0.875rem;
          padding: 0.75rem 1.375rem;
          transition: background 0.15s;
        }
        .activity-item:hover { background: #f8fafc; }
        .activity-icon-wrap {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.875rem;
          flex-shrink: 0;
          margin-top: 0.0625rem;
        }
        .activity-body { flex: 1; min-width: 0; }
        .activity-text {
          font-size: 0.8125rem;
          color: #1e293b;
          line-height: 1.4;
          font-weight: 500;
        }
        .activity-time {
          font-size: 0.6875rem;
          color: #94a3b8;
          margin-top: 0.1875rem;
        }

        /* ── Quick Actions ─────────────────────────── */
        .dash-actions {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0.875rem;
        }
        @media (max-width: 768px) { .dash-actions { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 400px) { .dash-actions { grid-template-columns: 1fr; } }

        .action-card {
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 1.125rem;
          display: flex;
          align-items: center;
          gap: 0.875rem;
          cursor: pointer;
          transition: all 0.2s;
          text-decoration: none;
        }
        .action-card:hover {
          border-color: #22c55e;
          box-shadow: 0 4px 16px rgba(22,163,74,0.1);
          transform: translateY(-2px);
        }
        .action-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.125rem;
          flex-shrink: 0;
        }
        .action-label {
          font-size: 0.8125rem;
          font-weight: 600;
          color: #1e293b;
        }
        .action-sub {
          font-size: 0.6875rem;
          color: #94a3b8;
        }
      `}</style>

      <div className="dash">
        {/* Welcome Banner */}
        <div className="dash-welcome">
          <div className="dash-welcome-left">
            <div className="dash-welcome-greeting">👋 Good day,</div>
            <div className="dash-welcome-title">Welcome back, Admin!</div>
            <div className="dash-welcome-sub">Here's what's happening with Restora today.</div>
          </div>
          <div className="dash-welcome-right">
            <button className="dash-btn-secondary">📊 View Reports</button>
            <button className="dash-btn-primary">+ Add Restaurant</button>
          </div>
        </div>

        {/* Stats */}
        <div className="dash-stats">
          {stats.map(s => (
            <div className="stat-card" key={s.id} id={`stat-${s.id}`}>
              <div className="stat-card-top">
                <div className="stat-icon-wrap" style={{ background: s.bg }}>
                  {s.icon}
                </div>
                <span className={`stat-change ${s.positive ? 'positive' : 'negative'}`}>
                  {s.positive ? '↑' : '↓'} {s.change}
                </span>
              </div>
              <div>
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label}</div>
                <div className="stat-desc">{s.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="dash-actions">
          {[
            { icon: '🍽️', bg: 'rgba(22,163,74,0.1)',  label: 'Add Restaurant', sub: 'Onboard new partner' },
            { icon: '👤', bg: 'rgba(37,99,235,0.1)',   label: 'Manage Users',   sub: 'View all accounts' },
            { icon: '📋', bg: 'rgba(124,58,237,0.1)', label: 'View Orders',    sub: 'Track deliveries' },
            { icon: '📊', bg: 'rgba(234,88,12,0.1)',   label: 'Analytics',      sub: 'Revenue insights' },
          ].map((a, i) => (
            <a href="#" className="action-card" key={i}>
              <div className="action-icon" style={{ background: a.bg }}>{a.icon}</div>
              <div>
                <div className="action-label">{a.label}</div>
                <div className="action-sub">{a.sub}</div>
              </div>
            </a>
          ))}
        </div>

        {/* Main Content: Orders + Side Panels */}
        <div className="dash-main">
          {/* Recent Orders */}
          <div className="panel" id="recent-orders-panel">
            <div className="panel-header">
              <div>
                <div className="panel-title">Recent Orders</div>
                <div className="panel-subtitle">Latest 5 orders across all restaurants</div>
              </div>
              <a href="/admin/orders" className="panel-action">View All →</a>
            </div>
            <div className="orders-table-wrap">
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Restaurant</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map(o => {
                    const sc = statusColors[o.status] || { bg: '#f1f5f9', color: '#64748b' };
                    return (
                      <tr key={o.id}>
                        <td><span className="order-id">{o.id}</span></td>
                        <td><span className="order-customer">{o.customer}</span></td>
                        <td><span className="order-restaurant">{o.restaurant}</span></td>
                        <td>{o.items}</td>
                        <td><span className="order-total">{o.total}</span></td>
                        <td>
                          <span
                            className="status-badge"
                            style={{ background: sc.bg, color: sc.color }}
                          >
                            <span className="status-dot"></span>
                            {o.status}
                          </span>
                        </td>
                        <td><span className="order-time">{o.time}</span></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Column */}
          <div className="dash-side">
            {/* Top Restaurants */}
            <div className="panel" id="top-restaurants-panel">
              <div className="panel-header">
                <div>
                  <div className="panel-title">Top Restaurants</div>
                  <div className="panel-subtitle">By order volume</div>
                </div>
                <a href="/admin/restaurants" className="panel-action">View All →</a>
              </div>
              <div className="rest-list">
                {topRestaurants.map((r, i) => (
                  <div className="rest-item" key={r.name}>
                    <span className="rest-rank">{i + 1}</span>
                    <div className="rest-emoji">{r.emoji}</div>
                    <div className="rest-info">
                      <div className="rest-name">{r.name}</div>
                      <div className="rest-meta">{r.orders} orders · ⭐ {r.rating}</div>
                    </div>
                    <span className="rest-revenue">{r.revenue}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Activity Feed */}
            <div className="panel" id="activity-feed-panel">
              <div className="panel-header">
                <div>
                  <div className="panel-title">Recent Activity</div>
                  <div className="panel-subtitle">Live system events</div>
                </div>
              </div>
              <div className="activity-list">
                {activities.map((a, i) => (
                  <div className="activity-item" key={i}>
                    <div
                      className="activity-icon-wrap"
                      style={{ background: `${a.color}18` }}
                    >
                      {a.icon}
                    </div>
                    <div className="activity-body">
                      <div className="activity-text">{a.text}</div>
                      <div className="activity-time">{a.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}