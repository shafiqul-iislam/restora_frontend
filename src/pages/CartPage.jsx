import { useCart } from '../context/CartContext.jsx';
import { Link, useNavigate } from 'react-router-dom';

export default function CartPage() {
  const { items, removeItem, updateQty, cartTotal, cartCount, restaurantName, clearCart } = useCart();
  const navigate = useNavigate();

  const deliveryFee = items.length > 0 ? 30 : 0;
  const total = cartTotal + deliveryFee;

  if (items.length === 0) {
    return (
      <div style={{
        minHeight: '80vh', backgroundColor: '#f9fafb',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '7rem', height: '7rem', borderRadius: '9999px',
            backgroundColor: '#f0fdf4',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '3.5rem', margin: '0 auto 1.5rem',
          }}>🛒</div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827', marginBottom: '0.5rem' }}>Your cart is empty</h2>
          <p style={{ color: '#9ca3af', marginBottom: '2rem' }}>Looks like you haven't added anything yet.</p>
          <Link to="/restaurants" style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.75rem 1.75rem',
            backgroundColor: '#16a34a', color: '#fff',
            borderRadius: '9999px', textDecoration: 'none',
            fontWeight: 700, fontSize: '0.9rem',
            boxShadow: '0 4px 14px rgba(22,163,74,0.3)',
          }}>
            Browse Restaurants →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <div className="page-container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827' }}>Your Cart</h1>
            {restaurantName && <p style={{ fontSize: '0.875rem', color: '#16a34a', fontWeight: 600, marginTop: '0.25rem' }}>From: {restaurantName}</p>}
          </div>
          <button onClick={clearCart} style={{
            fontSize: '0.875rem', color: '#f87171', background: 'none',
            border: 'none', cursor: 'pointer', fontWeight: 500,
          }}>Clear Cart</button>
        </div>

        {/* Two-column layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }} className="cart-grid">
          {/* Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {items.map(item => (
              <div key={item.id} style={{
                backgroundColor: '#fff', borderRadius: '1rem',
                border: '1px solid #f3f4f6', boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
                padding: '1rem',
                display: 'flex', alignItems: 'center', gap: '1rem',
              }}>
                {item.image ? (
                  <img src={item.image} alt={item.name} style={{ width: '4rem', height: '4rem', borderRadius: '0.75rem', objectFit: 'cover', flexShrink: 0 }} />
                ) : (
                  <div style={{
                    width: '4rem', height: '4rem', borderRadius: '0.75rem',
                    backgroundColor: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.75rem', flexShrink: 0,
                  }}>🍜</div>
                )}

                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 style={{ fontWeight: 600, color: '#111827', fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</h3>
                  <p style={{ fontSize: '0.8rem', color: '#9ca3af', marginTop: '0.2rem' }}>৳{parseFloat(item.price).toFixed(0)} each</p>
                </div>

                {/* Qty */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
                  <button onClick={() => updateQty(item.id, item.quantity - 1)} style={{
                    width: '2rem', height: '2rem', borderRadius: '9999px',
                    border: '1px solid #e5e7eb', backgroundColor: '#fff', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1rem', fontWeight: 700, color: '#374151',
                  }}>−</button>
                  <span style={{ width: '1.5rem', textAlign: 'center', fontSize: '0.9rem', fontWeight: 600 }}>{item.quantity}</span>
                  <button onClick={() => updateQty(item.id, item.quantity + 1)} style={{
                    width: '2rem', height: '2rem', borderRadius: '9999px',
                    backgroundColor: '#16a34a', border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1rem', fontWeight: 700, color: '#fff',
                  }}>+</button>
                </div>

                {/* Price + remove */}
                <div style={{ textAlign: 'right', flexShrink: 0, minWidth: '4.5rem' }}>
                  <p style={{ fontWeight: 700, color: '#111827', fontSize: '0.95rem' }}>৳{(item.price * item.quantity).toFixed(0)}</p>
                  <button onClick={() => removeItem(item.id)} style={{
                    fontSize: '0.75rem', color: '#f87171', background: 'none', border: 'none',
                    cursor: 'pointer', marginTop: '0.2rem',
                  }}>Remove</button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary sidebar */}
          <div>
            <div style={{
              backgroundColor: '#fff', borderRadius: '1rem',
              border: '1px solid #f3f4f6', boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
              padding: '1.25rem', position: 'sticky', top: '5.5rem',
            }}>
              <h2 style={{ fontWeight: 700, color: '#111827', marginBottom: '1.25rem', fontSize: '1rem' }}>Order Summary</h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', fontSize: '0.875rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6b7280' }}>
                  <span>Subtotal ({cartCount} item{cartCount !== 1 ? 's' : ''})</span>
                  <span>৳{cartTotal.toFixed(0)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6b7280' }}>
                  <span>Delivery fee</span>
                  <span>৳{deliveryFee}</span>
                </div>
                <div style={{
                  display: 'flex', justifyContent: 'space-between',
                  fontWeight: 700, color: '#111827', fontSize: '1rem',
                  paddingTop: '0.75rem',
                  borderTop: '1px solid #f3f4f6', marginTop: '0.25rem',
                }}>
                  <span>Total</span>
                  <span style={{ color: '#16a34a' }}>৳{total.toFixed(0)}</span>
                </div>
              </div>

              <button
                id="proceed-to-checkout-button"
                onClick={() => navigate('/checkout')}
                style={{
                  width: '100%', padding: '0.875rem', marginTop: '1.25rem',
                  backgroundColor: '#16a34a', color: '#fff',
                  border: 'none', borderRadius: '0.75rem',
                  fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                  boxShadow: '0 4px 14px rgba(22,163,74,0.3)',
                }}
              >
                Proceed to Checkout →
              </button>

              <Link to="/restaurants" style={{
                display: 'block', textAlign: 'center',
                fontSize: '0.875rem', color: '#16a34a',
                textDecoration: 'none', marginTop: '0.875rem', fontWeight: 500,
              }}>
                + Add more items
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 1024px) {
          .cart-grid { grid-template-columns: 1fr 20rem !important; }
        }
      `}</style>
    </div>
  );
}
