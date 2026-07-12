import { useCart } from '../context/CartContext.jsx';
import { useNavigate } from 'react-router-dom';

export default function CartDrawer({ isOpen, onClose }) {
  const { items, cartTotal, cartCount, removeItem, updateQty, restaurantName, clearCart } = useCart();
  const navigate = useNavigate();

  const deliveryFee = items.length > 0 ? 30 : 0;
  const total = cartTotal + deliveryFee;

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed', inset: 0,
            backgroundColor: 'rgba(0,0,0,0.4)',
            backdropFilter: 'blur(3px)',
            zIndex: 50,
          }}
        />
      )}

      {/* Drawer panel */}
      <div style={{
        position: 'fixed', right: 0, top: 0, height: '100%',
        width: '100%', maxWidth: '22rem',
        backgroundColor: '#fff',
        zIndex: 51,
        boxShadow: '-4px 0 32px rgba(0,0,0,0.15)',
        display: 'flex', flexDirection: 'column',
        transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.3s ease',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '1rem 1.25rem',
          borderBottom: '1px solid #f3f4f6',
        }}>
          <div>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#111827' }}>Your Cart</h2>
            {restaurantName && (
              <p style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 600, marginTop: '0.1rem' }}>{restaurantName}</p>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {items.length > 0 && (
              <button onClick={clearCart} style={{ fontSize: '0.8rem', color: '#f87171', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
                Clear
              </button>
            )}
            <button
              id="close-cart-button"
              onClick={onClose}
              aria-label="Close cart"
              style={{
                padding: '0.375rem', borderRadius: '9999px',
                background: 'none', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <svg style={{ width: '1.25rem', height: '1.25rem', color: '#6b7280' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 1.25rem' }}>
          {items.length === 0 ? (
            <div style={{
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              height: '100%', gap: '1rem', textAlign: 'center',
            }}>
              <div style={{
                width: '5rem', height: '5rem', borderRadius: '9999px',
                backgroundColor: '#f3f4f6',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '2.5rem',
              }}>🛒</div>
              <div>
                <p style={{ fontWeight: 600, color: '#111827' }}>Your cart is empty</p>
                <p style={{ fontSize: '0.875rem', color: '#9ca3af', marginTop: '0.25rem' }}>Add items from a restaurant to get started</p>
              </div>
              <button onClick={onClose} style={{
                marginTop: '0.5rem', padding: '0.5rem 1.25rem',
                backgroundColor: '#16a34a', color: '#fff',
                borderRadius: '9999px', border: 'none', cursor: 'pointer',
                fontSize: '0.875rem', fontWeight: 600,
              }}>
                Browse Restaurants
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {items.map(item => (
                <div key={item.id} style={{
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                  padding: '0.75rem', backgroundColor: '#f9fafb', borderRadius: '0.75rem',
                }}>
                  {item.image ? (
                    <img src={item.image} alt={item.name} style={{ width: '3.5rem', height: '3.5rem', borderRadius: '0.5rem', objectFit: 'cover', flexShrink: 0 }} />
                  ) : (
                    <div style={{
                      width: '3.5rem', height: '3.5rem', borderRadius: '0.5rem',
                      backgroundColor: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '1.5rem', flexShrink: 0,
                    }}>🍽️</div>
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</p>
                    <p style={{ fontSize: '0.875rem', color: '#16a34a', fontWeight: 700 }}>৳{(item.price * item.quantity).toFixed(0)}</p>
                  </div>
                  {/* Qty controls */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', flexShrink: 0 }}>
                    <button onClick={() => updateQty(item.id, item.quantity - 1)} style={{
                      width: '1.75rem', height: '1.75rem', borderRadius: '9999px',
                      backgroundColor: '#fff', border: '1px solid #e5e7eb', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '1rem', fontWeight: 700, color: '#374151',
                    }}>−</button>
                    <span style={{ width: '1.5rem', textAlign: 'center', fontSize: '0.875rem', fontWeight: 600 }}>{item.quantity}</span>
                    <button onClick={() => updateQty(item.id, item.quantity + 1)} style={{
                      width: '1.75rem', height: '1.75rem', borderRadius: '9999px',
                      backgroundColor: '#16a34a', border: 'none', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '1rem', fontWeight: 700, color: '#fff',
                    }}>+</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div style={{ borderTop: '1px solid #f3f4f6', padding: '1rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6b7280' }}>
                <span>Subtotal ({cartCount} items)</span>
                <span>৳{cartTotal.toFixed(0)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6b7280' }}>
                <span>Delivery fee</span>
                <span>৳{deliveryFee}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: '#111827', fontSize: '1rem', paddingTop: '0.5rem', borderTop: '1px solid #f3f4f6', marginTop: '0.25rem' }}>
                <span>Total</span>
                <span style={{ color: '#16a34a' }}>৳{total.toFixed(0)}</span>
              </div>
            </div>
            <button
              id="checkout-from-drawer-button"
              onClick={handleCheckout}
              style={{
                width: '100%', padding: '0.875rem',
                backgroundColor: '#16a34a', color: '#fff',
                border: 'none', borderRadius: '0.75rem',
                fontWeight: 700, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                fontSize: '0.9rem',
                boxShadow: '0 4px 12px rgba(22,163,74,0.3)',
              }}
            >
              Proceed to Checkout
              <svg style={{ width: '1rem', height: '1rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </>
  );
}
