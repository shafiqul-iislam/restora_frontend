import { Link } from 'react-router-dom';

const CUISINE_EMOJIS = {
  'Pizza': '🍕', 'Pasta': '🍝', 'Antipasti': '🧆', 'Desserts': '🍰',
  'Beverages': '🥤', 'Starters': '🥗', 'Curries': '🍛', 'Biryani & Rice': '🍚',
  'Breads': '🫓', 'Drinks': '🧋', 'Smoked Meats': '🥩', 'Burgers & Sandwiches': '🍔',
  'Sides': '🍟', 'Platters': '🍱', 'Sushi & Sashimi': '🍣', 'Ramen': '🍜',
  'Donburi': '🥣', 'Gyoza & Snacks': '🥟', 'Tacos': '🌮', 'Burritos & Bowls': '🌯',
  'Nachos & Appetizers': '🧀', 'Soups': '🍲',
};

export default function RestaurantCard({ restaurant }) {
  const { id, name, logo, description, address, status, categories = [] } = restaurant;

  const isOpen = status === 'open';

  // Build a short cuisine tag from first 2 categories
  const cuisineTag = categories.slice(0, 2).map(c => c.name).join(' · ');

  // Pick emoji from first category if known
  const emoji = CUISINE_EMOJIS[categories[0]?.name] ?? '🍽️';

  return (
    <Link to={`/restaurants/${id}`} style={{ textDecoration: 'none', display: 'block' }} className="card-hover">
      <div style={{
        backgroundColor: '#fff',
        borderRadius: '1rem',
        overflow: 'hidden',
        border: '1px solid #f3f4f6',
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        display: 'flex', flexDirection: 'column',
        height: '100%',
        cursor: 'pointer',
      }}>
        {/* Banner / Logo area */}
        <div style={{ position: 'relative', height: '11rem', backgroundColor: '#f3f4f6', overflow: 'hidden' }}>
          {logo ? (
            <img src={logo} alt={name} onError={(e) => { e.target.onerror = null; e.target.src = '/placeholder-restaurant.png'; }} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }} />
          ) : (
            <div style={{
              width: '100%', height: '100%',
              background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '3.5rem',
            }}>{emoji}</div>
          )}

          {/* Status badge */}
          {!isOpen && (
            <div style={{
              position: 'absolute', top: '0.75rem', left: '0.75rem',
              padding: '0.2rem 0.6rem', borderRadius: '9999px',
              backgroundColor: 'rgba(17,24,39,0.8)', color: '#fff',
              fontSize: '0.75rem', fontWeight: 600,
            }}>Closed</div>
          )}

          {/* Category count badge */}
          {categories.length > 0 && (
            <div style={{
              position: 'absolute', top: '0.75rem', right: '0.75rem',
              display: 'flex', alignItems: 'center', gap: '0.25rem',
              backgroundColor: 'rgba(255,255,255,0.92)',
              padding: '0.2rem 0.6rem', borderRadius: '9999px',
              boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
              fontSize: '0.72rem', fontWeight: 600, color: '#16a34a',
            }}>
              {categories.length} menus
            </div>
          )}
        </div>

        {/* Info */}
        <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
          <h3 style={{ fontWeight: 700, color: '#111827', fontSize: '0.95rem' }} className="line-clamp-1">{name}</h3>

          {cuisineTag && (
            <p style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '0.2rem' }} className="line-clamp-1">
              {cuisineTag}
            </p>
          )}

          {description && (
            <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.25rem', lineHeight: 1.4 }} className="line-clamp-2">
              {description}
            </p>
          )}

          {address && (
            <p style={{
              fontSize: '0.73rem', color: '#9ca3af', marginTop: '0.5rem',
              display: 'flex', alignItems: 'center', gap: '0.2rem',
            }} className="line-clamp-1">
              <svg style={{ width: '0.8rem', height: '0.8rem', flexShrink: 0 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {address}
            </p>
          )}

          {/* Status row */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            marginTop: 'auto', paddingTop: '0.75rem',
            borderTop: '1px solid #f9fafb',
          }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
              fontSize: '0.75rem', fontWeight: 600,
              color: isOpen ? '#16a34a' : '#ef4444',
            }}>
              <span style={{
                width: '0.45rem', height: '0.45rem', borderRadius: '50%',
                backgroundColor: isOpen ? '#16a34a' : '#ef4444',
                display: 'inline-block',
              }} />
              {isOpen ? 'Open Now' : 'Closed'}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
