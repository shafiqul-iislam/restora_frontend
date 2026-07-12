import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRestaurants, getCategories } from '../api/index.js';
import RestaurantCard from '../components/RestaurantCard.jsx';

const CATEGORY_EMOJIS = {
  'Burgers': '🍔', 'Pizza': '🍕', 'Sushi': '🍣', 'Biryani': '🍛',
  'Chinese': '🥡', 'Desserts': '🍰', 'Salads': '🥗', 'Sandwiches': '🥪',
  'Pasta': '🍝', 'Chicken': '🍗', 'Seafood': '🦐', 'Kebab': '🥙',
  'Breakfast': '🥞', 'Coffee': '☕', 'Juice': '🥤', 'Ice Cream': '🍦',
};

const DEFAULT_CATEGORIES = Object.entries(CATEGORY_EMOJIS).slice(0, 10).map(([name, emoji]) => ({ name, emoji }));

const SORT_OPTIONS = [
  { value: '', label: 'Recommended' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'delivery_time', label: 'Fastest Delivery' },
  { value: 'min_order', label: 'Min Order' },
];

export default function RestaurantListPage() {
  const [restaurants, setRestaurants] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('');
  const [sortBy, setSortBy] = useState('');

  const fetchRestaurants = async (query = searchQuery, cat = activeCategory, sort = sortBy) => {
    setLoading(true);
    try {
      const params = {};
      if (query) params.search = query;
      if (cat) params.category = cat;
      if (sort) params.sort = sort;
      const data = await getRestaurants(params);
      setRestaurants(data.data ?? data);
    } catch {
      setRestaurants([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get('search') || '';
    const cat = params.get('category') || '';
    setSearchQuery(q);
    setActiveCategory(cat);
    fetchRestaurants(q, cat, '');

    getCategories()
      .then(data => setCategories(data.data ?? data))
      .catch(() => setCategories([]));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchRestaurants();
  };

  const handleCategory = (name) => {
    const next = activeCategory === name ? '' : name;
    setActiveCategory(next);
    fetchRestaurants(searchQuery, next, sortBy);
  };

  const handleSort = (val) => {
    setSortBy(val);
    fetchRestaurants(searchQuery, activeCategory, val);
  };

  const displayCategories = categories.length > 0 ? categories : DEFAULT_CATEGORIES;

  const chipStyle = (active) => ({
    display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
    padding: '0.4rem 0.875rem',
    borderRadius: '9999px',
    border: active ? '2px solid #16a34a' : '1px solid #e5e7eb',
    backgroundColor: active ? '#16a34a' : '#fff',
    color: active ? '#fff' : '#374151',
    fontSize: '0.8rem', fontWeight: 500,
    cursor: 'pointer', whiteSpace: 'nowrap',
    transition: 'all 0.15s',
    boxShadow: active ? '0 2px 8px rgba(22,163,74,0.25)' : 'none',
  });

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      {/* Filter bar */}
      <div style={{
        backgroundColor: '#fff', borderBottom: '1px solid #f3f4f6',
        position: 'sticky', top: '4rem', zIndex: 30,
      }}>
        <div className="page-container" style={{ paddingTop: '1rem', paddingBottom: '1rem' }}>
          {/* Search + sort row */}
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <svg style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', width: '1rem', height: '1rem', color: '#9ca3af' }}
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search restaurants or cuisines..."
                style={{
                  width: '100%', padding: '0.625rem 1rem 0.625rem 2.25rem',
                  fontSize: '0.875rem', border: '1px solid #e5e7eb',
                  borderRadius: '0.75rem', backgroundColor: '#f9fafb',
                  outline: 'none', color: '#111827', boxSizing: 'border-box',
                }}
              />
            </div>
            <button type="submit" style={{
              padding: '0.625rem 1.25rem', backgroundColor: '#16a34a', color: '#fff',
              border: 'none', borderRadius: '0.75rem', fontWeight: 600, cursor: 'pointer',
              fontSize: '0.875rem', flexShrink: 0,
            }}>Search</button>
            <select
              value={sortBy}
              onChange={e => handleSort(e.target.value)}
              style={{
                padding: '0.625rem 0.75rem', border: '1px solid #e5e7eb',
                borderRadius: '0.75rem', fontSize: '0.875rem',
                color: '#374151', cursor: 'pointer', outline: 'none',
                backgroundColor: '#fff', flexShrink: 0,
              }}
            >
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </form>

          {/* Category chips */}
          <div className="scrollbar-hide" style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.125rem' }}>
            <button style={chipStyle(activeCategory === '')} onClick={() => handleCategory('')}>🍽️ All</button>
            {displayCategories.map(cat => (
              <button
                key={cat.name}
                style={chipStyle(activeCategory === cat.name)}
                onClick={() => handleCategory(cat.name)}
              >
                {(cat.emoji ?? CATEGORY_EMOJIS[cat.name] ?? '🍴')} {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="page-container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
        {!loading && (
          <p style={{ fontSize: '0.875rem', color: '#9ca3af', marginBottom: '1.25rem' }}>
            {restaurants.length > 0
              ? `${restaurants.length} restaurant${restaurants.length !== 1 ? 's' : ''} found`
              : 'No restaurants found'}
          </p>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} style={{ backgroundColor: '#fff', borderRadius: '1rem', overflow: 'hidden', border: '1px solid #f3f4f6' }}>
                <div className="skeleton" style={{ height: '11rem' }} />
                <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                  <div className="skeleton" style={{ height: '1rem', width: '75%' }} />
                  <div className="skeleton" style={{ height: '0.75rem', width: '50%' }} />
                  <div className="skeleton" style={{ height: '0.75rem', width: '65%' }} />
                </div>
              </div>
            ))}
          </div>
        ) : restaurants.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '5rem 1rem', textAlign: 'center' }}>
            <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🔍</div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#111827' }}>No restaurants found</h3>
            <p style={{ color: '#9ca3af', marginTop: '0.5rem', marginBottom: '1.5rem' }}>Try a different search or category</p>
            <button onClick={() => { setSearchQuery(''); setActiveCategory(''); setSortBy(''); fetchRestaurants('', '', ''); }} style={{
              padding: '0.5rem 1.5rem', backgroundColor: '#16a34a', color: '#fff',
              border: 'none', borderRadius: '9999px', cursor: 'pointer', fontWeight: 600,
            }}>
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {restaurants.map(r => <RestaurantCard key={r.id} restaurant={r} />)}
          </div>
        )}
      </div>
    </div>
  );
}
