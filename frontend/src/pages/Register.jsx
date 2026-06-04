import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', roomNumber: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.post('/api/auth/register', form);
      login(data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '90vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '40px 24px',
      background: 'radial-gradient(ellipse at center top, rgba(108,99,255,0.1) 0%, transparent 60%)',
    }}>
      <div style={{ width: '100%', maxWidth: 440 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 56, height: 56,
            background: 'linear-gradient(135deg, #6c63ff, #4f46e5)',
            borderRadius: 16, display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: 24, fontWeight: 700,
            margin: '0 auto 16px',
          }}>S</div>
          <h1 style={{ fontSize: 26, fontWeight: 700, marginBottom: 6 }}>Create account</h1>
          <p style={{ color: '#a7a5c0', fontSize: 14 }}>Register as a student to raise complaints</p>
        </div>

        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          padding: '32px',
          boxShadow: 'var(--shadow)',
        }}>
          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input name="name" className="form-input" placeholder="John Doe"
                value={form.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input name="email" type="email" className="form-input" placeholder="you@example.com"
                value={form.email} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">Room Number</label>
              <input name="roomNumber" className="form-input" placeholder="e.g. A-204"
                value={form.roomNumber} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input name="password" type="password" className="form-input" placeholder="Min. 6 characters"
                value={form.password} onChange={handleChange} required />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}
              style={{ width: '100%', padding: '13px', fontSize: 15, marginTop: 4 }}>
              {loading ? 'Creating account...' : 'Create Account →'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: 20, color: '#a7a5c0', fontSize: 14 }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#a78bfa', fontWeight: 600 }}>Sign In</Link>
        </p>
      </div>
    </div>
  );
}