import React, { useState } from 'react';
import { useTuitionStore, storeActions } from '../data/store';
import { Modal } from '../components/Modal';
import { QRCodeModal } from '../components/QRCodeModal';

export function CampaignsView({ onNavigateToAssessment }) {
  const store = useTuitionStore();
  const campaigns = store.campaigns || [];

  const [selectedQR, setSelectedQR] = useState(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState(null);

  const [form, setForm] = useState(() => ({
    title: '',
    code: '',
    targetAudience: 'Plus Two & Undergraduate Students',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    description: '',
    channels: 'Campus Stands, WhatsApp Groups, School Career Seminars',
    status: 'Active'
  }));

  const handleOpenCreate = () => {
    setEditingCampaign(null);
    setForm({
      title: '',
      code: `QUEST${Math.floor(100 + Math.random() * 900)}`,
      targetAudience: 'Plus Two & Undergraduate Students',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '2026-12-31',
      description: '',
      channels: 'Campus QR Stands, WhatsApp Broadcasts, Parent Orientation',
      status: 'Active'
    });
    setIsCreateOpen(true);
  };

  const handleOpenEdit = (cmp) => {
    setEditingCampaign(cmp);
    setForm({
      ...cmp,
      channels: Array.isArray(cmp.channels) ? cmp.channels.join(', ') : cmp.channels
    });
    setIsCreateOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.code.trim()) {
      alert('Campaign title and unique code are required.');
      return;
    }

    const payload = {
      ...form,
      channels: typeof form.channels === 'string' ? form.channels.split(',').map(c => c.trim()).filter(Boolean) : form.channels
    };

    if (editingCampaign) {
      payload.id = editingCampaign.id;
      payload.metrics = editingCampaign.metrics;
    }

    storeActions.saveCampaign(payload);
    setIsCreateOpen(false);
  };

  return (
    <div style={{ padding: '2rem 1.5rem', maxWidth: '1360px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#171717', letterSpacing: '-0.02em' }}>
            Assessment Campaigns & Student Acquisition
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--tc-muted-text)', marginTop: '0.25rem' }}>
            Generate targeted QR codes and shareable assessment links to attract students from schools and partner colleges.
          </p>
        </div>
        <button onClick={handleOpenCreate} className="tc-btn-primary" style={{ fontSize: '0.875rem' }}>
          + Launch New Campaign
        </button>
      </div>

      {/* Campaigns Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '1.5rem' }}>
        {campaigns.map(cmp => (
          <div key={cmp.id} className="tc-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <span className="tc-badge tc-badge-yellow" style={{ fontSize: '0.75rem', fontWeight: 700 }}>
                  Code: {cmp.code}
                </span>
                <span className={`tc-badge ${cmp.status === 'Active' ? 'tc-badge-success' : 'tc-badge-neutral'}`}>
                  {cmp.status}
                </span>
              </div>

              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#171717', marginBottom: '0.35rem' }}>
                {cmp.title}
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--tc-muted-text)', marginBottom: '1rem', lineHeight: 1.5 }}>
                {cmp.description || 'Targeted career guidance outreach and diagnostic lead generation.'}
              </p>

              <div style={{ fontSize: '0.8rem', color: 'var(--tc-charcoal)', marginBottom: '1rem', padding: '0.75rem', background: '#FAF8F5', borderRadius: '8px' }}>
                <div>🎯 <strong>Audience:</strong> {cmp.targetAudience}</div>
                <div>📅 <strong>Active Window:</strong> {cmp.startDate} → {cmp.endDate || 'Ongoing'}</div>
              </div>

              {/* Performance Metrics */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '0.5rem',
                textAlign: 'center',
                padding: '0.75rem',
                backgroundColor: 'var(--tc-yellow-cream)',
                borderRadius: '8px',
                border: '1px solid #EED180',
                marginBottom: '1.25rem'
              }}>
                <div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#171717' }}>
                    {cmp.metrics?.qrScans || 0}
                  </div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--tc-muted-text)', textTransform: 'uppercase' }}>QR Scans</div>
                </div>
                <div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#8C6A05' }}>
                    {cmp.metrics?.completions || 0}
                  </div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--tc-muted-text)', textTransform: 'uppercase' }}>Tests Done</div>
                </div>
                <div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1E7E34' }}>
                    {cmp.metrics?.enrolled || 0}
                  </div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--tc-muted-text)', textTransform: 'uppercase' }}>Admitted</div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => setSelectedQR(cmp)}
                className="tc-btn-primary"
                style={{ flex: 1, padding: '0.45rem 0.75rem', fontSize: '0.8rem' }}
              >
                📲 QR Code & Share
              </button>
              <button
                onClick={() => handleOpenEdit(cmp)}
                className="tc-btn-secondary"
                style={{ padding: '0.45rem 0.75rem', fontSize: '0.8rem' }}
              >
                Edit
              </button>
              <button
                onClick={() => onNavigateToAssessment(cmp.code)}
                className="tc-btn-outline"
                style={{ padding: '0.45rem 0.75rem', fontSize: '0.8rem' }}
                title="Test taking the diagnostic test with this campaign code"
              >
                Demo Test
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* QR Code Modal */}
      {selectedQR && (
        <QRCodeModal
          isOpen={true}
          onClose={() => setSelectedQR(null)}
          campaign={selectedQR}
        />
      )}

      {/* Create / Edit Campaign Modal */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title={editingCampaign ? `Edit Campaign: ${editingCampaign.title}` : 'Launch Assessment Campaign'}
        maxWidth="600px"
      >
        <form onSubmit={handleSave}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
              Campaign Title *
            </label>
            <input
              type="text"
              required
              className="tc-input"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Mission Future 2026 — Kerala Career Quest"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                Campaign Code (Unique URL Param) *
              </label>
              <input
                type="text"
                required
                className="tc-input"
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                placeholder="e.g. QUEST26"
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                Status
              </label>
              <select
                className="tc-select"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                <option value="Active">Active</option>
                <option value="Paused">Paused</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
              Target Audience
            </label>
            <input
              type="text"
              className="tc-input"
              value={form.targetAudience}
              onChange={(e) => setForm({ ...form, targetAudience: e.target.value })}
              placeholder="e.g. Plus Two Science & Undergraduate Final-Year Students"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                Start Date
              </label>
              <input
                type="date"
                required
                className="tc-input"
                value={form.startDate}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                End Date
              </label>
              <input
                type="date"
                className="tc-input"
                value={form.endDate}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
              />
            </div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
              Distribution Channels (comma-separated)
            </label>
            <input
              type="text"
              className="tc-input"
              value={form.channels}
              onChange={(e) => setForm({ ...form, channels: e.target.value })}
              placeholder="e.g. School Seminars, WhatsApp Communities, Direct Campus QR"
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
              Campaign Description / Objective
            </label>
            <textarea
              rows="3"
              className="tc-textarea"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Describe target schools, colleges, or admission targets..."
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <button
              type="button"
              onClick={() => setIsCreateOpen(false)}
              className="tc-btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="tc-btn-primary">
              {editingCampaign ? 'Save Changes' : 'Launch Campaign'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
