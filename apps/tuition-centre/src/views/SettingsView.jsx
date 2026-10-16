import React, { useState } from 'react';
import { useTuitionStore, storeActions } from '../data/store';

export function SettingsView() {
  const store = useTuitionStore();
  const profile = store.profile || {};

  const [form, setForm] = useState({
    name: profile.name || '',
    tagline: profile.tagline || '',
    location: profile.location || '',
    address: profile.address || '',
    phone: profile.phone || '',
    email: profile.email || '',
    website: profile.website || '',
    directorName: profile.directorName || '',
    allocatedSeats: profile.allocatedSeats || 200
  });

  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    storeActions.updateProfile({
      ...form,
      allocatedSeats: Number(form.allocatedSeats) || 200
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to restore initial demo records? All mock changes will reset.')) {
      storeActions.resetAll();
      alert('Demo data restored successfully.');
    }
  };

  return (
    <div style={{ padding: '2rem 1.5rem', maxWidth: '1000px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#171717', letterSpacing: '-0.02em' }}>
          Tuition Centre Profile & Settings
        </h1>
        <p style={{ fontSize: '0.9rem', color: 'var(--tc-muted-text)', marginTop: '0.25rem' }}>
          Manage your institutional identity, campus locations, and Zhero subscription quota.
        </p>
      </div>

      {isSaved && (
        <div style={{
          backgroundColor: '#EAF7EE',
          border: '1px solid #C3E6CB',
          color: '#1E7E34',
          padding: '0.85rem 1rem',
          borderRadius: '8px',
          fontSize: '0.875rem',
          fontWeight: 600,
          marginBottom: '1.5rem'
        }}>
          ✓ Centre profile settings updated successfully!
        </div>
      )}

      {/* Subscription & License Tier Card */}
      <div className="tc-card" style={{ marginBottom: '2rem', border: '1px solid #EED180', background: 'var(--tc-yellow-cream)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span className="tc-badge tc-badge-yellow" style={{ fontSize: '0.8rem', fontWeight: 700 }}>
                {profile.licenseTier} INSTITUTIONAL LICENSE
              </span>
              <span className="tc-badge tc-badge-success" style={{ fontSize: '0.75rem' }}>
                ✓ {profile.verificationStatus}
              </span>
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#171717' }}>
              Sponsored Student Seat Allocation
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#5E5B54', marginTop: '0.25rem' }}>
              Administered under Zhero B2B2C Educational Partner Network.
            </p>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#8C6A05' }}>
              {profile.usedSeats || 148} / {profile.allocatedSeats || 200}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#737067', textTransform: 'uppercase' }}>
              Active Seats Used
            </div>
          </div>
        </div>

        <div style={{ width: '100%', height: '8px', backgroundColor: '#EAE5D8', borderRadius: '999px', overflow: 'hidden', marginTop: '1rem' }}>
          <div style={{
            width: `${Math.round(((profile.usedSeats || 148) / (profile.allocatedSeats || 200)) * 100)}%`,
            height: '100%',
            backgroundColor: 'var(--tc-primary-yellow)'
          }} />
        </div>
      </div>

      {/* Centre Profile Form */}
      <div className="tc-card" style={{ marginBottom: '2.5rem' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#171717', marginBottom: '1.25rem' }}>
          General Institutional Information
        </h3>

        <form onSubmit={handleSave}>
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
              Tuition Centre / Academy Name *
            </label>
            <input
              type="text"
              required
              className="tc-input"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
              Mission Statement & Tagline
            </label>
            <input
              type="text"
              className="tc-input"
              value={form.tagline}
              onChange={(e) => setForm({ ...form, tagline: e.target.value })}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                Primary City / Region
              </label>
              <input
                type="text"
                className="tc-input"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                Director / Principal Name
              </label>
              <input
                type="text"
                className="tc-input"
                value={form.directorName}
                onChange={(e) => setForm({ ...form, directorName: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                Contact Phone / WhatsApp
              </label>
              <input
                type="text"
                className="tc-input"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                Institutional Email
              </label>
              <input
                type="email"
                required
                className="tc-input"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                Official Website
              </label>
              <input
                type="url"
                className="tc-input"
                value={form.website}
                onChange={(e) => setForm({ ...form, website: e.target.value })}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                License Seat Quota
              </label>
              <input
                type="number"
                className="tc-input"
                value={form.allocatedSeats}
                onChange={(e) => setForm({ ...form, allocatedSeats: e.target.value })}
              />
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
              Headquarters Campus Address
            </label>
            <textarea
              rows="2"
              className="tc-textarea"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
          </div>

          <button type="submit" className="tc-btn-primary">
            Save Profile Settings
          </button>
        </form>
      </div>

      {/* Campus Locations Card */}
      <div className="tc-card" style={{ marginBottom: '2.5rem' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#171717', marginBottom: '1rem' }}>
          Registered Branches & Coaching Campuses
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {(profile.branches || []).map((br, idx) => (
            <div key={idx} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0.85rem 1rem',
              backgroundColor: '#FAF8F5',
              borderRadius: '8px',
              border: '1px solid var(--tc-border)'
            }}>
              <div>
                <div style={{ fontWeight: 700, color: '#171717', fontSize: '0.9rem' }}>{br.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--tc-muted-text)' }}>
                  Campus Head: {br.head} • Allocated Lab Capacity: {br.seats} seats
                </div>
              </div>
              <span className="tc-badge tc-badge-success" style={{ fontSize: '0.7rem' }}>
                Operational
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Danger Zone / Reset Demo Data */}
      <div className="tc-card" style={{ border: '1px solid #F8B4B4', backgroundColor: '#FFFDFD' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#C53030' }}>
              Reset Local Demo Database
            </h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--tc-muted-text)', marginTop: '0.2rem' }}>
              Restores initial mock courses, batches, assessment campaigns, and sample students.
            </p>
          </div>
          <button
            onClick={handleReset}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              backgroundColor: '#FDE8E8',
              color: '#C53030',
              border: '1px solid #F8B4B4',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            Reset All Demo Data
          </button>
        </div>
      </div>
    </div>
  );
}
