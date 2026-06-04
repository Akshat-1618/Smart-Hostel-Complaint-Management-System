const statusMap = {
  Pending:     { class: 'badge-pending',  label: 'Pending' },
  'In Progress': { class: 'badge-progress', label: 'In Progress' },
  Resolved:    { class: 'badge-resolved', label: 'Resolved' },
};
const priorityMap = {
  Low:    'priority-low',
  Medium: 'priority-medium',
  High:   'priority-high',
};

export default function ComplaintCard({ complaint, actions }) {
  const s = statusMap[complaint.status] || statusMap['Pending'];
  const p = priorityMap[complaint.priority] || 'priority-medium';

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 4, wordBreak: 'break-word' }}>
            {complaint.title}
          </h3>
          <p style={{ fontSize: 13, color: '#a7a5c0' }}>
            {complaint.category}
            {complaint.roomNumber && ` · Room ${complaint.roomNumber}`}
          </p>
        </div>
        <span className={`badge ${s.class}`}>{s.label}</span>
      </div>

      <p style={{ fontSize: 13, color: '#a7a5c0', lineHeight: 1.6 }}>
        {complaint.description}
      </p>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
        <span className={`badge ${p}`}>{complaint.priority}</span>
        {complaint.student && (
          <span style={{ fontSize: 12, color: '#a7a5c0' }}>
            👤 {complaint.student.name}
          </span>
        )}
        {complaint.assignedTo && (
          <span style={{ fontSize: 12, color: '#06b6d4' }}>
            🔧 {complaint.assignedTo.name}
          </span>
        )}
      </div>

      {complaint.remarks && (
        <div style={{
          background: 'rgba(16,185,129,0.08)',
          border: '1px solid rgba(16,185,129,0.2)',
          borderRadius: 8, padding: '10px 14px',
          fontSize: 13, color: '#6ee7b7',
        }}>
          💬 {complaint.remarks}
        </div>
      )}

      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', paddingTop: 8,
        borderTop: '1px solid var(--border)',
      }}>
        <span style={{ fontSize: 12, color: '#a7a5c0', fontFamily: 'var(--mono)' }}>
          {new Date(complaint.createdAt).toLocaleDateString('en-IN', {
            day: '2-digit', month: 'short', year: 'numeric',
          })}
        </span>
        {actions && <div style={{ display: 'flex', gap: 8 }}>{actions}</div>}
      </div>
    </div>
  );
}