import React, { useState, useEffect } from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { StatCard } from '../components/common/StatCard';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { AiService } from '../services/aiService';
import { AnalyticsService } from '../services/analyticsService';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import {
  Cpu,
  Clock,
  DollarSign,
  CheckCircle2,
  Play,
  ShieldCheck,
  Filter,
  Search,
  FileCheck2,
  Compass,
  Zap,
  Download,
  Mic,
  Volume2,
  ShieldAlert,
} from 'lucide-react';
import { StorageService } from '../services/storageService';

export function AiMonitoringPage() {
  const { isSuperAdmin } = useAuth();
  const { addToast } = useToast();

  const [config, setConfig] = useState(null);
  const [activeTab, setActiveTab] = useState('telemetry'); // 'telemetry' | 'verbal' | 'assessment' | 'prompts' | 'models'
  const [verbalInterviews, setVerbalInterviews] = useState([]);
  const [testing, setTesting] = useState(false);

  // Telemetry filtering state
  const [taskFilter, setTaskFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Assessment Settings state
  const [assessmentSettings, setAssessmentSettings] = useState({
    assessmentPurpose: 'STEM & Engineering Cognitive Readiness & Career Aptitude',
    defaultQuestionCount: 15,
    difficultyPreference: 'ADAPTIVE',
    supportedQuestionTypes: ['Multiple Choice', 'Algorithmic Logic', 'Scenario Analysis'],
    approvedTemplate:
      'Generate high-quality multiple choice question with 4 calibrated options, single ground truth, and comprehensive diagnostic rationale.',
    safetyConstraints:
      'Filter out proprietary exam leaks, enforce age-appropriate vocational context, require zero hallucinations.',
    qualityChecksEnabled: true,
    regionalNeutrality: true,
    maxGenerationAttempts: 3,
  });

  // Prompt editor state
  const [prompts, setPrompts] = useState({
    careerRecommendation: '',
    skillGapAnalysis: '',
    questionGeneration: '',
  });

  // Model settings state
  const [modelSettings, setModelSettings] = useState({
    activeModel: 'gemini-1.5-flash',
    temperature: 0.3,
    maxTokens: 2048,
  });

  const loadConfig = async () => {
    const data = await AiService.getAiConfig();
    setConfig(data);
    setVerbalInterviews(StorageService.getVerbalInterviews());
    setPrompts(data.prompts || {});
    setModelSettings({
      activeModel: data.activeModel || 'gemini-1.5-flash',
      temperature: data.temperature ?? 0.3,
      maxTokens: data.maxTokens ?? 2048,
    });
    if (data.assessmentGenerationSettings) {
      setAssessmentSettings((prev) => ({
        ...prev,
        ...data.assessmentGenerationSettings,
      }));
    }
  };

  useEffect(() => {
    loadConfig();
    const handleStoreChange = () => loadConfig();
    window.addEventListener('zhero_store_change', handleStoreChange);
    return () => window.removeEventListener('zhero_store_change', handleStoreChange);
  }, []);

  const handleSaveAssessmentSettings = async (e) => {
    e.preventDefault();
    await AiService.updateAssessmentSettings(assessmentSettings);
    addToast('Global Assessment AI Generation parameters updated successfully.', 'success');
  };

  const handleSavePrompts = async (e) => {
    e.preventDefault();
    if (!isSuperAdmin) {
      addToast('Only Super Administrators can calibrate system prompt engineering templates.', 'error');
      return;
    }
    await AiService.updatePrompts(prompts);
    addToast('AI prompt templates updated and versioned in audit trail.', 'success');
  };

  const handleSaveModelConfig = async (e) => {
    e.preventDefault();
    await AiService.updateModelConfig(modelSettings);
    addToast(`Model configuration updated: ${modelSettings.activeModel}`, 'success');
  };

  const handleToggleFeature = async (featureKey, currentValue) => {
    await AiService.toggleFeature(featureKey, !currentValue);
    addToast(`Feature ${featureKey} ${!currentValue ? 'enabled' : 'disabled'}.`, 'info');
    loadConfig();
  };

  const handleTestRun = async () => {
    setTesting(true);
    const result = await AiService.testGenerateSample('DynamicQuestionGeneration');
    setTesting(false);
    if (result.status === 'SUCCESS') {
      addToast(
        `Diagnostic test successful! Latency: ${result.latencyMs}ms (${result.promptTokens + result.completionTokens} tokens)`,
        'success'
      );
    } else {
      addToast(`Diagnostic run simulation returned status ${result.statusCode}: ${result.errorMessage}`, 'error');
    }
    loadConfig();
  };

  const handleExportTelemetry = () => {
    if (!config?.recentLogs) return;
    AnalyticsService.exportToCsv('ZHERO_Gemini_Inference_Telemetry', config.recentLogs);
    addToast('Inference telemetry event stream exported to CSV', 'success');
  };

  if (!config) return null;

  // Filter logs
  const filteredLogs = (config.recentLogs || []).filter((log) => {
    const matchTask = taskFilter === 'ALL' || log.action?.toLowerCase() === taskFilter.toLowerCase();
    const matchStatus = statusFilter === 'ALL' || log.status === statusFilter;
    const matchQuery =
      !searchQuery ||
      log.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.context && log.context.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (log.studentId && log.studentId.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchTask && matchStatus && matchQuery;
  });

  const taskBreakdown = config.taskBreakdown || {
    careerGuidance: { total: 6150, percentage: 41.5, avgLatencyMs: 740, success: 6100 },
    skillGapAnalysis: { total: 4460, percentage: 30.1, avgLatencyMs: 690, success: 4422 },
    questionGeneration: { total: 4210, percentage: 28.4, avgLatencyMs: 820, success: 4180 },
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="AI Monitoring & Configuration"
        description="Monitor Gemini API telemetry, token consumption, latencies, and configure assessment generation parameters."
        actions={
          <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
            <Button variant="secondary" icon={Download} onClick={handleExportTelemetry}>
              Export Logs
            </Button>
            <Button variant="primary" icon={Play} loading={testing} onClick={handleTestRun}>
              Run Diagnostics Test
            </Button>
          </div>
        }
      />

      {/* Security Architecture Callout */}
      <div
        style={{
          backgroundColor: '#FCEADE',
          border: '1px solid #FAD1C6',
          borderRadius: '14px',
          padding: '0.85rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '0.75rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
          <ShieldCheck size={18} color="#DB5E8C" />
          <span>
            <strong>API Security:</strong> All AI inference requests are routed securely server-side with token rate-limiting.
          </span>
        </div>
        <Badge variant="success" dot>
          Server-side Proxy Active
        </Badge>
      </div>

      {/* 4 Core AI Metrics */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2rem',
        }}
      >
        <StatCard
          title="Total AI Inferences"
          value={config.stats.totalRequests.toLocaleString()}
          change="+1,240 past 24h"
          trend="up"
          subtext="Automated guidance & quizzes"
          icon={Cpu}
          badgeText="Gemini 1.5 Flash"
        />

        <StatCard
          title="Inference Success Rate"
          value={`${config.stats.successRate}%`}
          change={`${config.stats.failedRequests} fail (${config.stats.errorRate}%)`}
          trend="up"
          subtext="Circuit breaker active"
          icon={CheckCircle2}
          badgeText="Healthy Pipeline"
        />

        <StatCard
          title="Average Latency"
          value={`${config.stats.avgLatencyMs} ms`}
          change="-45ms vs last week"
          trend="up"
          subtext="P95 Streaming response"
          icon={Clock}
          badgeText="Low Latency"
        />

        <StatCard
          title="Estimated Usage Cost"
          value={`$${config.stats.estimatedCostUsd.toFixed(2)}`}
          change="Approx ₹3,510"
          trend="neutral"
          subtext="Within monthly quota"
          icon={DollarSign}
          badgeText="Optimized"
        />
      </div>

      {/* Tab Switcher: 4 Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          borderBottom: '1px solid #FAD1C6',
          marginBottom: '1.75rem',
          overflowX: 'auto',
        }}
      >
        <button
          onClick={() => setActiveTab('telemetry')}
          style={{
            padding: '0.65rem 1.25rem',
            border: 'none',
            borderBottom: activeTab === 'telemetry' ? '2px solid #DB5E8C' : '2px solid transparent',
            backgroundColor: 'transparent',
            color: activeTab === 'telemetry' ? '#DB5E8C' : '#77736D',
            fontWeight: activeTab === 'telemetry' ? 700 : 500,
            fontSize: '0.875rem',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          Live Telemetry & Event Traces
        </button>

        <button
          onClick={() => setActiveTab('verbal')}
          style={{
            padding: '0.65rem 1.25rem',
            border: 'none',
            borderBottom: activeTab === 'verbal' ? '2px solid #DB5E8C' : '2px solid transparent',
            backgroundColor: 'transparent',
            color: activeTab === 'verbal' ? '#DB5E8C' : '#77736D',
            fontWeight: activeTab === 'verbal' ? 700 : 500,
            fontSize: '0.875rem',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <Mic size={15} />
          Verbal AI & Anti-Speedrunning
          <span
            style={{
              fontSize: '0.7rem',
              backgroundColor: activeTab === 'verbal' ? '#FAD1C6' : '#FCEADE',
              color: '#DB5E8C',
              padding: '1px 6px',
              borderRadius: '9999px',
              fontWeight: 700,
            }}
          >
            Voice
          </span>
        </button>

        <button
          onClick={() => setActiveTab('assessment')}
          style={{
            padding: '0.65rem 1.25rem',
            border: 'none',
            borderBottom: activeTab === 'assessment' ? '2px solid #DB5E8C' : '2px solid transparent',
            backgroundColor: 'transparent',
            color: activeTab === 'assessment' ? '#DB5E8C' : '#77736D',
            fontWeight: activeTab === 'assessment' ? 700 : 500,
            fontSize: '0.875rem',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          Assessment AI Generation
        </button>

        <button
          onClick={() => setActiveTab('prompts')}
          style={{
            padding: '0.65rem 1.25rem',
            border: 'none',
            borderBottom: activeTab === 'prompts' ? '2px solid #DB5E8C' : '2px solid transparent',
            backgroundColor: 'transparent',
            color: activeTab === 'prompts' ? '#DB5E8C' : '#77736D',
            fontWeight: activeTab === 'prompts' ? 700 : 500,
            fontSize: '0.875rem',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          Prompt Rubrics & Engineering
        </button>

        <button
          onClick={() => setActiveTab('models')}
          style={{
            padding: '0.65rem 1.25rem',
            border: 'none',
            borderBottom: activeTab === 'models' ? '2px solid #DB5E8C' : '2px solid transparent',
            backgroundColor: 'transparent',
            color: activeTab === 'models' ? '#DB5E8C' : '#77736D',
            fontWeight: activeTab === 'models' ? 700 : 500,
            fontSize: '0.875rem',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          Foundation Models & Circuit Breakers
        </button>
      </div>

      {/* TAB 1: Live Telemetry & Event Traces */}
      {activeTab === 'telemetry' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Task Distribution Breakdown 3 Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            <div className="admin-card" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.825rem', fontWeight: 700, color: '#171717', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Compass size={16} color="#DB5E8C" /> Career Guidance & Match
                </span>
                <Badge variant="orange">{taskBreakdown.careerGuidance.percentage}% Volume</Badge>
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#171717' }}>
                {taskBreakdown.careerGuidance.total.toLocaleString()}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#77736D', marginTop: '4px' }}>
                Avg Latency: <strong>{taskBreakdown.careerGuidance.avgLatencyMs}ms</strong> • {taskBreakdown.careerGuidance.success} Successes
              </div>
            </div>

            <div className="admin-card" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.825rem', fontWeight: 700, color: '#171717', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Zap size={16} color="#DB5E8C" /> Skill-Gap Diagnostics
                </span>
                <Badge variant="orange">{taskBreakdown.skillGapAnalysis.percentage}% Volume</Badge>
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#171717' }}>
                {taskBreakdown.skillGapAnalysis.total.toLocaleString()}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#77736D', marginTop: '4px' }}>
                Avg Latency: <strong>{taskBreakdown.skillGapAnalysis.avgLatencyMs}ms</strong> • {taskBreakdown.skillGapAnalysis.success} Successes
              </div>
            </div>

            <div className="admin-card" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.825rem', fontWeight: 700, color: '#171717', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <FileCheck2 size={16} color="#DB5E8C" /> Dynamic Question Generation
                </span>
                <Badge variant="orange">{taskBreakdown.questionGeneration.percentage}% Volume</Badge>
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#171717' }}>
                {taskBreakdown.questionGeneration.total.toLocaleString()}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#77736D', marginTop: '4px' }}>
                Avg Latency: <strong>{taskBreakdown.questionGeneration.avgLatencyMs}ms</strong> • {taskBreakdown.questionGeneration.success} Successes
              </div>
            </div>
          </div>

          {/* Filtering Bar */}
          <div
            className="admin-card"
            style={{
              padding: '1rem 1.25rem',
              display: 'flex',
              gap: '1rem',
              alignItems: 'center',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flex: 1, minWidth: '260px' }}>
              <Search size={16} color="#77736D" />
              <input
                type="text"
                placeholder="Search trace ID, task type, or context..."
                className="admin-input"
                style={{ flex: 1 }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#77736D' }}>
                <Filter size={14} /> Task:
              </div>
              <select
                className="admin-input"
                style={{ width: '180px' }}
                value={taskFilter}
                onChange={(e) => setTaskFilter(e.target.value)}
              >
                <option value="ALL">All AI Tasks</option>
                <option value="QuestionGeneration">Question Generation</option>
                <option value="CareerGuidance">Career Guidance</option>
                <option value="SkillGapAnalysis">Skill-Gap Analysis</option>
              </select>

              <select
                className="admin-input"
                style={{ width: '140px' }}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="ALL">All Statuses</option>
                <option value="SUCCESS">Success (200)</option>
                <option value="FAILED">Failed / Timeout</option>
              </select>
            </div>
          </div>

          {/* Event Stream Table */}
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
                  Live Gemini Inference Traces ({filteredLogs.length})
                </h2>
                <p style={{ fontSize: '0.8rem', color: '#77736D', marginTop: '2px' }}>
                  Real-time chronologic log of prompts executed through the secure server reverse proxy.
                </p>
              </div>
              <Badge variant="orange" dot>
                Streaming Active
              </Badge>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ backgroundColor: '#FCEADE', borderBottom: '1px solid #FAD1C6', color: '#77736D' }}>
                    <th style={{ padding: '0.75rem 1.25rem' }}>Trace ID</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Inference Task</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Model</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Tokens</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Latency</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Execution Context</th>
                    <th style={{ padding: '0.75rem 1.25rem', textAlign: 'right' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ padding: '2rem', textAlign: 'center', color: '#77736D' }}>
                        No telemetry logs matched the specified filter criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredLogs.map((log) => {
                      const isOk = log.status === 'SUCCESS';
                      return (
                        <tr key={log.id} style={{ borderBottom: '1px solid #FAD1C6', backgroundColor: '#FFFFFF' }}>
                          <td style={{ padding: '0.85rem 1.25rem', fontWeight: 700, color: '#77736D', fontSize: '0.8rem' }}>
                            {log.id}
                            <div style={{ fontSize: '0.7rem', color: '#9E9B95', fontWeight: 400 }}>
                              {log.timestamp?.slice(11, 19)}
                            </div>
                          </td>
                          <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: '#171717' }}>
                            {log.action}
                          </td>
                          <td style={{ padding: '0.85rem 1rem' }}>
                            <span
                              style={{
                                fontSize: '0.75rem',
                                backgroundColor: '#FCEADE',
                                padding: '2px 6px',
                                borderRadius: '4px',
                                border: '1px solid #FAD1C6',
                              }}
                            >
                              {log.model}
                            </span>
                          </td>
                          <td style={{ padding: '0.85rem 1rem', color: '#77736D', fontSize: '0.8rem' }}>
                            {log.promptTokens} in / {log.completionTokens} out
                          </td>
                          <td
                            style={{
                              padding: '0.85rem 1rem',
                              fontWeight: 600,
                              color: '#DB5E8C',
                            }}
                          >
                            {log.latencyMs} ms
                          </td>
                          <td style={{ padding: '0.85rem 1rem', color: '#77736D', fontSize: '0.8rem' }}>
                            <div>{log.context || log.studentId || 'Platform'}</div>
                            {log.errorMessage && (
                              <div style={{ color: '#DB5E8C', fontSize: '0.725rem', marginTop: '2px' }}>
                                Error: {log.errorMessage}
                              </div>
                            )}
                          </td>
                          <td style={{ padding: '0.85rem 1.25rem', textAlign: 'right' }}>
                            <Badge variant={isOk ? 'success' : 'danger'} dot>
                              {isOk ? '200 OK' : `${log.statusCode || 500} Error`}
                            </Badge>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB: Verbal AI & Anti-Speedrunning Diagnostics */}
      {activeTab === 'verbal' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Philosophy Banner */}
          <div
            style={{
              backgroundColor: '#FCEADE',
              border: '1px solid #FAD1C6',
              borderRadius: '14px',
              padding: '1.25rem 1.5rem',
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
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  backgroundColor: '#FAD1C6',
                  color: '#DB5E8C',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Mic size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#171717', margin: 0 }}>
                  Verbal AI Interview: Better Learning & Anti-Speedrun Defense
                </h3>
                <p style={{ fontSize: '0.825rem', color: '#77736D', marginTop: '2px', lineHeight: 1.4 }}>
                  "After every course, an audio interview ensures students don't speedrun with AI tools, helps verbal communication, and prepares them for real-life technical interviews."
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Badge variant="coral">Gemini 1.5 Multimodal Audio</Badge>
              <Badge variant="orange" dot>Anti-Speedrunning Active</Badge>
            </div>
          </div>

          {/* Stat Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            <StatCard
              title="Voice Audio Latency"
              value="1.1s"
              subtitle="End-to-end speech evaluation"
              icon={Clock}
            />
            <StatCard
              title="Verbal Fluency Index"
              value="88.4%"
              subtitle="Oral articulation & confidence"
              icon={Volume2}
              variant="coral"
            />
            <StatCard
              title="Organic Speech Rate"
              value="98.1%"
              subtitle="Zero canned AI script detection"
              icon={ShieldCheck}
            />
            <StatCard
              title="Speedrun Flags Intercepted"
              value="2"
              subtitle="Escalated to Tuition Mentors"
              icon={ShieldAlert}
              variant="orange"
            />
          </div>

          {/* Anti-Speedrun Heuristic Rules */}
          <div className="admin-card">
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#171717', marginBottom: '0.35rem' }}>
              Academic Integrity & Pacing Heuristic Rules
            </h3>
            <p style={{ fontSize: '0.825rem', color: '#77736D', marginBottom: '1.25rem' }}>
              Detect and intercept automated speedrunning attempts when students attempt to paste answers into assessments without conceptual verbal grasp.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
              <div style={{ padding: '1rem', backgroundColor: '#FCEADE', borderRadius: '10px', border: '1px solid #FAD1C6' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#171717' }}>Rapid Completion Threshold</div>
                <p style={{ fontSize: '0.775rem', color: '#77736D', marginTop: '4px' }}>
                  If a multi-step engineering problem is submitted in under 45 seconds, the student is routed to a mandatory Verbal AI interview before score unlock.
                </p>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#DB5E8C', marginTop: '6px' }}>Status: ENFORCED (45s Min)</div>
              </div>

              <div style={{ padding: '1rem', backgroundColor: '#FCEADE', borderRadius: '10px', border: '1px solid #FAD1C6' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#171717' }}>Human Mentor Intervention Escalation</div>
                <p style={{ fontSize: '0.775rem', color: '#77736D', marginTop: '4px' }}>
                  If verbal reasoning depth score drops below 55% following rapid submission, the student's roadmap milestone is held until their tuition centre mentor conducts a 1-on-1 GMeet review.
                </p>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#DB5E8C', marginTop: '6px' }}>Status: AUTO-ROUTING ACTIVE</div>
              </div>
            </div>
          </div>

          {/* Recent Verbal AI Interviews Log */}
          <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #FAD1C6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#171717', margin: 0 }}>
                  Recent Student Verbal AI Interview Sessions
                </h3>
                <p style={{ fontSize: '0.775rem', color: '#77736D', marginTop: '2px' }}>
                  Voice transcripts and oral examination scores processed after course completions.
                </p>
              </div>
              <Badge variant="orange" dot>Live Voice Stream</Badge>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ backgroundColor: '#FCEADE', borderBottom: '1px solid #FAD1C6', color: '#77736D' }}>
                    <th style={{ padding: '0.75rem 1.25rem' }}>Student</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Course / Module Context</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Duration</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Fluency / Depth</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Anti-Speedrun Status</th>
                    <th style={{ padding: '0.75rem 1.25rem', textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {verbalInterviews.map((vi) => (
                    <tr key={vi.id} style={{ borderBottom: '1px solid #FAD1C6', backgroundColor: '#FFFFFF' }}>
                      <td style={{ padding: '0.85rem 1.25rem' }}>
                        <div style={{ fontWeight: 700, color: '#171717' }}>{vi.studentName}</div>
                        <div style={{ fontSize: '0.725rem', color: '#77736D' }}>{vi.timestamp}</div>
                      </td>
                      <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: '#171717' }}>
                        {vi.courseContext}
                        <div style={{ fontSize: '0.725rem', color: '#77736D', fontStyle: 'italic', marginTop: '2px' }}>
                          "{vi.summary}"
                        </div>
                      </td>
                      <td style={{ padding: '0.85rem 1rem', color: '#77736D', fontSize: '0.8rem' }}>
                        {vi.audioDuration}
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#171717' }}>
                          {vi.fluencyScore}% / {vi.depthScore}%
                        </div>
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <Badge variant={vi.pacingAnomalyDetected ? 'coral' : 'neutral'}>
                          {vi.antiSpeedrunStatus}
                        </Badge>
                      </td>
                      <td style={{ padding: '0.85rem 1.25rem', textAlign: 'right' }}>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => {
                            addToast(`Transcript audio dossier opened for ${vi.studentName}`, 'info');
                          }}
                        >
                          Review Audio
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Assessment AI Generation Configuration */}
      {activeTab === 'assessment' && (
        <form onSubmit={handleSaveAssessmentSettings} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="admin-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
              <div>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#171717', margin: 0 }}>
                  Global Assessment Generation Architecture
                </h2>
                <p style={{ fontSize: '0.825rem', color: '#77736D', marginTop: '2px' }}>
                  Govern how Gemini dynamically synthesizes assessment questions for students in real-time, removing manual authoring overhead.
                </p>
              </div>
              <Badge variant="orange">Gemini Automated Engine</Badge>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#171717', marginBottom: '0.35rem' }}>
                  Primary Assessment Purpose
                </label>
                <select
                  className="admin-input"
                  value={assessmentSettings.assessmentPurpose}
                  onChange={(e) => setAssessmentSettings({ ...assessmentSettings, assessmentPurpose: e.target.value })}
                >
                  <option value="STEM & Engineering Cognitive Readiness & Career Aptitude">
                    STEM & Engineering Cognitive Readiness & Career Aptitude
                  </option>
                  <option value="Aptitude, Mathematical Logic & Computational Thinking">
                    Aptitude, Mathematical Logic & Computational Thinking
                  </option>
                  <option value="UI/UX, Spatial Reasoning & Creative Design">
                    UI/UX, Spatial Reasoning & Creative Design
                  </option>
                  <option value="Comprehensive Career Diagnostic Baseline">
                    Comprehensive Career Diagnostic Baseline
                  </option>
                </select>
                <span style={{ fontSize: '0.725rem', color: '#77736D' }}>
                  Defines the high-level evaluation rubric fed into the Gemini system context.
                </span>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#171717', marginBottom: '0.35rem' }}>
                  Difficulty Preference Calibration
                </label>
                <select
                  className="admin-input"
                  value={assessmentSettings.difficultyPreference}
                  onChange={(e) => setAssessmentSettings({ ...assessmentSettings, difficultyPreference: e.target.value })}
                >
                  <option value="ADAPTIVE">Adaptive (Dynamic difficulty scaling based on student answers)</option>
                  <option value="EASY">Foundational (Beginner friendly)</option>
                  <option value="MEDIUM">Standard Industry Baseline (Moderate)</option>
                  <option value="HARD">Rigorous Technical (Challenging)</option>
                </select>
                <span style={{ fontSize: '0.725rem', color: '#77736D' }}>
                  Adaptive mode automatically adjusts question complexity turn-by-turn.
                </span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#171717', marginBottom: '0.35rem' }}>
                  Default Question Count per Student Session ({assessmentSettings.defaultQuestionCount} Questions)
                </label>
                <input
                  type="range"
                  min="5"
                  max="30"
                  step="5"
                  style={{ width: '100%', accentColor: '#DB5E8C' }}
                  value={assessmentSettings.defaultQuestionCount}
                  onChange={(e) =>
                    setAssessmentSettings({ ...assessmentSettings, defaultQuestionCount: parseInt(e.target.value, 10) })
                  }
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.725rem', color: '#77736D' }}>
                  <span>5 (Quick Diagnostic)</span>
                  <span>15 (Recommended Standard)</span>
                  <span>30 (Full Evaluation)</span>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#171717', marginBottom: '0.35rem' }}>
                  Max Generation Retries on Validation Rejection ({assessmentSettings.maxGenerationAttempts} attempts)
                </label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  className="admin-input"
                  value={assessmentSettings.maxGenerationAttempts}
                  onChange={(e) =>
                    setAssessmentSettings({ ...assessmentSettings, maxGenerationAttempts: parseInt(e.target.value, 10) })
                  }
                />
                <span style={{ fontSize: '0.725rem', color: '#77736D' }}>
                  Number of self-correction loops Gemini executes if distractor plausibility check fails.
                </span>
              </div>
            </div>

            {/* Supported Question Types Checkboxes */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#171717', marginBottom: '0.5rem' }}>
                Permitted Question Modalities
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
                {[
                  'Multiple Choice (4 Options)',
                  'Algorithmic Logic',
                  'Scenario Analysis',
                  'Situational Judgment',
                ].map((type) => {
                  const isChecked = assessmentSettings.supportedQuestionTypes.includes(type);
                  return (
                    <label
                      key={type}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '0.65rem 0.85rem',
                        backgroundColor: isChecked ? '#FAD1C6' : '#FCEADE',
                        border: isChecked ? '1px solid #F5AFAE' : '1px solid #FAD1C6',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '0.825rem',
                        fontWeight: isChecked ? 600 : 500,
                        color: isChecked ? '#DB5E8C' : '#171717',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {
                          const updated = isChecked
                            ? assessmentSettings.supportedQuestionTypes.filter((t) => t !== type)
                            : [...assessmentSettings.supportedQuestionTypes, type];
                          setAssessmentSettings({ ...assessmentSettings, supportedQuestionTypes: updated });
                        }}
                        style={{ accentColor: '#DB5E8C' }}
                      />
                      {type}
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Approved Generation Instructions */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#171717', marginBottom: '0.35rem' }}>
                Approved Generation Template & Instructions
              </label>
              <textarea
                rows={3}
                className="admin-input"
                value={assessmentSettings.approvedTemplate}
                onChange={(e) => setAssessmentSettings({ ...assessmentSettings, approvedTemplate: e.target.value })}
              />
            </div>

            {/* Safety & Quality Constraints */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#171717', marginBottom: '0.35rem' }}>
                Safety & Quality Guardrails
              </label>
              <textarea
                rows={2}
                className="admin-input"
                value={assessmentSettings.safetyConstraints}
                onChange={(e) => setAssessmentSettings({ ...assessmentSettings, safetyConstraints: e.target.value })}
              />
            </div>

            {/* Quality Toggles */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: '#171717', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={assessmentSettings.qualityChecksEnabled}
                  onChange={(e) => setAssessmentSettings({ ...assessmentSettings, qualityChecksEnabled: e.target.checked })}
                  style={{ accentColor: '#DB5E8C' }}
                />
                <span>
                  <strong>Distractor Plausibility Filter:</strong> Require Gemini to verify that 3 incorrect options are pedagogically instructive without being confusingly trivial.
                </span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: '#171717', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={assessmentSettings.regionalNeutrality}
                  onChange={(e) => setAssessmentSettings({ ...assessmentSettings, regionalNeutrality: e.target.checked })}
                  style={{ accentColor: '#DB5E8C' }}
                />
                <span>
                  <strong>Regional Curriculum Alignment:</strong> Calibrate STEM questions to match Kerala Higher Secondary & Technical Vocational education frameworks.
                </span>
              </label>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button type="submit" variant="primary">
                Save & Deploy Assessment Generation Settings
              </Button>
            </div>
          </div>
        </form>
      )}

      {/* TAB 3: Prompt Templates */}
      {activeTab === 'prompts' && (
        <form onSubmit={handleSavePrompts} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="admin-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#171717', margin: 0 }}>
                  Career Recommendation Engine Prompt Rubric
                </h3>
                <p style={{ fontSize: '0.8rem', color: '#77736D', marginTop: '2px' }}>
                  Governs how student aptitude scores and skills match with high-demand careers.
                </p>
              </div>
              <Badge variant="orange">v2.4 Active</Badge>
            </div>
            <textarea
              rows={4}
              className="admin-input"
              value={prompts.careerRecommendation}
              onChange={(e) => setPrompts({ ...prompts, careerRecommendation: e.target.value })}
            />
          </div>

          <div className="admin-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#171717', margin: 0 }}>
                  Skill-Gap Diagnostic Prompt Rubric
                </h3>
                <p style={{ fontSize: '0.8rem', color: '#77736D', marginTop: '2px' }}>
                  Analyzes missing competencies and synthesizes milestone learning roadmaps.
                </p>
              </div>
              <Badge variant="orange">v1.8 Active</Badge>
            </div>
            <textarea
              rows={4}
              className="admin-input"
              value={prompts.skillGapAnalysis}
              onChange={(e) => setPrompts({ ...prompts, skillGapAnalysis: e.target.value })}
            />
          </div>

          <div className="admin-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#171717', margin: 0 }}>
                  Dynamic Question Generation Prompt Rubric
                </h3>
                <p style={{ fontSize: '0.8rem', color: '#77736D', marginTop: '2px' }}>
                  Generates multiple-choice aptitude challenges with calibrated distractors.
                </p>
              </div>
              <Badge variant="orange">v1.2 Active</Badge>
            </div>
            <textarea
              rows={4}
              className="admin-input"
              value={prompts.questionGeneration}
              onChange={(e) => setPrompts({ ...prompts, questionGeneration: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button type="submit" variant="primary">
              Save & Deploy Prompt Templates
            </Button>
          </div>
        </form>
      )}

      {/* TAB 4: Model & Feature Controls */}
      {activeTab === 'models' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Model Configuration */}
          <div className="admin-card">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#171717', marginBottom: '0.35rem' }}>
              Primary Foundation Model Hyperparameters
            </h3>
            <p style={{ fontSize: '0.825rem', color: '#77736D', marginBottom: '1.25rem' }}>
              Configure temperature for creativity vs determinism, and select upstream Google Gemini checkpoint.
            </p>

            <form onSubmit={handleSaveModelConfig} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#171717', marginBottom: '0.35rem' }}>
                    Active Gemini Model Checkpoint
                  </label>
                  <select
                    className="admin-input"
                    value={modelSettings.activeModel}
                    onChange={(e) => setModelSettings({ ...modelSettings, activeModel: e.target.value })}
                  >
                    <option value="gemini-1.5-flash">Gemini 1.5 Flash (Fast, High Throughput, Lower Cost)</option>
                    <option value="gemini-1.5-pro">Gemini 1.5 Pro (Deep Complex Reasoning, Code Synthesis)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#171717', marginBottom: '0.35rem' }}>
                    Sampling Temperature ({modelSettings.temperature})
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    style={{ width: '100%', accentColor: '#DB5E8C' }}
                    value={modelSettings.temperature}
                    onChange={(e) => setModelSettings({ ...modelSettings, temperature: parseFloat(e.target.value) })}
                  />
                  <span style={{ fontSize: '0.725rem', color: '#77736D' }}>
                    Lower = deterministic evaluation; Higher = creative scenarios
                  </span>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#171717', marginBottom: '0.35rem' }}>
                    Max Completion Tokens
                  </label>
                  <input
                    type="number"
                    min="512"
                    max="8192"
                    step="256"
                    className="admin-input"
                    value={modelSettings.maxTokens}
                    onChange={(e) => setModelSettings({ ...modelSettings, maxTokens: parseInt(e.target.value, 10) })}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <Button type="submit" variant="primary">
                  Save Model Hyperparameters
                </Button>
              </div>
            </form>
          </div>

          {/* Feature Toggles */}
          <div className="admin-card">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#171717', marginBottom: '0.35rem' }}>
              AI Feature Flags & Circuit Breakers
            </h3>
            <p style={{ fontSize: '0.825rem', color: '#77736D', marginBottom: '1.25rem' }}>
              Instantly enable or disable generative capabilities if upstream quotas reach saturation.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {Object.entries(config.featuresEnabled || {}).map(([key, isEnabled]) => (
                <div
                  key={key}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.85rem 1rem',
                    backgroundColor: '#FCEADE',
                    borderRadius: '10px',
                    border: '1px solid #FAD1C6',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#171717' }}>
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#77736D' }}>
                      {isEnabled ? 'Operational: Generating dynamic outputs for student platform' : 'Disabled: Returning fallback deterministic rule-based output'}
                    </div>
                  </div>

                  <button
                    onClick={() => handleToggleFeature(key, isEnabled)}
                    style={{
                      padding: '4px 12px',
                      borderRadius: '9999px',
                      border: `1px solid ${isEnabled ? '#DB5E8C' : '#FAD1C6'}`,
                      backgroundColor: isEnabled ? '#FAD1C6' : '#FFFFFF',
                      color: '#DB5E8C',
                      fontWeight: 700,
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                    }}
                  >
                    {isEnabled ? 'Enabled' : 'Disabled'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
