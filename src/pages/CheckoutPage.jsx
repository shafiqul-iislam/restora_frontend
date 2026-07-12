import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { placeOrder } from '../api/index.js';

const PAYMENT_METHODS = [
  { id: 'cash_on_delivery', label: 'Cash on Delivery', icon: '💵' },
  { id: 'card', label: 'Credit / Debit Card', icon: '💳' },
  { id: 'mobile_banking', label: 'Mobile Banking (bKash/Nagad)', icon: '📱' },
];

const inputStyle = {
  width: '100%',
  padding: '0.7rem 1rem',
  fontSize: '0.875rem',
  border: '1.5px solid #e5e7eb',
  borderRadius: '0.75rem',
  backgroundColor: '#f9fafb',
  outline: 'none',
  color: '#111827',
  boxSizing: 'border-box',
};

export default function CheckoutPage() {
  const { items, cartTotal, cartCount, restaurantId, clearCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: user?.name ?? '',
    phone: user?.phone ?? '',
    address: '',
    note: '',
    payment_method: 'cash_on_delivery',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const deliveryFee = items.length > 0 ? 30 : 0;
  const total = cartTotal + deliveryFee;

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.address.trim()) { setError('Please enter a delivery address.'); return; }
    setSubmitting(true);
    setError('');
    try {
      await placeOrder({
        restaurant_id: restaurantId,
        delivery_address: form.address,
        delivery_name: form.name,
        delivery_phone: form.phone,
        note: form.note,
        payment_method: form.payment_method,
        items: items.map(i => ({ menu_item_id: i.id, quantity: i.quantity, price: i.price })),
      });
      clearCart();
      setSuccess(true);
    } catch (err) {
      setError(err?.message ?? 'Failed to place order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0 && !success) {
    return (
      <div style={{ minHeight: '80vh', backgroundColor: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🛒</div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', marginBottom: '0.5rem' }}>Cart is empty</h2>
          <Link to="/restaurants" style={{ color: '#16a34a', fontWeight: 500, textDecoration: 'none' }}>Browse restaurants</Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div style={{ minHeight: '80vh', backgroundColor: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ textAlign: 'center', maxWidth: '22rem' }}>
          <div style={{
            width: '6rem', height: '6rem', borderRadius: '9999px',
            backgroundColor: '#f0fdf4',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '3rem', margin: '0 auto 1.5rem',
            animation: 'bounce 1s ease infinite',
          }}>🎉</div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827', marginBottom: '0.75rem' }}>Order Placed!</h2>
          <p style={{ color: '#9ca3af', lineHeight: 1.6, marginBottom: '2rem' }}>
            Your order has been placed successfully. You'll receive a confirmation shortly.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <Link to="/" style={{
              display: 'block', padding: '0.875rem',
              backgroundColor: '#16a34a', color: '#fff',
              borderRadius: '0.75rem', textDecoration: 'none',
              fontWeight: 700, textAlign: 'center',
            }}>Back to Home</Link>
            <Link to="/restaurants" style={{
              display: 'block', padding: '0.875rem',
              border: '2px solid #16a34a', color: '#16a34a',
              borderRadius: '0.75rem', textDecoration: 'none',
              fontWeight: 700, textAlign: 'center',
            }}>Order Again</Link>
          </div>
        </div>
        <style>{`@keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }`}</style>
      </div>
    );
  }

  const labelStyle = { display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.4rem' };
  const sectionStyle = { backgroundColor: '#fff', borderRadius: '1rem', border: '1px solid #f3f4f6', boxShadow: '0 1px 4px rgba(0,0,0,0.05)', padding: '1.25rem', marginBottom: '1.25rem' };
  const stepBadge = (n) => ({
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    width: '1.5rem', height: '1.5rem', borderRadius: '9999px',
    backgroundColor: '#16a34a', color: '#fff', fontSize: '0.75rem', fontWeight: 700,
    marginRight: '0.5rem', flexShrink: 0,
  });

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <div className="page-container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827', marginBottom: '0.375rem' }}>Checkout</h1>
        <p style={{ fontSize: '0.875rem', color: '#9ca3af', marginBottom: '1.5rem' }}>Complete your order details below</p>

        {!isAuthenticated && (
          <div style={{
            padding: '1rem', backgroundColor: '#fffbeb', border: '1px solid #fde68a',
            borderRadius: '0.75rem', marginBottom: '1.25rem',
            display: 'flex', gap: '0.75rem', alignItems: 'flex-start',
            fontSize: '0.875rem', color: '#92400e',
          }}>
            <span>⚠️</span>
            <p>You're not logged in. <Link to="/login?redirect=/checkout" style={{ fontWeight: 600, color: '#d97706' }}>Login</Link> to track your orders, or continue as guest.</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.25rem' }} className="checkout-grid">

            {/* Left: Delivery + Payment */}
            <div>
              {/* Delivery info */}
              <div style={sectionStyle}>
                <h2 style={{ fontWeight: 700, color: '#111827', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', fontSize: '1rem' }}>
                  <span style={stepBadge(1)}>1</span> Delivery Information
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
                  <div>
                    <label htmlFor="checkout-name" style={labelStyle}>Full Name</label>
                    <input id="checkout-name" name="name" type="text" value={form.name} onChange={handleChange}
                      placeholder="John Doe" required style={inputStyle}
                      onFocus={e => e.target.style.borderColor = '#16a34a'}
                      onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
                  </div>
                  <div>
                    <label htmlFor="checkout-phone" style={labelStyle}>Phone</label>
                    <input id="checkout-phone" name="phone" type="tel" value={form.phone} onChange={handleChange}
                      placeholder="+880 1XXX-XXXXXX" required style={inputStyle}
                      onFocus={e => e.target.style.borderColor = '#16a34a'}
                      onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label htmlFor="checkout-address" style={labelStyle}>Delivery Address *</label>
                    <textarea id="checkout-address" name="address" value={form.address} onChange={handleChange}
                      rows={3} placeholder="Enter your full delivery address..." required
                      style={{ ...inputStyle, resize: 'none', lineHeight: 1.5 }}
                      onFocus={e => e.target.style.borderColor = '#16a34a'}
                      onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label htmlFor="checkout-note" style={labelStyle}>Order Note (optional)</label>
                    <input id="checkout-note" name="note" type="text" value={form.note} onChange={handleChange}
                      placeholder="Any special instructions..." style={inputStyle}
                      onFocus={e => e.target.style.borderColor = '#16a34a'}
                      onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
                  </div>
                </div>
              </div>

              {/* Payment */}
              <div style={sectionStyle}>
                <h2 style={{ fontWeight: 700, color: '#111827', marginBottom: '1rem', display: 'flex', alignItems: 'center', fontSize: '1rem' }}>
                  <span style={stepBadge(2)}>2</span> Payment Method
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                  {PAYMENT_METHODS.map(method => (
                    <label key={method.id} style={{
                      display: 'flex', alignItems: 'center', gap: '0.75rem',
                      padding: '1rem', borderRadius: '0.75rem',
                      border: `2px solid ${form.payment_method === method.id ? '#16a34a' : '#e5e7eb'}`,
                      backgroundColor: form.payment_method === method.id ? '#f0fdf4' : '#fff',
                      cursor: 'pointer', transition: 'all 0.15s',
                    }}>
                      <input type="radio" name="payment_method" value={method.id}
                        checked={form.payment_method === method.id}
                        onChange={handleChange}
                        style={{ accentColor: '#16a34a' }} />
                      <span style={{ fontSize: '1.25rem' }}>{method.icon}</span>
                      <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#111827' }}>{method.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Summary */}
            <div>
              <div style={{ backgroundColor: '#fff', borderRadius: '1rem', border: '1px solid #f3f4f6', boxShadow: '0 1px 4px rgba(0,0,0,0.05)', padding: '1.25rem', position: 'sticky', top: '5.5rem' }}>
                <h2 style={{ fontWeight: 700, color: '#111827', marginBottom: '1rem', display: 'flex', alignItems: 'center', fontSize: '1rem' }}>
                  <span style={stepBadge(3)}>3</span> Order Summary
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '10rem', overflowY: 'auto', marginBottom: '0.75rem' }}>
                  {items.map(item => (
                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: 0 }}>
                        <span style={{
                          width: '1.25rem', height: '1.25rem', borderRadius: '9999px',
                          backgroundColor: '#f0fdf4', color: '#16a34a',
                          fontSize: '0.7rem', fontWeight: 700, flexShrink: 0,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>{item.quantity}</span>
                        <span style={{ color: '#374151', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</span>
                      </div>
                      <span style={{ fontWeight: 600, flexShrink: 0, marginLeft: '0.5rem' }}>৳{(item.price * item.quantity).toFixed(0)}</span>
                    </div>
                  ))}
                </div>

                <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: '0.875rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6b7280' }}>
                    <span>Subtotal ({cartCount} items)</span><span>৳{cartTotal.toFixed(0)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6b7280' }}>
                    <span>Delivery fee</span><span>৳{deliveryFee}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: '#111827', fontSize: '1rem', paddingTop: '0.625rem', borderTop: '1px solid #f3f4f6', marginTop: '0.25rem' }}>
                    <span>Total</span><span style={{ color: '#16a34a' }}>৳{total.toFixed(0)}</span>
                  </div>
                </div>

                {error && (
                  <div style={{ marginTop: '0.875rem', padding: '0.75rem', backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '0.625rem', fontSize: '0.8rem', color: '#dc2626' }}>
                    {error}
                  </div>
                )}

                <button
                  id="place-order-button"
                  type="submit"
                  disabled={submitting}
                  style={{
                    width: '100%', padding: '0.875rem', marginTop: '1rem',
                    backgroundColor: submitting ? '#86efac' : '#16a34a',
                    color: '#fff', border: 'none', borderRadius: '0.75rem',
                    fontWeight: 700, cursor: submitting ? 'not-allowed' : 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                    fontSize: '0.9rem',
                    boxShadow: '0 4px 14px rgba(22,163,74,0.3)',
                  }}
                >
                  {submitting ? (
                    <>
                      <svg style={{ width: '1rem', height: '1rem', animation: 'spin 1s linear infinite' }} fill="none" viewBox="0 0 24 24">
                        <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      Placing Order...
                    </>
                  ) : '✓ Place Order'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      <style>{`
        @media (min-width: 1024px) { .checkout-grid { grid-template-columns: 1fr 22rem !important; } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
