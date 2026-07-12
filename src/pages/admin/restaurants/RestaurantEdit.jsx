import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { adminUpdateRestaurant, getAdminRestaurant, adminGetUsers } from '../../../api/index.js';

export default function RestaurantEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    user_id: '',
    name: '',
    description: '',
    address: '',
    status: 'open'
  });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    adminGetUsers({ role: 'restaurant_owner' })
      .then(res => setUsers(res.data ?? res))
      .catch(err => console.error("Failed to load users", err));
      
    getAdminRestaurant(id)
      .then(res => {
        const data = res.data ?? res;
        setFormData({
          user_id: data.user_id || '',
          name: data.name || '',
          description: data.description || '',
          address: data.address || '',
          status: data.status || 'open'
        });
      })
      .catch(err => setError('Failed to load restaurant data'))
      .finally(() => setFetching(false));
  }, [id]);

  const handleChange = (e) => setFormData(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await adminUpdateRestaurant(id, formData);
      navigate('/admin/restaurants');
    } catch (err) {
      setError(err.message || 'Failed to update restaurant');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading restaurant data...</div>;

  return (
    <div style={{ padding: '1.5rem', maxWidth: 800, margin: '0 auto' }}>
      <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Link to="/admin/restaurants" style={{ textDecoration: 'none', color: '#64748b', fontSize: '1.25rem' }}>←</Link>
        <div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Edit Restaurant</h1>
          <p style={{ fontSize: '0.8125rem', color: '#94a3b8', margin: 0 }}>Update restaurant details</p>
        </div>
      </div>

      {error && (
        <div style={{ padding: '0.875rem', background: '#fef2f2', color: '#dc2626', borderRadius: 8, marginBottom: '1.5rem', fontSize: '0.875rem' }}>
          {error}
        </div>
      )}

      <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <form onSubmit={handleSubmit} style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#374151', marginBottom: '0.375rem' }}>Restaurant Name</label>
            <input required name="name" value={formData.name} onChange={handleChange} style={{ width: '100%', padding: '0.625rem 0.875rem', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: '0.875rem', outline: 'none' }} />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#374151', marginBottom: '0.375rem' }}>Owner (User)</label>
            <select required name="user_id" value={formData.user_id} onChange={handleChange} style={{ width: '100%', padding: '0.625rem 0.875rem', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: '0.875rem', outline: 'none', background: '#fff' }}>
              <option value="">Select an owner...</option>
              {users.map(u => (
                <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#374151', marginBottom: '0.375rem' }}>Status</label>
            <select name="status" value={formData.status} onChange={handleChange} style={{ width: '100%', padding: '0.625rem 0.875rem', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: '0.875rem', outline: 'none', background: '#fff' }}>
              <option value="open">Open</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#374151', marginBottom: '0.375rem' }}>Address</label>
            <textarea required name="address" value={formData.address} onChange={handleChange} rows={3} style={{ width: '100%', padding: '0.625rem 0.875rem', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: '0.875rem', outline: 'none', resize: 'vertical' }} />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#374151', marginBottom: '0.375rem' }}>Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows={4} style={{ width: '100%', padding: '0.625rem 0.875rem', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: '0.875rem', outline: 'none', resize: 'vertical' }} />
          </div>

          <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
            <Link to="/admin/restaurants" style={{ padding: '0.625rem 1.25rem', borderRadius: 8, fontWeight: 600, textDecoration: 'none', color: '#64748b', fontSize: '0.875rem', border: '1px solid #e2e8f0' }}>Cancel</Link>
            <button type="submit" disabled={loading} style={{ padding: '0.625rem 1.25rem', borderRadius: 8, fontWeight: 600, border: 'none', background: '#16a34a', color: '#fff', cursor: loading ? 'not-allowed' : 'pointer', fontSize: '0.875rem' }}>
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
