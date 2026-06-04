import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await axios.post('/api/auth/login', form);
      login(data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
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
          <h1 style={{ fontSize: 26, fontWeight: 700, marginBottom: 6 }}>Welcome back</h1>
          <p style={{ color: '#a7a5c0', fontSize: 14 }}>Sign in to your SHCMS account</p>
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
              <label className="form-label">Email Address</label>
              <input
                name="email" type="email" className="form-input"
                placeholder="you@example.com"
                value={form.email} onChange={handleChange} required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                name="password" type="password" className="form-input"
                placeholder="Your password"
                value={form.password} onChange={handleChange} required
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}
              style={{ width: '100%', padding: '13px', fontSize: 15, marginTop: 4 }}>
              {loading ? 'Signing in...' : 'Sign In →'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: 20, color: '#a7a5c0', fontSize: 14 }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: '#a78bfa', fontWeight: 600 }}>Register as Student</Link>
        </p>
      </div>
    </div>
  );
}