import React, { useState, useEffect } from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { DataTable } from '../components/common/DataTable';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { InstitutionService } from '../services/institutionService';
import { StorageService } from '../services/storageService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  CheckCircle,
  Eye,
  Sliders,
  Plus,
  Video,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export function InstitutionsPage() {
  const { user, isSuperAdmin } = useAuth();
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState('centres'); // 'centres' | 'validations'
  const [institutions, setInstitutions] = useState([]);
  const [validations, setValidations] = useState([]);
  const [selectedInst, setSelectedInst] = useState(null);
  const [selectedVal, setSelectedVal] = useState(null);
  const [valModalOpen, setValModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [quotaModalOpen, setQuotaModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // Rejection modal state
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [targetRejectId, setTargetRejectId] = useState(null);

  // Quota form
  const [newQuota, setNewQuota] = useState(100);
  const [newPlan, setNewPlan] = useState('Growth (100 Seats)');

  // New Centre form
  const [newCentreData, setNewCentreData] = useState({
    name: '',
    location: '',
    tier: 'GROWTH',
    plan: 'Growth (100 Seats)',
    allocatedSeats: 100,
    contactPerson: '',
    phone: '',
    email: '',
    accreditation: '',
    notes: '',
  });

  // Confirmation dialog
  const [confirmState, setConfirmState] = useState({
    isOpen: false,
    title: '',
    description: '',
    action: null,
    type: 'danger',
  });

  const loadInstitutions = async () => {
    const list = await InstitutionService.getAllInstitutions();
    setInstitutions(list);
    setValidations(StorageService.getHumanValidations());
  };

  useEffect(() => {
    loadInstitutions();
    const handleStoreChange = () => loadInstitutions();
    window.addEventListener('zhero_store_change', handleStoreChange);
    return () => window.removeEventListener('zhero_store_change', handleStoreChange);
  }, []);

  // Approve Workflow
  const handleApprove = (inst) => {
    if (!isSuperAdmin) {
      addToast('Authorization Error: Only Super Administrators can grant institutional licenses.', 'error');
      return;
    }

    setConfirmState({
      isOpen: true,
      title: 'Approve Institutional Partner',
      description: `Grant platform access to ${inst.name}? This will allocate ${inst.allocatedSeats} sponsored student seats and generate partner API keys.`,
      type: 'warning',
      action: async () => {
        await InstitutionService.approveInstitution(inst.id, user.name);
        addToast(`Approved ${inst.name} successfully. License issued.`, 'success');
        setConfirmState(prev => ({ ...prev, isOpen: false }));
        loadInstitutions();
      },
    });
  };

  // Reject Workflow
  const handleRejectInitiate = (inst) => {
    if (!isSuperAdmin) {
      addToast('Authorization Error: Only Super Administrators can reject partner applications.', 'error');
      return;
    }
    setTargetRejectId(inst.id);
    setRejectionReason('Accreditation credentials could not be verified with Higher Ed Board.');
    setRejectModalOpen(true);
  };

  const handleConfirmReject = async (e) => {
    e.preventDefault();
    if (!rejectionReason.trim()) {
      addToast('A valid rejection rationale is required for audit compliance.', 'error');
      return;
    }
    await InstitutionService.rejectInstitution(targetRejectId, rejectionReason, user.name);
    addToast('Institutional application rejected.', 'info');
    setRejectModalOpen(false);
    loadInstitutions();
  };

  // Suspend / Reactivate
  const handleToggleSuspend = (inst) => {
    const isSuspending = inst.status === 'APPROVED';
    const newStatus = isSuspending ? 'SUSPENDED' : 'APPROVED';

    setConfirmState({
      isOpen: true,
      title: isSuspending ? 'Suspend Tuition Centre' : 'Reactivate Tuition Centre',
      description: `Are you sure you want to ${isSuspending ? 'suspend' : 'reactivate'} ${inst.name}? ${
        isSuspending ? 'All enrolled students under this centre will temporarily lose sponsored quiz access.' : ''
      }`,
      type: isSuspending ? 'danger' : 'warning',
      action: async () => {
        await InstitutionService.updateStatus(inst.id, newStatus, `Action by ${user.name}`);
        addToast(`Tuition centre status updated to ${newStatus}.`, 'success');
        setConfirmState(prev => ({ ...prev, isOpen: false }));
        loadInstitutions();
      },
    });
  };

  // Update Quota Submit
  const handleQuotaSubmit = async (e) => {
    e.preventDefault();
    if (!selectedInst) return;
    await InstitutionService.updateQuota(selectedInst.id, newQuota, newPlan);
    addToast(`Updated seat quota to ${newQuota} for ${selectedInst.name}.`, 'success');
    setQuotaModalOpen(false);
    loadInstitutions();
  };

  // Create Centre Submit
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    await InstitutionService.createInstitution(newCentreData);
    addToast(`Registered ${newCentreData.name} for institutional review.`, 'success');
    setCreateModalOpen(false);
    loadInstitutions();
  };

  const pendingList = institutions.filter(i => i.status === 'PENDING_REVIEW');

  const columns = [
    {
      header: 'Centre ID',
      accessor: 'id',
      width: '100px',
      render: (row) => (
        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#77736D' }}>
          {row.id}
        </span>
      ),
    },
    {
      header: 'Tuition Centre',
      accessor: 'name',
      render: (row) => (
        <div>
          <div style={{ fontWeight: 700, color: '#171717' }}>{row.name}</div>
          <div style={{ fontSize: '0.75rem', color: '#77736D' }}>{row.location}</div>
        </div>
      ),
    },
    {
      header: 'Contact Person',
      accessor: 'contactPerson',
      render: (row) => (
        <div>
          <div style={{ fontSize: '0.825rem', color: '#171717', fontWeight: 500 }}>
            {row.contactPerson}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#77736D' }}>
            {row.email}
          </div>
        </div>
      ),
    },
    {
      header: 'Sponsorship Quota',
      accessor: 'plan',
      render: (row) => {
        const pct = Math.round(((row.usedSeats || 0) / (row.allocatedSeats || 1)) * 100);
        return (
          <div style={{ minWidth: '130px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 600, color: '#171717', marginBottom: '3px' }}>
              <span>{row.usedSeats || 0} / {row.allocatedSeats} Seats</span>
              <span style={{ color: pct > 85 ? '#DB5E8C' : '#77736D' }}>{pct}%</span>
            </div>
            <div style={{ width: '100%', height: '5px', backgroundColor: '#FAD1C6', borderRadius: '999px', overflow: 'hidden' }}>
              <div style={{ width: `${Math.min(pct, 100)}%`, height: '100%', backgroundColor: '#DB5E8C', borderRadius: '999px' }} />
            </div>
          </div>
        );
      },
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => {
        if (row.status === 'APPROVED') {
          return <Badge variant="success" dot>Approved</Badge>;
        }
        if (row.status === 'PENDING_REVIEW') {
          return <Badge variant="warning" dot>Pending Review</Badge>;
        }
        if (row.status === 'REJECTED') {
          return <Badge variant="danger" dot>Rejected</Badge>;
        }
        return <Badge variant="neutral" dot>{row.status}</Badge>;
      },
    },
    {
      header: 'Cohort Readiness',
      accessor: 'avgReadiness',
      render: (row) => (
        <span style={{ fontWeight: 700, color: '#DB5E8C' }}>
          {row.avgReadiness ? `${row.avgReadiness}%` : '—'}
        </span>
      ),
    },
    {
      header: 'Action',
      align: 'right',
      render: (row) => (
        <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
          {row.status === 'PENDING_REVIEW' ? (
            <>
              <button
                onClick={() => handleApprove(row)}
                title="Approve Partnership"
                style={{
                  border: 'none',
                  backgroundColor: '#DB5E8C',
                  color: '#FFFFFF',
                  borderRadius: '6px',
                  padding: '4px 10px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <CheckCircle size={13} />
                <span>Approve</span>
              </button>
              <button
                onClick={() => handleRejectInitiate(row)}
                title="Reject Application"
                style={{
                  border: '1px solid #F5AFAE',
                  backgroundColor: '#FCEADE',
                  color: '#DB5E8C',
                  borderRadius: '6px',
                  padding: '4px 8px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Reject
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  setSelectedInst(row);
                  setDetailModalOpen(true);
                }}
                style={{
                  border: '1px solid #FAD1C6',
                  backgroundColor: '#FFFFFF',
                  color: '#77736D',
                  borderRadius: '6px',
                  padding: '4px 8px',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <Eye size={13} />
                <span>Details</span>
              </button>

              <button
                onClick={() => {
                  setSelectedInst(row);
                  setNewQuota(row.allocatedSeats);
                  setNewPlan(row.plan);
                  setQuotaModalOpen(true);
                }}
                title="Manage Seat Quota"
                style={{
                  border: '1px solid #FAD1C6',
                  backgroundColor: '#FFFFFF',
                  color: '#171717',
                  borderRadius: '6px',
                  padding: '4px 8px',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <Sliders size={13} />
                <span>Quota</span>
              </button>

              <button
                onClick={() => handleToggleSuspend(row)}
                title={row.status === 'APPROVED' ? 'Suspend Centre' : 'Reactivate'}
                style={{
                  border: '1px solid #FAD1C6',
                  backgroundColor: row.status === 'APPROVED' ? '#FCEADE' : '#FAD1C6',
                  color: '#DB5E8C',
                  borderRadius: '6px',
                  padding: '4px 8px',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                {row.status === 'APPROVED' ? 'Suspend' : 'Activate'}
              </button>
            </>
          )}
        </div>
      ),
    },
  ];

  const validationColumns = [
    {
      header: 'Student',
      accessor: 'studentName',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '30px',
              height: '30px',
              borderRadius: '8px',
              backgroundColor: '#FAD1C6',
              color: '#DB5E8C',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '0.75rem',
            }}
          >
            {row.avatar}
          </div>
          <div>
            <div style={{ fontWeight: 700, color: '#171717', fontSize: '0.85rem' }}>{row.studentName}</div>
            <div style={{ fontSize: '0.725rem', color: '#77736D' }}>{row.studentId}</div>
          </div>
        </div>
      ),
    },
    {
      header: 'AI Career Guidance',
      accessor: 'aiCareerTrack',
      render: (row) => (
        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#171717' }}>
          {row.aiCareerTrack}
        </span>
      ),
    },
    {
      header: 'Tuition Centre & Mentor',
      accessor: 'institutionName',
      render: (row) => (
        <div>
          <div style={{ fontSize: '0.825rem', fontWeight: 600, color: '#171717' }}>{row.institutionName}</div>
          <div style={{ fontSize: '0.725rem', color: '#DB5E8C', fontWeight: 700 }}>Mentor: {row.mentorName}</div>
        </div>
      ),
    },
    {
      header: 'GMeet Interview',
      accessor: 'gmeetLink',
      render: (row) => (
        <div>
          <a
            href={row.gmeetLink}
            target="_blank"
            rel="noreferrer"
            style={{
              fontSize: '0.75rem',
              color: '#DB5E8C',
              fontWeight: 700,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              backgroundColor: '#FCEADE',
              padding: '3px 8px',
              borderRadius: '6px',
              border: '1px solid #FAD1C6',
            }}
          >
            <Video size={13} />
            <span>Join GMeet</span>
          </a>
          <div style={{ fontSize: '0.7rem', color: '#77736D', marginTop: '2px' }}>
            {row.scheduledTime}
          </div>
        </div>
      ),
    },
    {
      header: 'Anti-Speedrun Check',
      accessor: 'antiSpeedrunFlag',
      render: (row) => (
        <Badge variant={row.antiSpeedrunFlag === 'PASSED' ? 'neutral' : 'coral'}>
          {row.antiSpeedrunFlag === 'PASSED' ? 'Verified Pacing' : 'Flagged Anomaly'}
        </Badge>
      ),
    },
    {
      header: 'Mentor Verdict',
      accessor: 'mentorVerdict',
      render: (row) => {
        if (row.mentorVerdict === 'CONFIRMED_ALIGNED') {
          return <Badge variant="orange">Confirmed Aligned</Badge>;
        }
        if (row.mentorVerdict === 'COURSE_CORRECTED') {
          return <Badge variant="coral">Course Corrected</Badge>;
        }
        if (row.mentorVerdict === 'NEEDS_INTERVENTION') {
          return <Badge variant="coral">Intervention Required</Badge>;
        }
        return <Badge variant="neutral">Pending Review</Badge>;
      },
    },
    {
      header: 'Actions',
      width: '100px',
      render: (row) => (
        <Button
          size="sm"
          variant="secondary"
          onClick={() => {
            setSelectedVal(row);
            setValModalOpen(true);
          }}
        >
          Dossier
        </Button>
      ),
    },
  ];

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Tuition Centre Management"
        description="Approve and manage partner tuition centres, review seat allocations, and oversee mentor validations."
        actions={
          <Button
            variant="primary"
            icon={Plus}
            onClick={() => setCreateModalOpen(true)}
          >
            Register Tuition Centre
          </Button>
        }
      />

      {/* Subtabs for Institutions vs Human Mentorship Pipeline */}
      <div
        style={{
          display: 'flex',
          borderBottom: '1px solid #FAD1C6',
          marginBottom: '1.5rem',
          gap: '0.5rem',
        }}
      >
        <button
          onClick={() => setActiveTab('centres')}
          style={{
            padding: '0.65rem 1.1rem',
            border: 'none',
            background: 'transparent',
            borderBottom: activeTab === 'centres' ? '2px solid #DB5E8C' : '2px solid transparent',
            color: activeTab === 'centres' ? '#DB5E8C' : '#77736D',
            fontWeight: activeTab === 'centres' ? 700 : 500,
            fontSize: '0.875rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          Tuition Centres & Seats ({institutions.length})
        </button>

        <button
          onClick={() => setActiveTab('validations')}
          style={{
            padding: '0.65rem 1.1rem',
            border: 'none',
            background: 'transparent',
            borderBottom: activeTab === 'validations' ? '2px solid #DB5E8C' : '2px solid transparent',
            color: activeTab === 'validations' ? '#DB5E8C' : '#77736D',
            fontWeight: activeTab === 'validations' ? 700 : 500,
            fontSize: '0.875rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          Human Mentor Validations ({validations.length})
          <span
            style={{
              fontSize: '0.725rem',
              padding: '2px 6px',
              borderRadius: '9999px',
              backgroundColor: '#FAD1C6',
              color: '#DB5E8C',
              fontWeight: 700,
            }}
          >
            GMeet
          </span>
        </button>
      </div>

      {activeTab === 'centres' && (
        <>
          {/* Pending Approvals Section if any */}
          {pendingList.length > 0 && (
            <div style={{ marginBottom: '2.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#171717', margin: 0 }}>
                  Applications Pending Administrator Verification
                </h2>
                <Badge variant="warning">{pendingList.length} Action Required</Badge>
              </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.25rem' }}>
            {pendingList.map(inst => (
              <div
                key={inst.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  border: '1px solid #FAD1C6',
                  padding: '1.5rem',
                  boxShadow: '0 4px 16px rgba(219, 94, 140, 0.04)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#DB5E8C' }}>{inst.id}</span>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#171717', marginTop: '2px', margin: 0 }}>
                      {inst.name}
                    </h3>
                    <p style={{ fontSize: '0.8rem', color: '#77736D' }}>{inst.location}</p>
                  </div>
                  <Badge variant="warning" dot>Pending Review</Badge>
                </div>

                <div style={{ backgroundColor: '#FCEADE', borderRadius: '10px', padding: '0.75rem', border: '1px solid #FAD1C6', fontSize: '0.8rem', marginBottom: '1rem' }}>
                  <div><strong>Contact:</strong> {inst.contactPerson} ({inst.email})</div>
                  <div><strong>Requested Tier:</strong> {inst.plan}</div>
                  <div><strong>Accreditation:</strong> {inst.accreditation || 'State Vocational License'}</div>
                  {inst.notes && <div style={{ color: '#DB5E8C', marginTop: '4px' }}>📝 {inst.notes}</div>}
                </div>

                <div style={{ display: 'flex', gap: '0.6rem' }}>
                  <Button
                    variant="primary"
                    size="sm"
                    icon={CheckCircle}
                    style={{ flex: 1 }}
                    onClick={() => handleApprove(inst)}
                  >
                    Approve & Issue License
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    style={{ color: '#DB5E8C' }}
                    onClick={() => handleRejectInitiate(inst)}
                  >
                    Reject
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Registered Partners Table */}
      <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#171717', margin: 0 }}>
          All Educational Partners & Coaching Centres
        </h2>
        <span style={{ fontSize: '0.8rem', color: '#77736D' }}>
          Server-side tenant isolation enforced per institution
        </span>
      </div>

      <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        <DataTable
          columns={columns}
          data={institutions}
          searchPlaceholder="Search by centre name, location, contact, or ID..."
          filterOptions={{
            key: 'status',
            label: 'Status',
            options: [
              { label: 'All Statuses', value: 'ALL' },
              { label: 'Approved', value: 'APPROVED' },
              { label: 'Pending Review', value: 'PENDING_REVIEW' },
              { label: 'Suspended', value: 'SUSPENDED' },
              { label: 'Rejected', value: 'REJECTED' },
            ],
          }}
          itemsPerPage={8}
        />
      </div>
      </>
      )}

      {activeTab === 'validations' && (
        <div>
          {/* Philosophy Banner */}
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
              <Video size={20} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#171717' }}>
                Human Validation: Tuition Centre Mentors Representing Zhero
              </div>
              <div style={{ fontSize: '0.8rem', color: '#77736D', marginTop: '2px' }}>
                "We cannot rely on just AI." After students complete dynamic Gemini career assessments, tuition centre mentors conduct 1-on-1 Google Meet verification interviews to confirm career readiness and catch speedrunners.
              </div>
            </div>
            <div
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #FAD1C6',
                padding: '6px 14px',
                borderRadius: '8px',
                textAlign: 'center',
                flexShrink: 0,
              }}
            >
              <div style={{ fontSize: '0.7rem', color: '#77736D', fontWeight: 600 }}>AI Concordance Rate</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#DB5E8C' }}>91.4%</div>
            </div>
          </div>

          {/* Validations Table */}
          <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
            <DataTable
              columns={validationColumns}
              data={validations}
              searchPlaceholder="Search by student, career, tuition centre, or mentor..."
              filterOptions={{
                key: 'status',
                label: 'Status',
                options: [
                  { label: 'All Sessions', value: 'ALL' },
                  { label: 'Verified', value: 'VERIFIED' },
                  { label: 'Scheduled', value: 'SCHEDULED' },
                  { label: 'Flagged for Human', value: 'FLAGGED_FOR_HUMAN' },
                  { label: 'Pending Schedule', value: 'PENDING_SCHEDULE' },
                ],
              }}
              itemsPerPage={8}
            />
          </div>
        </div>
      )}

      {/* Centre Details Modal */}
      {selectedInst && (
        <Modal
          isOpen={detailModalOpen}
          onClose={() => setDetailModalOpen(false)}
          title={`Institution Dossier: ${selectedInst.name}`}
          subtitle={`ID: ${selectedInst.id} • Joined: ${selectedInst.joinedDate}`}
          footer={
            <Button variant="secondary" onClick={() => setDetailModalOpen(false)}>
              Close
            </Button>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.85rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#77736D', display: 'block' }}>Primary Contact</span>
                <span style={{ fontWeight: 600, color: '#171717' }}>{selectedInst.contactPerson}</span>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#77736D', display: 'block' }}>Contact Phone</span>
                <span style={{ fontWeight: 600, color: '#171717' }}>{selectedInst.phone}</span>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#77736D', display: 'block' }}>Email Address</span>
                <span style={{ fontWeight: 600, color: '#171717' }}>{selectedInst.email}</span>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#77736D', display: 'block' }}>Physical Campus</span>
                <span style={{ fontWeight: 600, color: '#171717' }}>{selectedInst.location}</span>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#77736D', display: 'block' }}>Accreditation Partner</span>
                <span style={{ fontWeight: 600, color: '#171717' }}>{selectedInst.accreditation || 'State Board Verified'}</span>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#77736D', display: 'block' }}>Sponsorship Tier</span>
                <span style={{ fontWeight: 600, color: '#171717' }}>{selectedInst.plan}</span>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#77736D', display: 'block' }}>Active Students Sponsored</span>
                <span style={{ fontWeight: 700, color: '#DB5E8C' }}>{selectedInst.studentsCount || selectedInst.usedSeats}</span>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#77736D', display: 'block' }}>Assessments Completed</span>
                <span style={{ fontWeight: 700, color: '#DB5E8C' }}>{selectedInst.assessmentsCompleted || 0}</span>
              </div>
            </div>

            <div style={{ backgroundColor: '#FCEADE', padding: '1rem', borderRadius: '10px', border: '1px solid #FAD1C6' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#77736D', textTransform: 'uppercase' }}>
                Multi-Tenant Data Isolation Policy
              </div>
              <p style={{ fontSize: '0.8rem', color: '#171717', marginTop: '4px', lineHeight: 1.4 }}>
                Enforced by Zhero backend filters: Centre staff and owners under {selectedInst.name} have isolated query scoping (<code>WHERE institution_id = '{selectedInst.id}'</code>) preventing cross-tenant cohort leakage.
              </p>
            </div>
          </div>
        </Modal>
      )}

      {/* Quota Management Modal */}
      {selectedInst && (
        <Modal
          isOpen={quotaModalOpen}
          onClose={() => setQuotaModalOpen(false)}
          title={`Adjust Seat Quota: ${selectedInst.name}`}
          subtitle="Increase or decrease sponsored student license capacity."
        >
          <form onSubmit={handleQuotaSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#171717', marginBottom: '0.35rem' }}>
                Allocated Student Seats
              </label>
              <input
                type="number"
                min={selectedInst.usedSeats || 10}
                required
                className="admin-input"
                value={newQuota}
                onChange={(e) => setNewQuota(e.target.value)}
              />
              <span style={{ fontSize: '0.75rem', color: '#77736D', marginTop: '4px', display: 'block' }}>
                Currently {selectedInst.usedSeats || 0} seats utilized by enrolled batches.
              </span>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#171717', marginBottom: '0.35rem' }}>
                Subscription Tier Plan Label
              </label>
              <input
                type="text"
                required
                className="admin-input"
                value={newPlan}
                onChange={(e) => setNewPlan(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
              <Button variant="secondary" onClick={() => setQuotaModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Save Quota Adjustment
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Partner Rejection Modal with Audit Rationale */}
      <Modal
        isOpen={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        title="Reject Institutional Application"
        subtitle="Provide mandatory compliance reason for rejecting accreditation."
      >
        <form onSubmit={handleConfirmReject} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#171717', marginBottom: '0.35rem' }}>
              Rejection Rationale (Logged in Audit Trail) *
            </label>
            <textarea
              required
              rows={4}
              className="admin-input"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <Button variant="secondary" onClick={() => setRejectModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="danger">
              Confirm Rejection
            </Button>
          </div>
        </form>
      </Modal>

      {/* Register New Centre Modal */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Register Tuition Centre Partner"
        subtitle="Onboard a new educational academy or coaching institute."
      >
        <form onSubmit={handleCreateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#171717', marginBottom: '0.35rem' }}>
              Institution Name *
            </label>
            <input
              type="text"
              required
              className="admin-input"
              placeholder="e.g. Zenith Science Coaching"
              value={newCentreData.name}
              onChange={(e) => setNewCentreData({ ...newCentreData, name: e.target.value })}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#171717', marginBottom: '0.35rem' }}>
                Campus Location *
              </label>
              <input
                type="text"
                required
                className="admin-input"
                placeholder="e.g. Thrissur, Kerala"
                value={newCentreData.location}
                onChange={(e) => setNewCentreData({ ...newCentreData, location: e.target.value })}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#171717', marginBottom: '0.35rem' }}>
                Initial Quota Seats
              </label>
              <input
                type="number"
                min="20"
                className="admin-input"
                value={newCentreData.allocatedSeats}
                onChange={(e) => setNewCentreData({ ...newCentreData, allocatedSeats: Number(e.target.value), plan: `${newCentreData.tier} (${e.target.value} Seats)` })}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#171717', marginBottom: '0.35rem' }}>
                Contact Person Name *
              </label>
              <input
                type="text"
                required
                className="admin-input"
                placeholder="Dr. Rajesh Kumar"
                value={newCentreData.contactPerson}
                onChange={(e) => setNewCentreData({ ...newCentreData, contactPerson: e.target.value })}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#171717', marginBottom: '0.35rem' }}>
                Contact Email *
              </label>
              <input
                type="email"
                required
                className="admin-input"
                placeholder="contact@zenith.edu"
                value={newCentreData.email}
                onChange={(e) => setNewCentreData({ ...newCentreData, email: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#171717', marginBottom: '0.35rem' }}>
              Accreditation Details
            </label>
            <input
              type="text"
              className="admin-input"
              placeholder="State Ed Trust License #KL-TCR-2026"
              value={newCentreData.accreditation}
              onChange={(e) => setNewCentreData({ ...newCentreData, accreditation: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
            <Button variant="secondary" onClick={() => setCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Submit Application
            </Button>
          </div>
        </form>
      </Modal>

      {/* Human Mentor Validation Dossier Modal */}
      {selectedVal && (
        <Modal
          isOpen={valModalOpen}
          onClose={() => setValModalOpen(false)}
          title={`Mentor Validation: ${selectedVal.studentName}`}
          subtitle={`Student ID: ${selectedVal.studentId} • Assigned Centre: ${selectedVal.institutionName}`}
          footer={
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
              <Button variant="secondary" onClick={() => setValModalOpen(false)}>
                Close
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  addToast(`Mentor validation sign-off confirmed for ${selectedVal.studentName}`, 'success');
                  setValModalOpen(false);
                }}
              >
                Approve & Unlock Roadmap
              </Button>
            </div>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.85rem' }}>
            <div style={{ backgroundColor: '#FCEADE', padding: '1rem', borderRadius: '10px', border: '1px solid #FAD1C6' }}>
              <div style={{ fontWeight: 700, color: '#DB5E8C', marginBottom: '4px' }}>AI Career Assessment Output</div>
              <div style={{ fontWeight: 800, fontSize: '1rem', color: '#171717' }}>{selectedVal.aiCareerTrack}</div>
              <div style={{ fontSize: '0.75rem', color: '#77736D', marginTop: '2px' }}>
                Initial readiness diagnosis: {selectedVal.readinessScore}%
              </div>
            </div>

            <div style={{ padding: '0.85rem', backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid #FAD1C6' }}>
              <div style={{ fontSize: '0.75rem', color: '#77736D', fontWeight: 600 }}>Tuition Centre Mentor Evaluation</div>
              <div style={{ fontWeight: 700, color: '#171717', marginTop: '2px' }}>
                {selectedVal.mentorName} ({selectedVal.mentorRole})
              </div>
              <p style={{ marginTop: '6px', color: '#171717', lineHeight: 1.4, fontStyle: 'italic' }}>
                "{selectedVal.mentorNotes}"
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div style={{ padding: '0.75rem', border: '1px solid #FAD1C6', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.7rem', color: '#77736D' }}>GMeet Session</div>
                <a
                  href={selectedVal.gmeetLink}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: '#DB5E8C', fontWeight: 700, fontSize: '0.8rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '3px' }}
                >
                  <Video size={14} /> Open Meeting Room
                </a>
              </div>
              <div style={{ padding: '0.75rem', border: '1px solid #FAD1C6', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.7rem', color: '#77736D' }}>Anti-Speedrun Integrity</div>
                <div style={{ fontWeight: 700, color: '#DB5E8C', fontSize: '0.8rem', marginTop: '3px' }}>
                  {selectedVal.antiSpeedrunFlag}
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Confirm Safeguard Dialog */}
      <ConfirmDialog
        isOpen={confirmState.isOpen}
        onClose={() => setConfirmState(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmState.action}
        title={confirmState.title}
        description={confirmState.description}
        type={confirmState.type}
      />
    </div>
  );
}
