import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRestaurant } from '../api/index.js';
import FoodCard from '../components/FoodCard.jsx';
import { useCart } from '../context/CartContext.jsx';

function SkeletonDetail() {
  return (
    <div className="page-container" style={{ paddingTop: '1.5rem', paddingBottom: '2rem' }}>
      <div className="skeleton" style={{ height: '14rem', borderRadius: '1rem', marginBottom: '1.5rem' }} />
      <div className="skeleton" style={{ height: '1.5rem', width: '50%', marginBottom: '0.75rem' }} />
      <div className="skeleton" style={{ height: '1rem', width: '35%', marginBottom: '0.5rem' }} />
      <div className="skeleton" style={{ height: '1rem', width: '25%', marginBottom: '2rem' }} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} style={{ backgroundColor: '#fff', borderRadius: '1rem', padding: '1rem', display: 'flex', gap: '1rem', border: '1px solid #f3f4f6' }}>
            <div className="skeleton" style={{ width: '6rem', height: '6rem', borderRadius: '0.75rem', flexShrink: 0 }} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div className="skeleton" style={{ height: '1rem', width: '75%' }} />
              <div className="skeleton" style={{ height: '0.75rem', width: '100%' }} />
              <div className="skeleton" style={{ height: '0.75rem', width: '50%' }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function RestaurantDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cartCount, cartTotal, restaurantId } = useCart();

  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    setLoading(true);
    getRestaurant(id)
      .then((restData) => {
        const r = restData.data ?? restData;
        setRestaurant(r);

        // Flatten the foods from categories
        const foods = [];
        if (r.categories) {
          r.categories.forEach(cat => {
            if (cat.foods) {
              cat.foods.forEach(food => {
                foods.push({
                  ...food,
                  category_name: cat.name
                });
              });
            }
          });
        }
        setMenuItems(foods);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <SkeletonDetail />;
  if (!restaurant) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '16rem', gap: '1rem' }}>
      <span style={{ fontSize: '3rem' }}>😕</span>
      <p style={{ color: '#9ca3af' }}>Restaurant not found</p>
      <button onClick={() => navigate('/restaurants')} style={{
        padding: '0.5rem 1.25rem', backgroundColor: '#16a34a', color: '#fff',
        border: 'none', borderRadius: '9999px', cursor: 'pointer',
      }}>Back to list</button>
    </div>
  );

  const categories = ['all', ...new Set(menuItems.map(i => i.category ?? i.category_name ?? 'Others').filter(Boolean))];
  const filtered = activeCategory === 'all' ? menuItems : menuItems.filter(i => (i.category ?? i.category_name ?? 'Others') === activeCategory);
  const grouped = {};
  filtered.forEach(item => {
    const cat = item.category ?? item.category_name ?? 'Others';
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(item);
  });

  const tabStyle = (active) => ({
    padding: '0.4rem 1rem',
    borderRadius: '9999px',
    fontSize: '0.85rem', fontWeight: 500,
    border: active ? 'none' : '1px solid #e5e7eb',
    backgroundColor: active ? '#16a34a' : '#fff',
    color: active ? '#fff' : '#374151',
    cursor: 'pointer', whiteSpace: 'nowrap',
    transition: 'all 0.15s',
    boxShadow: active ? '0 2px 8px rgba(22,163,74,0.25)' : 'none',
  });

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', paddingBottom: '6rem' }}>
      {/* Hero Banner */}
      <div style={{ position: 'relative', height: '14rem', backgroundColor: '#e5e7eb', overflow: 'hidden' }}>
        {restaurant.logo ? (
          <img src={restaurant.logo} alt={restaurant.name} onError={(e) => { e.target.onerror = null; e.target.src = '/placeholder-restaurant.png'; }} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div className="hero-gradient" style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '5rem' }}>
            🍽️
          </div>
        )}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.5), transparent)' }} />
        <button onClick={() => navigate(-1)} style={{
          position: 'absolute', top: '1rem', left: '1rem',
          padding: '0.5rem', borderRadius: '9999px',
          backgroundColor: 'rgba(255,255,255,0.9)', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}>
          <svg style={{ width: '1.25rem', height: '1.25rem', color: '#374151' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      <div className="page-container" style={{ maxWidth: '56rem' }}>
        {/* Info card */}
        <div style={{
          backgroundColor: '#fff', borderRadius: '1rem',
          boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
          border: '1px solid #f3f4f6',
          padding: '1.25rem', marginTop: '-2.5rem', position: 'relative', zIndex: 10,
          marginBottom: '1.5rem',
        }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                <h1 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#111827' }}>{restaurant.name}</h1>
                <span style={{
                  padding: '0.2rem 0.7rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600,
                  backgroundColor: restaurant.is_open !== false ? '#f0fdf4' : '#f3f4f6',
                  color: restaurant.is_open !== false ? '#16a34a' : '#9ca3af',
                }}>
                  {restaurant.is_open !== false ? '● Open' : '● Closed'}
                </span>
              </div>
              {restaurant.cuisine_type && <p style={{ fontSize: '0.875rem', color: '#9ca3af', marginTop: '0.25rem' }}>{restaurant.cuisine_type}</p>}
              {restaurant.address && (
                <p style={{ fontSize: '0.8rem', color: '#9ca3af', marginTop: '0.375rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  📍 {restaurant.address}
                </p>
              )}
            </div>

            <div style={{ display: 'flex', gap: '1.5rem', flexShrink: 0 }}>
              {restaurant.rating && (
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontWeight: 700, color: '#111827' }}>⭐ {Number(restaurant.rating).toFixed(1)}</p>
                  <p style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Rating</p>
                </div>
              )}
              {restaurant.delivery_time && (
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontWeight: 700, color: '#111827' }}>{restaurant.delivery_time} min</p>
                  <p style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Delivery</p>
                </div>
              )}
              {restaurant.min_order !== undefined && (
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontWeight: 700, color: '#111827' }}>৳{restaurant.min_order}</p>
                  <p style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Min order</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Category tabs */}
        {categories.length > 1 && (
          <div className="scrollbar-hide" style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', marginBottom: '1.5rem', paddingBottom: '0.25rem' }}>
            {categories.map(cat => (
              <button key={cat} style={tabStyle(activeCategory === cat)} onClick={() => setActiveCategory(cat)}>
                {cat === 'all' ? '🍽️ All' : cat}
              </button>
            ))}
          </div>
        )}

        {/* Menu */}
        {menuItems.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
            <span style={{ fontSize: '3.5rem' }}>🍽️</span>
            <p style={{ color: '#9ca3af', marginTop: '0.75rem' }}>No menu items available</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {Object.entries(grouped).map(([category, catItems]) => (
              <div key={category}>
                <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#111827', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                  <span style={{ width: '0.25rem', height: '1.25rem', backgroundColor: '#16a34a', borderRadius: '9999px', display: 'inline-block' }} />
                  {category}
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.75rem' }} className="menu-grid">
                  {catItems.map(item => (
                    <FoodCard key={item.id} item={item} restaurantId={restaurant.id} restaurantName={restaurant.name} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Floating cart bar */}
      {cartCount > 0 && String(restaurantId) === String(id) && (
        <div style={{ position: 'fixed', bottom: '1.5rem', left: '50%', transform: 'translateX(-50%)', zIndex: 40, padding: '0 1rem', width: '100%', maxWidth: '28rem' }}>
          <button onClick={() => navigate('/cart')} style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '1rem 1.25rem',
            backgroundColor: '#16a34a', color: '#fff',
            border: 'none', borderRadius: '1rem', cursor: 'pointer',
            boxShadow: '0 8px 24px rgba(22,163,74,0.4)',
          }}>
            <span style={{ backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: '0.5rem', padding: '0.25rem 0.625rem', fontSize: '0.85rem', fontWeight: 700 }}>
              {cartCount} item{cartCount !== 1 ? 's' : ''}
            </span>
            <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>View Cart</span>
            <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>৳{cartTotal.toFixed(0)}</span>
          </button>
        </div>
      )}

      <style>{`@media (min-width: 768px) { .menu-grid { grid-template-columns: 1fr 1fr !important; } }`}</style>
    </div>
  );
}
