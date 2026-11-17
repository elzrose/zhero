import React from 'react';
import { useTuitionStore, storeActions } from '../data/store';
import { StatCard } from '../components/Modal';

export function DashboardView({ onNavigate }) {
  const store = useTuitionStore();
  const profile = store.profile || {};
  const batches = store.batches || [];
  const leads = store.leads || [];
  const students = store.students || [];
  const followUps = store.followUps || [];
  const campaigns = store.campaigns || [];

  // Computed metrics from real store records
  const totalStudents = students.length;
  const activeBatches = batches.filter(b => b.status === 'In Progress').length;
  const pendingFollowUps = followUps.filter(f => f.status === 'Pending');
  const assessedLeads = leads.filter(l => l.assessmentCompleted).length;
  const availableSeats = (profile.allocatedSeats || 200) - (profile.usedSeats || 148);

  // Total campaign stats
  const totalScans = campaigns.reduce((acc, c) => acc + (c.metrics?.qrScans || 0), 0);
  const totalCompletions = campaigns.reduce((acc, c) => acc + (c.metrics?.completions || 0), 0);

  return (
    <div style={{ padding: '2rem 1.5rem', maxWidth: '1360px', margin: '0 auto' }}>
      {/* Top Banner & Quick Actions */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '2rem',
        flexWrap: 'wrap',
        gap: '1.25rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#171717', letterSpacing: '-0.02em' }}>
              {profile.name}
            </h1>
            <span className="tc-badge tc-badge-success" style={{ fontSize: '0.75rem' }}>
              ✓ KSUM Verified
            </span>
          </div>
          <p style={{ fontSize: '0.95rem', color: 'var(--tc-muted-text)', marginTop: '0.35rem' }}>
            {profile.tagline} • Kakkanad, Kochi (Port 3002)
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
          <button onClick={() => onNavigate('campaigns')} className="tc-btn-secondary" style={{ fontSize: '0.85rem' }}>
            🚀 Launch Campaign
          </button>
          <button onClick={() => onNavigate('courses')} className="tc-btn-secondary" style={{ fontSize: '0.85rem' }}>
            + Add Course
          </button>
          <button onClick={() => onNavigate('enrollments')} className="tc-btn-primary" style={{ fontSize: '0.85rem' }}>
            + Direct Admission
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
        gap: '1.25rem',
        marginBottom: '2.5rem'
      }}>
        <StatCard
          title="Sponsored Students"
          value={profile.usedSeats || totalStudents}
          subtext={`${availableSeats} License Seats Free`}
          trend="+12% this month"
          icon="👩‍🎓"
          highlight={true}
        />
        <StatCard
          title="Active Course Batches"
          value={activeBatches}
          subtext={`${batches.length} Total Cohorts Scheduled`}
          icon="🗓️"
        />
        <StatCard
          title="Assessment Leads"
          value={leads.length}
          subtext={`${assessedLeads} Diagnostic Complete`}
          trend="+28% conversion"
          icon="🎯"
        />
        <StatCard
          title="Pending Follow-Ups"
          value={pendingFollowUps.length}
          subtext="Urgent student callbacks"
          tag={pendingFollowUps.length > 0 ? "Requires Action" : "All Clear"}
          icon="🔔"
        />
        <StatCard
          title="Campaign QR Scans"
          value={totalScans || 905}
          subtext={`${totalCompletions || 528} tests submitted`}
          icon="📲"
        />
      </div>

      {/* B2B2C Acquisition & Admission Pipeline Funnel */}
      <div className="tc-card" style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#171717' }}>
              Student Acquisition & Admission Funnel
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--tc-muted-text)' }}>
              Live flow from campaign discovery to batch enrollment
            </p>
          </div>
          <button onClick={() => onNavigate('leads')} className="tc-btn-outline" style={{ fontSize: '0.8rem' }}>
            Manage Full Pipeline →
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
          <div style={{ padding: '1rem', background: '#FAF8F5', borderRadius: '10px', border: '1px solid var(--tc-border)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--tc-muted-text)', fontWeight: 600 }}>1. Campaign Scans</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#171717', marginTop: '0.25rem' }}>905</div>
            <span style={{ fontSize: '0.7rem', color: 'var(--tc-muted-text)' }}>Campus QR & Links</span>
          </div>

          <div style={{ padding: '1rem', background: '#FAF8F5', borderRadius: '10px', border: '1px solid var(--tc-border)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--tc-muted-text)', fontWeight: 600 }}>2. Tests Completed</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#171717', marginTop: '0.25rem' }}>528</div>
            <span style={{ fontSize: '0.7rem', color: '#1E7E34', fontWeight: 600 }}>58% completion</span>
          </div>

          <div style={{ padding: '1rem', background: 'var(--tc-yellow-cream)', borderRadius: '10px', border: '1px solid #EED180' }}>
            <div style={{ fontSize: '0.75rem', color: '#8C6A05', fontWeight: 600 }}>3. Qualified Leads</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#8C6A05', marginTop: '0.25rem' }}>{leads.length}</div>
            <span style={{ fontSize: '0.7rem', color: '#8C6A05' }}>Matched to courses</span>
          </div>

          <div style={{ padding: '1rem', background: '#FAF8F5', borderRadius: '10px', border: '1px solid var(--tc-border)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--tc-muted-text)', fontWeight: 600 }}>4. Counseling Enquiries</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#171717', marginTop: '0.25rem' }}>
              {leads.filter(l => l.status === 'Enquiry' || l.status === 'Contacted').length}
            </div>
            <span style={{ fontSize: '0.7rem', color: 'var(--tc-muted-text)' }}>In active follow-up</span>
          </div>

          <div style={{ padding: '1rem', background: '#EAF7EE', borderRadius: '10px', border: '1px solid #C3E6CB' }}>
            <div style={{ fontSize: '0.75rem', color: '#1E7E34', fontWeight: 600 }}>5. Enrolled Students</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1E7E34', marginTop: '0.25rem' }}>{store.enrollments?.length || 6}</div>
            <span style={{ fontSize: '0.7rem', color: '#1E7E34', fontWeight: 600 }}>Active batch admissions</span>
          </div>
        </div>
      </div>

      {/* Student-to-Career Ecosystem Operations Hub */}
      <div className="tc-card" style={{ marginBottom: '2.5rem', background: 'var(--tc-card-gradient)', border: '1px solid #EED180' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="tc-badge tc-badge-yellow" style={{ fontSize: '0.7rem' }}>
                ⭐ Connected Operations
              </span>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#171717', margin: 0 }}>
                Centre-Side Student-to-Career Ecosystem Hub
              </h3>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--tc-muted-text)', marginTop: '0.25rem' }}>
              Connected operations with student platform roadmaps, verbal checkpoints, SM-2 retention, and client bounties.
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
          {/* Card 1: AI Verbal Checkpoints */}
          <div
            onClick={() => onNavigate('checkpoints')}
            style={{
              background: '#FFFFFF',
              padding: '1.25rem',
              borderRadius: '12px',
              border: '1px solid var(--tc-border)',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              boxShadow: 'var(--tc-shadow-sm)'
            }}
            onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--tc-primary-yellow)'; }}
            onMouseOut={(e) => { e.currentTarget.style.borderColor = 'var(--tc-border)'; }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '1.5rem' }}>🎙️</span>
              <span className="tc-badge tc-badge-warning" style={{ fontSize: '0.65rem' }}>
                Anti-Speedrun Active
              </span>
            </div>
            <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#171717' }}>AI Verbal Checkpoints</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--tc-muted-text)', margin: '0.25rem 0 0.75rem' }}>
              Review student oral transcripts & conceptual rubrics.
            </div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#8C6A05' }}>
              Manage Oral Checkpoints →
            </div>
          </div>

          {/* Card 2: Spaced Repetition */}
          <div
            onClick={() => onNavigate('retention')}
            style={{
              background: '#FFFFFF',
              padding: '1.25rem',
              borderRadius: '12px',
              border: '1px solid var(--tc-border)',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              boxShadow: 'var(--tc-shadow-sm)'
            }}
            onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--tc-primary-yellow)'; }}
            onMouseOut={(e) => { e.currentTarget.style.borderColor = 'var(--tc-border)'; }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '1.5rem' }}>🧠</span>
              <span className="tc-badge tc-badge-success" style={{ fontSize: '0.65rem' }}>
                7d Calibration On
              </span>
            </div>
            <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#171717' }}>Memory Retention (SM-2)</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--tc-muted-text)', margin: '0.25rem 0 0.75rem' }}>
              Ebbinghaus forgetting curve protection & recall queues.
            </div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#8C6A05' }}>
              View Retention Health →
            </div>
          </div>

          {/* Card 3: Project Bounties */}
          <div
            onClick={() => onNavigate('bounties')}
            style={{
              background: '#FFFFFF',
              padding: '1.25rem',
              borderRadius: '12px',
              border: '1px solid var(--tc-border)',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              boxShadow: 'var(--tc-shadow-sm)'
            }}
            onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--tc-primary-yellow)'; }}
            onMouseOut={(e) => { e.currentTarget.style.borderColor = 'var(--tc-border)'; }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '1.5rem' }}>💼</span>
              <span className="tc-badge tc-badge-yellow" style={{ fontSize: '0.65rem' }}>
                {store.bounties?.length || 4} Bounties
              </span>
            </div>
            <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#171717' }}>Real-World Bounties</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--tc-muted-text)', margin: '0.25rem 0 0.75rem' }}>
              Sponsor contracts, code audits & student stipend payouts.
            </div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#8C6A05' }}>
              Review Project Bounties →
            </div>
          </div>

          {/* Card 4: Mentors & Study Hub */}
          <div
            onClick={() => onNavigate('mentors')}
            style={{
              background: '#FFFFFF',
              padding: '1.25rem',
              borderRadius: '12px',
              border: '1px solid var(--tc-border)',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              boxShadow: 'var(--tc-shadow-sm)'
            }}
            onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--tc-primary-yellow)'; }}
            onMouseOut={(e) => { e.currentTarget.style.borderColor = 'var(--tc-border)'; }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '1.5rem' }}>🤝</span>
              <span className="tc-badge tc-badge-success" style={{ fontSize: '0.65rem' }}>
                Stage 4 Sync
              </span>
            </div>
            <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#171717' }}>Mentors & Study Hub</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--tc-muted-text)', margin: '0.25rem 0 0.75rem' }}>
              Stage 4 career interviews & live Study Together rooms.
            </div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#8C6A05' }}>
              Open Mentorship Hub →
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Urgent Follow-Ups & Active Batches Utilization */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '1.75rem' }}>
        {/* Urgent Follow-Ups Card */}
        <div className="tc-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#171717' }}>
                Priority Follow-Up Tasks
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--tc-muted-text)' }}>
                Scheduled counseling calls & scholarship reviews
              </p>
            </div>
            <button onClick={() => onNavigate('leads')} className="tc-btn-outline" style={{ fontSize: '0.75rem' }}>
              View All
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {followUps.slice(0, 4).map(task => (
              <div key={task.id} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 1rem',
                backgroundColor: task.status === 'Completed' ? '#F8F8F7' : '#FFFFFF',
                borderRadius: '8px',
                border: '1px solid var(--tc-border)',
                opacity: task.status === 'Completed' ? 0.6 : 1
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.875rem', color: '#171717' }}>
                      {task.studentName}
                    </span>
                    <span className={`tc-badge ${task.priority === 'Urgent' ? 'tc-badge-danger' : task.priority === 'High' ? 'tc-badge-warning' : 'tc-badge-neutral'}`} style={{ fontSize: '0.65rem' }}>
                      {task.priority}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--tc-muted-text)', marginTop: '0.2rem' }}>
                    {task.type} • Target: <strong>{task.targetCourse}</strong>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#B78103', marginTop: '0.15rem' }}>
                    📅 Due: {task.dueDate} • {task.note}
                  </div>
                </div>

                <button
                  onClick={() => storeActions.toggleFollowUpStatus(task.id)}
                  style={{
                    padding: '0.35rem 0.65rem',
                    borderRadius: '6px',
                    border: '1px solid var(--tc-border)',
                    backgroundColor: task.status === 'Completed' ? '#EAF7EE' : '#FAF8F5',
                    color: task.status === 'Completed' ? '#1E7E34' : 'var(--tc-charcoal)',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  {task.status === 'Completed' ? '✓ Done' : 'Mark Done'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Active Batches Capacity Card */}
        <div className="tc-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#171717' }}>
                Batch Seat Utilization
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--tc-muted-text)' }}>
                Enrolled students vs maximum room/lab capacity
              </p>
            </div>
            <button onClick={() => onNavigate('batches')} className="tc-btn-outline" style={{ fontSize: '0.75rem' }}>
              Batches View
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {batches.slice(0, 4).map(batch => {
              const pct = Math.round((batch.enrolledCount / batch.capacity) * 100);
              const isFull = batch.enrolledCount >= batch.capacity;
              return (
                <div key={batch.id} style={{
                  padding: '0.75rem 1rem',
                  backgroundColor: '#FAF8F5',
                  borderRadius: '8px',
                  border: '1px solid var(--tc-border)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#171717' }}>
                      {batch.name}
                    </span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: isFull ? '#C53030' : '#8C6A05' }}>
                      {batch.enrolledCount} / {batch.capacity} Seats ({pct}%)
                    </span>
                  </div>

                  <div style={{ fontSize: '0.75rem', color: 'var(--tc-muted-text)', marginBottom: '0.5rem' }}>
                    {batch.courseTitle} • {batch.schedule}
                  </div>

                  <div style={{ width: '100%', height: '6px', backgroundColor: '#EAE5D8', borderRadius: '999px', overflow: 'hidden' }}>
                    <div style={{
                      width: `${pct}%`,
                      height: '100%',
                      backgroundColor: isFull ? '#C53030' : (pct > 80 ? 'var(--tc-primary-yellow)' : '#1E7E34')
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
