import { Link } from 'react-router-dom';

const footerLinks = {
  Company: ['About Us', 'Careers', 'Blog', 'Press'],
  Help: ['FAQ', 'Contact Us', 'Partner With Us'],
};

export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#111827', color: '#d1d5db', marginTop: 'auto' }}>
      <div className="page-container" style={{ paddingTop: '3.5rem', paddingBottom: '3.5rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '2.5rem',
        }}>

          {/* Brand */}
          <div style={{ gridColumn: 'span 1' }}>
            <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', marginBottom: '1rem' }}>
              <div style={{
                width: '2.25rem', height: '2.25rem',
                backgroundColor: '#16a34a', borderRadius: '0.75rem',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.1rem',
              }}>🍛</div>
              <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff' }}>
                Resto<span style={{ color: '#4ade80' }}>ra</span>
              </span>
            </Link>
            <p style={{ fontSize: '0.875rem', color: '#9ca3af', lineHeight: 1.7, marginBottom: '1.25rem' }}>
              Delicious food delivered fast to your door. Order from your favourite restaurants.
            </p>
            {/* Socials */}
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {['Facebook', 'Instagram', 'Twitter'].map(s => (
                <a key={s} href="#" aria-label={s} style={{
                  width: '2rem', height: '2rem',
                  borderRadius: '9999px',
                  backgroundColor: '#1f2937',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#9ca3af', textDecoration: 'none', fontSize: '0.75rem', fontWeight: 600,
                  transition: 'background 0.2s',
                }}>
                  {s[0]}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h3 style={{ color: '#fff', fontWeight: 600, fontSize: '0.9rem', marginBottom: '1rem' }}>{section}</h3>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {links.map(link => (
                  <li key={link}>
                    <a href="#" style={{
                      fontSize: '0.875rem', color: '#9ca3af',
                      textDecoration: 'none', transition: 'color 0.15s',
                    }}
                      onMouseEnter={e => e.currentTarget.style.color = '#4ade80'}
                      onMouseLeave={e => e.currentTarget.style.color = '#9ca3af'}
                    >
                      {link}
                    </a>
                  </li>
                ))}
                {section === 'Help' && (
                  <li>
                    <Link to="/restaurants" style={{ fontSize: '0.875rem', color: '#9ca3af', textDecoration: 'none' }}>
                      Restaurants
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          ))}

          {/* App download */}
          <div>
            <h3 style={{ color: '#fff', fontWeight: 600, fontSize: '0.9rem', marginBottom: '1rem' }}>Get the App</h3>
            <p style={{ fontSize: '0.8rem', color: '#9ca3af', marginBottom: '0.75rem' }}>
              Download for the best experience
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {[{ icon: '🍎', store: 'App Store', sub: 'Download on the' }, { icon: '🤖', store: 'Google Play', sub: 'Get it on' }].map(app => (
                <a key={app.store} href="#" style={{
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                  backgroundColor: '#1f2937', borderRadius: '0.625rem',
                  padding: '0.625rem 1rem', textDecoration: 'none',
                  transition: 'background 0.2s',
                }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = '#374151'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = '#1f2937'}
                >
                  <span style={{ fontSize: '1.4rem' }}>{app.icon}</span>
                  <div>
                    <p style={{ fontSize: '0.65rem', color: '#9ca3af', marginBottom: '0.1rem' }}>{app.sub}</p>
                    <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff' }}>{app.store}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: '1px solid #1f2937',
          marginTop: '2.5rem', paddingTop: '1.5rem',
          display: 'flex', flexWrap: 'wrap',
          alignItems: 'center', justifyContent: 'space-between',
          gap: '0.75rem',
          fontSize: '0.8rem', color: '#6b7280',
        }}>
          <p>© {new Date().getFullYear()} Restora. All rights reserved.</p>
          <div style={{ display: 'flex', gap: '1.25rem' }}>
            {['Privacy Policy', 'Terms of Service'].map(l => (
              <a key={l} href="#" style={{ color: '#6b7280', textDecoration: 'none', transition: 'color 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.color = '#4ade80'}
                onMouseLeave={e => e.currentTarget.style.color = '#6b7280'}
              >{l}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
