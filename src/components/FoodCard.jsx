import { useState } from 'react';
import { useCart } from '../context/CartContext.jsx';

export default function FoodCard({ item, restaurantId, restaurantName }) {
  const { addItem, items, updateQty } = useCart();
  const [adding, setAdding] = useState(false);

  const cartItem = items.find(i => i.id === item.id);
  const qty = cartItem?.quantity ?? 0;

  const handleAdd = () => {
    setAdding(true);
    addItem({
      id: item.id,
      name: item.name,
      price: parseFloat(item.price),
      image: item.image,
      restaurant_id: restaurantId,
      restaurant_name: restaurantName,
    });
    setTimeout(() => setAdding(false), 500);
  };

  return (
    <div style={{
      backgroundColor: '#fff',
      borderRadius: '1rem',
      border: '1px solid #f3f4f6',
      boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
      display: 'flex',
      gap: '1rem',
      padding: '1rem',
      transition: 'box-shadow 0.2s',
    }}>
      {/* Image */}
      <div style={{ position: 'relative', width: '6rem', height: '6rem', flexShrink: 0, borderRadius: '0.75rem', overflow: 'hidden', backgroundColor: '#f0fdf4' }}>
        {item.image ? (
          <img src={item.image} alt={item.name} onError={(e) => { e.target.onerror = null; e.target.src = '/placeholder-food.png'; }} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem' }}>🍜</div>
        )}
        {item.is_veg && (
          <div style={{
            position: 'absolute', top: '0.25rem', left: '0.25rem',
            width: '1rem', height: '1rem',
            border: '2px solid #16a34a', borderRadius: '0.2rem',
            backgroundColor: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{ width: '0.375rem', height: '0.375rem', borderRadius: '9999px', backgroundColor: '#16a34a' }} />
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <h4 style={{ fontWeight: 600, color: '#111827', fontSize: '0.9rem' }} className="line-clamp-1">{item.name}</h4>
          {item.description && (
            <p style={{ fontSize: '0.8rem', color: '#9ca3af', marginTop: '0.25rem', lineHeight: 1.5 }} className="line-clamp-2">
              {item.description}
            </p>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.75rem' }}>
          <span style={{ fontSize: '1rem', fontWeight: 700, color: '#16a34a' }}>৳{parseFloat(item.price).toFixed(0)}</span>

          {qty === 0 ? (
            <button
              id={`add-to-cart-${item.id}`}
              onClick={handleAdd}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.375rem',
                padding: '0.375rem 1rem',
                borderRadius: '9999px',
                border: 'none', cursor: 'pointer',
                fontSize: '0.875rem', fontWeight: 600,
                backgroundColor: adding ? '#dcfce7' : '#16a34a',
                color: adding ? '#16a34a' : '#fff',
                transition: 'all 0.2s',
                transform: adding ? 'scale(0.95)' : 'scale(1)',
              }}
            >
              {adding ? '✓ Added' : '+ Add'}
            </button>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button
                onClick={() => updateQty(item.id, qty - 1)}
                style={{
                  width: '1.75rem', height: '1.75rem', borderRadius: '9999px',
                  backgroundColor: '#f0fdf4', color: '#15803d',
                  border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '1rem',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >−</button>
              <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#111827', width: '1.25rem', textAlign: 'center' }}>{qty}</span>
              <button
                onClick={() => updateQty(item.id, qty + 1)}
                style={{
                  width: '1.75rem', height: '1.75rem', borderRadius: '9999px',
                  backgroundColor: '#16a34a', color: '#fff',
                  border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '1rem',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >+</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
