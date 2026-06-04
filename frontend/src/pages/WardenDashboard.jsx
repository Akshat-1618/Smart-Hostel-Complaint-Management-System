import { useState, useEffect } from 'react';
import axios from 'axios';
import ComplaintCard from '../components/ComplaintCard';

export default function WardenDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [assigningId, setAssigningId] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState({});
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cRes, uRes] = await Promise.all([
          axios.get('/api/complaints'),
          axios.get('/api/users'),
        ]);
        setComplaints(cRes.data);
        setStaffList(uRes.data.filter(u => u.role === 'staff'));
      } catch (err) {
         console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAssign = async (complaintId) => {
    const staffId = selectedStaff[complaintId];
    if (!staffId) return;
    try {
      const { data } = await axios.put(`/api/complaints/${complaintId}/assign`, { staffId });
      setComplaints(prev => prev.map(c => c._id === data._id ? data : c));
      setAssigningId(null);
      setMessage('Complaint assigned successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Assignment failed: ' + (err.response?.data?.message || 'Error'));
    }
  };

  const filtered = filter === 'All' ? complaints : complaints.filter(c => c.status === filter);

  const stats = {
    total: complaints.length,
    unassigned: complaints.filter(c => !c.assignedTo).length,
    inProgress: complaints.filter(c => c.status === 'In Progress').length,
    resolved: complaints.filter(c => c.status === 'Resolved').length,
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Warden Dashboard</h1>
          <p style={{ color: '#a7a5c0', marginTop: 4 }}>Manage and assign all hostel complaints</p>
        </div>
      </div>

      {message && (
        <div className={`alert ${message.includes('failed') ? 'alert-error' : 'alert-success'}`}>
          {message}
        </div>
      )}

      {/* Stats */}
      <div className="grid-4" style={{ marginBottom: 32 }}>
        {[
          { label: 'Total Complaints', value: stats.total, color: '#6c63ff' },
          { label: 'Unassigned', value: stats.unassigned, color: '#ef4444' },
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
          <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
          <p>No complaints in this category</p>
        </div>
      ) : (
        <div className="grid-2">
          {filtered.map(c => (
            <ComplaintCard
              key={c._id}
              complaint={c}
              actions={
                c.status !== 'Resolved' && (
                  assigningId === c._id ? (
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <select
                        className="form-input"
                        style={{ padding: '6px 10px', fontSize: 13, width: 150 }}
                        value={selectedStaff[c._id] || ''}
                        onChange={e => setSelectedStaff({ ...selectedStaff, [c._id]: e.target.value })}
                      >
                        <option value="">Select staff</option>
                        {staffList.map(s => (
                          <option key={s._id} value={s._id}>{s.name}</option>
                        ))}
                      </select>
                      <button className="btn btn-success btn-sm" onClick={() => handleAssign(c._id)}>
                        Assign
                      </button>
                      <button className="btn btn-secondary btn-sm" onClick={() => setAssigningId(null)}>
                        ✕
                      </button>
                    </div>
                  ) : (
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => setAssigningId(c._id)}
                    >
                      {c.assignedTo ? '🔄 Reassign' : '📋 Assign Staff'}
                    </button>
                  )
                )
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}