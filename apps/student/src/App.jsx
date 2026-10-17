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
import { OpenSourceHubPage } from './pages/OpenSourceHubPage';
import { BountyHubPage } from './pages/BountyHubPage';
import { StudyRoomsPage } from './pages/StudyRoomsPage';
import LiveInterviewPage from './pages/LiveInterviewPage';
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
    showToast('Roadmap updated');
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
      showToast('Milestone added');
    }
  };

  const handleToggleBookmarkResource = (resId) => {
    const updated = storageService.toggleBookmarkResource(resId);
    setBookmarkedResources(updated);
    showToast(updated.includes(resId) ? 'Resource saved' : 'Resource removed');
  };

  const handleToggleCompleteResource = (resId) => {
    const updated = storageService.toggleCompleteResource(resId);
    setCompletedResources(updated);
    showToast(updated.includes(resId) ? 'Resource completed' : 'Status updated');
  };

  const handleCompleteAssessment = (results) => {
    setAssessmentResults(results);
    if (results?.primaryCareer) {
      const match = CAREERS_DATA.find((c) => c.title.toLowerCase() === results.primaryCareer.toLowerCase()) || CAREERS_DATA[0];
      const updatedRoadmap = storageService.setRoadmapForCareer(match.id);
      setActiveRoadmap(updatedRoadmap);
      showToast('Roadmap updated');
    } else {
      showToast('Assessment saved');
    }
    setCurrentPage('roadmap');
  };

  const handleResetAssessment = () => {
    storageService.resetAssessment();
    setAssessmentResults(null);
    showToast('Assessment reset');
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
    showToast('Data reset');
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    storageService.logoutUser();
    setUserProfile({ ...userProfile, isLoggedIn: false });
    showToast('Signed out');
    setCurrentPage('landing');
  };

  const isPublicPage = currentPage === 'landing';

  // Titles mapping for Dashboard Header (no subtitles, concise titles per Part B)
  const pageTitles = {
    dashboard: { title: 'Dashboard' },
    assessment: { title: 'Assessment' },
    interview: { title: 'Interview' },
    results: { title: 'Matches' },
    careers: { title: 'Careers' },
    'career-detail': { title: 'Career profile' },
    compare: { title: 'Compare' },
    'skill-gap': { title: 'Skill gaps' },
    roadmap: { title: 'Roadmap' },
    resources: { title: 'Resources' },
    'github-hub': { title: 'Open source' },
    bounties: { title: 'Bounties' },
    'study-rooms': { title: 'Study rooms' },
    progress: { title: 'Progress' },
    profile: { title: 'Profile' },
  };

  const headerInfo = pageTitles[currentPage] || { title: 'ZHERO' };

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
          padding: '0.65rem 1rem',
          borderRadius: '8px',
          fontSize: '0.85rem',
          fontWeight: 500,
          boxShadow: '0 1px 3px rgba(23, 23, 23, 0.04)',
          zIndex: 999,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          animation: 'modalFadeIn 0.15s ease',
        }}>
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
          showToast('Signed in');
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

              {currentPage === 'interview' && (
                <LiveInterviewPage onNavigate={handleNavigate} />
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

              {currentPage === 'github-hub' && (
                <OpenSourceHubPage
                  userProfile={userProfile}
                  activeRoadmap={activeRoadmap}
                  onNavigate={handleNavigate}
                />
              )}

              {currentPage === 'bounties' && (
                <BountyHubPage
                  userProfile={userProfile}
                  activeRoadmap={activeRoadmap}
                  onNavigate={handleNavigate}
                />
              )}

              {currentPage === 'study-rooms' && (
                <StudyRoomsPage
                  userProfile={userProfile}
                  activeRoadmap={activeRoadmap}
                  onNavigate={handleNavigate}
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
