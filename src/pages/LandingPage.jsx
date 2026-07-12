import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getRestaurants } from '../api/index.js';
import RestaurantCard from '../components/RestaurantCard.jsx';

const CATEGORIES = [
  { name: 'Biryani', emoji: '🍛', color: '#fef3c7' },
  { name: 'Burgers', emoji: '🍔', color: '#fee2e2' },
  { name: 'Pizza', emoji: '🍕', color: '#fce7f3' },
  { name: 'Chinese', emoji: '🥡', color: '#e0f2fe' },
  { name: 'Sushi', emoji: '🍣', color: '#f0fdf4' },
  { name: 'Desserts', emoji: '🍰', color: '#fdf4ff' },
  { name: 'Chicken', emoji: '🍗', color: '#fff7ed' },
  { name: 'Seafood', emoji: '🦐', color: '#ecfdf5' },
];

const FOOD_COLLAGE = [
  { emoji: '🍕', bg: '#fee2e2', label: 'Pizza', rotate: '-6deg', delay: '0s' },
  { emoji: '🍔', bg: '#fef3c7', label: 'Burger', rotate: '4deg', delay: '0.2s' },
  { emoji: '🍛', bg: '#f0fdf4', label: 'Biryani', rotate: '-3deg', delay: '0.4s' },
  { emoji: '🍣', bg: '#e0f2fe', label: 'Sushi', rotate: '5deg', delay: '0.1s' },
  { emoji: '🍰', bg: '#fdf4ff', label: 'Dessert', rotate: '-4deg', delay: '0.3s' },
  { emoji: '🥡', bg: '#fff7ed', label: 'Chinese', rotate: '3deg', delay: '0.5s' },
];

const STATS = [
  { value: '500+', label: 'Restaurants' },
  { value: '30 min', label: 'Avg. Delivery' },
  { value: '50k+', label: 'Happy Customers' },
];

const STEPS = [
  { icon: '📍', title: 'Choose Location', desc: 'Enter your address to find restaurants near you.' },
  { icon: '🍽️', title: 'Pick Your Food', desc: 'Browse menus and choose your favourite dishes.' },
  { icon: '🚀', title: 'Fast Delivery', desc: 'Fresh food delivered hot to your doorstep.' },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const [address, setAddress] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredRestaurants, setFeaturedRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRestaurants({ per_page: 8 })
      .then(data => setFeaturedRestaurants(data.data ?? data))
      .catch(() => setFeaturedRestaurants([]))
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/restaurants${searchQuery.trim() ? `?search=${encodeURIComponent(searchQuery.trim())}` : ''}`);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>

      {/* ── HERO ──────────────────────────────────────── */}
      <section style={{
        background: 'linear-gradient(135deg, #064e3b 0%, #065f46 35%, #047857 70%, #059669 100%)',
        minHeight: '88vh',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        position: 'relative',
      }}>
        {/* BG pattern dots */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }} />
        {/* BG blobs */}
        <div style={{ position: 'absolute', top: '-6rem', right: '-4rem', width: '28rem', height: '28rem', borderRadius: '9999px', background: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-8rem', left: '-6rem', width: '36rem', height: '36rem', borderRadius: '9999px', background: 'rgba(0,0,0,0.1)', pointerEvents: 'none' }} />

        <div className="page-container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '3rem',
            alignItems: 'center',
            paddingTop: '4rem',
            paddingBottom: '4rem',
          }} className="hero-grid">

            {/* ── LEFT CONTENT ── */}
            <div>
              {/* Promo badge */}
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                backgroundColor: 'rgba(251,191,36,0.15)',
                border: '1px solid rgba(251,191,36,0.4)',
                color: '#fbbf24',
                padding: '0.4rem 1rem', borderRadius: '9999px',
                fontSize: '0.8rem', fontWeight: 600,
                marginBottom: '1.5rem',
              }}>
                🎉 Get 50% off your first order — use code RESTORA50
              </div>

              <h1 style={{
                fontSize: 'clamp(2.2rem, 5vw, 3.5rem)',
                fontWeight: 900,
                color: '#fff',
                lineHeight: 1.15,
                marginBottom: '1.25rem',
                letterSpacing: '-0.02em',
              }}>
                Hungry? <br />
                <span style={{ color: '#6ee7b7' }}>Food at your door</span><br />
                in 30 minutes 🚀
              </h1>

              <p style={{ fontSize: '1rem', color: '#a7f3d0', marginBottom: '2rem', lineHeight: 1.7, maxWidth: '30rem' }}>
                Order from the best local restaurants. Fresh, hot, and delivered fast — right to your doorstep.
              </p>

              {/* Address input */}
              <div style={{ marginBottom: '0.875rem' }}>
                <div style={{
                  display: 'flex',
                  backgroundColor: '#fff',
                  borderRadius: '1rem',
                  overflow: 'hidden',
                  boxShadow: '0 16px 48px rgba(0,0,0,0.3)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', padding: '0 1rem', borderRight: '1px solid #e5e7eb', flexShrink: 0 }}>
                    <svg style={{ width: '1.2rem', height: '1.2rem', color: '#16a34a' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <input
                    id="hero-address-input"
                    type="text"
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    placeholder="Enter your delivery address..."
                    style={{
                      flex: 1, padding: '1rem', fontSize: '0.9rem',
                      border: 'none', outline: 'none', color: '#111827',
                      backgroundColor: 'transparent',
                    }}
                  />
                  <button
                    onClick={() => navigate('/restaurants')}
                    style={{
                      padding: '0.875rem 1.75rem',
                      backgroundColor: '#16a34a',
                      color: '#fff', border: 'none',
                      fontSize: '0.9rem', fontWeight: 700,
                      cursor: 'pointer', flexShrink: 0,
                      transition: 'background 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#15803d'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = '#16a34a'}
                  >
                    Find Food
                  </button>
                </div>
              </div>

              {/* Quick search */}
              <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '2.5rem' }}>
                <span style={{ fontSize: '0.8rem', color: '#6ee7b7', whiteSpace: 'nowrap' }}>or search:</span>
                <div style={{ position: 'relative', flex: 1, maxWidth: '22rem' }}>
                  <svg style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', width: '0.9rem', height: '0.9rem', color: 'rgba(255,255,255,0.5)' }}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    id="hero-search-input"
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Burger, pizza, biryani..."
                    style={{
                      width: '100%', padding: '0.6rem 0.75rem 0.6rem 2.25rem',
                      fontSize: '0.85rem',
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: '0.75rem', color: '#fff', outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
                <button type="submit" style={{
                  padding: '0.6rem 1rem',
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  border: '1px solid rgba(255,255,255,0.25)',
                  borderRadius: '0.75rem', color: '#fff',
                  fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer',
                }}>Search</button>
              </form>

              {/* Stats */}
              <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                {STATS.map(stat => (
                  <div key={stat.label}>
                    <p style={{ fontSize: '1.5rem', fontWeight: 900, color: '#fff', lineHeight: 1 }}>{stat.value}</p>
                    <p style={{ fontSize: '0.75rem', color: '#6ee7b7', marginTop: '0.2rem', fontWeight: 500 }}>{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* ── RIGHT: FOOD COLLAGE ── */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', minHeight: '26rem' }} className="hero-collage">
              {/* Center delivery circle */}
              <div style={{
                width: '10rem', height: '10rem', borderRadius: '9999px',
                background: 'rgba(255,255,255,0.1)',
                border: '2px solid rgba(255,255,255,0.2)',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 0 0 1.5rem rgba(255,255,255,0.04), 0 0 0 3rem rgba(255,255,255,0.02)',
                zIndex: 2, position: 'relative',
              }}>
                <span style={{ fontSize: '3.5rem' }}>🛵</span>
                <span style={{ fontSize: '0.75rem', color: '#a7f3d0', fontWeight: 600, marginTop: '0.25rem' }}>On the way!</span>
              </div>

              {/* Floating food cards */}
              {FOOD_COLLAGE.map((food, i) => {
                const angle = (i / FOOD_COLLAGE.length) * Math.PI * 2 - Math.PI / 2;
                const radius = 140;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;
                return (
                  <div key={food.label} style={{
                    position: 'absolute',
                    left: `calc(50% + ${x}px - 2.5rem)`,
                    top: `calc(50% + ${y}px - 2.5rem)`,
                    width: '5rem', height: '5rem',
                    borderRadius: '1.25rem',
                    backgroundColor: food.bg,
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
                    transform: `rotate(${food.rotate})`,
                    animation: `foodFloat 3s ease-in-out ${food.delay} infinite alternate`,
                    zIndex: 3,
                    cursor: 'default',
                  }}>
                    <span style={{ fontSize: '1.75rem' }}>{food.emoji}</span>
                    <span style={{ fontSize: '0.6rem', fontWeight: 600, color: '#374151', marginTop: '0.15rem' }}>{food.label}</span>
                  </div>
                );
              })}

              {/* Order ready badge */}
              <div style={{
                position: 'absolute', top: '1rem', right: '0',
                backgroundColor: '#fff', borderRadius: '0.875rem',
                padding: '0.625rem 0.875rem',
                boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                zIndex: 4,
                animation: 'badgeFloat 2.5s ease-in-out 0s infinite alternate',
              }}>
                <div style={{ width: '2rem', height: '2rem', borderRadius: '9999px', backgroundColor: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>✅</div>
                <div>
                  <p style={{ fontSize: '0.7rem', color: '#9ca3af', lineHeight: 1 }}>Order ready!</p>
                  <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#111827', lineHeight: 1.3 }}>Burger Combo</p>
                </div>
              </div>

              {/* Delivery time badge */}
              <div style={{
                position: 'absolute', bottom: '1rem', left: '0',
                backgroundColor: '#16a34a', borderRadius: '0.875rem',
                padding: '0.625rem 0.875rem',
                boxShadow: '0 8px 24px rgba(22,163,74,0.35)',
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                zIndex: 4,
                animation: 'badgeFloat 2.5s ease-in-out 1.2s infinite alternate',
              }}>
                <span style={{ fontSize: '1.25rem' }}>⚡</span>
                <div>
                  <p style={{ fontSize: '0.7rem', color: '#a7f3d0', lineHeight: 1 }}>Estimated time</p>
                  <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff', lineHeight: 1.3 }}>25–35 min</p>
                </div>
              </div>

              {/* Rating badge */}
              <div style={{
                position: 'absolute', top: '40%', right: '-0.5rem',
                backgroundColor: '#fff', borderRadius: '0.875rem',
                padding: '0.5rem 0.75rem',
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                display: 'flex', alignItems: 'center', gap: '0.375rem',
                zIndex: 4,
                animation: 'badgeFloat 2.5s ease-in-out 0.6s infinite alternate',
              }}>
                <span style={{ fontSize: '1rem' }}>⭐</span>
                <div>
                  <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#111827' }}>4.9</p>
                  <p style={{ fontSize: '0.65rem', color: '#9ca3af' }}>Top Rated</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave bottom */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
          <svg viewBox="0 0 1440 60" style={{ display: 'block', width: '100%' }} preserveAspectRatio="none">
            <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" fill="#f9fafb" />
          </svg>
        </div>
      </section>

      {/* ── CATEGORY STRIP ────────────────────────────── */}
      <section style={{ backgroundColor: '#fff', borderBottom: '1px solid #f3f4f6', paddingTop: '2rem', paddingBottom: '1.5rem' }}>
        <div className="page-container">
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#111827', marginBottom: '1.25rem' }}>What are you craving? 😋</h2>
          <div className="scrollbar-hide" style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
            {CATEGORIES.map(cat => (
              <Link key={cat.name} to={`/restaurants?category=${encodeURIComponent(cat.name)}`}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.625rem', minWidth: '4.5rem', textDecoration: 'none' }}>
                <div style={{
                  width: '4rem', height: '4rem', borderRadius: '1.25rem',
                  backgroundColor: cat.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.75rem',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.12)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)'; }}
                >{cat.emoji}</div>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#374151', whiteSpace: 'nowrap' }}>{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROMO BANNERS ─────────────────────────────── */}
      <section className="page-container" style={{ paddingTop: '2.5rem', paddingBottom: '0.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }} className="promo-grid">
          <div style={{
            background: 'linear-gradient(135deg, #064e3b, #059669)',
            borderRadius: '1.25rem', padding: '1.5rem 2rem',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            overflow: 'hidden', position: 'relative',
          }}>
            <div style={{ position: 'absolute', right: '-1rem', top: '-1rem', fontSize: '6rem', opacity: 0.15, transform: 'rotate(15deg)' }}>🍔</div>
            <div style={{ position: 'relative' }}>
              <div style={{ fontSize: '0.75rem', color: '#6ee7b7', fontWeight: 600, marginBottom: '0.375rem' }}>LIMITED TIME</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#fff', marginBottom: '0.75rem' }}>50% OFF First Order</div>
              <Link to="/register" style={{
                display: 'inline-block', padding: '0.5rem 1.25rem',
                backgroundColor: '#fff', color: '#065f46',
                borderRadius: '9999px', textDecoration: 'none',
                fontWeight: 700, fontSize: '0.85rem',
              }}>Claim Now →</Link>
            </div>
          </div>
          <div style={{
            background: 'linear-gradient(135deg, #92400e, #d97706)',
            borderRadius: '1.25rem', padding: '1.5rem 2rem',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            overflow: 'hidden', position: 'relative',
          }}>
            <div style={{ position: 'absolute', right: '-1rem', top: '-1rem', fontSize: '6rem', opacity: 0.15, transform: 'rotate(-10deg)' }}>🚀</div>
            <div style={{ position: 'relative' }}>
              <div style={{ fontSize: '0.75rem', color: '#fde68a', fontWeight: 600, marginBottom: '0.375rem' }}>FREE DELIVERY</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#fff', marginBottom: '0.75rem' }}>Orders over ৳500</div>
              <Link to="/restaurants" style={{
                display: 'inline-block', padding: '0.5rem 1.25rem',
                backgroundColor: '#fff', color: '#92400e',
                borderRadius: '9999px', textDecoration: 'none',
                fontWeight: 700, fontSize: '0.85rem',
              }}>Order Now →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURED RESTAURANTS ──────────────────────── */}
      <section className="page-container" style={{ paddingTop: '2.5rem', paddingBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#111827' }}>Featured Restaurants 🔥</h2>
            <p style={{ fontSize: '0.875rem', color: '#9ca3af', marginTop: '0.25rem' }}>Top picks near you</p>
          </div>
          <Link to="/restaurants" style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
            fontSize: '0.875rem', fontWeight: 700, color: '#16a34a', textDecoration: 'none',
          }}>View all →</Link>
        </div>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.25rem' }}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} style={{ backgroundColor: '#fff', borderRadius: '1rem', overflow: 'hidden', border: '1px solid #f3f4f6' }}>
                <div className="skeleton" style={{ height: '11rem' }} />
                <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                  <div className="skeleton" style={{ height: '1rem', width: '70%' }} />
                  <div className="skeleton" style={{ height: '0.75rem', width: '50%' }} />
                </div>
              </div>
            ))}
          </div>
        ) : featuredRestaurants.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', backgroundColor: '#fff', borderRadius: '1.25rem', border: '1px solid #f3f4f6' }}>
            <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>🍽️</div>
            <p style={{ color: '#9ca3af' }}>No restaurants yet. Check back soon!</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.25rem' }}>
            {featuredRestaurants.map(r => <RestaurantCard key={r.id} restaurant={r} />)}
          </div>
        )}
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────── */}
      <section style={{ backgroundColor: '#fff', paddingTop: '3.5rem', paddingBottom: '3.5rem' }}>
        <div className="page-container">
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', backgroundColor: '#f0fdf4', color: '#16a34a', padding: '0.3rem 0.875rem', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.875rem' }}>
              Simple & Fast
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111827' }}>Order in 3 easy steps</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', position: 'relative' }}>
            {STEPS.map((step, i) => (
              <div key={i} style={{ textAlign: 'center', padding: '2rem 1.25rem', borderRadius: '1.25rem', border: '1px solid #f3f4f6', backgroundColor: '#fff', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '-0.5rem', right: '-0.5rem', fontSize: '5rem', opacity: 0.04, fontWeight: 900, lineHeight: 1 }}>{i + 1}</div>
                <div style={{
                  width: '4.5rem', height: '4.5rem', borderRadius: '1.25rem',
                  background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '2rem', margin: '0 auto 1.25rem',
                  boxShadow: '0 4px 14px rgba(22,163,74,0.15)',
                }}>{step.icon}</div>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  width: '1.75rem', height: '1.75rem', borderRadius: '9999px',
                  backgroundColor: '#16a34a', color: '#fff',
                  fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.875rem',
                }}>{i + 1}</div>
                <h3 style={{ fontWeight: 700, color: '#111827', marginBottom: '0.5rem', fontSize: '1rem' }}>{step.title}</h3>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: 1.6 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ────────────────────────────────── */}
      <section className="page-container" style={{ paddingTop: '2.5rem', paddingBottom: '3rem' }}>
        <div style={{
          background: 'linear-gradient(135deg, #064e3b 0%, #059669 100%)',
          borderRadius: '1.5rem', padding: 'clamp(2rem, 5vw, 3rem)',
          display: 'flex', flexWrap: 'wrap', alignItems: 'center',
          justifyContent: 'space-between', gap: '1.5rem',
          overflow: 'hidden', position: 'relative',
        }}>
          <div style={{ position: 'absolute', right: '-2rem', top: '-2rem', fontSize: '12rem', opacity: 0.06, lineHeight: 1 }}>🛵</div>
          <div style={{ position: 'relative' }}>
            <h2 style={{ fontSize: 'clamp(1.3rem, 3vw, 1.875rem)', fontWeight: 900, color: '#fff', marginBottom: '0.5rem' }}>
              Taste the difference today 🍔
            </h2>
            <p style={{ color: '#a7f3d0', fontSize: '0.9rem' }}>
              Browse 500+ restaurants. Fast delivery. Great prices.
            </p>
          </div>
          <Link to="/restaurants" style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.875rem 2rem',
            backgroundColor: '#fff', color: '#065f46',
            fontWeight: 800, borderRadius: '9999px',
            textDecoration: 'none', fontSize: '0.95rem',
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
            flexShrink: 0,
          }}>
            🍽️ Order Now
          </Link>
        </div>
      </section>

      <style>{`
        @keyframes foodFloat {
          from { transform: translateY(0px) rotate(var(--r, 0deg)); }
          to   { transform: translateY(-10px) rotate(var(--r, 0deg)); }
        }
        @keyframes badgeFloat {
          from { transform: translateY(0px); }
          to   { transform: translateY(-6px); }
        }
        @media (min-width: 900px) {
          .hero-grid { grid-template-columns: 1fr 1fr !important; }
          .promo-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 899px) {
          .hero-collage { display: none !important; }
        }
      `}</style>
    </div>
  );
}
