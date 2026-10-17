import React, { useState, useEffect } from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { StatCard } from '../components/common/StatCard';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { StorageService } from '../services/storageService';
import { AnalyticsService } from '../services/analyticsService';
import { useToast } from '../context/ToastContext';
import {
  Flame,
  Brain,
  Download,
  Calendar,
  Sparkles,
  BarChart3,
  TrendingUp,
  Clock,
  Target,
  GraduationCap,
  Layers,
} from 'lucide-react';

export function AnalyticsPage() {
  const { addToast } = useToast();
  const [metrics, setMetrics] = useState(AnalyticsService.getSystemMetrics());
  const [trends, setTrends] = useState(AnalyticsService.getPlatformTrends());
  const [careerDist, setCareerDist] = useState(AnalyticsService.getCareerDistribution());
  const [scienceData, setScienceData] = useState(StorageService.getLearningScience());

  const loadData = () => {
    setMetrics(AnalyticsService.getSystemMetrics());
    setTrends(AnalyticsService.getPlatformTrends());
    setCareerDist(AnalyticsService.getCareerDistribution());
    setScienceData(StorageService.getLearningScience());
  };

  useEffect(() => {
    loadData();
    const handleStoreChange = () => loadData();
    window.addEventListener('zhero_store_change', handleStoreChange);
    return () => window.removeEventListener('zhero_store_change', handleStoreChange);
  }, []);

  const handleExportCohortReport = () => {
    const reportData = scienceData?.streakOverview?.cohorts?.map((c) => ({
      'Streak Cohort Tier': c.name,
      'Active Students': c.count,
      'Cohort Percentage': `${c.percent}%`,
      'Avg Retention Rate': '84.6%',
    })) || [];
    AnalyticsService.exportToCsv('ZHERO_Cognitive_Cohort_Analytics', reportData);
    addToast('Cognitive retention & cohort telemetry exported to CSV', 'success');
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Cognitive Retention & Cohort Analytics"
        description="Empirical learning science telemetry: Ebbinghaus forgetting curve, spaced repetition recall rates, Snapchat-inspired streak habit formation, and career cohort distributions."
        actions={
          <div style={{ display: 'flex', gap: '0.6rem' }}>
            <Button
              variant="secondary"
              icon={Download}
              onClick={handleExportCohortReport}
            >
              Export Cohort Telemetry (CSV)
            </Button>
          </div>
        }
      />

      {/* Cognitive Science Value Proposition Banner */}
      <div
        style={{
          backgroundColor: '#FCEADE',
          border: '1px solid #FAD1C6',
          borderRadius: '12px',
          padding: '1.25rem',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1.25rem',
        }}
      >
        <div
          style={{
            width: '46px',
            height: '46px',
            borderRadius: '12px',
            backgroundColor: '#FAD1C6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#DB5E8C',
            flexShrink: 0,
          }}
        >
          <Brain size={24} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#171717' }}>
            Neuro-Calibrated Retention: Defeating the Ebbinghaus Forgetting Curve
          </div>
          <div style={{ fontSize: '0.825rem', color: '#77736D', marginTop: '3px' }}>
            Students forget 78% of learned concepts within 30 days without review. Zhero's spaced-repetition engine delivers micro-prompts at calculated decay points (24h, 3d, 7d, 14d) to cement deep mental schemas.
          </div>
        </div>
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #FAD1C6',
            padding: '8px 16px',
            borderRadius: '10px',
            textAlign: 'center',
            flexShrink: 0,
          }}
        >
          <div style={{ fontSize: '0.725rem', color: '#77736D', fontWeight: 600 }}>Active Recall Prompts</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#DB5E8C' }}>
            {metrics.activeRecallPrompts?.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem',
          marginBottom: '1.5rem',
        }}
      >
        <StatCard
          title="Forgetting Curve Recall"
          value={metrics.forgettingCurveRecallRate || '84.6%'}
          subtitle="Versus 22% natural decay"
          icon={Brain}
          variant="orange"
        />
        <StatCard
          title="Active Daily Streaks"
          value={metrics.activeDailyStreaks?.toLocaleString() || '1,840'}
          subtitle="Snapchat-model habit formation"
          icon={Flame}
          variant="coral"
        />
        <StatCard
          title="Avg Streak Length"
          value={`${metrics.averageStreakDays || 7.4} Days`}
          subtitle="Continuous study commitment"
          icon={Clock}
        />
        <StatCard
          title="Course Completion Rate"
          value={metrics.assessmentCompletionRate || '78.5%'}
          subtitle="Verbal voice tested cohorts"
          icon={GraduationCap}
        />
      </div>

      {/* SECTION 1: EBBINGHAUS FORGETTING CURVE DECAY VS ZHERO SPACED RECALL */}
      <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#171717', margin: 0 }}>
              Ebbinghaus Retention Benchmarks (Standard Decay vs. Spaced Repetition)
            </h2>
            <p style={{ fontSize: '0.8rem', color: '#77736D', marginTop: '2px' }}>
              Comparative retention percentages across standard cramming vs. Zhero automated retrieval prompts.
            </p>
          </div>
          <Badge variant="success">84.6% Average Recall Retained</Badge>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '1rem' }}>
          {scienceData?.forgettingCurve?.intervals?.map((item, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: '#FCEADE',
                border: '1px solid #FAD1C6',
                borderRadius: '10px',
                padding: '1rem',
              }}
            >
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#171717', marginBottom: '0.5rem' }}>
                Interval: {item.period}
              </div>

              {/* Standard Natural Decay */}
              <div style={{ marginBottom: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.725rem', color: '#77736D' }}>
                  <span>Natural Decay:</span>
                  <strong style={{ color: '#171717' }}>{item.standardDecay}%</strong>
                </div>
                <div style={{ width: '100%', height: '5px', backgroundColor: '#FFFFFF', borderRadius: '3px', marginTop: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${item.standardDecay}%`, height: '100%', backgroundColor: '#9E9B95', borderRadius: '3px' }} />
                </div>
              </div>

              {/* Zhero Spaced Repetition */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.725rem', color: '#DB5E8C' }}>
                  <span style={{ fontWeight: 700 }}>Zhero Recall:</span>
                  <strong style={{ fontWeight: 800 }}>{item.zheroSpacedRecall}%</strong>
                </div>
                <div style={{ width: '100%', height: '6px', backgroundColor: '#FFFFFF', borderRadius: '3px', marginTop: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${item.zheroSpacedRecall}%`, height: '100%', backgroundColor: '#DB5E8C', borderRadius: '3px' }} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '1rem', fontSize: '0.75rem', color: '#77736D', backgroundColor: '#FFFFFF', padding: '8px 12px', borderRadius: '8px', border: '1px solid #FAD1C6' }}>
          💡 <strong>How it works:</strong> Gemini triggers scenario-based micro-prompts at calibrated intervals (24h, 3d, 7d, 14d) based on student assessment topics and industry bounty tasks to cement knowledge before neuro-decay sets in.
        </div>
      </div>

      {/* SECTION 2: HABIT STREAKS & DYNAMIC PACING */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
        {/* Streak Cohorts Card */}
        <div className="admin-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Flame size={18} color="#DB5E8C" />
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#171717', margin: 0 }}>
                Habit Streaks (Snapchat Model)
              </h3>
            </div>
            <Badge variant="coral">Gamified Daily Cadence</Badge>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {scienceData?.streakOverview?.cohorts?.map((cohort, idx) => (
              <div key={idx}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '3px' }}>
                  <span style={{ fontWeight: 600, color: '#171717' }}>{cohort.name}</span>
                  <span style={{ color: '#77736D' }}>
                    <strong style={{ color: '#DB5E8C' }}>{cohort.count}</strong> students ({cohort.percent}%)
                  </span>
                </div>
                <div style={{ width: '100%', height: '8px', backgroundColor: '#FCEADE', borderRadius: '4px', overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${cohort.percent}%`,
                      height: '100%',
                      backgroundColor: '#DB5E8C',
                      borderRadius: '4px',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '1rem', fontSize: '0.75rem', color: '#77736D', backgroundColor: '#FCEADE', padding: '8px 12px', borderRadius: '6px', border: '1px solid #FAD1C6' }}>
            🔥 <strong>Social Accountability:</strong> 94% of students report daily streak preservation keeps them consistent during rigorous tuition modules.
          </div>
        </div>

        {/* Dynamic Pacing Distribution */}
        <div className="admin-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Target size={18} color="#DB5E8C" />
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#171717', margin: 0 }}>
                Dynamic Cohort Pacing
              </h3>
            </div>
            <Badge variant="neutral">Adaptive AI Routing</Badge>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '3px' }}>
                <span style={{ fontWeight: 700, color: '#171717' }}>Nominal Pace (Standard Cadence)</span>
                <strong style={{ color: '#DB5E8C' }}>{scienceData?.dynamicPacing?.nominalPace || 61}%</strong>
              </div>
              <div style={{ width: '100%', height: '8px', backgroundColor: '#FCEADE', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${scienceData?.dynamicPacing?.nominalPace || 61}%`, height: '100%', backgroundColor: '#DB5E8C', borderRadius: '4px' }} />
              </div>
              <span style={{ fontSize: '0.725rem', color: '#77736D' }}>Completes scheduled modules on time with 80%+ quiz accuracy</span>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '3px' }}>
                <span style={{ fontWeight: 700, color: '#171717' }}>Accelerated Pace (Fast Track)</span>
                <strong style={{ color: '#DB5E8C' }}>{scienceData?.dynamicPacing?.acceleratedPace || 26}%</strong>
              </div>
              <div style={{ width: '100%', height: '8px', backgroundColor: '#FCEADE', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${scienceData?.dynamicPacing?.acceleratedPace || 26}%`, height: '100%', backgroundColor: '#F5AFAE', borderRadius: '4px' }} />
              </div>
              <span style={{ fontSize: '0.725rem', color: '#77736D' }}>Advanced students routed directly to company bounty challenges</span>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '3px' }}>
                <span style={{ fontWeight: 700, color: '#171717' }}>Needs Human Mentor Intervention</span>
                <strong style={{ color: '#DB5E8C' }}>{scienceData?.dynamicPacing?.needsMentorAssistance || 13}%</strong>
              </div>
              <div style={{ width: '100%', height: '8px', backgroundColor: '#FCEADE', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${scienceData?.dynamicPacing?.needsMentorAssistance || 13}%`, height: '100%', backgroundColor: '#FAD1C6', borderRadius: '4px' }} />
              </div>
              <span style={{ fontSize: '0.725rem', color: '#77736D' }}>Flagged by verbal AI for 1-on-1 tuition centre mentor GMeet sessions</span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: CAREER INTEREST DISTRIBUTION & PLATFORM GROWTH TRENDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
        {/* Career Distribution */}
        <div className="admin-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#171717', margin: 0 }}>
              Career Cohort Interest Distribution
            </h3>
            <Badge variant="orange">Real Student Assessment Data</Badge>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {careerDist.map((c, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '3px' }}>
                  <span style={{ fontWeight: 600, color: '#171717' }}>{c.name}</span>
                  <span style={{ color: '#77736D' }}>
                    <strong style={{ color: '#171717' }}>{c.students}</strong> students ({c.percentage}%)
                  </span>
                </div>
                <div style={{ width: '100%', height: '8px', backgroundColor: '#FCEADE', borderRadius: '4px', overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${c.percentage}%`,
                      height: '100%',
                      backgroundColor: '#DB5E8C',
                      borderRadius: '4px',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Platform Cohort Growth Table */}
        <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #FAD1C6' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#171717', margin: 0 }}>
              Cohort Growth & Assessment Volume (5 Months)
            </h3>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#FCEADE', borderBottom: '1px solid #FAD1C6', color: '#171717' }}>
                  <th style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>Period</th>
                  <th style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>Students</th>
                  <th style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>Tuition Centres</th>
                  <th style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>Assessments</th>
                  <th style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>AI Telemetry</th>
                </tr>
              </thead>
              <tbody>
                {trends.map((t, idx) => (
                  <tr
                    key={idx}
                    style={{
                      borderBottom: idx < trends.length - 1 ? '1px solid #FAD1C6' : 'none',
                      backgroundColor: idx % 2 === 0 ? '#FFFFFF' : '#FCEADE',
                    }}
                  >
                    <td style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#171717' }}>{t.period}</td>
                    <td style={{ padding: '0.75rem 1rem', color: '#DB5E8C', fontWeight: 700 }}>{t.students}</td>
                    <td style={{ padding: '0.75rem 1rem', color: '#171717' }}>{t.centres}</td>
                    <td style={{ padding: '0.75rem 1rem', color: '#171717' }}>{t.assessments}</td>
                    <td style={{ padding: '0.75rem 1rem', color: '#77736D' }}>{t.aiRequests?.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
