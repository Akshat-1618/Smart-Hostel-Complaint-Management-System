import { useState, useEffect } from 'react';
import axios from 'axios';
import ComplaintCard from '../components/ComplaintCard';

const roles = ['student', 'warden', 'staff', 'admin'];
const roleColors = { student: '#6c63ff', admin: '#ef4444', warden: '#f59e0b', staff: '#10b981' };

export default function AdminDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const showMsg = (msg) => { setMessage(msg); setTimeout(() => setMessage(''), 3000); };

  useEffect(() => {
    Promise.all([axios.get('/api/complaints'), axios.get('/api/users')])
      .then(([c, u]) => { setComplaints(c.data); setUsers(u.data); })
      .finally(() => setLoading(false));
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      const { data } = await axios.put(`/api/users/${userId}/role`, { role: newRole });
      setUsers(prev => prev.map(u => u._id === data._id ? data : u));
      showMsg(`Role updated to "${newRole}"`);
    } catch (err) {
      showMsg('Failed: ' + (err.response?.data?.message || 'Error'));
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Delete this user permanently?')) return;
    try {
      await axios.delete(`/api/users/${userId}`);
      setUsers(prev => prev.filter(u => u._id !== userId));
      showMsg('User deleted');
    } catch (err) {
      showMsg('Delete failed');
    }
  };

  const handleDeleteComplaint = async (id) => {
    if (!window.confirm('Delete this complaint?')) return;
    try {
      await axios.delete(`/api/complaints/${id}`);
      setComplaints(prev => prev.filter(c => c._id !== id));
      showMsg('Complaint deleted');
    } catch (err) {
      showMsg('Delete failed');
    }
  };

  const stats = {
    users: users.length,
    complaints: complaints.length,
    resolved: complaints.filter(c => c.status === 'Resolved').length,
    pending: complaints.filter(c => c.status === 'Pending').length,
  };

  const tabs = ['overview', 'users', 'complaints'];

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Admin Panel</h1>
          <p style={{ color: '#a7a5c0', marginTop: 4 }}>System-level control and management</p>
        </div>
      </div>

      {message && (
        <div className={`alert ${message.includes('failed') || message.includes('Failed') ? 'alert-error' : 'alert-success'}`}>
          {message}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 32, borderBottom: '1px solid var(--border)', paddingBottom: 0 }}>
        {tabs.map(t => (
          <button key={t} onClick={() => setActiveTab(t)}
            style={{
              padding: '10px 20px', background: 'none', border: 'none',
              color: activeTab === t ? '#6c63ff' : '#a7a5c0',
              fontFamily: 'var(--font)', fontSize: 14, fontWeight: 600,
              cursor: 'pointer', textTransform: 'capitalize',
              borderBottom: activeTab === t ? '2px solid #6c63ff' : '2px solid transparent',
              transition: 'var(--transition)', marginBottom: -1,
            }}
          >
            {t === 'overview' ? '📊 Overview' : t === 'users' ? '👥 Users' : '📋 Complaints'}
          </button>
        ))}
      </div>

      {loading && <div className="spinner" />}

      {!loading && activeTab === 'overview' && (
        <>
          <div className="grid-4" style={{ marginBottom: 40 }}>
            {[
              { label: 'Total Users', value: stats.users, color: '#6c63ff' },
              { label: 'Total Complaints', value: stats.complaints, color: '#06b6d4' },
              { label: 'Pending', value: stats.pending, color: '#f59e0b' },
              { label: 'Resolved', value: stats.resolved, color: '#10b981' },
            ].map((s, i) => (
              <div key={i} className="stat-card">
                <div className="stat-number" style={{ color: s.color }}>{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
          <h3 style={{ marginBottom: 16, fontSize: 18, fontWeight: 600 }}>Users by Role</h3>
          <div className="grid-4">
            {roles.map(r => (
              <div key={r} className="stat-card" style={{ borderColor: `${roleColors[r]}33` }}>
                <div className="stat-number" style={{ color: roleColors[r], fontSize: 28 }}>
                  {users.filter(u => u.role === r).length}
                </div>
                <div className="stat-label" style={{ textTransform: 'capitalize' }}>{r}s</div>
              </div>
            ))}
          </div>
        </>
      )}

      {!loading && activeTab === 'users' && (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Room</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u._id}>
                  <td style={{ fontWeight: 500 }}>{u.name}</td>
                  <td style={{ color: '#a7a5c0', fontSize: 13 }}>{u.email}</td>
                  <td style={{ color: '#a7a5c0', fontSize: 13 }}>{u.roomNumber || '—'}</td>
                  <td>
                    <select
                      className="form-input"
                      value={u.role}
                      onChange={e => handleRoleChange(u._id, e.target.value)}
                      style={{ padding: '5px 10px', fontSize: 13, width: 120,
                        color: roleColors[u.role], fontWeight: 600 }}
                    >
                      {roles.map(r => <option key={r} value={r} style={{ color: roleColors[r] }}>{r}</option>)}
                    </select>
                  </td>
                  <td>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDeleteUser(u._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && activeTab === 'complaints' && (
        <div className="grid-2">
          {complaints.map(c => (
            <ComplaintCard
              key={c._id}
              complaint={c}
              actions={
                <button className="btn btn-danger btn-sm" onClick={() => handleDeleteComplaint(c._id)}>
                  🗑️ Delete
                </button>
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}