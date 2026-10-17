import React, { useState, useEffect } from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { StatCard } from '../components/common/StatCard';
import { TrendChart } from '../components/charts/TrendChart';
import { CareerBarChart } from '../components/charts/CareerBarChart';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { StorageService } from '../services/storageService';
import { AnalyticsService } from '../services/analyticsService';
import { useToast } from '../context/ToastContext';
import {
  Users,
  Building2,
  FileCheck2,
  AlertTriangle,
  ArrowRight,
  Download,
  Clock,
  Sparkles,
  Sliders,
  ShieldCheck,
  TrendingUp,
  Video,
  Mic,
  Compass,
  Flame,
  Award,
  Briefcase,
  CheckCircle2,
  GraduationCap,
  Brain,
} from 'lucide-react';

export function DashboardPage({ onNavigate }) {
  const { addToast } = useToast();
  const [timeframe, setTimeframe] = useState('30d');

  const [institutions, setInstitutions] = useState([]);
  const [validations, setValidations] = useState([]);
  const [verbalInterviews, setVerbalInterviews] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);

  const loadData = () => {
    setInstitutions(StorageService.getInstitutions());
    setValidations(StorageService.getHumanValidations());
    setVerbalInterviews(StorageService.getVerbalInterviews());
    setAuditLogs(StorageService.getAuditLogs().slice(0, 5));
  };

  useEffect(() => {
    loadData();
    const handleStoreChange = () => loadData();
    window.addEventListener('zhero_store_change', handleStoreChange);
    return () => window.removeEventListener('zhero_store_change', handleStoreChange);
  }, []);

  const pendingCentres = institutions.filter((i) => i.status === 'PENDING_REVIEW');
  const metrics = AnalyticsService.getSystemMetrics(timeframe);
  const trendData = AnalyticsService.getPlatformTrends();
  const careerData = AnalyticsService.getCareerDistribution();

  const handleExportSummary = () => {
    const summary = [
      { Metric: 'Total Enrolled Students', Value: metrics.totalStudents },
      { Metric: 'Active Daily Streaks', Value: metrics.activeDailyStreaks },
      { Metric: 'Forgetting Curve Spaced Recall Rate', Value: metrics.forgettingCurveRecallRate },
      { Metric: 'Human Mentor Validations (Tuition Centres)', Value: metrics.totalValidations },
      { Metric: 'AI vs Mentor Concordance Rate', Value: metrics.mentorConcordanceRate },
      { Metric: 'Verbal AI Interviews Completed', Value: metrics.totalVerbalInterviews },
      { Metric: 'Anti-Speedrunning Integrity Rate', Value: metrics.verbalInterviewsVerifiedHumanRate },
      { Metric: 'Total Tuition Centres', Value: metrics.totalInstitutions },
      { Metric: 'Pending Centre Approvals', Value: metrics.pendingApprovals },
      { Metric: 'Authorized Partner Companies', Value: metrics.authorizedCompaniesCanPost },
      { Metric: 'Open Industry Bounties', Value: metrics.openBountiesCount },
      { Metric: 'Gemini AI Inferences', Value: metrics.aiTotalRequests },
      { Metric: 'AI Architecture', Value: 'Multimodal Voice + Reverse Proxy + Human Validation' },
    ];
    AnalyticsService.exportToCsv('ZHERO_AI_Human_Ecosystem_Summary', summary);
    addToast('Executive Ecosystem Summary exported to CSV', 'success');
  };

  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <PageHeader
        title="Operations, Human-in-the-Loop & AI Observability"
        description="Unified administration for Zhero: Verbal AI interviews, tuition centre mentor validations via GMeet, cognitive spaced repetition, and industry company bounties."
        actions={
          <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
            <div
              style={{
                display: 'flex',
                backgroundColor: '#FFFFFF',
                border: '1px solid #FAD1C6',
                borderRadius: '10px',
                padding: '2px',
              }}
            >
              {['7d', '30d', '90d', 'all'].map((t) => (
                <button
                  key={t}
                  onClick={() => setTimeframe(t)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '8px',
                    border: 'none',
                    fontSize: '0.75rem',
                    fontWeight: timeframe === t ? 700 : 500,
                    backgroundColor: timeframe === t ? '#FAD1C6' : 'transparent',
                    color: timeframe === t ? '#DB5E8C' : '#77736D',
                    cursor: 'pointer',
                  }}
                >
                  {t.toUpperCase()}
                </button>
              ))}
            </div>

            <Button variant="secondary" icon={Download} onClick={handleExportSummary}>
              Export Summary
            </Button>

            <Button variant="primary" icon={Sparkles} onClick={() => onNavigate('ai-monitoring')}>
              Verbal AI Config
            </Button>
          </div>
        }
      />

      {/* Urgent Alert Banner (Pending Approvals / Speedrun Flags) */}
      {(pendingCentres.length > 0 || metrics.flaggedSpeedrunInterventions > 0) && (
        <div
          style={{
            backgroundColor: '#FCEADE',
            border: '1px solid #FAD1C6',
            borderRadius: '16px',
            padding: '1.25rem 1.5rem',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
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
              <AlertTriangle size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#DB5E8C', margin: 0 }}>
                {pendingCentres.length} Centre Review{pendingCentres.length > 1 ? 's' : ''} &{' '}
                {metrics.flaggedSpeedrunInterventions} Human Mentor Intervention Flag
              </h2>
              <p style={{ fontSize: '0.825rem', color: '#77736D', marginTop: '2px' }}>
                Tuition centres awaiting accreditation licenses and students flagged for abnormal pacing requiring mentor GMeet review.
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onNavigate('institutions')}
            >
              Review Tuition Centres
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => onNavigate('institutions')}
              icon={ArrowRight}
              iconPosition="right"
            >
              Inspect Mentor Validations
            </Button>
          </div>
        </div>
      )}

      {/* Core KPI Stat Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2rem',
        }}
      >
        <StatCard
          title="Enrolled Students"
          value={metrics.totalStudents.toLocaleString()}
          change={`${metrics.activeDailyStreaks} Active Streaks`}
          trend="up"
          subtext="Snapchat-style daily habit"
          icon={Users}
          badgeText="Active Learners"
          onClick={() => onNavigate('users')}
        />

        <StatCard
          title="Human Mentor Validations"
          value={metrics.totalValidations.toString()}
          change={`${metrics.mentorConcordanceRate} AI Concordance`}
          trend="up"
          subtext="Tuition Centre GMeet sign-off"
          icon={Video}
          variant="coral"
          badgeText="Can't rely on just AI"
          onClick={() => onNavigate('institutions')}
        />

        <StatCard
          title="Verbal AI Interviews"
          value={metrics.totalVerbalInterviews.toLocaleString()}
          change="Anti-Speedrunning Active"
          trend="up"
          subtext="Voice tests after course"
          icon={Mic}
          badgeText="Gemini 1.5 Voice"
          onClick={() => onNavigate('ai-monitoring')}
        />

        <StatCard
          title="Cognitive Retention Index"
          value={metrics.forgettingCurveRecallRate}
          change="Spaced Repetition"
          trend="up"
          subtext="Ebbinghaus Forgetting Curve"
          icon={Brain}
          variant="orange"
          badgeText="84.6% vs 22% Decay"
          onClick={() => onNavigate('analytics')}
        />

        <StatCard
          title="Courses & Providers"
          value={`${metrics.totalCoursesOffered || 6} Courses`}
          change={`${metrics.totalCourseEnrollments || 128} Enrolled`}
          trend="up"
          subtext="Offered by verified centres"
          icon={GraduationCap}
          badgeText="Provider Directory"
          onClick={() => onNavigate('courses')}
        />
      </div>

      {/* Differentiator Philosophy Highlight */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #FAD1C6',
          borderRadius: '14px',
          padding: '1.1rem 1.4rem',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.85rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '9px',
              backgroundColor: '#FCEADE',
              color: '#DB5E8C',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <ShieldCheck size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#171717' }}>
              The Hybrid Synergy: Multimodal AI Guidance + Human Validation + Cognitive Habits
            </div>
            <div style={{ fontSize: '0.8rem', color: '#77736D', marginTop: '2px' }}>
              Verbal AI interviews stop speedrunning; tuition centre mentors validate assessments via Google Meet; partner company bounties deliver real-world industry experience; and spaced repetition defeats the forgetting curve.
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Badge variant="coral">Human Intervention Ready</Badge>
          <Badge variant="orange" dot>Anti-Speedrun Active</Badge>
        </div>
      </div>

      {/* Human Validation & Verbal Telemetry Live Feeds */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem',
        }}
      >
        {/* Human-in-the-Loop Mentor Validations Queue */}
        <div className="admin-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#171717', margin: 0 }}>
                Tuition Centre Mentor Validation Pipeline
              </h2>
              <p style={{ fontSize: '0.8rem', color: '#77736D', marginTop: '2px' }}>
                Tuition centre mentors representing Zhero conducting post-assessment GMeet interviews.
              </p>
            </div>
            <Badge variant="coral">GMeet Integrated</Badge>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {validations.slice(0, 4).map((val) => (
              <div
                key={val.id}
                style={{
                  padding: '0.85rem 1rem',
                  borderRadius: '10px',
                  backgroundColor: '#FCEADE',
                  border: '1px solid #FAD1C6',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      backgroundColor: '#FAD1C6',
                      color: '#DB5E8C',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '0.8rem',
                    }}
                  >
                    {val.avatar}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#171717' }}>
                      {val.studentName}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#77736D' }}>
                      {val.aiCareerTrack} • Mentor: {val.mentorName}
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                  <Badge variant={val.status === 'VERIFIED' ? 'orange' : 'coral'}>
                    {val.status}
                  </Badge>
                  <a
                    href={val.gmeetLink}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      fontSize: '0.725rem',
                      color: '#DB5E8C',
                      fontWeight: 700,
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '3px',
                    }}
                  >
                    <Video size={12} />
                    GMeet Link
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '1rem', textAlign: 'center' }}>
            <Button size="sm" variant="secondary" onClick={() => onNavigate('institutions')}>
              Manage All Mentor Validation Sessions →
            </Button>
          </div>
        </div>

        {/* Verbal AI Interviews & Anti-Speedrunning Monitor */}
        <div className="admin-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#171717', margin: 0 }}>
                Verbal AI Interviews & Anti-Speedrun Monitor
              </h2>
              <p style={{ fontSize: '0.8rem', color: '#77736D', marginTop: '2px' }}>
                Voice evaluations after courses preventing rapid AI speedrunning and verifying genuine retention.
              </p>
            </div>
            <Badge variant="orange" dot>Audio AI Active</Badge>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {verbalInterviews.slice(0, 4).map((vi) => (
              <div
                key={vi.id}
                style={{
                  padding: '0.85rem 1rem',
                  borderRadius: '10px',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #FAD1C6',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#171717' }}>
                      {vi.studentName}
                    </span>
                    <span style={{ fontSize: '0.725rem', color: '#77736D' }}>({vi.courseContext})</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#77736D', marginTop: '2px' }}>
                    Spoken Duration: <strong style={{ color: '#171717' }}>{vi.audioDuration}</strong> • Fluency: {vi.fluencyScore}% • Depth: {vi.depthScore}%
                  </div>
                </div>

                <div>
                  <Badge variant={vi.pacingAnomalyDetected ? 'coral' : 'neutral'}>
                    {vi.antiSpeedrunStatus}
                  </Badge>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '1rem', textAlign: 'center' }}>
            <Button size="sm" variant="secondary" onClick={() => onNavigate('ai-monitoring')}>
              Inspect Verbal Voice Latency & Telemetry →
            </Button>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(440px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem',
        }}
      >
        {/* Trend Chart */}
        <div className="admin-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#171717', margin: 0 }}>
                Platform Scale vs. AI Inference Volume
              </h2>
              <p style={{ fontSize: '0.8rem', color: '#77736D', marginTop: '2px' }}>
                Learner onboarding correlated with Gemini automated assessment generation load.
              </p>
            </div>
            <Badge variant="orange" dot>Live Telemetry</Badge>
          </div>
          <TrendChart data={trendData} showAiSeries={true} />
        </div>

        {/* AI Career Recommendations */}
        <div className="admin-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#171717', margin: 0 }}>
                AI-Generated Career Recommendations
              </h2>
              <p style={{ fontSize: '0.8rem', color: '#77736D', marginTop: '2px' }}>
                Distribution across top industrial sectors synthesized by Gemini guidance models.
              </p>
            </div>
            <Badge variant="neutral">Kerala Talent Pool</Badge>
          </div>
          <CareerBarChart data={careerData} />
        </div>
      </div>

      {/* Two Column Section: Quick Actions + Recent Audit Feed */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '1.5rem',
        }}
      >
        {/* Quick Operations Modules */}
        <div className="admin-card">
          <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#171717', marginBottom: '0.5rem' }}>
            Administrative Command Center
          </h2>
          <p style={{ fontSize: '0.825rem', color: '#77736D', marginBottom: '1.25rem' }}>
            Shortcuts to high-frequency operational governance, company bounties, and AI configuration.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <button
              onClick={() => onNavigate('institutions')}
              style={{
                textAlign: 'left',
                padding: '1rem',
                borderRadius: '12px',
                border: '1px solid #FAD1C6',
                backgroundColor: '#FCEADE',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#F5AFAE')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#FAD1C6')}
            >
              <div style={{ color: '#DB5E8C', marginBottom: '0.5rem' }}>
                <Building2 size={20} />
              </div>
              <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#171717' }}>
                Tuition & Mentors
              </div>
              <div style={{ fontSize: '0.75rem', color: '#77736D', marginTop: '2px' }}>
                GMeet interview pipeline
              </div>
            </button>

            <button
              onClick={() => onNavigate('bounties')}
              style={{
                textAlign: 'left',
                padding: '1rem',
                borderRadius: '12px',
                border: '1px solid #FAD1C6',
                backgroundColor: '#FCEADE',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#F5AFAE')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#FAD1C6')}
            >
              <div style={{ color: '#DB5E8C', marginBottom: '0.5rem' }}>
                <Briefcase size={20} />
              </div>
              <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#171717' }}>
                Company Bounties
              </div>
              <div style={{ fontSize: '0.75rem', color: '#77736D', marginTop: '2px' }}>
                Partner problems & stipends
              </div>
            </button>

            <button
              onClick={() => onNavigate('ai-monitoring')}
              style={{
                textAlign: 'left',
                padding: '1rem',
                borderRadius: '12px',
                border: '1px solid #FAD1C6',
                backgroundColor: '#FCEADE',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#F5AFAE')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#FAD1C6')}
            >
              <div style={{ color: '#DB5E8C', marginBottom: '0.5rem' }}>
                <Mic size={20} />
              </div>
              <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#171717' }}>
                Verbal AI & Quotas
              </div>
              <div style={{ fontSize: '0.75rem', color: '#77736D', marginTop: '2px' }}>
                Voice latency & anti-speedrun
              </div>
            </button>

            <button
              onClick={() => onNavigate('users')}
              style={{
                textAlign: 'left',
                padding: '1rem',
                borderRadius: '12px',
                border: '1px solid #FAD1C6',
                backgroundColor: '#FCEADE',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#F5AFAE')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#FAD1C6')}
            >
              <div style={{ color: '#DB5E8C', marginBottom: '0.5rem' }}>
                <Users size={20} />
              </div>
              <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#171717' }}>
                User Directory
              </div>
              <div style={{ fontSize: '0.75rem', color: '#77736D', marginTop: '2px' }}>
                Students, centres & roles
              </div>
            </button>

            <button
              onClick={() => onNavigate('courses')}
              style={{
                textAlign: 'left',
                padding: '1rem',
                borderRadius: '12px',
                border: '1px solid #FAD1C6',
                backgroundColor: '#FCEADE',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#F5AFAE')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#FAD1C6')}
            >
              <div style={{ color: '#DB5E8C', marginBottom: '0.5rem' }}>
                <GraduationCap size={20} />
              </div>
              <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#171717' }}>
                Course Offerings
              </div>
              <div style={{ fontSize: '0.75rem', color: '#77736D', marginTop: '2px' }}>
                Tuition providers & syllabus
              </div>
            </button>

            <button
              onClick={() => onNavigate('analytics')}
              style={{
                textAlign: 'left',
                padding: '1rem',
                borderRadius: '12px',
                border: '1px solid #FAD1C6',
                backgroundColor: '#FCEADE',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#F5AFAE')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#FAD1C6')}
            >
              <div style={{ color: '#DB5E8C', marginBottom: '0.5rem' }}>
                <Brain size={20} />
              </div>
              <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#171717' }}>
                Cognitive Analytics
              </div>
              <div style={{ fontSize: '0.75rem', color: '#77736D', marginTop: '2px' }}>
                Forgetting curve & cohorts
              </div>
            </button>
          </div>
        </div>

        {/* Live Administrative Audit Trail */}
        <div className="admin-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#171717', margin: 0 }}>
              Recent Administrative Activity
            </h2>
            <button
              onClick={() => onNavigate('audit-logs')}
              style={{
                border: 'none',
                background: 'transparent',
                color: '#DB5E8C',
                fontSize: '0.785rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              View Full Audit Trail →
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {auditLogs.map((log) => (
              <div
                key={log.id}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.75rem',
                  padding: '0.75rem',
                  borderRadius: '10px',
                  backgroundColor: '#FCEADE',
                  border: '1px solid #FAD1C6',
                  fontSize: '0.825rem',
                }}
              >
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '7px',
                    backgroundColor: '#FAD1C6',
                    color: '#DB5E8C',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: '2px',
                  }}
                >
                  <Clock size={14} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 700, color: '#171717' }}>{log.action}</span>
                    <span style={{ fontSize: '0.7rem', color: '#9E9B95' }}>{log.timestamp.slice(11, 16)}</span>
                  </div>
                  <p style={{ color: '#77736D', fontSize: '0.785rem', marginTop: '2px', lineHeight: 1.3 }}>
                    <strong style={{ color: '#171717' }}>{log.target}</strong>: {log.details}
                  </p>
                  <span style={{ fontSize: '0.7rem', color: '#9E9B95', display: 'block', marginTop: '4px' }}>
                    By {log.admin}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
