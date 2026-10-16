import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { GitBranch, ShieldCheck } from 'lucide-react';

export function AdminLayout({ activeTab, onSelectTab, children }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#FCEADE' }}>
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={onSelectTab}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed(!collapsed)}
      />

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflowX: 'hidden' }}>
        <Topbar activeTab={activeTab} onSelectTab={onSelectTab} />

        {/* Developer Branch Indicator Banner */}
        <div style={{ padding: '1rem 2rem 0' }}>
          <div
            style={{
              backgroundColor: '#FCEADE',
              border: '1px solid #FAD1C6',
              borderRadius: '12px',
              padding: '0.65rem 1.25rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '0.75rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={16} color="#DB5E8C" />
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#171717' }}>
                ZHERO Platform Operations — Hackathon Admin Console
              </span>
            </div>
            <div style={{ display: 'flex', gap: '1.25rem', fontSize: '0.785rem', color: '#77736D' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <GitBranch size={13} color="#DB5E8C" />
                Branch: <strong style={{ color: '#DB5E8C' }}>feature/admin-platform</strong>
              </span>
              <span>Port: <strong style={{ color: '#171717' }}>3003</strong></span>
            </div>
          </div>
        </div>

        {/* Dynamic Page Content */}
        <main style={{ flex: 1, padding: '1.5rem 2rem 3rem', maxWidth: '1440px', width: '100%', margin: '0 auto' }}>
          {children}
        </main>

        {/* Footer */}
        <footer
          style={{
            textAlign: 'center',
            padding: '1.25rem',
            borderTop: '1px solid #FAD1C6',
            backgroundColor: '#FFFFFF',
            fontSize: '0.785rem',
            color: '#77736D',
          }}
        >
          ZHERO Monorepo Foundation — KSUM She Builds Hackathon 2026 • Platform Administration Engine
        </footer>
      </div>
    </div>
  );
}
