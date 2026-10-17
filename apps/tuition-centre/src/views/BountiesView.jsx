import React, { useState } from 'react';
import { useTuitionStore, storeActions } from '../data/store';
import { PROJECT_BOUNTIES } from '../data/studentCompatibility';
import { StatCard, Modal } from '../components/Modal';

export function BountiesView() {
  const store = useTuitionStore();
  const bounties = store.bounties || PROJECT_BOUNTIES;
  const students = store.students || [];

  const [activeFilter, setActiveFilter] = useState('All'); // 'All' | 'Available' | 'In Progress' | 'Mentor Review' | 'Completed'
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedBounty, setSelectedBounty] = useState(null);

  const [newBounty, setNewBounty] = useState({
    title: '',
    client: '',
    stipend: '₹8,000',
    deadline: '2026-11-15',
    difficulty: 'Intermediate',
    requiredSkills: 'React, Node.js, REST API',
    description: '',
    mentor: 'Dr. Radhika Sen'
  });

  const totalBounties = bounties.length;
  const inProgressCount = bounties.filter(b => b.status === 'In Progress').length;
  const reviewCount = bounties.filter(b => b.status === 'Mentor Review').length;
  const completedCount = bounties.filter(b => b.status === 'Completed').length;

  const filteredBounties = bounties.filter(b => {
    if (activeFilter === 'All') return true;
    return b.status === activeFilter;
  });

  const handleCreateBounty = (e) => {
    e.preventDefault();
    if (!newBounty.title || !newBounty.client) return;

    storeActions.addBounty({
      title: newBounty.title,
      client: newBounty.client,
      stipend: newBounty.stipend,
      deadline: newBounty.deadline,
      difficulty: newBounty.difficulty,
      skillsRequired: newBounty.requiredSkills.split(',').map(s => s.trim()),
      description: newBounty.description,
      mentor: newBounty.mentor,
      status: 'Available',
      assignedStudent: null
    });

    setIsAddModalOpen(false);
    setNewBounty({
      title: '',
      client: '',
      stipend: '₹8,000',
      deadline: '2026-11-15',
      difficulty: 'Intermediate',
      requiredSkills: 'React, Node.js, REST API',
      description: '',
      mentor: 'Dr. Radhika Sen'
    });
  };

  const handleUpdateStatus = (bountyId, newStatus) => {
    storeActions.updateBountyStatus(bountyId, newStatus);
    if (selectedBounty) {
      setSelectedBounty({ ...selectedBounty, status: newStatus });
    }
  };

  const handleAssignStudent = (bountyId, studentName) => {
    storeActions.assignBountyStudent(bountyId, studentName);
    if (selectedBounty) {
      setSelectedBounty({ ...selectedBounty, assignedStudent: studentName, status: 'In Progress' });
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Available': return 'tc-badge-yellow';
      case 'In Progress': return 'tc-badge-neutral';
      case 'Mentor Review': return 'tc-badge-warning';
      case 'Completed': return 'tc-badge-success';
      default: return 'tc-badge-neutral';
    }
  };

  return (
    <div style={{ padding: '2rem 1.5rem', maxWidth: '1360px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#171717', letterSpacing: '-0.02em' }}>
              Real-World Project Bounties & Client Acceptance Hub
            </h1>
            <span className="tc-badge tc-badge-success" style={{ fontSize: '0.75rem' }}>
              Client Stipends
            </span>
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--tc-muted-text)', marginTop: '0.25rem' }}>
            Facilitate sponsored industry micro-contracts. Tuition centre faculty validates code milestones before client handover.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="tc-btn-primary"
          style={{ fontSize: '0.85rem' }}
        >
          + Post New Client Bounty
        </button>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        <StatCard
          title="Active Project Bounties"
          value={totalBounties}
          subtext="Industry micro-projects"
          icon="💼"
        />
        <StatCard
          title="Active in Development"
          value={inProgressCount}
          subtext="Students actively coding"
          icon="💻"
        />
        <StatCard
          title="Faculty Review Queue"
          value={reviewCount}
          subtext="Deliverables pending audit"
          tag={reviewCount > 0 ? "Awaiting Audit" : "Clear"}
          icon="🔍"
          highlight={reviewCount > 0}
        />
        <StatCard
          title="Client Accepted & Paid"
          value={completedCount}
          subtext="Stipends successfully disbursed"
          icon="🎉"
        />
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {[
          { id: 'All', label: 'All Bounties', count: totalBounties },
          { id: 'Available', label: 'Available to Claim', count: bounties.filter(b => b.status === 'Available').length },
          { id: 'In Progress', label: 'In Progress', count: inProgressCount },
          { id: 'Mentor Review', label: 'Faculty Review', count: reviewCount },
          { id: 'Completed', label: 'Client Accepted', count: completedCount },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id)}
            className={activeFilter === tab.id ? 'tc-btn-primary' : 'tc-btn-secondary'}
            style={{ fontSize: '0.8rem', padding: '0.45rem 0.85rem' }}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Bounties Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.25rem' }}>
        {filteredBounties.map(b => (
          <div key={b.id} className="tc-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <span className={`tc-badge ${getStatusBadge(b.status)}`} style={{ fontSize: '0.75rem' }}>
                  {b.status}
                </span>
                <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#8C6A05' }}>
                  {b.stipend}
                </span>
              </div>

              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#171717', margin: '0.35rem 0' }}>
                {b.title}
              </h3>
              <div style={{ fontSize: '0.8rem', color: 'var(--tc-muted-text)', marginBottom: '0.75rem' }}>
                Sponsor: <strong>{b.client}</strong> • Difficulty: {b.difficulty} • Deadline: {b.deadline}
              </div>

              <p style={{ fontSize: '0.85rem', color: 'var(--tc-charcoal)', lineHeight: 1.4, margin: '0.5rem 0 1rem' }}>
                {b.description}
              </p>

              {/* Skills Tags */}
              <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                {b.skillsRequired?.map((skill, sIdx) => (
                  <span key={sIdx} className="tc-badge tc-badge-neutral" style={{ fontSize: '0.7rem' }}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Assignment & Management Footer */}
            <div style={{ borderTop: '1px solid var(--tc-border)', paddingTop: '0.85rem', marginTop: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--tc-muted-text)' }}>
                  Assigned Student:
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.85rem', color: b.assignedStudent ? '#171717' : '#8C6A05' }}>
                  {b.assignedStudent ? `👩‍🎓 ${b.assignedStudent}` : 'Unassigned (Open)'}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                <button
                  onClick={() => setSelectedBounty(b)}
                  className="tc-btn-outline"
                  style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}
                >
                  Manage / Assign
                </button>

                {b.status === 'Mentor Review' && (
                  <button
                    onClick={() => handleUpdateStatus(b.id, 'Completed')}
                    className="tc-btn-primary"
                    style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}
                  >
                    Approve for Client ✓
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Manage / Assign Bounty Modal */}
      {selectedBounty && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedBounty(null)}
          title={`Bounty Workflow: ${selectedBounty.title}`}
          maxWidth="600px"
        >
          <div>
            <div style={{ background: '#FAF8F5', padding: '1rem', borderRadius: '8px', border: '1px solid var(--tc-border)', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--tc-muted-text)' }}>Client Sponsor:</span>
                <span style={{ fontWeight: 700 }}>{selectedBounty.client}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--tc-muted-text)' }}>Stipend Amount:</span>
                <span style={{ fontWeight: 800, color: '#8C6A05' }}>{selectedBounty.stipend}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--tc-muted-text)' }}>Assigned Faculty Mentor:</span>
                <span style={{ fontWeight: 600 }}>{selectedBounty.mentor}</span>
              </div>
            </div>

            {/* Assign Student Dropdown */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                Assign Enrolled Student:
              </label>
              <select
                className="tc-select"
                value={selectedBounty.assignedStudent || ''}
                onChange={(e) => handleAssignStudent(selectedBounty.id, e.target.value)}
              >
                <option value="">-- Select Qualified Student --</option>
                {students.map(s => (
                  <option key={s.id} value={s.name}>
                    {s.name} ({s.id} - {s.targetCareer})
                  </option>
                ))}
              </select>
            </div>

            {/* Workflow Stage Buttons */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                Update Contract Stage:
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
                {['Available', 'In Progress', 'Mentor Review', 'Completed'].map(st => (
                  <button
                    key={st}
                    onClick={() => handleUpdateStatus(selectedBounty.id, st)}
                    style={{
                      padding: '0.5rem',
                      borderRadius: '6px',
                      border: '1px solid',
                      borderColor: selectedBounty.status === st ? 'var(--tc-primary-yellow)' : 'var(--tc-border)',
                      backgroundColor: selectedBounty.status === st ? 'var(--tc-yellow-pale)' : '#FAF8F5',
                      fontWeight: selectedBounty.status === st ? 700 : 500,
                      fontSize: '0.8rem',
                      cursor: 'pointer'
                    }}
                  >
                    {st === 'Completed' ? '✓ Client Accepted' : st}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
              <button onClick={() => setSelectedBounty(null)} className="tc-btn-secondary">
                Done
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Post New Bounty Modal */}
      {isAddModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsAddModalOpen(false)}
          title="Post Sponsored Industry Bounty"
          maxWidth="640px"
        >
          <form onSubmit={handleCreateBounty}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                Project Title *
              </label>
              <input
                type="text"
                required
                className="tc-input"
                placeholder="e.g. Student Onboarding Checkout Flow"
                value={newBounty.title}
                onChange={(e) => setNewBounty({ ...newBounty, title: e.target.value })}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                  Client / Startup Sponsor *
                </label>
                <input
                  type="text"
                  required
                  className="tc-input"
                  placeholder="e.g. Kerala Startup Mission / TechCorp"
                  value={newBounty.client}
                  onChange={(e) => setNewBounty({ ...newBounty, client: e.target.value })}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                  Student Stipend Amount
                </label>
                <input
                  type="text"
                  className="tc-input"
                  placeholder="e.g. ₹10,000"
                  value={newBounty.stipend}
                  onChange={(e) => setNewBounty({ ...newBounty, stipend: e.target.value })}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                  Difficulty Level
                </label>
                <select
                  className="tc-select"
                  value={newBounty.difficulty}
                  onChange={(e) => setNewBounty({ ...newBounty, difficulty: e.target.value })}
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                  Submission Deadline
                </label>
                <input
                  type="date"
                  className="tc-input"
                  value={newBounty.deadline}
                  onChange={(e) => setNewBounty({ ...newBounty, deadline: e.target.value })}
                />
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                Required Technical Skills (comma separated)
              </label>
              <input
                type="text"
                className="tc-input"
                placeholder="e.g. React, TailwindCSS, REST API"
                value={newBounty.requiredSkills}
                onChange={(e) => setNewBounty({ ...newBounty, requiredSkills: e.target.value })}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                Deliverables & Scope Description
              </label>
              <textarea
                rows={3}
                className="tc-input"
                placeholder="Describe project deliverables, expected test coverage, and acceptance criteria..."
                value={newBounty.description}
                onChange={(e) => setNewBounty({ ...newBounty, description: e.target.value })}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
              <button type="button" onClick={() => setIsAddModalOpen(false)} className="tc-btn-secondary">
                Cancel
              </button>
              <button type="submit" className="tc-btn-primary">
                Post Bounty →
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
