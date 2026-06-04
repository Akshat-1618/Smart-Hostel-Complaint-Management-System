import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const features = [
  { icon: '📋', title: 'Smart Complaint Tracking', desc: 'Students can raise, track, and monitor complaints in real-time with status updates.' },
  { icon: '🔐', title: 'Role-Based Access', desc: 'Strict role control for Students, Wardens, Staff, and Admins with JWT authentication.' },
  { icon: '⚡', title: 'Instant Assignment', desc: 'Wardens can instantly assign complaints to maintenance staff with one click.' },
  { icon: '📊', title: 'Status Dashboard', desc: 'Live dashboards for each role showing all relevant complaints and analytics.' },
  { icon: '🔔', title: 'Priority System', desc: 'Categorize complaints by priority — Low, Medium, High — for efficient resolution.' },
  { icon: '🛡️', title: 'Secure & Reliable', desc: 'Bcrypt password hashing and JWT tokens keep your data safe and sessions secure.' },
];

const flow = [
  { step: '01', label: 'Student raises complaint', color: '#6c63ff' },
  { step: '02', label: 'Warden reviews & assigns to staff', color: '#f59e0b' },
  { step: '03', label: 'Staff resolves the issue', color: '#10b981' },
  { step: '04', label: 'Student sees real-time update', color: '#06b6d4' },
];

export default function Landing() {
  const { user } = useAuth();

  return (
    <div>
      {/* Hero */}
      <section style={{
        minHeight: '88vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '60px 24px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Background glow */}
        <div style={{
          position: 'absolute',
          top: '10%', left: '50%',
          transform: 'translateX(-50%)',
          width: 600, height: 600,
          background: 'radial-gradient(circle, rgba(108,99,255,0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: 720, position: 'relative' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(108,99,255,0.12)',
            border: '1px solid rgba(108,99,255,0.3)',
            borderRadius: 20, padding: '6px 16px',
            fontSize: 13, fontWeight: 600, color: '#a78bfa',
            marginBottom: 28,
          }}>
            🏠 Smart Hostel Management System
          </div>

          <h1 style={{
            fontSize: 'clamp(36px, 6vw, 64px)',
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: '-1.5px',
            marginBottom: 24,
            background: 'linear-gradient(135deg, #fff 40%, #a78bfa)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Manage Hostel Complaints<br />with Precision
          </h1>

          <p style={{
            fontSize: 18, color: '#a7a5c0', lineHeight: 1.7,
            marginBottom: 40, maxWidth: 560, margin: '0 auto 40px',
          }}>
            A unified platform for students, wardens, and maintenance staff to raise, 
            assign, and resolve hostel complaints seamlessly.
          </p>

          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            {user ? (
              <Link to="/dashboard" className="btn btn-primary" style={{ padding: '14px 32px', fontSize: 16 }}>
                Go to Dashboard →
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary" style={{ padding: '14px 32px', fontSize: 16 }}>
                  Get Started Free →
                </Link>
                <Link to="/login" className="btn btn-secondary" style={{ padding: '14px 32px', fontSize: 16 }}>
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Workflow */}
      <section style={{ padding: '80px 24px', background: 'rgba(108,99,255,0.03)' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: 32, fontWeight: 700, marginBottom: 12 }}>
            How It Works
          </h2>
          <p style={{ textAlign: 'center', color: '#a7a5c0', marginBottom: 48 }}>
            Four simple steps from complaint to resolution
          </p>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
            {flow.map((item, i) => (
              <div key={i} style={{
                flex: '1 1 200px', maxWidth: 220,
                background: 'var(--bg-card)',
                border: `1px solid ${item.color}33`,
                borderRadius: 'var(--radius)',
                padding: '28px 20px',
                textAlign: 'center',
                position: 'relative',
                transition: 'var(--transition)',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = `0 12px 40px ${item.color}30`; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
              >
                <div style={{
                  fontSize: 36, fontWeight: 700,
                  fontFamily: 'var(--mono)',
                  color: item.color,
                  marginBottom: 12,
                  opacity: 0.8,
                }}>{item.step}</div>
                <div style={{ fontSize: 14, fontWeight: 500, lineHeight: 1.5 }}>{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: 32, fontWeight: 700, marginBottom: 12 }}>
            Everything You Need
          </h2>
          <p style={{ textAlign: 'center', color: '#a7a5c0', marginBottom: 48 }}>
            Built for hostel administration teams of all sizes
          </p>
          <div className="grid-3">
            {features.map((f, i) => (
              <div key={i} className="card" style={{ cursor: 'default' }}>
                <div style={{ fontSize: 32, marginBottom: 16 }}>{f.icon}</div>
                <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: '#a7a5c0', lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{
        padding: '80px 24px',
        textAlign: 'center',
        background: 'linear-gradient(135deg, rgba(108,99,255,0.1), rgba(6,182,212,0.05))',
        borderTop: '1px solid var(--border)',
      }}>
        <h2 style={{ fontSize: 32, fontWeight: 700, marginBottom: 16 }}>
          Ready to Streamline Your Hostel?
        </h2>
        <p style={{ color: '#a7a5c0', marginBottom: 32, fontSize: 16 }}>
          Join students and wardens already using SHCMS for hassle-free complaint management.
        </p>
        <Link to="/register" className="btn btn-primary" style={{ padding: '14px 36px', fontSize: 16 }}>
          Start for Free →
        </Link>
      </section>

      {/* Footer */}
      <footer style={{
        textAlign: 'center', padding: '24px',
        color: '#a7a5c0', fontSize: 13,
        borderTop: '1px solid var(--border)',
      }}>
        © 2024 SHCMS — Smart Hostel Complaint Management System
      </footer>
    </div>
  );
}