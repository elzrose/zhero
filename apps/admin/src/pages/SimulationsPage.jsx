import React, { useState, useEffect } from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { StatCard } from '../components/common/StatCard';
import { Modal } from '../components/common/Modal';
import { StorageService } from '../services/storageService';
import { useToast } from '../context/ToastContext';
import {
  Briefcase,
  Sparkles,
  Users,
  Compass,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  MessageSquare,
  Award,
  Plus,
  Search,
} from 'lucide-react';

export function SimulationsPage() {
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState('simulations'); // 'simulations' | 'alumni' | 'bounties'
  const [simulations, setSimulations] = useState([]);
  const [bounties, setBounties] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadData = () => {
    setSimulations(StorageService.getCareerSimulations());
    setBounties(StorageService.getBounties());
  };

  useEffect(() => {
    loadData();
    const handleStoreChange = () => loadData();
    window.addEventListener('zhero_store_change', handleStoreChange);
    return () => window.removeEventListener('zhero_store_change', handleStoreChange);
  }, []);

  const filteredSimulations = simulations.filter(
    (s) =>
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.careerTrack.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredBounties = bounties.filter(
    (b) =>
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.careerTrack.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.sponsor.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenDetail = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Simulations, Alumni Insights & Bounties"
        description="Bridge classroom theory with real-world reality checks: Day-in-the-life career crisis simulations, alumni experiential advice, and industry bounties."
        actions={
          <div style={{ display: 'flex', gap: '0.6rem' }}>
            <Button
              variant="secondary"
              icon={Sparkles}
              onClick={() => {
                addToast('Alumni scenario contribution sync updated', 'info');
              }}
            >
              Sync Alumni Repository
            </Button>
            <Button
              variant="primary"
              icon={Plus}
              onClick={() => {
                addToast('Bounty partner intake form opened for tuition partners', 'success');
              }}
            >
              Post Industry Bounty
            </Button>
          </div>
        }
      />

      {/* Top Value Proposition & Architectural Banner */}
      <div
        style={{
          backgroundColor: '#FCEADE',
          border: '1px solid #FAD1C6',
          borderRadius: '12px',
          padding: '1rem 1.25rem',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
        }}
      >
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            backgroundColor: '#FAD1C6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#DB5E8C',
            flexShrink: 0,
          }}
        >
          <Compass size={22} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#171717' }}>
            AI-Driven Career Simulation & Expectation Calibration
          </div>
          <div style={{ fontSize: '0.8rem', color: '#77736D', marginTop: '2px' }}>
            "Students may like the idea of a career, but don't know what they're truly signing up for." Simulations put students in high-stress, real-life dilemmas to eliminate romanticized career fallacies before graduation.
          </div>
        </div>
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #FAD1C6',
            padding: '6px 12px',
            borderRadius: '8px',
            textAlign: 'center',
            flexShrink: 0,
          }}
        >
          <div style={{ fontSize: '0.7rem', color: '#77736D', fontWeight: 600 }}>Reality-Gap Shift Rate</div>
          <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#DB5E8C' }}>41.2%</div>
        </div>
      </div>

      {/* Metric Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem',
          marginBottom: '1.5rem',
        }}
      >
        <StatCard
          title="Active Simulations"
          value={simulations.length.toString()}
          subtitle="Real-world scenario dilemmas"
          icon={Compass}
        />
        <StatCard
          title="Alumni Reality Check Index"
          value="100%"
          subtitle="Vetted alumni contributors"
          icon={MessageSquare}
          variant="coral"
        />
        <StatCard
          title="Industry Bounties Open"
          value={bounties.filter((b) => b.status === 'OPEN').length.toString()}
          subtitle="Paid student challenges"
          icon={Award}
          variant="orange"
        />
        <StatCard
          title="Active Scenario Takers"
          value="1,020"
          subtitle="Students undergoing simulations"
          icon={Users}
        />
      </div>

      {/* Tabs Navigation */}
      <div
        style={{
          display: 'flex',
          borderBottom: '1px solid #FAD1C6',
          marginBottom: '1.25rem',
          gap: '0.5rem',
        }}
      >
        {[
          { id: 'simulations', label: 'Career Reality Simulations', count: simulations.length },
          { id: 'alumni', label: 'Alumni "Reality Check" Vault', count: simulations.length },
          { id: 'bounties', label: 'Industry Bounties & Job Opps', count: bounties.length },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '0.65rem 1.1rem',
              border: 'none',
              background: 'transparent',
              borderBottom: activeTab === tab.id ? '2px solid #DB5E8C' : '2px solid transparent',
              color: activeTab === tab.id ? '#DB5E8C' : '#77736D',
              fontWeight: activeTab === tab.id ? 700 : 500,
              fontSize: '0.875rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            {tab.label}
            <span
              style={{
                fontSize: '0.725rem',
                padding: '2px 6px',
                borderRadius: '9999px',
                backgroundColor: activeTab === tab.id ? '#FAD1C6' : '#FCEADE',
                color: '#DB5E8C',
              }}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div style={{ marginBottom: '1.25rem', maxWidth: '420px', position: 'relative' }}>
        <input
          type="text"
          className="admin-input"
          placeholder="Filter by title, career track, or category..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ paddingLeft: '2.25rem' }}
        />
        <Search
          size={16}
          style={{
            position: 'absolute',
            left: '0.75rem',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#77736D',
          }}
        />
      </div>

      {/* Tab 1: Career Reality Simulations */}
      {activeTab === 'simulations' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {filteredSimulations.map((sim) => (
            <div
              key={sim.id}
              className="admin-card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <Badge variant="coral">{sim.careerTrack}</Badge>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#77736D' }}>
                    {sim.decisionPoints} Decision Gates
                  </span>
                </div>

                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#171717', marginBottom: '0.5rem', lineHeight: 1.4 }}>
                  {sim.title}
                </h3>
                <p style={{ fontSize: '0.775rem', color: '#77736D', marginBottom: '1rem' }}>
                  Category: {sim.category}
                </p>

                {/* Alumni Insight Quote */}
                <div
                  style={{
                    backgroundColor: '#FCEADE',
                    borderLeft: '3px solid #DB5E8C',
                    padding: '0.75rem',
                    borderRadius: '0 8px 8px 0',
                    fontSize: '0.775rem',
                    fontStyle: 'italic',
                    color: '#171717',
                    marginBottom: '1rem',
                  }}
                >
                  "{sim.alumniQuote}"
                  <div style={{ fontStyle: 'normal', fontWeight: 700, color: '#DB5E8C', marginTop: '4px', fontSize: '0.725rem' }}>
                    — {sim.alumniAuthor}
                  </div>
                </div>

                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #FAD1C6',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '8px',
                    fontSize: '0.75rem',
                    marginBottom: '1rem',
                  }}
                >
                  <span style={{ fontWeight: 700, color: '#DB5E8C' }}>Expectation Gap Insight: </span>
                  <span style={{ color: '#77736D' }}>{sim.studentExpectationRealityGap}</span>
                </div>
              </div>

              <div
                style={{
                  borderTop: '1px solid #FAD1C6',
                  paddingTop: '0.75rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div style={{ fontSize: '0.75rem', color: '#77736D' }}>
                  Completion: <strong style={{ color: '#171717' }}>{sim.completionRate}</strong> ({sim.activeParticipants} attempts)
                </div>
                <Button size="sm" variant="secondary" onClick={() => handleOpenDetail(sim)}>
                  Inspect Simulation
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Alumni Reality Check Vault */}
      {activeTab === 'alumni' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div
            style={{
              padding: '0.85rem 1rem',
              backgroundColor: '#FFFFFF',
              border: '1px solid #FAD1C6',
              borderRadius: '10px',
              fontSize: '0.825rem',
              color: '#77736D',
            }}
          >
            Alumni quotes are contributed by working professionals to prevent students from having unrealistic fantasies about jobs. These quotes are directly embedded into dynamic career simulations.
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
            {simulations.map((item) => (
              <div key={item.id} className="admin-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#DB5E8C' }}>{item.careerTrack}</span>
                  <Badge variant="orange">VERIFIED ALUMNI</Badge>
                </div>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#171717', marginBottom: '0.75rem', lineHeight: 1.5 }}>
                  "{item.alumniQuote}"
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #FAD1C6', paddingTop: '0.5rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#77736D' }}>{item.alumniAuthor}</span>
                  <span style={{ fontSize: '0.725rem', color: '#DB5E8C', fontWeight: 700 }}>Injected into {item.id}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Industry Bounties & Job Opps */}
      {activeTab === 'bounties' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div
            style={{
              padding: '0.85rem 1rem',
              backgroundColor: '#FCEADE',
              border: '1px solid #FAD1C6',
              borderRadius: '10px',
              fontSize: '0.825rem',
              color: '#171717',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <strong>Practical Proof-of-Work Bounties:</strong> Tuition centres and industry partners sponsor real tasks. When students finish, they receive stipends and direct fast-track job interviews.
            </div>
            <Badge variant="coral">JOB OPPS PIPELINE</Badge>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
            {filteredBounties.map((bounty) => (
              <div key={bounty.id} className="admin-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <Badge variant="orange">{bounty.careerTrack}</Badge>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: '#DB5E8C',
                        backgroundColor: '#FAD1C6',
                        padding: '2px 8px',
                        borderRadius: '6px',
                      }}
                    >
                      {bounty.reward}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#171717', marginBottom: '0.35rem' }}>
                    {bounty.title}
                  </h3>
                  <p style={{ fontSize: '0.775rem', color: '#77736D', marginBottom: '0.85rem' }}>
                    Sponsor: <strong>{bounty.sponsor}</strong>
                  </p>

                  <div
                    style={{
                      display: 'flex',
                      gap: '0.5rem',
                      fontSize: '0.75rem',
                      color: '#77736D',
                      marginBottom: '1rem',
                      backgroundColor: '#FFFFFF',
                      padding: '0.5rem',
                      borderRadius: '6px',
                      border: '1px solid #FAD1C6',
                    }}
                  >
                    <div>Difficulty: <strong style={{ color: '#171717' }}>{bounty.difficulty}</strong></div>
                    <div>•</div>
                    <div>Deadline: <strong style={{ color: '#171717' }}>{bounty.deadline}</strong></div>
                  </div>
                </div>

                <div
                  style={{
                    borderTop: '1px solid #FAD1C6',
                    paddingTop: '0.75rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span style={{ fontSize: '0.75rem', color: '#77736D' }}>
                    Submissions: <strong style={{ color: '#171717' }}>{bounty.submissionsCount}</strong> ({bounty.verifiedPassports} verified)
                  </span>
                  <Button size="sm" variant="primary" onClick={() => handleOpenDetail(bounty)}>
                    Review Submissions
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {isModalOpen && selectedItem && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={selectedItem.title}
          subtitle={`Track: ${selectedItem.careerTrack} • ID: ${selectedItem.id}`}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.85rem' }}>
            {selectedItem.alumniQuote && (
              <div style={{ backgroundColor: '#FCEADE', padding: '1rem', borderRadius: '8px', border: '1px solid #FAD1C6' }}>
                <div style={{ fontWeight: 700, color: '#DB5E8C', marginBottom: '4px' }}>Alumni Reality Check Prompt</div>
                <div style={{ fontStyle: 'italic', color: '#171717' }}>"{selectedItem.alumniQuote}"</div>
                <div style={{ fontSize: '0.75rem', color: '#77736D', marginTop: '6px' }}>— {selectedItem.alumniAuthor}</div>
              </div>
            )}

            {selectedItem.reward && (
              <div style={{ backgroundColor: '#FCEADE', padding: '1rem', borderRadius: '8px', border: '1px solid #FAD1C6' }}>
                <div style={{ fontWeight: 700, color: '#DB5E8C', marginBottom: '4px' }}>Sponsor Incentive & Placement</div>
                <div style={{ fontWeight: 800, fontSize: '1rem', color: '#171717' }}>{selectedItem.reward}</div>
                <div style={{ fontSize: '0.75rem', color: '#77736D', marginTop: '4px' }}>Provided by: {selectedItem.sponsor}</div>
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div style={{ padding: '0.75rem', border: '1px solid #FAD1C6', borderRadius: '8px', backgroundColor: '#FFFFFF' }}>
                <div style={{ fontSize: '0.725rem', color: '#77736D' }}>Status</div>
                <div style={{ fontWeight: 700, color: '#DB5E8C' }}>{selectedItem.status || 'ACTIVE'}</div>
              </div>
              <div style={{ padding: '0.75rem', border: '1px solid #FAD1C6', borderRadius: '8px', backgroundColor: '#FFFFFF' }}>
                <div style={{ fontSize: '0.725rem', color: '#77736D' }}>Verification Standard</div>
                <div style={{ fontWeight: 700, color: '#171717' }}>Zhero Verified Passport</div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' }}>
              <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
                Close
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  addToast('Simulation audit passed and published to student mobile roadmap', 'success');
                  setIsModalOpen(false);
                }}
              >
                Approve & Sync Live
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
