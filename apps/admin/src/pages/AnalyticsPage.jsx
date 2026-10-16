import React, { useState } from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { StatCard } from '../components/common/StatCard';
import { TrendChart } from '../components/charts/TrendChart';
import { CareerBarChart } from '../components/charts/CareerBarChart';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { AnalyticsService } from '../services/analyticsService';
import { useToast } from '../context/ToastContext';
import {
  Download,
  Users,
  Building2,
  FileCheck2,
  Sparkles,
  Zap,
  Compass,
  Cpu,
  Flame,
  Award,
  Activity,
} from 'lucide-react';
import { StorageService } from '../services/storageService';

export function AnalyticsPage() {
  const { addToast } = useToast();
  const [dateRange, setDateRange] = useState('30d');

  const metrics = AnalyticsService.getSystemMetrics(dateRange);
  const trendData = AnalyticsService.getPlatformTrends();
  const careerData = AnalyticsService.getCareerDistribution();
  const centreData = AnalyticsService.getCentrePerformance();
  const aiTasks = AnalyticsService.getAiTaskActivity();
  const science = StorageService.getLearningScience();

  const handleExportCentres = () => {
    AnalyticsService.exportToCsv('ZHERO_Tuition_Centres_Audit_Report', centreData);
    addToast('Tuition Centre Cohort Audit exported to CSV', 'success');
  };

  const handleExportCareers = () => {
    AnalyticsService.exportToCsv('ZHERO_Student_Career_Aspirations_Report', careerData);
    addToast('AI Career Aspirations Report exported to CSV', 'success');
  };

  const handleExportAiTelemetry = () => {
    const aiSummary = [
      { Metric: 'Total AI Inferences', Value: metrics.aiTotalRequests },
      { Metric: 'Successful Inferences', Value: metrics.aiSuccessfulRequests },
      { Metric: 'Failed Inferences', Value: metrics.aiFailedRequests },
      { Metric: 'Success Rate', Value: `${metrics.aiSuccessRate}%` },
      { Metric: 'Average Latency', Value: `${metrics.aiAvgLatencyMs} ms` },
      { Metric: 'Estimated Quota Cost', Value: `$${metrics.aiEstimatedCostUsd}` },
    ];
    AnalyticsService.exportToCsv('ZHERO_AI_Inference_Executive_Summary', aiSummary);
    addToast('AI Observability Summary exported to CSV', 'success');
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Platform Analytics & AI Intelligence"
        description="Comprehensive audit of institutional cohort readiness, automated Gemini generative workload, and student career match distribution."
        actions={
          <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', backgroundColor: '#FFFFFF', border: '1px solid #FAD1C6', borderRadius: '10px', padding: '2px' }}>
              {['7d', '30d', '90d', 'all'].map((range) => (
                <button
                  key={range}
                  onClick={() => {
                    setDateRange(range);
                    addToast(`Filtered analytics for ${range.toUpperCase()}`, 'info');
                  }}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '8px',
                    border: 'none',
                    fontSize: '0.75rem',
                    fontWeight: dateRange === range ? 700 : 500,
                    backgroundColor: dateRange === range ? '#FAD1C6' : 'transparent',
                    color: dateRange === range ? '#DB5E8C' : '#77736D',
                    cursor: 'pointer',
                  }}
                >
                  {range.toUpperCase()}
                </button>
              ))}
            </div>

            <Button variant="secondary" icon={Download} onClick={handleExportCentres}>
              Centres (CSV)
            </Button>
            <Button variant="secondary" icon={Download} onClick={handleExportCareers}>
              Careers (CSV)
            </Button>
            <Button variant="primary" icon={Sparkles} onClick={handleExportAiTelemetry}>
              AI Metrics (CSV)
            </Button>
          </div>
        }
      />

      {/* 4 Summary Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2rem',
        }}
      >
        <StatCard
          title="Total Student Footprint"
          value={metrics.totalStudents.toLocaleString()}
          change="+18.4%"
          trend="up"
          subtext="Sponsored access"
          icon={Users}
          badgeText="Active Pipeline"
        />
        <StatCard
          title="Tuition Centre Network"
          value={metrics.totalInstitutions}
          change="4 Enterprise"
          trend="up"
          subtext={`${metrics.pendingApprovals} Pending Review`}
          icon={Building2}
          badgeText={`${metrics.seatUtilization}% Quota`}
        />
        <StatCard
          title="Gemini AI Inferences"
          value={metrics.aiTotalRequests.toLocaleString()}
          change={`${metrics.aiSuccessRate}% Success`}
          trend="up"
          subtext={`Avg Latency: ${metrics.aiAvgLatencyMs}ms`}
          icon={Sparkles}
          badgeText="Gemini 1.5 Flash"
        />
        <StatCard
          title="Completed Assessments"
          value={metrics.totalAssessmentsAttempted.toLocaleString()}
          change={`${metrics.assessmentCompletionRate} rate`}
          trend="up"
          subtext="Dynamic AI Questions"
          icon={FileCheck2}
          badgeText="Zero Manual Input"
        />
      </div>

      {/* AI Task Workload Breakdown Cards */}
      <div className="admin-card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#171717', margin: 0 }}>
              Autonomous AI Generative Workload Distribution
            </h2>
            <p style={{ fontSize: '0.8rem', color: '#77736D', marginTop: '2px' }}>
              Breakdown of Google Gemini model invocations across core educational sub-pipelines.
            </p>
          </div>
          <Badge variant="orange" dot>
            Upstream Telemetry
          </Badge>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
          {aiTasks.map((task, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: '#FCEADE',
                border: '1px solid #FAD1C6',
                borderRadius: '12px',
                padding: '1rem 1.25rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.825rem', fontWeight: 700, color: '#171717', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {task.name === 'Career Guidance' ? (
                    <Compass size={16} color="#DB5E8C" />
                  ) : task.name === 'Skill-Gap Diagnostics' ? (
                    <Zap size={16} color="#DB5E8C" />
                  ) : (
                    <Cpu size={16} color="#DB5E8C" />
                  )}
                  {task.name}
                </span>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#DB5E8C' }}>{task.percentage}%</span>
              </div>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#171717' }}>
                {task.requests.toLocaleString()} <span style={{ fontSize: '0.75rem', fontWeight: 500, color: '#77736D' }}>calls</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#77736D', marginTop: '4px' }}>
                Avg Latency: <strong>{task.latency}</strong>
              </div>
              <div style={{ width: '100%', height: '6px', backgroundColor: '#FAD1C6', borderRadius: '3px', marginTop: '8px', overflow: 'hidden' }}>
                <div style={{ width: `${task.percentage}%`, height: '100%', backgroundColor: '#DB5E8C', borderRadius: '3px' }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cognitive Science: Ebbinghaus Forgetting Curve & Spaced Repetition */}
      <div className="admin-card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#171717', margin: 0 }}>
                Ebbinghaus Forgetting Curve & Spaced Repetition Analytics
              </h2>
              <Badge variant="coral">Cognitive Science</Badge>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#77736D', marginTop: '2px' }}>
              Measuring memory retention over time: Standard decay without reinforcement vs. Zhero scenario-based active recall.
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.75rem', color: '#77736D' }}>Spaced Recall Retention: </span>
            <strong style={{ color: '#DB5E8C', fontSize: '1.1rem' }}>{science.forgettingCurve.spacedRepetitionRecallRate}</strong>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.85rem' }}>
          {science.forgettingCurve.intervals.map((item, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: '#FCEADE',
                border: '1px solid #FAD1C6',
                borderRadius: '10px',
                padding: '0.85rem 1rem',
              }}
            >
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#171717', marginBottom: '4px' }}>
                {item.period}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '4px' }}>
                <span style={{ color: '#77736D' }}>Standard Decay:</span>
                <span style={{ fontWeight: 600, color: '#171717' }}>{item.standardDecay}%</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '8px' }}>
                <span style={{ color: '#DB5E8C', fontWeight: 700 }}>Zhero Recall:</span>
                <span style={{ fontWeight: 800, color: '#DB5E8C' }}>{item.zheroSpacedRecall}%</span>
              </div>
              <div style={{ width: '100%', height: '5px', backgroundColor: '#FAD1C6', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: `${item.zheroSpacedRecall}%`, height: '100%', backgroundColor: '#DB5E8C', borderRadius: '3px' }} />
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: '1rem', fontSize: '0.75rem', color: '#77736D', backgroundColor: '#FFFFFF', padding: '0.65rem 1rem', borderRadius: '8px', border: '1px solid #FAD1C6' }}>
          💡 <strong>How it works:</strong> Gemini triggers scenario-based micro-prompts at calibrated intervals (24h, 3d, 7d, 14d) based on student assessment topics and industry bounty tasks to cement knowledge before neuro-decay sets in.
        </div>
      </div>

      {/* Gamification & Dynamic Pacing: Snapchat Streaks & Badges */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem',
        }}
      >
        {/* Streak Cohorts Card */}
        <div className="admin-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Flame size={18} color="#DB5E8C" />
                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#171717', margin: 0 }}>
                  Habit Streaks (Snapchat Model)
                </h3>
              </div>
              <p style={{ fontSize: '0.785rem', color: '#77736D', marginTop: '2px' }}>
                Daily consecutive practice streaks keeping students engaged.
              </p>
            </div>
            <Badge variant="orange">{science.streakOverview.totalActiveStreaks} Active</Badge>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {science.streakOverview.cohorts.map((cohort, idx) => (
              <div key={idx} style={{ padding: '0.65rem 0.85rem', backgroundColor: '#FCEADE', borderRadius: '8px', border: '1px solid #FAD1C6' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700, color: '#171717', marginBottom: '3px' }}>
                  <span>{cohort.name}</span>
                  <span style={{ color: '#DB5E8C' }}>{cohort.count} learners ({cohort.percent}%)</span>
                </div>
                <div style={{ width: '100%', height: '5px', backgroundColor: '#FAD1C6', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${cohort.percent}%`, height: '100%', backgroundColor: '#DB5E8C', borderRadius: '3px' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Roadmap Pacing Cohorts */}
        <div className="admin-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Activity size={18} color="#DB5E8C" />
                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#171717', margin: 0 }}>
                  Dynamic Roadmap Pacing
                </h3>
              </div>
              <p style={{ fontSize: '0.785rem', color: '#77736D', marginTop: '2px' }}>
                Real-time adaptation to individual student learning speeds.
              </p>
            </div>
            <Badge variant="coral">AI Paced</Badge>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ padding: '0.85rem', backgroundColor: '#FCEADE', borderRadius: '8px', border: '1px solid #FAD1C6' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', fontWeight: 700, color: '#171717' }}>
                <span>Accelerated Fast-Trackers</span>
                <span style={{ color: '#DB5E8C' }}>{science.dynamicPacing.acceleratedPace}%</span>
              </div>
              <p style={{ fontSize: '0.75rem', color: '#77736D', marginTop: '2px' }}>
                Mastering concepts ahead of schedule; automatically offered advanced bounties and internships.
              </p>
            </div>

            <div style={{ padding: '0.85rem', backgroundColor: '#FCEADE', borderRadius: '8px', border: '1px solid #FAD1C6' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', fontWeight: 700, color: '#171717' }}>
                <span>Optimal Benchmark Pace</span>
                <span style={{ color: '#DB5E8C' }}>{science.dynamicPacing.nominalPace}%</span>
              </div>
              <p style={{ fontSize: '0.75rem', color: '#77736D', marginTop: '2px' }}>
                Progressing within expected standard milestone intervals with steady retention.
              </p>
            </div>

            <div style={{ padding: '0.85rem', backgroundColor: '#FCEADE', borderRadius: '8px', border: '1px solid #FAD1C6' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', fontWeight: 700, color: '#171717' }}>
                <span>Requires Mentor Assistance</span>
                <span style={{ color: '#DB5E8C' }}>{science.dynamicPacing.needsMentorAssistance}%</span>
              </div>
              <p style={{ fontSize: '0.75rem', color: '#77736D', marginTop: '2px' }}>
                Pacing lag detected; automatically flagged for tuition centre mentor 1-on-1 intervention.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2 Main Charts */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(440px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem',
        }}
      >
        <div className="admin-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#171717', margin: 0 }}>
                Platform Scale vs. AI Inference Volume
              </h2>
              <p style={{ fontSize: '0.8rem', color: '#77736D', marginTop: '2px' }}>
                Monthly active learners correlated with automated assessment query volume.
              </p>
            </div>
            <Badge variant="orange">Verified Data</Badge>
          </div>
          <TrendChart data={trendData} showAiSeries={true} />
        </div>

        <div className="admin-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#171717', margin: 0 }}>
                AI-Synthesized Career Recommendations
              </h2>
              <p style={{ fontSize: '0.8rem', color: '#77736D', marginTop: '2px' }}>
                Distribution of primary recommendations matching student aptitude to market demand.
              </p>
            </div>
            <Badge variant="neutral">Statewide Talent</Badge>
          </div>
          <CareerBarChart data={careerData} />
        </div>
      </div>

      {/* Tuition Centre Performance Summary Table */}
      <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid #FAD1C6',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#171717', margin: 0 }}>
              Institutional Cohort Performance Summary
            </h2>
            <p style={{ fontSize: '0.8rem', color: '#77736D', marginTop: '2px' }}>
              Benchmarking partner centres on seat utilization and student readiness metrics.
            </p>
          </div>
          <Button variant="secondary" size="sm" icon={Download} onClick={handleExportCentres}>
            Download CSV
          </Button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#FCEADE', borderBottom: '1px solid #FAD1C6', color: '#77736D' }}>
                <th style={{ padding: '0.85rem 1.25rem' }}>Tuition Centre</th>
                <th style={{ padding: '0.85rem 1rem' }}>Sponsored Students</th>
                <th style={{ padding: '0.85rem 1rem' }}>Seat Quota</th>
                <th style={{ padding: '0.85rem 1rem' }}>Assessments Completed</th>
                <th style={{ padding: '0.85rem 1rem' }}>Average Readiness</th>
                <th style={{ padding: '0.85rem 1.25rem', textAlign: 'right' }}>License Status</th>
              </tr>
            </thead>
            <tbody>
              {centreData.map((centre, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #FAD1C6', backgroundColor: '#FFFFFF' }}>
                  <td style={{ padding: '0.95rem 1.25rem', fontWeight: 700, color: '#171717' }}>
                    {centre.name}
                  </td>
                  <td style={{ padding: '0.95rem 1rem', color: '#171717', fontWeight: 600 }}>
                    {centre.students}
                  </td>
                  <td style={{ padding: '0.95rem 1rem', color: '#77736D' }}>
                    {centre.quota} Seats
                  </td>
                  <td style={{ padding: '0.95rem 1rem', color: '#171717' }}>
                    {centre.assessments}
                  </td>
                  <td style={{ padding: '0.95rem 1rem', fontWeight: 700, color: '#DB5E8C' }}>
                    {centre.avgReadiness}%
                  </td>
                  <td style={{ padding: '0.95rem 1.25rem', textAlign: 'right' }}>
                    <Badge variant={centre.status === 'APPROVED' ? 'success' : 'warning'} dot>
                      {centre.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
