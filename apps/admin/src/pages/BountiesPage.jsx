import React, { useState, useEffect } from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { StatCard } from '../components/common/StatCard';
import { Modal } from '../components/common/Modal';
import { StorageService } from '../services/storageService';
import { useToast } from '../context/ToastContext';
import {
  Building2,
  Briefcase,
  Award,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ExternalLink,
  Plus,
  Search,
  Filter,
  ShieldCheck,
  ShieldAlert,
  Lock,
  Unlock,
  Eye,
  DollarSign,
  FileText,
  Clock,
  UserCheck,
} from 'lucide-react';

export function BountiesPage() {
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState('companies'); // 'companies' | 'bounties' | 'submissions'
  const [companies, setCompanies] = useState([]);
  const [bounties, setBounties] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSector, setFilterSector] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');

  // Modals state
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [selectedBounty, setSelectedBounty] = useState(null);
  const [isBountyModalOpen, setIsBountyModalOpen] = useState(false);
  const [isAddCompanyOpen, setIsAddCompanyOpen] = useState(false);
  const [isAddBountyOpen, setIsAddBountyOpen] = useState(false);

  // New Company Form state
  const [newCompanyForm, setNewCompanyForm] = useState({
    name: '',
    sector: 'Cloud & Distributed Infrastructure',
    contactPerson: '',
    contactRole: '',
    contactEmail: '',
    contactPhone: '',
    totalBountyPool: '₹20,000',
    postingPrivilege: true,
    partnerTuitionCentres: 'Apex Career Academy',
    notes: '',
  });

  // New Bounty Form state
  const [newBountyForm, setNewBountyForm] = useState({
    companyId: '',
    title: '',
    careerTrack: 'Full Stack Engineer',
    description: '',
    reward: '₹15,000 Stipend + Interview',
    deadline: '2026-11-15',
    difficulty: 'Intermediate',
  });

  const loadData = () => {
    setCompanies(StorageService.getCompanies());
    setBounties(StorageService.getBounties());
    setSubmissions(StorageService.getBountySubmissions());
  };

  useEffect(() => {
    loadData();
    const handleStoreChange = () => loadData();
    window.addEventListener('zhero_store_change', handleStoreChange);
    return () => window.removeEventListener('zhero_store_change', handleStoreChange);
  }, []);

  // Filtered Companies
  const filteredCompanies = companies.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.sector.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.contactPerson.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'ALL' || c.verifiedStatus === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Filtered Bounties
  const filteredBounties = bounties.filter((b) => {
    const matchesSearch =
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.careerTrack.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'ALL' || b.approvalStatus === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Filtered Submissions
  const filteredSubmissions = submissions.filter((s) => {
    return (
      s.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.bountyTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.companyName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Toggle company posting privilege
  const handleTogglePostingPrivilege = (company) => {
    const updated = StorageService.toggleCompanyPrivilege(company.id);
    setCompanies(updated);
    const newStatus = !company.postingPrivilege;
    if (newStatus) {
      addToast(`Posting access GRANTED to ${company.name}. They can now submit problem statements.`, 'success');
    } else {
      addToast(`Posting access REVOKED for ${company.name}. Problem posting disabled.`, 'warning');
    }
  };

  // Change company verification status
  const handleUpdateCompanyStatus = (companyId, newStatus) => {
    const updated = StorageService.updateCompanyStatus(companyId, newStatus);
    setCompanies(updated);
    addToast(`Company verification updated to ${newStatus}`, 'info');
    if (selectedCompany && selectedCompany.id === companyId) {
      setSelectedCompany({ ...selectedCompany, verifiedStatus: newStatus });
    }
  };

  // Approve problem statement
  const handleApproveBounty = (bountyId) => {
    const updated = StorageService.updateBountyStatus(bountyId, 'APPROVED_FOR_STUDENTS');
    setBounties(updated);
    addToast('Company problem statement APPROVED and published to Student Platform feed!', 'success');
    if (selectedBounty && selectedBounty.id === bountyId) {
      setSelectedBounty({ ...selectedBounty, approvalStatus: 'APPROVED_FOR_STUDENTS' });
    }
  };

  // Reject or suspend problem statement
  const handleRejectBounty = (bountyId) => {
    const updated = StorageService.updateBountyStatus(bountyId, 'REJECTED');
    setBounties(updated);
    addToast('Problem statement rejected/returned to company for revisions.', 'warning');
    if (selectedBounty && selectedBounty.id === bountyId) {
      setSelectedBounty({ ...selectedBounty, approvalStatus: 'REJECTED' });
    }
  };

  // Release stipend for student submission
  const handleDisburseStipend = (subId) => {
    const updated = StorageService.updateBountySubmissionStatus(subId, 'VERIFIED_PASSPORT_ISSUED', true);
    setSubmissions(updated);
    addToast('Bounty stipend successfully released to student account!', 'success');
  };

  // Create new partner company
  const handleCreateCompany = (e) => {
    e.preventDefault();
    if (!newCompanyForm.name || !newCompanyForm.contactEmail) {
      addToast('Please enter company name and contact email', 'error');
      return;
    }

    const newComp = {
      id: `CMP-${String(companies.length + 1).padStart(2, '0')}`,
      name: newCompanyForm.name,
      sector: newCompanyForm.sector,
      verifiedStatus: 'VERIFIED',
      postingPrivilege: Boolean(newCompanyForm.postingPrivilege),
      contactPerson: newCompanyForm.contactPerson || 'HR & Tech Lead',
      contactRole: newCompanyForm.contactRole || 'Engineering Operations',
      contactEmail: newCompanyForm.contactEmail,
      contactPhone: newCompanyForm.contactPhone || '+91 98000 00000',
      partnerTuitionCentres: [newCompanyForm.partnerTuitionCentres],
      activeBountiesCount: 0,
      totalBountyPool: newCompanyForm.totalBountyPool,
      joinedDate: new Date().toISOString().split('T')[0],
      notes: newCompanyForm.notes || 'Newly registered industry bounty sponsor.',
    };

    const updated = [newComp, ...companies];
    StorageService.saveCompanies(updated);
    setCompanies(updated);
    setIsAddCompanyOpen(false);
    addToast(`Partner Company "${newComp.name}" onboarded with posting privilege=${newComp.postingPrivilege ? 'ENABLED' : 'DISABLED'}`, 'success');
    setNewCompanyForm({
      name: '',
      sector: 'Cloud & Distributed Infrastructure',
      contactPerson: '',
      contactRole: '',
      contactEmail: '',
      contactPhone: '',
      totalBountyPool: '₹20,000',
      postingPrivilege: true,
      partnerTuitionCentres: 'Apex Career Academy',
      notes: '',
    });
  };

  // Create new bounty problem statement
  const handleCreateBounty = (e) => {
    e.preventDefault();
    const authorizedCompanies = companies.filter((c) => c.postingPrivilege);
    const targetCompId = newBountyForm.companyId || (authorizedCompanies[0] && authorizedCompanies[0].id);
    const targetComp = companies.find((c) => c.id === targetCompId);

    if (!targetComp) {
      addToast('Please select a company with active posting privileges', 'error');
      return;
    }
    if (!targetComp.postingPrivilege) {
      addToast(`Company "${targetComp.name}" does NOT have posting privilege. Admin must grant permission first.`, 'error');
      return;
    }
    if (!newBountyForm.title || !newBountyForm.description) {
      addToast('Please enter problem statement title and description', 'error');
      return;
    }

    const newB = {
      id: `BNT-${String(bounties.length + 1).padStart(2, '0')}`,
      companyId: targetComp.id,
      companyName: targetComp.name,
      title: newBountyForm.title,
      description: newBountyForm.description,
      reward: newBountyForm.reward,
      careerTrack: newBountyForm.careerTrack,
      deadline: newBountyForm.deadline,
      difficulty: newBountyForm.difficulty,
      submissionsCount: 0,
      verifiedPassports: 0,
      approvalStatus: 'APPROVED_FOR_STUDENTS',
      status: 'ACTIVE',
    };

    const updated = [newB, ...bounties];
    StorageService.saveBounties(updated);
    setBounties(updated);
    setIsAddBountyOpen(false);
    addToast(`Problem statement "${newB.title}" published under ${targetComp.name}`, 'success');
    setNewBountyForm({
      companyId: '',
      title: '',
      careerTrack: 'Full Stack Engineer',
      description: '',
      reward: '₹15,000 Stipend + Interview',
      deadline: '2026-11-15',
      difficulty: 'Intermediate',
    });
  };

  const authorizedCount = companies.filter((c) => c.postingPrivilege).length;
  const approvedBountiesCount = bounties.filter((b) => b.approvalStatus === 'APPROVED_FOR_STUDENTS').length;
  const pendingReviewBountiesCount = bounties.filter((b) => b.approvalStatus === 'PENDING_ADMIN_REVIEW').length;

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Company Management & Industry Bounties"
        description="Gatekeep and manage partner companies authorized to post real-world problem statements for Zhero students. Review problem statements and approve student stipends."
        actions={
          <div style={{ display: 'flex', gap: '0.6rem' }}>
            <Button
              variant="secondary"
              icon={Building2}
              onClick={() => setIsAddCompanyOpen(true)}
            >
              Onboard Partner Company
            </Button>
            <Button
              variant="primary"
              icon={Plus}
              onClick={() => setIsAddBountyOpen(true)}
            >
              Post Problem Statement
            </Button>
          </div>
        }
      />

      {/* Admin Gatekeeper Architectural Banner */}
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
          <ShieldCheck size={26} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#171717' }}>
            Admin Gatekeeper: Company Authorization & Problem Statement Vetting
          </div>
          <div style={{ fontSize: '0.825rem', color: '#77736D', marginTop: '3px' }}>
            Companies cannot put problems directly in front of students without admin authorization. The Admin Platform maintains the whitelist of authorized companies, toggles posting privileges, and validates that every problem statement offers educational merit and genuine student stipends.
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
          <div style={{ fontSize: '0.725rem', color: '#77736D', fontWeight: 600 }}>Active Posting Whitelist</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#DB5E8C' }}>
            {authorizedCount} of {companies.length} Companies
          </div>
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
          title="Partner Companies"
          value={companies.length.toString()}
          subtitle={`${authorizedCount} authorized to post`}
          icon={Building2}
        />
        <StatCard
          title="Posting Access Rate"
          value={companies.length > 0 ? `${Math.round((authorizedCount / companies.length) * 100)}%` : '0%'}
          subtitle="Admin approved sponsors"
          icon={ShieldCheck}
          variant="coral"
        />
        <StatCard
          title="Active Student Bounties"
          value={approvedBountiesCount.toString()}
          subtitle={`${pendingReviewBountiesCount} awaiting admin review`}
          icon={Award}
          variant="orange"
        />
        <StatCard
          title="Student Proof-of-Work"
          value={submissions.length.toString()}
          subtitle="Submitted solutions & code"
          icon={UserCheck}
        />
      </div>

      {/* Tabs Navigation */}
      <div
        style={{
          display: 'flex',
          borderBottom: '1px solid #FAD1C6',
          marginBottom: '1.5rem',
          gap: '0.5rem',
        }}
      >
        <button
          onClick={() => {
            setActiveTab('companies');
            setFilterStatus('ALL');
          }}
          style={{
            padding: '0.75rem 1.25rem',
            fontSize: '0.875rem',
            fontWeight: 700,
            border: 'none',
            borderBottom: activeTab === 'companies' ? '2px solid #DB5E8C' : '2px solid transparent',
            color: activeTab === 'companies' ? '#DB5E8C' : '#77736D',
            backgroundColor: 'transparent',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <Building2 size={16} />
          Authorized Companies ({companies.length})
        </button>

        <button
          onClick={() => {
            setActiveTab('bounties');
            setFilterStatus('ALL');
          }}
          style={{
            padding: '0.75rem 1.25rem',
            fontSize: '0.875rem',
            fontWeight: 700,
            border: 'none',
            borderBottom: activeTab === 'bounties' ? '2px solid #DB5E8C' : '2px solid transparent',
            color: activeTab === 'bounties' ? '#DB5E8C' : '#77736D',
            backgroundColor: 'transparent',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <Briefcase size={16} />
          Company Problem Statements ({bounties.length})
          {pendingReviewBountiesCount > 0 && (
            <span
              style={{
                backgroundColor: '#DB5E8C',
                color: '#FFFFFF',
                borderRadius: '10px',
                padding: '1px 6px',
                fontSize: '0.7rem',
                fontWeight: 700,
              }}
            >
              {pendingReviewBountiesCount} review
            </span>
          )}
        </button>

        <button
          onClick={() => {
            setActiveTab('submissions');
            setFilterStatus('ALL');
          }}
          style={{
            padding: '0.75rem 1.25rem',
            fontSize: '0.875rem',
            fontWeight: 700,
            border: 'none',
            borderBottom: activeTab === 'submissions' ? '2px solid #DB5E8C' : '2px solid transparent',
            color: activeTab === 'submissions' ? '#DB5E8C' : '#77736D',
            backgroundColor: 'transparent',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <Award size={16} />
          Student Solutions & Stipends ({submissions.length})
        </button>
      </div>

      {/* Search & Filter Toolbar */}
      <div
        style={{
          display: 'flex',
          gap: '1rem',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ position: 'relative', minWidth: '280px', flex: 1 }}>
          <Search
            size={16}
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#77736D',
            }}
          />
          <input
            type="text"
            placeholder={
              activeTab === 'companies'
                ? 'Search company name, sector, contact person...'
                : activeTab === 'bounties'
                ? 'Search problem title, company, required skill...'
                : 'Search student name, bounty title...'
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '0.6rem 0.75rem 0.6rem 2.25rem',
              borderRadius: '8px',
              border: '1px solid #FAD1C6',
              fontSize: '0.875rem',
              backgroundColor: '#FFFFFF',
              color: '#171717',
              outline: 'none',
            }}
          />
        </div>

        {activeTab === 'companies' && (
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: '#77736D', fontWeight: 600 }}>Status:</span>
            {['ALL', 'VERIFIED', 'PENDING_APPROVAL', 'SUSPENDED'].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                style={{
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  border: filterStatus === st ? '1px solid #DB5E8C' : '1px solid #FAD1C6',
                  backgroundColor: filterStatus === st ? '#FCEADE' : '#FFFFFF',
                  color: filterStatus === st ? '#DB5E8C' : '#77736D',
                  cursor: 'pointer',
                }}
              >
                {st.replace('_', ' ')}
              </button>
            ))}
          </div>
        )}

        {activeTab === 'bounties' && (
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: '#77736D', fontWeight: 600 }}>Approval:</span>
            {['ALL', 'APPROVED_FOR_STUDENTS', 'PENDING_ADMIN_REVIEW'].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                style={{
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  border: filterStatus === st ? '1px solid #DB5E8C' : '1px solid #FAD1C6',
                  backgroundColor: filterStatus === st ? '#FCEADE' : '#FFFFFF',
                  color: filterStatus === st ? '#DB5E8C' : '#77736D',
                  cursor: 'pointer',
                }}
              >
                {st === 'ALL' ? 'ALL' : st === 'APPROVED_FOR_STUDENTS' ? 'APPROVED' : 'PENDING REVIEW'}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* TAB 1: AUTHORIZED PARTNER COMPANIES */}
      {activeTab === 'companies' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.25rem' }}>
          {filteredCompanies.map((comp) => {
            const hasPrivilege = Boolean(comp.postingPrivilege);
            return (
              <div
                key={comp.id}
                className="admin-card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  border: hasPrivilege ? '1px solid #FAD1C6' : '1px dashed #F5AFAE',
                  backgroundColor: '#FFFFFF',
                }}
              >
                <div>
                  {/* Top company banner */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                      <div
                        style={{
                          width: '42px',
                          height: '42px',
                          borderRadius: '10px',
                          backgroundColor: '#FCEADE',
                          color: '#DB5E8C',
                          fontWeight: 800,
                          fontSize: '1rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: '1px solid #FAD1C6',
                        }}
                      >
                        {comp.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#171717' }}>
                          {comp.name}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#77736D' }}>
                          {comp.sector}
                        </div>
                      </div>
                    </div>

                    <Badge
                      variant={
                        comp.verifiedStatus === 'VERIFIED'
                          ? 'success'
                          : comp.verifiedStatus === 'PENDING_APPROVAL'
                          ? 'warning'
                          : 'error'
                      }
                    >
                      {comp.verifiedStatus.replace('_', ' ')}
                    </Badge>
                  </div>

                  {/* Posting Privilege Status Banner */}
                  <div
                    style={{
                      padding: '0.65rem 0.75rem',
                      borderRadius: '8px',
                      backgroundColor: hasPrivilege ? '#FCEADE' : '#FFFFFF',
                      border: '1px solid #FAD1C6',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '0.85rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {hasPrivilege ? (
                        <CheckCircle2 size={16} color="#DB5E8C" />
                      ) : (
                        <Lock size={16} color="#77736D" />
                      )}
                      <span
                        style={{
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          color: hasPrivilege ? '#DB5E8C' : '#77736D',
                        }}
                      >
                        {hasPrivilege ? 'Authorized to Post Problems' : 'Problem Posting Disabled by Admin'}
                      </span>
                    </div>

                    {/* Instant Admin Toggle */}
                    <button
                      onClick={() => handleTogglePostingPrivilege(comp)}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '0.725rem',
                        fontWeight: 700,
                        border: 'none',
                        cursor: 'pointer',
                        backgroundColor: hasPrivilege ? '#DB5E8C' : '#FAD1C6',
                        color: hasPrivilege ? '#FFFFFF' : '#171717',
                        transition: 'all 0.15s ease',
                      }}
                      title={hasPrivilege ? 'Revoke posting access' : 'Grant posting access'}
                    >
                      {hasPrivilege ? 'Revoke Access' : 'Grant Posting'}
                    </button>
                  </div>

                  {/* Company Details Grid */}
                  <div style={{ fontSize: '0.775rem', color: '#77736D', marginBottom: '0.75rem', lineHeight: '1.4' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span>Contact Lead:</span>
                      <strong style={{ color: '#171717' }}>{comp.contactPerson} ({comp.contactRole})</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span>Email:</span>
                      <span style={{ color: '#171717' }}>{comp.contactEmail}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span>Phone:</span>
                      <span style={{ color: '#171717' }}>{comp.contactPhone}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span>Total Bounty Pool:</span>
                      <strong style={{ color: '#DB5E8C' }}>{comp.totalBountyPool}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Active Bounties:</span>
                      <strong style={{ color: '#171717' }}>{comp.activeBountiesCount} problem statements</strong>
                    </div>
                  </div>

                  {/* Partner Centres & Notes */}
                  {comp.notes && (
                    <div
                      style={{
                        fontSize: '0.75rem',
                        color: '#77736D',
                        backgroundColor: '#FCEADE',
                        padding: '6px 10px',
                        borderRadius: '6px',
                        border: '1px solid #FAD1C6',
                        marginBottom: '0.75rem',
                      }}
                    >
                      📝 {comp.notes}
                    </div>
                  )}
                </div>

                {/* Card Actions */}
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', borderTop: '1px solid #FCEADE', paddingTop: '0.75rem' }}>
                  <Button
                    variant="outline"
                    size="sm"
                    icon={Eye}
                    onClick={() => {
                      setSelectedCompany(comp);
                      setIsCompanyModalOpen(true);
                    }}
                    style={{ flex: 1 }}
                  >
                    View Details & Audit
                  </Button>
                  {comp.verifiedStatus !== 'VERIFIED' && (
                    <Button
                      variant="primary"
                      size="sm"
                      icon={ShieldCheck}
                      onClick={() => handleUpdateCompanyStatus(comp.id, 'VERIFIED')}
                    >
                      Verify
                    </Button>
                  )}
                  {comp.verifiedStatus === 'VERIFIED' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUpdateCompanyStatus(comp.id, 'SUSPENDED')}
                    >
                      Suspend
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: COMPANY PROBLEM STATEMENTS */}
      {activeTab === 'bounties' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.25rem' }}>
          {filteredBounties.map((bounty) => {
            const isApproved = bounty.approvalStatus === 'APPROVED_FOR_STUDENTS';
            const company = companies.find((c) => c.id === bounty.companyId);

            return (
              <div
                key={bounty.id}
                className="admin-card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  border: isApproved ? '1px solid #FAD1C6' : '2px solid #F5AFAE',
                  backgroundColor: '#FFFFFF',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Building2 size={15} color="#DB5E8C" />
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#DB5E8C' }}>
                        {bounty.companyName}
                      </span>
                      {company && company.postingPrivilege && (
                        <span title="Posting Privilege Verified">
                          <CheckCircle2 size={13} color="#DB5E8C" />
                        </span>
                      )}
                    </div>
                    <Badge
                      variant={isApproved ? 'success' : 'warning'}
                    >
                      {isApproved ? 'APPROVED FOR STUDENTS' : 'PENDING ADMIN APPROVAL'}
                    </Badge>
                  </div>

                  <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#171717', marginBottom: '0.5rem', lineHeight: '1.3' }}>
                    {bounty.title}
                  </h3>

                  <p style={{ fontSize: '0.8rem', color: '#77736D', marginBottom: '1rem', lineHeight: '1.45' }}>
                    {bounty.description}
                  </p>

                  <div
                    style={{
                      backgroundColor: '#FCEADE',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid #FAD1C6',
                      marginBottom: '1rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.7rem', color: '#77736D', fontWeight: 600 }}>Stipend Reward</div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#DB5E8C' }}>
                        {bounty.reward}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.7rem', color: '#77736D', fontWeight: 600 }}>Track & Level</div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#171717' }}>
                        {bounty.careerTrack} • {bounty.difficulty}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#77736D', marginBottom: '0.5rem' }}>
                    <span>Deadline: <strong>{bounty.deadline}</strong></span>
                    <span>Student Submissions: <strong style={{ color: '#171717' }}>{bounty.submissionsCount} solutions</strong></span>
                  </div>
                </div>

                {/* Admin Actions */}
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', borderTop: '1px solid #FCEADE', paddingTop: '0.75rem' }}>
                  <Button
                    variant="outline"
                    size="sm"
                    icon={Eye}
                    onClick={() => {
                      setSelectedBounty(bounty);
                      setIsBountyModalOpen(true);
                    }}
                    style={{ flex: 1 }}
                  >
                    Inspect Problem
                  </Button>

                  {!isApproved ? (
                    <Button
                      variant="primary"
                      size="sm"
                      icon={CheckCircle2}
                      onClick={() => handleApproveBounty(bounty.id)}
                    >
                      Approve & Publish
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRejectBounty(bounty.id)}
                    >
                      Unpublish
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 3: STUDENT SOLUTIONS & STIPENDS */}
      {activeTab === 'submissions' && (
        <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#FCEADE', borderBottom: '1px solid #FAD1C6' }}>
                  <th style={{ padding: '0.85rem 1rem', color: '#171717', fontWeight: 700 }}>Student & ID</th>
                  <th style={{ padding: '0.85rem 1rem', color: '#171717', fontWeight: 700 }}>Bounty Problem & Company</th>
                  <th style={{ padding: '0.85rem 1rem', color: '#171717', fontWeight: 700 }}>Mentor Endorsement</th>
                  <th style={{ padding: '0.85rem 1rem', color: '#171717', fontWeight: 700 }}>Score</th>
                  <th style={{ padding: '0.85rem 1rem', color: '#171717', fontWeight: 700 }}>Stipend Status</th>
                  <th style={{ padding: '0.85rem 1rem', color: '#171717', fontWeight: 700 }}>Proof-of-Work</th>
                  <th style={{ padding: '0.85rem 1rem', color: '#171717', fontWeight: 700, textAlign: 'right' }}>Admin Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubmissions.map((sub, idx) => {
                  const isReleased = sub.stipendStatus === 'STIPEND_RELEASED';
                  return (
                    <tr
                      key={sub.id}
                      style={{
                        borderBottom: idx < filteredSubmissions.length - 1 ? '1px solid #FAD1C6' : 'none',
                        backgroundColor: idx % 2 === 0 ? '#FFFFFF' : '#FCEADE',
                      }}
                    >
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '8px',
                              backgroundColor: '#FAD1C6',
                              color: '#DB5E8C',
                              fontWeight: 700,
                              fontSize: '0.75rem',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            {sub.avatar}
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, color: '#171717' }}>{sub.studentName}</div>
                            <div style={{ fontSize: '0.725rem', color: '#77736D' }}>{sub.studentId}</div>
                          </div>
                        </div>
                      </td>

                      <td style={{ padding: '0.85rem 1rem' }}>
                        <div style={{ fontWeight: 600, color: '#171717', maxWidth: '240px' }}>
                          {sub.bountyTitle}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#DB5E8C', fontWeight: 700 }}>
                          {sub.companyName}
                        </div>
                      </td>

                      <td style={{ padding: '0.85rem 1rem' }}>
                        <div style={{ fontSize: '0.775rem', color: '#171717' }}>
                          {sub.mentorEndorsement}
                        </div>
                        <div style={{ fontSize: '0.725rem', color: '#77736D' }}>
                          Submitted: {sub.submittedAt}
                        </div>
                      </td>

                      <td style={{ padding: '0.85rem 1rem' }}>
                        <span style={{ fontWeight: 800, color: '#DB5E8C', fontSize: '0.95rem' }}>
                          {sub.score}%
                        </span>
                      </td>

                      <td style={{ padding: '0.85rem 1rem' }}>
                        <Badge variant={isReleased ? 'success' : 'warning'}>
                          {isReleased ? 'STIPEND RELEASED' : 'PENDING DISBURSEMENT'}
                        </Badge>
                      </td>

                      <td style={{ padding: '0.85rem 1rem' }}>
                        <a
                          href={sub.githubRepoUrl}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            color: '#DB5E8C',
                            textDecoration: 'none',
                            fontWeight: 700,
                            fontSize: '0.775rem',
                          }}
                        >
                          Inspect Repo / Flow <ExternalLink size={12} />
                        </a>
                      </td>

                      <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                        {!isReleased ? (
                          <Button
                            variant="primary"
                            size="sm"
                            icon={DollarSign}
                            onClick={() => handleDisburseStipend(sub.id)}
                          >
                            Disburse Stipend
                          </Button>
                        ) : (
                          <span style={{ fontSize: '0.75rem', color: '#77736D', fontWeight: 600 }}>
                            Disbursed ✓
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL 1: INSPECT COMPANY DETAILS */}
      <Modal
        isOpen={isCompanyModalOpen}
        onClose={() => setIsCompanyModalOpen(false)}
        title={selectedCompany ? `${selectedCompany.name} — Company Audit & Authorization` : 'Company Details'}
        footer={
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <Button
              variant="outline"
              onClick={() => {
                if (selectedCompany) handleTogglePostingPrivilege(selectedCompany);
                setIsCompanyModalOpen(false);
              }}
            >
              {selectedCompany?.postingPrivilege ? 'Revoke Posting Privilege' : 'Grant Posting Privilege'}
            </Button>
            <Button variant="secondary" onClick={() => setIsCompanyModalOpen(false)}>
              Close Audit
            </Button>
          </div>
        }
      >
        {selectedCompany && (
          <div>
            <div
              style={{
                backgroundColor: '#FCEADE',
                padding: '1rem',
                borderRadius: '8px',
                border: '1px solid #FAD1C6',
                marginBottom: '1rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#171717' }}>Posting Rights Status:</span>
                <Badge variant={selectedCompany.postingPrivilege ? 'success' : 'error'}>
                  {selectedCompany.postingPrivilege ? 'AUTHORIZED TO POST' : 'POSTING DISABLED'}
                </Badge>
              </div>
              <div style={{ fontSize: '0.775rem', color: '#77736D' }}>
                When authorized, this company's hiring engineers can draft real-world problem statements directly targeted to Zhero student cohorts.
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.825rem', marginBottom: '1rem' }}>
              <div>
                <span style={{ color: '#77736D' }}>Company ID:</span>
                <div style={{ fontWeight: 700, color: '#171717' }}>{selectedCompany.id}</div>
              </div>
              <div>
                <span style={{ color: '#77736D' }}>Sector:</span>
                <div style={{ fontWeight: 700, color: '#171717' }}>{selectedCompany.sector}</div>
              </div>
              <div>
                <span style={{ color: '#77736D' }}>Key Contact:</span>
                <div style={{ fontWeight: 700, color: '#171717' }}>{selectedCompany.contactPerson} ({selectedCompany.contactRole})</div>
              </div>
              <div>
                <span style={{ color: '#77736D' }}>Contact Email:</span>
                <div style={{ fontWeight: 700, color: '#171717' }}>{selectedCompany.contactEmail}</div>
              </div>
              <div>
                <span style={{ color: '#77736D' }}>Phone:</span>
                <div style={{ fontWeight: 700, color: '#171717' }}>{selectedCompany.contactPhone}</div>
              </div>
              <div>
                <span style={{ color: '#77736D' }}>Total Bounty Committed:</span>
                <div style={{ fontWeight: 800, color: '#DB5E8C' }}>{selectedCompany.totalBountyPool}</div>
              </div>
            </div>

            <div style={{ fontSize: '0.8rem', color: '#171717', marginBottom: '1rem' }}>
              <strong>Partner Tuition Centres:</strong> {selectedCompany.partnerTuitionCentres?.join(', ') || 'None assigned'}
            </div>

            <div style={{ fontSize: '0.8rem', color: '#77736D', backgroundColor: '#FCEADE', padding: '10px', borderRadius: '8px', border: '1px solid #FAD1C6' }}>
              <strong>Admin Compliance Log:</strong> {selectedCompany.notes}
            </div>
          </div>
        )}
      </Modal>

      {/* MODAL 2: INSPECT BOUNTY PROBLEM STATEMENT */}
      <Modal
        isOpen={isBountyModalOpen}
        onClose={() => setIsBountyModalOpen(false)}
        title={selectedBounty ? `${selectedBounty.title}` : 'Bounty Problem Statement'}
        footer={
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            {selectedBounty && selectedBounty.approvalStatus !== 'APPROVED_FOR_STUDENTS' ? (
              <Button
                variant="primary"
                icon={CheckCircle2}
                onClick={() => {
                  handleApproveBounty(selectedBounty.id);
                  setIsBountyModalOpen(false);
                }}
              >
                Approve & Publish to Students
              </Button>
            ) : (
              <Button
                variant="outline"
                onClick={() => {
                  if (selectedBounty) handleRejectBounty(selectedBounty.id);
                  setIsBountyModalOpen(false);
                }}
              >
                Unpublish Problem
              </Button>
            )}
            <Button variant="secondary" onClick={() => setIsBountyModalOpen(false)}>
              Close
            </Button>
          </div>
        }
      >
        {selectedBounty && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#77736D' }}>Sponsoring Partner:</div>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: '#DB5E8C' }}>{selectedBounty.companyName}</div>
              </div>
              <Badge variant={selectedBounty.approvalStatus === 'APPROVED_FOR_STUDENTS' ? 'success' : 'warning'}>
                {selectedBounty.approvalStatus}
              </Badge>
            </div>

            <div style={{ backgroundColor: '#FCEADE', padding: '12px', borderRadius: '8px', border: '1px solid #FAD1C6', marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#171717', marginBottom: '4px' }}>
                Problem Statement Description:
              </div>
              <p style={{ fontSize: '0.825rem', color: '#171717', lineHeight: '1.5', margin: 0 }}>
                {selectedBounty.description}
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.825rem', marginBottom: '1rem' }}>
              <div>
                <span style={{ color: '#77736D' }}>Target Career Track:</span>
                <div style={{ fontWeight: 700, color: '#171717' }}>{selectedBounty.careerTrack}</div>
              </div>
              <div>
                <span style={{ color: '#77736D' }}>Difficulty:</span>
                <div style={{ fontWeight: 700, color: '#171717' }}>{selectedBounty.difficulty}</div>
              </div>
              <div>
                <span style={{ color: '#77736D' }}>Submission Deadline:</span>
                <div style={{ fontWeight: 700, color: '#171717' }}>{selectedBounty.deadline}</div>
              </div>
              <div>
                <span style={{ color: '#77736D' }}>Student Stipend Reward:</span>
                <div style={{ fontWeight: 800, color: '#DB5E8C' }}>{selectedBounty.reward}</div>
              </div>
            </div>

            <div style={{ fontSize: '0.75rem', color: '#77736D', backgroundColor: '#FCEADE', padding: '8px 12px', borderRadius: '6px', border: '1px solid #FAD1C6' }}>
              💡 <strong>Quality Assurance Guarantee:</strong> Once approved, tuition centre instructors can assign this problem as capstone work. Verified submissions award student skill passports and disburse stipends directly.
            </div>
          </div>
        )}
      </Modal>

      {/* MODAL 3: ONBOARD PARTNER COMPANY */}
      <Modal
        isOpen={isAddCompanyOpen}
        onClose={() => setIsAddCompanyOpen(false)}
        title="Onboard New Partner Company"
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', width: '100%' }}>
            <Button variant="secondary" onClick={() => setIsAddCompanyOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleCreateCompany}>
              Authorize Company
            </Button>
          </div>
        }
      >
        <form onSubmit={handleCreateCompany} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#171717', marginBottom: '4px' }}>
              Company Legal Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Apex AI Systems, HyperScale Cloud"
              value={newCompanyForm.name}
              onChange={(e) => setNewCompanyForm({ ...newCompanyForm, name: e.target.value })}
              style={{
                width: '100%',
                padding: '0.55rem 0.75rem',
                borderRadius: '8px',
                border: '1px solid #FAD1C6',
                fontSize: '0.85rem',
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#171717', marginBottom: '4px' }}>
                Industry Sector
              </label>
              <select
                value={newCompanyForm.sector}
                onChange={(e) => setNewCompanyForm({ ...newCompanyForm, sector: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.55rem 0.75rem',
                  borderRadius: '8px',
                  border: '1px solid #FAD1C6',
                  fontSize: '0.85rem',
                  backgroundColor: '#FFFFFF',
                }}
              >
                <option value="Cloud & Distributed Infrastructure">Cloud & Distributed Infrastructure</option>
                <option value="AI, LLMs & Vector Systems">AI, LLMs & Vector Systems</option>
                <option value="Digital Product Design & Accessibility">Digital Product Design & Accessibility</option>
                <option value="Financial Technology & Security">Financial Technology & Security</option>
                <option value="Biotech & Healthcare Informatics">Biotech & Healthcare Informatics</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#171717', marginBottom: '4px' }}>
                Total Bounty Pool Committed
              </label>
              <input
                type="text"
                placeholder="e.g. ₹30,000"
                value={newCompanyForm.totalBountyPool}
                onChange={(e) => setNewCompanyForm({ ...newCompanyForm, totalBountyPool: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.55rem 0.75rem',
                  borderRadius: '8px',
                  border: '1px solid #FAD1C6',
                  fontSize: '0.85rem',
                }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#171717', marginBottom: '4px' }}>
                Contact Person Name
              </label>
              <input
                type="text"
                placeholder="e.g. Anand Menon"
                value={newCompanyForm.contactPerson}
                onChange={(e) => setNewCompanyForm({ ...newCompanyForm, contactPerson: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.55rem 0.75rem',
                  borderRadius: '8px',
                  border: '1px solid #FAD1C6',
                  fontSize: '0.85rem',
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#171717', marginBottom: '4px' }}>
                Contact Role
              </label>
              <input
                type="text"
                placeholder="e.g. VP of Engineering"
                value={newCompanyForm.contactRole}
                onChange={(e) => setNewCompanyForm({ ...newCompanyForm, contactRole: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.55rem 0.75rem',
                  borderRadius: '8px',
                  border: '1px solid #FAD1C6',
                  fontSize: '0.85rem',
                }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#171717', marginBottom: '4px' }}>
                Contact Email *
              </label>
              <input
                type="email"
                required
                placeholder="engineering@company.com"
                value={newCompanyForm.contactEmail}
                onChange={(e) => setNewCompanyForm({ ...newCompanyForm, contactEmail: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.55rem 0.75rem',
                  borderRadius: '8px',
                  border: '1px solid #FAD1C6',
                  fontSize: '0.85rem',
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#171717', marginBottom: '4px' }}>
                Contact Phone
              </label>
              <input
                type="text"
                placeholder="+91 98471 00000"
                value={newCompanyForm.contactPhone}
                onChange={(e) => setNewCompanyForm({ ...newCompanyForm, contactPhone: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.55rem 0.75rem',
                  borderRadius: '8px',
                  border: '1px solid #FAD1C6',
                  fontSize: '0.85rem',
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#171717', marginBottom: '4px' }}>
              Partner Tuition Centre Alignment
            </label>
            <input
              type="text"
              placeholder="e.g. Apex Career Academy, Horizon STEM"
              value={newCompanyForm.partnerTuitionCentres}
              onChange={(e) => setNewCompanyForm({ ...newCompanyForm, partnerTuitionCentres: e.target.value })}
              style={{
                width: '100%',
                padding: '0.55rem 0.75rem',
                borderRadius: '8px',
                border: '1px solid #FAD1C6',
                fontSize: '0.85rem',
              }}
            />
          </div>

          <div
            style={{
              padding: '0.75rem',
              borderRadius: '8px',
              backgroundColor: '#FCEADE',
              border: '1px solid #FAD1C6',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <input
              type="checkbox"
              id="grantPrivilegeCheckbox"
              checked={newCompanyForm.postingPrivilege}
              onChange={(e) => setNewCompanyForm({ ...newCompanyForm, postingPrivilege: e.target.checked })}
              style={{ width: '18px', height: '18px', accentColor: '#DB5E8C' }}
            />
            <label htmlFor="grantPrivilegeCheckbox" style={{ fontSize: '0.825rem', fontWeight: 700, color: '#171717', cursor: 'pointer' }}>
              Grant Immediate Problem Posting Privilege (Admin Whitelist)
            </label>
          </div>
        </form>
      </Modal>

      {/* MODAL 4: POST COMPANY PROBLEM STATEMENT */}
      <Modal
        isOpen={isAddBountyOpen}
        onClose={() => setIsAddBountyOpen(false)}
        title="Post Company Problem Statement"
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', width: '100%' }}>
            <Button variant="secondary" onClick={() => setIsAddBountyOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleCreateBounty}>
              Publish Problem Statement
            </Button>
          </div>
        }
      >
        <form onSubmit={handleCreateBounty} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#171717', marginBottom: '4px' }}>
              Select Authorized Partner Company *
            </label>
            <select
              value={newBountyForm.companyId}
              onChange={(e) => setNewBountyForm({ ...newBountyForm, companyId: e.target.value })}
              style={{
                width: '100%',
                padding: '0.55rem 0.75rem',
                borderRadius: '8px',
                border: '1px solid #FAD1C6',
                fontSize: '0.85rem',
                backgroundColor: '#FFFFFF',
              }}
            >
              <option value="">-- Choose Authorized Company --</option>
              {companies
                .filter((c) => c.postingPrivilege)
                .map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.sector}) [Posting Authorized]
                  </option>
                ))}
            </select>
            <div style={{ fontSize: '0.725rem', color: '#77736D', marginTop: '3px' }}>
              Only companies with Admin posting privileges enabled appear in this list.
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#171717', marginBottom: '4px' }}>
              Problem Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Implement Open-Telemetry Tracing Exporter"
              value={newBountyForm.title}
              onChange={(e) => setNewBountyForm({ ...newBountyForm, title: e.target.value })}
              style={{
                width: '100%',
                padding: '0.55rem 0.75rem',
                borderRadius: '8px',
                border: '1px solid #FAD1C6',
                fontSize: '0.85rem',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#171717', marginBottom: '4px' }}>
              Problem Statement & Deliverables *
            </label>
            <textarea
              required
              rows={4}
              placeholder="Describe the real-world engineering challenge, technical constraints, deliverables, and acceptance criteria..."
              value={newBountyForm.description}
              onChange={(e) => setNewBountyForm({ ...newBountyForm, description: e.target.value })}
              style={{
                width: '100%',
                padding: '0.55rem 0.75rem',
                borderRadius: '8px',
                border: '1px solid #FAD1C6',
                fontSize: '0.85rem',
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#171717', marginBottom: '4px' }}>
                Career Track
              </label>
              <select
                value={newBountyForm.careerTrack}
                onChange={(e) => setNewBountyForm({ ...newBountyForm, careerTrack: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.55rem 0.75rem',
                  borderRadius: '8px',
                  border: '1px solid #FAD1C6',
                  fontSize: '0.85rem',
                  backgroundColor: '#FFFFFF',
                }}
              >
                <option value="Full Stack Engineer">Full Stack Engineer</option>
                <option value="AI / ML Specialist">AI / ML Specialist</option>
                <option value="UI/UX Product Designer">UI/UX Product Designer</option>
                <option value="Cloud Solutions Architect">Cloud Solutions Architect</option>
                <option value="Cybersecurity Analyst">Cybersecurity Analyst</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#171717', marginBottom: '4px' }}>
                Difficulty Level
              </label>
              <select
                value={newBountyForm.difficulty}
                onChange={(e) => setNewBountyForm({ ...newBountyForm, difficulty: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.55rem 0.75rem',
                  borderRadius: '8px',
                  border: '1px solid #FAD1C6',
                  fontSize: '0.85rem',
                  backgroundColor: '#FFFFFF',
                }}
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#171717', marginBottom: '4px' }}>
                Student Stipend Reward
              </label>
              <input
                type="text"
                placeholder="e.g. ₹15,000 Stipend + Interview"
                value={newBountyForm.reward}
                onChange={(e) => setNewBountyForm({ ...newBountyForm, reward: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.55rem 0.75rem',
                  borderRadius: '8px',
                  border: '1px solid #FAD1C6',
                  fontSize: '0.85rem',
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#171717', marginBottom: '4px' }}>
                Submission Deadline
              </label>
              <input
                type="date"
                value={newBountyForm.deadline}
                onChange={(e) => setNewBountyForm({ ...newBountyForm, deadline: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.55rem 0.75rem',
                  borderRadius: '8px',
                  border: '1px solid #FAD1C6',
                  fontSize: '0.85rem',
                }}
              />
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
}
