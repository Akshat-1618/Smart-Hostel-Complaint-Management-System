import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const roleColors = {
  student: '#6c63ff',
  admin: '#ef4444',
  warden: '#f59e0b',
  staff: '#10b981',
};

const roleLabels = {
  student: 'Student',
  admin: 'Admin',
  warden: 'Warden',
  staff: 'Staff',
};

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav style={{
      background: 'rgba(15,14,23,0.9)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(108,99,255,0.2)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      padding: '0 24px',
    }}>
      <div style={{
        maxWidth: 1200,
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 64,
      }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36,
            background: 'linear-gradient(135deg, #6c63ff, #4f46e5)',
            borderRadius: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, fontWeight: 700,
          }}>S</div>
          <span style={{ fontWeight: 700, fontSize: 16, letterSpacing: '-0.3px' }}>
            SHCMS
          </span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {user ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 34, height: 34,
                  background: `${roleColors[user.role]}22`,
                  border: `2px solid ${roleColors[user.role]}44`,
                  borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, fontWeight: 700,
                  color: roleColors[user.role],
                }}>
                  {user.name[0].toUpperCase()}
                </div>
                <div style={{ lineHeight: 1.2 }}>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{user.name}</div>
                  <div style={{
                    fontSize: 11,
                    color: roleColors[user.role],
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}>{roleLabels[user.role]}</div>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="btn btn-secondary btn-sm"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}