import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import ComplaintCard from '../components/ComplaintCard';

export default function StaffDashboard() {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [remarks, setRemarks] = useState({});
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get('/api/complaints')
      .then(({ data }) => setComplaints(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleStatusUpdate = async (id, status) => {
    setUpdating(id);
    try {
      const { data } = await axios.put(`/api/complaints/${id}/status`, {
        status,
        remarks: remarks[id] || '',
      });
      setComplaints(prev => prev.map(c => c._id === data._id ? data : c));
      setMessage(`Status updated to "${status}"`);
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Update failed: ' + (err.response?.data?.message || 'Error'));
    } finally {
      setUpdating(null);
    }
  };

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
          <h1 className="page-title">My Assigned Complaints</h1>
          <p style={{ color: '#a7a5c0', marginTop: 4 }}>Welcome, {user?.name} · Maintenance Staff</p>
        </div>
      </div>

      {message && (
        <div className={`alert ${message.includes('failed') ? 'alert-error' : 'alert-success'}`}>
          {message}
        </div>
      )}

      <div className="grid-4" style={{ marginBottom: 32 }}>
        {[
          { label: 'Assigned', value: stats.total, color: '#6c63ff' },
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

      {loading ? (
        <div className="spinner" />
      ) : complaints.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#a7a5c0' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
          <p>No complaints assigned to you yet!</p>
        </div>
      ) : (
        <div className="grid-2">
          {complaints.map(c => (
            <ComplaintCard
              key={c._id}
              complaint={c}
              actions={
                c.status !== 'Resolved' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%' }}>
                    <input
                      className="form-input"
                      placeholder="Add remarks (optional)"
                      style={{ padding: '7px 12px', fontSize: 13 }}
                      value={remarks[c._id] || ''}
                      onChange={e => setRemarks({ ...remarks, [c._id]: e.target.value })}
                    />
                    <div style={{ display: 'flex', gap: 8 }}>
                      {c.status === 'Pending' && (
                        <button
                          className="btn btn-secondary btn-sm"
                          disabled={updating === c._id}
                          onClick={() => handleStatusUpdate(c._id, 'In Progress')}
                        >
                          🔄 Start
                        </button>
                      )}
                      <button
                        className="btn btn-success btn-sm"
                        disabled={updating === c._id}
                        onClick={() => handleStatusUpdate(c._id, 'Resolved')}
                      >
                        ✅ Resolve
                      </button>
                    </div>
                  </div>
                )
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}