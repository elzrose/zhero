import React, { useState } from 'react';
import { useTuitionStore, storeActions } from '../data/store';
import { Modal } from '../components/Modal';

export function LeadsView({ onDirectEnroll }) {
  const store = useTuitionStore();
  const leads = store.leads || [];
  
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedLead, setSelectedLead] = useState(null);
  
  // Follow-up modal
  const [isFollowUpModalOpen, setIsFollowUpModalOpen] = useState(false);
  const [followUpForm, setFollowUpForm] = useState(() => ({
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    type: 'Counseling Call',
    priority: 'High',
    note: ''
  }));

  const statuses = ['All', 'New', 'Assessed', 'Qualified', 'Contacted', 'Enquiry', 'Enrolled', 'Lost'];

  const filteredLeads = leads.filter(l => {
    const matchesSearch = l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.email.toLowerCase().includes(search.toLowerCase()) ||
      l.targetCareer?.toLowerCase().includes(search.toLowerCase()) ||
      l.campaignCode?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || l.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (leadId, newStatus) => {
    storeActions.updateLeadStatus(leadId, newStatus);
    if (selectedLead?.id === leadId) {
      setSelectedLead({ ...selectedLead, status: newStatus });
    }
  };

  const handleSaveFollowUp = (e) => {
    e.preventDefault();
    if (!selectedLead) return;

    storeActions.saveFollowUp({
      leadId: selectedLead.id,
      studentName: selectedLead.name,
      contact: selectedLead.phone,
      type: followUpForm.type,
      targetCourse: selectedLead.targetCareer || 'Specialized Coaching',
      dueDate: followUpForm.dueDate,
      priority: followUpForm.priority,
      note: followUpForm.note || 'Follow-up counseling scheduled.'
    });

    // Also update lead's follow up due
    storeActions.saveLead({
      ...selectedLead,
      followUpDue: followUpForm.dueDate,
      status: selectedLead.status === 'New' ? 'Contacted' : selectedLead.status
    });

    setIsFollowUpModalOpen(false);
    alert(`Follow-up task scheduled for ${selectedLead.name}!`);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'New': return 'tc-badge-danger';
      case 'Assessed': return 'tc-badge-yellow';
      case 'Qualified': return 'tc-badge-yellow';
      case 'Contacted': return 'tc-badge-info';
      case 'Enquiry': return 'tc-badge-warning';
      case 'Enrolled': return 'tc-badge-success';
      case 'Lost': return 'tc-badge-neutral';
      default: return 'tc-badge-neutral';
    }
  };

  return (
    <div style={{ padding: '2rem 1.5rem', maxWidth: '1360px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#171717', letterSpacing: '-0.02em' }}>
            Lead Pipeline & Prospective Enquiries
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--tc-muted-text)', marginTop: '0.25rem' }}>
            Track students acquired through campaign QR assessments, manage counseling interactions, and progress them toward batch enrollment.
          </p>
        </div>
      </div>

      {/* Status Stage Pipeline Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem', marginBottom: '1.75rem' }}>
        {statuses.filter(s => s !== 'All').map(st => {
          const count = leads.filter(l => l.status === st).length;
          const isSelected = statusFilter === st;
          return (
            <button
              key={st}
              onClick={() => setStatusFilter(isSelected ? 'All' : st)}
              style={{
                padding: '0.75rem',
                borderRadius: '10px',
                border: '1px solid',
                borderColor: isSelected ? 'var(--tc-primary-yellow)' : 'var(--tc-border)',
                backgroundColor: isSelected ? 'var(--tc-yellow-pale)' : '#FFFFFF',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <div style={{ fontSize: '0.7rem', color: 'var(--tc-muted-text)', fontWeight: 600, textTransform: 'uppercase' }}>
                {st}
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#171717', marginTop: '0.2rem' }}>
                {count}
              </div>
            </button>
          );
        })}
      </div>

      {/* Filter and Search Bar */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '1rem',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.5rem',
        backgroundColor: '#FFFFFF',
        padding: '1rem',
        borderRadius: 'var(--tc-radius-lg)',
        border: '1px solid var(--tc-border)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--tc-muted-text)' }}>Filter by Stage:</span>
          {['All', 'New', 'Assessed', 'Qualified', 'Contacted', 'Enquiry', 'Enrolled'].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              style={{
                padding: '0.35rem 0.75rem',
                borderRadius: '6px',
                border: '1px solid',
                borderColor: statusFilter === st ? '#EED180' : 'var(--tc-border)',
                backgroundColor: statusFilter === st ? 'var(--tc-yellow-pale)' : '#FFFFFF',
                color: statusFilter === st ? '#8C6A05' : 'var(--tc-charcoal)',
                fontWeight: statusFilter === st ? 700 : 500,
                fontSize: '0.75rem',
                cursor: 'pointer'
              }}
            >
              {st}
            </button>
          ))}
        </div>

        <div style={{ minWidth: '260px' }}>
          <input
            type="text"
            className="tc-input"
            placeholder="Search leads by name, email, career..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Leads Table */}
      <div className="tc-table-wrapper">
        <table className="tc-table">
          <thead>
            <tr>
              <th>Lead Name & Contact</th>
              <th>Education / School</th>
              <th>Campaign</th>
              <th>Target Career</th>
              <th>Diagnostic Score</th>
              <th>Pipeline Stage</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeads.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: 'var(--tc-muted-text)' }}>
                  No prospective student leads found matching this stage.
                </td>
              </tr>
            ) : (
              filteredLeads.map(lead => (
                <tr key={lead.id}>
                  <td>
                    <div style={{ fontWeight: 700, color: '#171717' }}>{lead.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--tc-muted-text)' }}>
                      {lead.email} • {lead.phone}
                    </div>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.85rem', color: '#171717' }}>{lead.education}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--tc-muted-text)' }}>{lead.institution}</div>
                  </td>
                  <td>
                    <span className="tc-badge tc-badge-yellow" style={{ fontSize: '0.7rem' }}>
                      {lead.campaignCode || 'DIRECT'}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: '#171717', fontSize: '0.85rem' }}>
                      {lead.targetCareer || 'Undecided'}
                    </div>
                  </td>
                  <td>
                    {lead.assessmentCompleted ? (
                      <span style={{ fontWeight: 700, color: '#1E7E34' }}>
                        {lead.readinessScore || 75}% Aptitude
                      </span>
                    ) : (
                      <span style={{ color: 'var(--tc-subtle-text)', fontSize: '0.75rem' }}>Pending Test</span>
                    )}
                  </td>
                  <td>
                    <select
                      value={lead.status}
                      onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                      style={{
                        padding: '0.25rem 0.5rem',
                        borderRadius: '6px',
                        border: '1px solid var(--tc-border)',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        backgroundColor: '#FFFFFF',
                        cursor: 'pointer'
                      }}
                    >
                      {statuses.filter(s => s !== 'All').map(st => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '0.35rem' }}>
                      <button
                        onClick={() => setSelectedLead(lead)}
                        className="tc-btn-outline"
                        style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}
                      >
                        Profile
                      </button>
                      {lead.status !== 'Enrolled' && (
                        <button
                          onClick={() => onDirectEnroll(lead)}
                          className="tc-btn-primary"
                          style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}
                        >
                          Enroll →
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Lead Profile Detail Modal */}
      {selectedLead && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedLead(null)}
          title={`Lead Profile: ${selectedLead.name}`}
          maxWidth="640px"
        >
          <div style={{ fontSize: '0.875rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', padding: '1rem', background: '#FAF8F5', borderRadius: '10px' }}>
              <div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#171717' }}>{selectedLead.name}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--tc-muted-text)' }}>
                  📧 {selectedLead.email} • 📞 {selectedLead.phone}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--tc-muted-text)', marginTop: '0.2rem' }}>
                  🏫 {selectedLead.institution} ({selectedLead.education})
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span className={`tc-badge ${getStatusBadge(selectedLead.status)}`} style={{ fontSize: '0.8rem', marginBottom: '0.35rem' }}>
                  {selectedLead.status}
                </span>
                <div style={{ fontSize: '0.75rem', color: 'var(--tc-muted-text)' }}>
                  Acquired: {selectedLead.createdAt}
                </div>
              </div>
            </div>

            {/* Diagnostic Results */}
            <div style={{ marginBottom: '1.25rem', padding: '1rem', background: 'var(--tc-yellow-cream)', borderRadius: '10px', border: '1px solid #EED180' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#8C6A05', textTransform: 'uppercase' }}>
                  🎯 Career Assessment Insights
                </span>
                <span style={{ fontWeight: 800, color: '#8C6A05', fontSize: '1rem' }}>
                  {selectedLead.readinessScore || 75}% Readiness
                </span>
              </div>
              <div>
                <strong>Top Match Role:</strong> {selectedLead.targetCareer || 'Engineering Explorer'}
              </div>
              <div style={{ marginTop: '0.5rem' }}>
                <strong>Demonstrated Strengths:</strong>
                <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginTop: '0.25rem' }}>
                  {(selectedLead.strengths || ['Problem Solving', 'Logic']).map((s, idx) => (
                    <span key={idx} className="tc-badge tc-badge-success" style={{ fontSize: '0.7rem' }}>{s}</span>
                  ))}
                </div>
              </div>
              <div style={{ marginTop: '0.5rem' }}>
                <strong>Identified Skill Gaps:</strong>
                <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginTop: '0.25rem' }}>
                  {(selectedLead.skillGaps || ['Advanced Frameworks']).map((g, idx) => (
                    <span key={idx} className="tc-badge tc-badge-yellow" style={{ fontSize: '0.7rem' }}>{g}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Counselor Notes */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ fontWeight: 700, color: '#171717', marginBottom: '0.35rem' }}>
                Counselor Interaction History & Notes:
              </div>
              <p style={{ color: 'var(--tc-muted-text)', background: '#FAF8F5', padding: '0.75rem', borderRadius: '8px', lineHeight: 1.5 }}>
                {selectedLead.notes || 'No counseling notes recorded yet.'}
              </p>
            </div>

            {/* Modal Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
              <button
                onClick={() => setIsFollowUpModalOpen(true)}
                className="tc-btn-secondary"
                style={{ fontSize: '0.85rem' }}
              >
                📅 Schedule Follow-Up Task
              </button>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => setSelectedLead(null)}
                  className="tc-btn-outline"
                >
                  Close
                </button>
                {selectedLead.status !== 'Enrolled' && (
                  <button
                    onClick={() => {
                      const l = selectedLead;
                      setSelectedLead(null);
                      onDirectEnroll(l);
                    }}
                    className="tc-btn-primary"
                  >
                    Convert to Enrollment →
                  </button>
                )}
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Schedule Follow Up Modal */}
      {isFollowUpModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsFollowUpModalOpen(false)}
          title={`Schedule Follow-Up: ${selectedLead?.name}`}
          maxWidth="500px"
        >
          <form onSubmit={handleSaveFollowUp}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                Due Date *
              </label>
              <input
                type="date"
                required
                className="tc-input"
                value={followUpForm.dueDate}
                onChange={(e) => setFollowUpForm({ ...followUpForm, dueDate: e.target.value })}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                  Follow-Up Type
                </label>
                <select
                  className="tc-select"
                  value={followUpForm.type}
                  onChange={(e) => setFollowUpForm({ ...followUpForm, type: e.target.value })}
                >
                  <option value="Counseling Call">Counseling Call</option>
                  <option value="Scholarship Review">Scholarship Review</option>
                  <option value="Campus Tour / Demo">Campus Tour / Demo</option>
                  <option value="Parent Consultation">Parent Consultation</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                  Priority Level
                </label>
                <select
                  className="tc-select"
                  value={followUpForm.priority}
                  onChange={(e) => setFollowUpForm({ ...followUpForm, priority: e.target.value })}
                >
                  <option value="Urgent">Urgent</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                Counseling Notes / Action Item
              </label>
              <textarea
                rows="3"
                className="tc-textarea"
                required
                placeholder="e.g. Call parent regarding weekend batch fee schedule and placement assistance..."
                value={followUpForm.note}
                onChange={(e) => setFollowUpForm({ ...followUpForm, note: e.target.value })}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => setIsFollowUpModalOpen(false)}
                className="tc-btn-secondary"
              >
                Cancel
              </button>
              <button type="submit" className="tc-btn-primary">
                Save Task
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
