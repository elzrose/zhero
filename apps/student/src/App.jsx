import React, { useState, useEffect } from 'react';
import '@shared/styles/tokens.css';
import { StudentNavbar } from './components/StudentNavbar';
import { StudentSidebar } from './components/StudentSidebar';
import { StudentHeader } from './components/StudentHeader';
import { AuthModal } from './pages/AuthModal';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { AssessmentPage } from './pages/AssessmentPage';
import { ResultsPage } from './pages/ResultsPage';
import { CareersPage } from './pages/CareersPage';
import { CareerDetailPage } from './pages/CareerDetailPage';
import { ComparePage } from './pages/ComparePage';
import { SkillGapPage } from './pages/SkillGapPage';
import { RoadmapPage } from './pages/RoadmapPage';
import { ResourcesPage } from './pages/ResourcesPage';
import { ProgressPage } from './pages/ProgressPage';
import { ProfilePage } from './pages/ProfilePage';
import { storageService } from './services/storageService';
import { CAREERS_DATA } from './data/careersData';

export default function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [selectedCareerId, setSelectedCareerId] = useState('full-stack-engineer');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Persistent States
  const [userProfile, setUserProfile] = useState(() => storageService.getUserProfile());
  const [assessmentResults, setAssessmentResults] = useState(() => storageService.getAssessmentResults());
  const [activeRoadmap, setActiveRoadmap] = useState(() => storageService.getActiveRoadmap());
  const [savedCareers, setSavedCareers] = useState(() => storageService.getSavedCareers());
  const [compareList, setCompareList] = useState(() => storageService.getCompareList());
  const [bookmarkedResources, setBookmarkedResources] = useState(() => storageService.getBookmarkedResources());
  const [completedResources, setCompletedResources] = useState(() => storageService.getCompletedResources());

  useEffect(() => {
    const handleSync = () => {
      setActiveRoadmap(storageService.getActiveRoadmap());
      setCompareList(storageService.getCompareList());
    };
    window.addEventListener('storage', handleSync);
    return () => window.removeEventListener('storage', handleSync);
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleNavigate = (pageId) => {
    setCurrentPage(pageId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCareer = (careerId) => {
    setSelectedCareerId(careerId);
    setCurrentPage('career-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleSaveCareer = (careerId) => {
    const updated = storageService.toggleSaveCareer(careerId);
    setSavedCareers(updated);
    showToast(updated.includes(careerId) ? 'Career saved to targets!' : 'Career removed from targets.');
  };

  const handleToggleCompareCareer = (careerId) => {
    const updated = storageService.toggleCompareCareer(careerId);
    setCompareList(updated);
    showToast(updated.includes(careerId) ? 'Added to career comparison!' : 'Removed from comparison.');
  };

  const handleGenerateRoadmap = (careerId) => {
    const roadmap = storageService.setRoadmapForCareer(careerId);
    setActiveRoadmap(roadmap);
    showToast(`Active roadmap set to ${roadmap.careerTitle}!`);
    setCurrentPage('roadmap');
  };

  const handleAuditSkills = (careerId) => {
    setSelectedCareerId(careerId);
    setCurrentPage('skill-gap');
  };

  const handleToggleRoadmapTask = (taskId) => {
    const updated = storageService.toggleRoadmapTask(taskId);
    if (updated) {
      setActiveRoadmap({ ...updated });
    }
  };

  const handleAddCustomTask = (phaseIndex, title, duration) => {
    const updated = storageService.addCustomTask(phaseIndex, title, duration);
    if (updated) {
      setActiveRoadmap({ ...updated });
      showToast('Custom milestone added to roadmap!');
    }
  };

  const handleToggleBookmarkResource = (resId) => {
    const updated = storageService.toggleBookmarkResource(resId);
    setBookmarkedResources(updated);
    showToast(updated.includes(resId) ? 'Resource bookmarked!' : 'Bookmark removed.');
  };

  const handleToggleCompleteResource = (resId) => {
    const updated = storageService.toggleCompleteResource(resId);
    setCompletedResources(updated);
    showToast(updated.includes(resId) ? 'Resource marked completed!' : 'Resource status updated.');
  };

  const handleCompleteAssessment = (results) => {
    setAssessmentResults(results);
    if (results?.primaryCareer) {
      const match = CAREERS_DATA.find((c) => c.title.toLowerCase() === results.primaryCareer.toLowerCase()) || CAREERS_DATA[0];
      const updatedRoadmap = storageService.setRoadmapForCareer(match.id);
      setActiveRoadmap(updatedRoadmap);
      showToast(`Roadmap dynamically tailored to ${match.title}!`);
    } else {
      showToast('Career assessment & guidance finalized!');
    }
    setCurrentPage('roadmap');
  };

  const handleResetAssessment = () => {
    storageService.resetAssessment();
    setAssessmentResults(null);
    showToast('Assessment progress reset.');
    setCurrentPage('assessment');
  };

  const handleResetAllData = () => {
    storageService.resetAll();
    setUserProfile(storageService.getUserProfile());
    setAssessmentResults(storageService.getAssessmentResults());
    setActiveRoadmap(storageService.getActiveRoadmap());
    setSavedCareers(storageService.getSavedCareers());
    setCompareList(storageService.getCompareList());
    setBookmarkedResources(storageService.getBookmarkedResources());
    setCompletedResources(storageService.getCompletedResources());
    showToast('All demo state restored to baseline.');
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    storageService.logoutUser();
    setUserProfile({ ...userProfile, isLoggedIn: false });
    showToast('Signed out of student session.');
    setCurrentPage('landing');
  };

  const isPublicPage = currentPage === 'landing';

  // Titles mapping for Dashboard Header
  const pageTitles = {
    dashboard: { title: 'Student Dashboard', subtitle: 'Personalized career intelligence & roadmap tracking' },
    assessment: { title: 'Career Interest Assessment', subtitle: '16 psychometric scenario questions' },
    results: { title: 'Assessment Results', subtitle: 'Your top 5 aligned career pathways' },
    careers: { title: 'Career Catalogue', subtitle: '18+ emerging & core professional disciplines' },
    'career-detail': { title: 'Career Profile', subtitle: 'Comprehensive skill & pathway breakdown' },
    compare: { title: 'Career Comparison', subtitle: 'Side-by-side analysis across requirements and compensation' },
    'skill-gap': { title: 'Skill-Gap Diagnostic', subtitle: 'Interactive self-audit against industry standards' },
    roadmap: { title: 'Personalized Roadmap', subtitle: 'Actionable step-by-step learning milestones' },
    resources: { title: 'Learning Resources', subtitle: 'Curated beginner guides and tutorials' },
    progress: { title: 'Growth Metrics', subtitle: 'Quantitative readiness and session activity audit' },
    profile: { title: 'Student Settings', subtitle: 'Profile details and demo storage controls' },
  };

  const headerInfo = pageTitles[currentPage] || { title: 'ZHERO Student Portal', subtitle: '' };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#F8F8F7' }}>
      {/* Toast Feedback Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          backgroundColor: '#171717',
          color: '#FFFFFF',
          padding: '0.75rem 1.25rem',
          borderRadius: '10px',
          fontSize: '0.85rem',
          fontWeight: 600,
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
          zIndex: 999,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          animation: 'slideUp 0.2s ease',
        }}>
          <span style={{ color: '#FE6904' }}>✓</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={(profile) => {
          setUserProfile(profile);
          setCurrentPage('dashboard');
          showToast(`Welcome back, ${profile.name}!`);
        }}
      />

      {isPublicPage ? (
        /* PUBLIC LANDING PAGE */
        <>
          <StudentNavbar
            activePage={currentPage}
            onNavigate={handleNavigate}
            onOpenAuth={() => setIsAuthModalOpen(true)}
          />
          <LandingPage
            onStartAssessment={() => handleNavigate('assessment')}
            onExploreCareers={() => handleNavigate('careers')}
            onOpenAuth={() => setIsAuthModalOpen(true)}
          />
        </>
      ) : (
        /* LOGGED-IN PORTAL WITH SIDEBAR & TOPBAR */
        <div style={{ display: 'flex', flex: 1, minHeight: '100vh' }}>
          <StudentSidebar
            currentPage={currentPage}
            onNavigate={handleNavigate}
            userProfile={userProfile}
            onLogout={handleLogout}
            isMobileOpen={isMobileSidebarOpen}
            onCloseMobile={() => setIsMobileSidebarOpen(false)}
          />

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
            <StudentHeader
              title={headerInfo.title}
              subtitle={headerInfo.subtitle}
              onOpenMobile={() => setIsMobileSidebarOpen(true)}
              onNavigate={handleNavigate}
            />

            <main style={{ flex: 1, overflowY: 'auto' }}>
              {currentPage === 'dashboard' && (
                <DashboardPage
                  userProfile={userProfile}
                  assessmentResults={assessmentResults}
                  activeRoadmap={activeRoadmap}
                  savedCareers={savedCareers}
                  onNavigate={handleNavigate}
                  onSelectCareer={handleSelectCareer}
                  onToggleRoadmapTask={handleToggleRoadmapTask}
                />
              )}

              {currentPage === 'assessment' && (
                <AssessmentPage
                  onCompleteAssessment={handleCompleteAssessment}
                  onCancel={() => handleNavigate('dashboard')}
                />
              )}

              {currentPage === 'results' && (
                <ResultsPage
                  assessmentResults={assessmentResults}
                  onSelectCareer={handleSelectCareer}
                  onGenerateRoadmap={handleGenerateRoadmap}
                  onAuditSkills={handleAuditSkills}
                  onCompareCareer={handleToggleCompareCareer}
                  onRetakeAssessment={() => handleNavigate('assessment')}
                  savedCareers={savedCareers}
                  onToggleSaveCareer={handleToggleSaveCareer}
                />
              )}

              {currentPage === 'careers' && (
                <CareersPage
                  onSelectCareer={handleSelectCareer}
                  savedCareers={savedCareers}
                  onToggleSaveCareer={handleToggleSaveCareer}
                  compareList={compareList}
                  onToggleCompareCareer={handleToggleCompareCareer}
                  assessmentResults={assessmentResults}
                />
              )}

              {currentPage === 'career-detail' && (
                <CareerDetailPage
                  careerId={selectedCareerId}
                  onBack={() => handleNavigate('careers')}
                  onGenerateRoadmap={handleGenerateRoadmap}
                  onAuditSkills={handleAuditSkills}
                  onToggleCompareCareer={handleToggleCompareCareer}
                  compareList={compareList}
                  savedCareers={savedCareers}
                  onToggleSaveCareer={handleToggleSaveCareer}
                  onSelectCareer={handleSelectCareer}
                />
              )}

              {currentPage === 'compare' && (
                <ComparePage
                  compareList={compareList}
                  onToggleCompareCareer={handleToggleCompareCareer}
                  onSelectCareer={handleSelectCareer}
                  onGenerateRoadmap={handleGenerateRoadmap}
                  onAuditSkills={handleAuditSkills}
                  onNavigate={handleNavigate}
                />
              )}

              {currentPage === 'skill-gap' && (
                <SkillGapPage
                  initialCareerId={selectedCareerId}
                  onGenerateRoadmap={handleGenerateRoadmap}
                  onNavigate={handleNavigate}
                />
              )}

              {currentPage === 'roadmap' && (
                <RoadmapPage
                  activeRoadmap={activeRoadmap}
                  onToggleTask={handleToggleRoadmapTask}
                  onAddCustomTask={handleAddCustomTask}
                  onSwitchRoadmapCareer={handleGenerateRoadmap}
                  onAuditSkills={handleAuditSkills}
                />
              )}

              {currentPage === 'resources' && (
                <ResourcesPage
                  bookmarkedResources={bookmarkedResources}
                  onToggleBookmark={handleToggleBookmarkResource}
                  completedResources={completedResources}
                  onToggleComplete={handleToggleCompleteResource}
                />
              )}

              {currentPage === 'progress' && (
                <ProgressPage
                  assessmentResults={assessmentResults}
                  activeRoadmap={activeRoadmap}
                  savedCareers={savedCareers}
                  completedResources={completedResources}
                  onNavigate={handleNavigate}
                />
              )}

              {currentPage === 'profile' && (
                <ProfilePage
                  userProfile={userProfile}
                  onUpdateProfile={(p) => {
                    const updated = storageService.saveUserProfile(p);
                    setUserProfile(updated);
                  }}
                  onResetAssessment={handleResetAssessment}
                  onResetAllData={handleResetAllData}
                  onLogout={handleLogout}
                />
              )}
            </main>
          </div>
        </div>
      )}
    </div>
  );
}
