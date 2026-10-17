import React, { useState } from 'react';
import {
  Mic,
  Award,
  History,
  ArrowRight
} from 'lucide-react';
import LiveAiInterviewRoom from '../components/LiveAiInterviewRoom';
import { liveInterviewService } from '../services/liveInterviewService';

export default function LiveInterviewPage({ onNavigate: _onNavigate = () => {} }) {
  const [activeTab, setActiveTab] = useState('interview'); // 'interview' | 'history'
  const [selectedMode, setSelectedMode] = useState('career_discovery'); // 'career_discovery' | 'learning_checkpoint'
  const [selectedCheckpoint, setSelectedCheckpoint] = useState({
    title: 'Modern Web Architecture & Data Flow',
    concept: 'Client-Server API communication, state persistence, and error handling',
  });
  const [inActiveInterview, setInActiveInterview] = useState(false);
  const [savedReports, setSavedReports] = useState(() => liveInterviewService.getSavedReports());

  const learningModules = [
    {
      id: 'web-arch',
      title: 'Modern Web Architecture & Data Flow',
      concept: 'Client-Server API communication, state synchronization, and resilience',
      duration: '3 turns • ~5 mins',
    },
    {
      id: 'dsa-tradeoffs',
      title: 'Algorithm & Data Structure Trade-offs',
      concept: 'Space-time complexity, hash maps vs binary trees in production systems',
      duration: '3 turns • ~5 mins',
    },
    {
      id: 'system-design',
      title: 'Scalable System Design & Caching',
      concept: 'Cache invalidation, load balancing, and database indexing',
      duration: '3 turns • ~5 mins',
    },
  ];

  const handleInterviewComplete = (_report) => {
    setSavedReports(liveInterviewService.getSavedReports());
  };

  return (
    <div className="page">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Interview</h1>
          <p className="page-subtitle">Spoken technical assessment and discussion.</p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            onClick={() => {
              setActiveTab('interview');
              setInActiveInterview(false);
            }}
            className={activeTab === 'interview' ? 'btn-primary' : 'btn-secondary'}
            style={{ padding: '6px 14px', borderRadius: '8px', fontSize: '0.85rem' }}
          >
            Interview
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('history');
              setSavedReports(liveInterviewService.getSavedReports());
            }}
            className={activeTab === 'history' ? 'btn-primary' : 'btn-secondary'}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 14px', borderRadius: '8px', fontSize: '0.85rem' }}
          >
            <History size={14} />
            <span>Past reports ({savedReports.length})</span>
          </button>
        </div>
      </div>

      {activeTab === 'interview' && (
        <div>
          {!inActiveInterview ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
              {/* Mode 1: Career Discovery */}
              <div
                onClick={() => setSelectedMode('career_discovery')}
                className="card"
                style={{
                  cursor: 'pointer',
                  border: selectedMode === 'career_discovery' ? '2px solid #FE6904' : '1px solid #EAE7E2',
                  backgroundColor: selectedMode === 'career_discovery' ? '#FFFFFF' : '#FFFFFF',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <span className="badge" style={{ backgroundColor: '#FFE5CE', color: '#FE6904', border: '1px solid #EAE7E2' }}>
                      Career discovery
                    </span>
                    <span style={{ fontSize: '0.8rem', color: '#77736F' }}>
                      4 turns • ~6 mins
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#171717', margin: '0 0 0.5rem 0' }}>
                    Career Discovery Interview
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: '#77736F', lineHeight: 1.5, margin: '0 0 1.25rem 0' }}>
                    Discuss your interests, problem-solving habits, and project scenarios to refine your career direction.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedMode('career_discovery');
                    setInActiveInterview(true);
                  }}
                  className="btn-primary"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '10px 16px', borderRadius: '8px', fontSize: '0.85rem' }}
                >
                  <Mic size={16} />
                  <span>Start interview</span>
                  <ArrowRight size={14} />
                </button>
              </div>

              {/* Mode 2: Learning Checkpoint */}
              <div
                onClick={() => setSelectedMode('learning_checkpoint')}
                className="card"
                style={{
                  cursor: 'pointer',
                  border: selectedMode === 'learning_checkpoint' ? '2px solid #FE6904' : '1px solid #EAE7E2',
                  backgroundColor: '#FFFFFF',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <span className="badge" style={{ backgroundColor: '#F8F8F7', color: '#171717', border: '1px solid #EAE7E2' }}>
                      Checkpoint
                    </span>
                    <span style={{ fontSize: '0.8rem', color: '#77736F' }}>
                      3 turns • ~5 mins
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#171717', margin: '0 0 0.5rem 0' }}>
                    Verbal Learning Checkpoint
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: '#77736F', lineHeight: 1.5, margin: '0 0 1rem 0' }}>
                    Orally explain technical concepts and trade-offs on a selected topic.
                  </p>

                  {/* Module Picker */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '1.25rem' }}>
                    {learningModules.map((mod) => (
                      <div
                        key={mod.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCheckpoint(mod);
                          setSelectedMode('learning_checkpoint');
                        }}
                        style={{
                          padding: '8px 10px',
                          borderRadius: '8px',
                          border: selectedCheckpoint.id === mod.id && selectedMode === 'learning_checkpoint' ? '1px solid #FE6904' : '1px solid #EAE7E2',
                          backgroundColor: selectedCheckpoint.id === mod.id && selectedMode === 'learning_checkpoint' ? '#FFE5CE' : '#F8F8F7',
                          color: '#171717',
                          fontSize: '0.8rem',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <span style={{ fontWeight: 500 }}>{mod.title}</span>
                        <span style={{ fontSize: '0.75rem', color: '#77736F' }}>{mod.duration}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedMode('learning_checkpoint');
                    setInActiveInterview(true);
                  }}
                  className="btn-primary"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '10px 16px', borderRadius: '8px', fontSize: '0.85rem' }}
                >
                  <Mic size={16} />
                  <span>Start checkpoint</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ) : (
            <LiveAiInterviewRoom
              mode={selectedMode}
              checkpointContext={selectedMode === 'learning_checkpoint' ? selectedCheckpoint : null}
              onComplete={handleInterviewComplete}
              onExit={() => setInActiveInterview(false)}
            />
          )}
        </div>
      )}

      {/* History */}
      {activeTab === 'history' && (
        <div>
          {savedReports.length === 0 ? (
            <p style={{ fontSize: '0.9rem', color: '#77736F' }}>
              No completed interviews yet.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {savedReports.map((entry) => (
                <div key={entry.id} className="card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', borderBottom: '1px solid #EAE7E2', paddingBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Award size={16} color="#FE6904" />
                      <span style={{ fontSize: '0.95rem', fontWeight: 600, color: '#171717' }}>
                        {entry.mode === 'career_discovery' ? 'Career discovery interview' : 'Verbal checkpoint'}
                      </span>
                      <span style={{ fontSize: '0.8rem', color: '#77736F' }}>
                        {new Date(entry.timestamp).toLocaleDateString()}
                      </span>
                    </div>

                    <span className="badge" style={{ backgroundColor: '#FFE5CE', color: '#FE6904', border: '1px solid #EAE7E2' }}>
                      Score: {entry.report.conceptualMasteryScore || 88}%
                    </span>
                  </div>

                  <p style={{ fontSize: '0.875rem', color: '#171717', lineHeight: 1.5, margin: '0 0 1rem 0' }}>
                    {entry.report.overallSummary}
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
                    <div style={{ padding: '0.75rem', borderRadius: '8px', backgroundColor: '#F8F8F7', border: '1px solid #EAE7E2' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#171717', display: 'block', marginBottom: '4px' }}>
                        Skills shown
                      </span>
                      <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.8rem', color: '#77736F', lineHeight: 1.5 }}>
                        {(entry.report.demonstratedStrengths || []).slice(0, 3).map((st, i) => (
                          <li key={i}>{st}</li>
                        ))}
                      </ul>
                    </div>

                    <div style={{ padding: '0.75rem', borderRadius: '8px', backgroundColor: '#F8F8F7', border: '1px solid #EAE7E2' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#171717', display: 'block', marginBottom: '4px' }}>
                        Discussion points
                      </span>
                      <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.8rem', color: '#77736F', lineHeight: 1.5 }}>
                        {(entry.report.actionableMentorDiscussionPoints || []).slice(0, 2).map((pt, i) => (
                          <li key={i}>{pt}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
