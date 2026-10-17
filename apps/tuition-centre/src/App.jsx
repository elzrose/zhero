import React, { useState } from 'react';
import './styles/theme.css';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { LandingPage } from './views/LandingPage';
import { CourseCatalog } from './views/CourseCatalog';
import { PublicAssessment } from './views/PublicAssessment';
import { AuthView } from './views/AuthView';
import { DashboardView } from './views/DashboardView';
import { CoursesView } from './views/CoursesView';
import { BatchesView } from './views/BatchesView';
import { CampaignsView } from './views/CampaignsView';
import { LeadsView } from './views/LeadsView';
import { StudentsView } from './views/StudentsView';
import { CheckpointsView } from './views/CheckpointsView';
import { RetentionView } from './views/RetentionView';
import { BountiesView } from './views/BountiesView';
import { MentorsView } from './views/MentorsView';
import { RecommendationsView } from './views/RecommendationsView';
import { EnrollmentsView } from './views/EnrollmentsView';
import { AnalyticsView } from './views/AnalyticsView';
import { SettingsView } from './views/SettingsView';

export default function App() {
  // Check URL query parameters for direct navigation (e.g. ?view=assessment&campaign=MISSION2026)
  const initialParams = new URLSearchParams(window.location.search);
  const initialViewParam = initialParams.get('view');

  const [currentView, setCurrentView] = useState(
    initialViewParam === 'assessment' ? 'assessment' : (initialViewParam === 'catalog' ? 'catalog' : 'landing')
  );

  const [currentDashboardSection, setCurrentDashboardSection] = useState('overview');
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Demo mode enabled by default

  // Cross-view state transfer
  const [leadForEnrollment, setLeadForEnrollment] = useState(null);
  const [studentForRecommendation, setStudentForRecommendation] = useState(null);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentView('landing');
  };

  const handleDirectEnroll = (candidate) => {
    setLeadForEnrollment(candidate);
    setCurrentDashboardSection('enrollments');
    setCurrentView('dashboard');
  };

  const handleDirectRecommend = (student) => {
    setStudentForRecommendation(student);
    setCurrentDashboardSection('recommendations');
    setCurrentView('dashboard');
  };

  const handleNavigateToAssessment = (campaignCode) => {
    window.history.pushState({}, '', `/?view=assessment&campaign=${encodeURIComponent(campaignCode || 'MISSION2026')}`);
    setCurrentView('assessment');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--tc-off-white)' }}>
      {/* Top Application Header Navbar */}
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        isAuthenticated={isAuthenticated}
        onLogout={handleLogout}
      />

      {/* View Switching */}
      {currentView === 'landing' && (
        <LandingPage
          onGoToDashboard={() => setCurrentView(isAuthenticated ? 'dashboard' : 'auth')}
          onGoToAssessment={() => setCurrentView('assessment')}
          onGoToCatalog={() => setCurrentView('catalog')}
        />
      )}

      {currentView === 'catalog' && (
        <CourseCatalog
          onTakeAssessment={() => setCurrentView('assessment')}
        />
      )}

      {currentView === 'assessment' && (
        <PublicAssessment
          onGoToCatalogue={() => setCurrentView('catalog')}
          onGoToDashboard={() => setCurrentView('dashboard')}
        />
      )}

      {currentView === 'auth' && (
        <AuthView
          onLoginSuccess={handleLoginSuccess}
          onCancel={() => setCurrentView('landing')}
        />
      )}

      {currentView === 'dashboard' && (
        <div style={{ display: 'flex', flex: 1 }}>
          {/* Authenticated Dashboard Sidebar */}
          <Sidebar
            currentSection={currentDashboardSection}
            setCurrentSection={setCurrentDashboardSection}
          />

          {/* Main Dashboard Sub-Views */}
          <main style={{ flex: 1, overflowY: 'auto' }}>
            {currentDashboardSection === 'overview' && (
              <DashboardView onNavigate={(section) => setCurrentDashboardSection(section)} />
            )}

            {currentDashboardSection === 'courses' && (
              <CoursesView />
            )}

            {currentDashboardSection === 'batches' && (
              <BatchesView />
            )}

            {currentDashboardSection === 'campaigns' && (
              <CampaignsView onNavigateToAssessment={handleNavigateToAssessment} />
            )}

            {currentDashboardSection === 'leads' && (
              <LeadsView onDirectEnroll={handleDirectEnroll} />
            )}

            {currentDashboardSection === 'students' && (
              <StudentsView onDirectRecommend={handleDirectRecommend} />
            )}

            {currentDashboardSection === 'checkpoints' && (
              <CheckpointsView />
            )}

            {currentDashboardSection === 'retention' && (
              <RetentionView />
            )}

            {currentDashboardSection === 'bounties' && (
              <BountiesView />
            )}

            {currentDashboardSection === 'mentors' && (
              <MentorsView />
            )}

            {currentDashboardSection === 'recommendations' && (
              <RecommendationsView
                preselectedStudent={studentForRecommendation}
                onDirectEnroll={handleDirectEnroll}
              />
            )}

            {currentDashboardSection === 'enrollments' && (
              <EnrollmentsView prefilledCandidate={leadForEnrollment} />
            )}

            {currentDashboardSection === 'analytics' && (
              <AnalyticsView />
            )}

            {currentDashboardSection === 'settings' && (
              <SettingsView />
            )}
          </main>
        </div>
      )}
    </div>
  );
}
