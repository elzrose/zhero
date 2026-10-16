import React, { useState } from 'react';
import { Modal } from './Modal';

export function QRCodeModal({ isOpen, onClose, campaign }) {
  const [copied, setCopied] = useState(false);
  if (!campaign) return null;

  // Derive real assessment URL
  const host = window.location.origin;
  const assessmentUrl = `${host}/?view=assessment&campaign=${encodeURIComponent(campaign.code)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(assessmentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Assessment Campaign QR & Share Link" maxWidth="520px">
      <div style={{ textAlign: 'center' }}>
        <div className="tc-badge tc-badge-yellow" style={{ marginBottom: '0.75rem' }}>
          Campaign Code: {campaign.code}
        </div>
        
        <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#171717', marginBottom: '0.35rem' }}>
          {campaign.title}
        </h4>
        <p style={{ fontSize: '0.85rem', color: 'var(--tc-muted-text)', marginBottom: '1.5rem' }}>
          Share this link or download the campaign QR code for school notice boards, seminars, and WhatsApp broadcasts.
        </p>

        {/* SVG QR Code Simulation */}
        <div style={{
          display: 'inline-flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '1.25rem',
          backgroundColor: '#FFFFFF',
          border: '2px solid var(--tc-primary-yellow)',
          borderRadius: '16px',
          boxShadow: 'var(--tc-shadow-md)',
          marginBottom: '1.5rem'
        }}>
          {/* Scalable vector QR Pattern with Zhero Brand Centerpiece */}
          <svg width="180" height="180" viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="180" height="180" rx="12" fill="white"/>
            {/* Top-left marker */}
            <rect x="15" y="15" width="45" height="45" rx="6" fill="#171717"/>
            <rect x="23" y="23" width="29" height="29" rx="3" fill="white"/>
            <rect x="30" y="30" width="15" height="15" rx="2" fill="#F5C842"/>
            {/* Top-right marker */}
            <rect x="120" y="15" width="45" height="45" rx="6" fill="#171717"/>
            <rect x="128" y="23" width="29" height="29" rx="3" fill="white"/>
            <rect x="135" y="30" width="15" height="15" rx="2" fill="#F5C842"/>
            {/* Bottom-left marker */}
            <rect x="15" y="120" width="45" height="45" rx="6" fill="#171717"/>
            <rect x="23" y="128" width="29" height="29" rx="3" fill="white"/>
            <rect x="30" y="135" width="15" height="15" rx="2" fill="#F5C842"/>
            
            {/* Data matrix dots */}
            <rect x="70" y="20" width="10" height="10" rx="2" fill="#171717"/>
            <rect x="90" y="20" width="10" height="10" rx="2" fill="#171717"/>
            <rect x="70" y="40" width="20" height="10" rx="2" fill="#171717"/>
            <rect x="100" y="40" width="10" height="20" rx="2" fill="#171717"/>
            
            <rect x="20" y="70" width="10" height="20" rx="2" fill="#171717"/>
            <rect x="40" y="70" width="20" height="10" rx="2" fill="#171717"/>
            <rect x="20" y="100" width="20" height="10" rx="2" fill="#171717"/>
            <rect x="50" y="90" width="10" height="20" rx="2" fill="#171717"/>

            {/* Central Badge */}
            <rect x="70" y="70" width="40" height="40" rx="8" fill="#F5C842"/>
            <text x="90" y="96" fill="#171717" fontSize="20" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">Z</text>

            <rect x="120" y="70" width="10" height="10" rx="2" fill="#171717"/>
            <rect x="140" y="70" width="20" height="10" rx="2" fill="#171717"/>
            <rect x="130" y="90" width="20" height="10" rx="2" fill="#171717"/>
            <rect x="120" y="110" width="10" height="20" rx="2" fill="#171717"/>
            <rect x="150" y="110" width="15" height="15" rx="2" fill="#171717"/>

            <rect x="70" y="120" width="15" height="15" rx="2" fill="#171717"/>
            <rect x="95" y="120" width="15" height="15" rx="2" fill="#171717"/>
            <rect x="70" y="145" width="20" height="10" rx="2" fill="#171717"/>
            <rect x="100" y="145" width="10" height="20" rx="2" fill="#171717"/>
            <rect x="125" y="145" width="20" height="10" rx="2" fill="#171717"/>
            <rect x="155" y="145" width="10" height="20" rx="2" fill="#171717"/>
          </svg>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--tc-muted-text)', marginTop: '0.5rem' }}>
            Direct Scan: 5-Min AI Career Discovery
          </span>
        </div>

        {/* Share Link Box */}
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          backgroundColor: 'var(--tc-off-white)',
          padding: '0.5rem',
          borderRadius: 'var(--tc-radius-md)',
          border: '1px solid var(--tc-border)',
          alignItems: 'center',
          marginBottom: '1.25rem'
        }}>
          <input
            type="text"
            readOnly
            value={assessmentUrl}
            style={{
              flex: 1,
              border: 'none',
              background: 'transparent',
              fontSize: '0.8rem',
              color: '#171717',
              outline: 'none',
              padding: '0.25rem 0.5rem'
            }}
          />
          <button
            onClick={handleCopy}
            className="tc-btn-primary"
            style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem', whiteSpace: 'nowrap' }}
          >
            {copied ? '✓ Copied!' : 'Copy Link'}
          </button>
        </div>

        {/* Quick Campaign Metrics */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '0.75rem',
          textAlign: 'center',
          padding: '0.85rem',
          backgroundColor: '#FAF8F5',
          borderRadius: 'var(--tc-radius-md)',
          border: '1px solid var(--tc-border)'
        }}>
          <div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#171717' }}>
              {campaign.metrics?.qrScans || 0}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--tc-muted-text)' }}>Total Scans</div>
          </div>
          <div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#171717' }}>
              {campaign.metrics?.completions || 0}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--tc-muted-text)' }}>Tests Completed</div>
          </div>
          <div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1E7E34' }}>
              {campaign.metrics?.enrolled || 0}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--tc-muted-text)' }}>Enrolled Students</div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
