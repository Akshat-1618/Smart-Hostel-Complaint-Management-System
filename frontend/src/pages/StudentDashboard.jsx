import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import ComplaintCard from '../components/ComplaintCard';

const categories = ['Electrical', 'Plumbing', 'Furniture', 'Cleanliness', 'Internet', 'Other'];

export default function StudentDashboard() {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState('All');
  const [form, setForm] = useState({ title: '', description: '', category: 'Electrical', priority: 'Medium' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchComplaints = async () => {
    try {
      const { data } = await axios.get('/api/complaints');
      setComplaints(data);
    } catch (err) {
      setError('Failed to load complaints');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchComplaints(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const { data } = await axios.post('/api/complaints', form);
      setComplaints([data, ...complaints]);
      setSuccess('Complaint submitted successfully!');
      setShowModal(false);
      setForm({ title: '', description: '', category: 'Electrical', priority: 'Medium' });
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit complaint');
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = filter === 'All' ? complaints : complaints.filter(c => c.status === filter);

  const stats = {
    total: complaints.length,
    pending: complaints.filter(c => c.status === 'Pending').length,
    inProgress: complaints.filter(c => c.status === 'In Progress').length,
    resolved: complaints.filter(c => c.status === 'Resolved').length,
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">My Complaints</h1>
          <p style={{ color: '#a7a5c0', marginTop: 4 }}>
            Welcome back, {user?.name} · Room {user?.roomNumber || 'N/A'}
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          + New Complaint
        </button>
      </div>

      {success && <div className="alert alert-success">{success}</div>}

      {/* Stats */}
      <div className="grid-4" style={{ marginBottom: 32 }}>
        {[
          { label: 'Total', value: stats.total, color: '#6c63ff' },
          { label: 'Pending', value: stats.pending, color: '#f59e0b' },
          { label: 'In Progress', value: stats.inProgress, color: '#06b6d4' },
          { label: 'Resolved', value: stats.resolved, color: '#10b981' },
        ].map((s, i) => (
          <div key={i} className="stat-card">
            <div className="stat-number" style={{ color: s.color }}>{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap' }}>
        {['All', 'Pending', 'In Progress', 'Resolved'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-secondary'}`}>
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="spinner" />
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#a7a5c0' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📭</div>
          <p style={{ fontSize: 16 }}>No complaints found</p>
          <p style={{ fontSize: 14, marginTop: 8 }}>
            {filter === 'All' ? 'Click "+ New Complaint" to raise your first one.' : `No ${filter} complaints.`}
          </p>
        </div>
      ) : (
        <div className="grid-2">
          {filtered.map(c => <ComplaintCard key={c._id} complaint={c} />)}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2 className="modal-title">Raise a New Complaint</h2>
            {error && <div className="alert alert-error">{error}</div>}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div className="form-group">
                <label className="form-label">Title</label>
                <input className="form-input" placeholder="Brief title of the issue"
                  value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
              </div>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select className="form-input" value={form.category}
                  onChange={e => setForm({ ...form, category: e.target.value })}>
                  {categories.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Priority</label>
                <select className="form-input" value={form.priority}
                  onChange={e => setForm({ ...form, priority: e.target.value })}>
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-input" rows={4}
                  placeholder="Describe the issue in detail..."
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  required style={{ resize: 'vertical' }} />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Submitting...' : 'Submit Complaint'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}