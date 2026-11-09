/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { NotificationToast } from './components/common/NotificationToast';
import { LandingPage } from './components/landing/LandingPage';
import { AuthModal } from './components/auth/AuthModal';

import { StudentDashboard } from './components/dashboard/StudentDashboard';
import { StudyAssistant } from './components/study-assistant/StudyAssistant';
import { DoubtSolver } from './components/doubt-solver/DoubtSolver';
import { StudyPlanner } from './components/planner/StudyPlanner';
import { AssignmentManager } from './components/assignments/AssignmentManager';
import { ResumeBuilder } from './components/resume/ResumeBuilder';
import { PlacementPrep } from './components/placement/PlacementPrep';
import { CollegeOrganizer } from './components/organizer/CollegeOrganizer';
import { UserProfile } from './components/profile/UserProfile';

const MainWorkspace: React.FC<{ onOpenLanding: () => void; onOpenAuth: () => void }> = ({
  onOpenLanding,
  onOpenAuth,
}) => {
  const { activeTab } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <StudentDashboard />;
      case 'study-assistant':
        return <StudyAssistant />;
      case 'doubt-solver':
        return <DoubtSolver />;
      case 'study-planner':
        return <StudyPlanner />;
      case 'assignments':
        return <AssignmentManager />;
      case 'resume-builder':
        return <ResumeBuilder />;
      case 'placement-prep':
        return <PlacementPrep />;
      case 'organizer':
        return <CollegeOrganizer />;
      case 'profile':
        return <UserProfile />;
      default:
        return <StudentDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 flex transition-colors">
      {/* Sidebar Navigation */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onOpenLanding={onOpenLanding}
      />

      {/* Main Content Viewport */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <Header
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
          onOpenAuthModal={onOpenAuth}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {renderActiveView()}
        </main>
      </div>

      <NotificationToast />
    </div>
  );
};

export default function App() {
  const [showLanding, setShowLanding] = useState<boolean>(() => {
    // If user has visited or authenticated, default to app, else show landing page first
    const isAuthed = localStorage.getItem('cm_auth') === 'true';
    return !isAuthed;
  });
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);

  return (
    <AppProvider>
      {showLanding ? (
        <>
          <LandingPage
            onEnterApp={() => setShowLanding(false)}
            onOpenAuth={() => setShowAuthModal(true)}
          />
          <AuthModal
            isOpen={showAuthModal}
            onClose={() => {
              setShowAuthModal(false);
              setShowLanding(false); // jump into app upon completing/closing auth
            }}
          />
          <NotificationToast />
        </>
      ) : (
        <>
          <MainWorkspace
            onOpenLanding={() => setShowLanding(true)}
            onOpenAuth={() => setShowAuthModal(true)}
          />
          <AuthModal
            isOpen={showAuthModal}
            onClose={() => setShowAuthModal(false)}
          />
        </>
      )}
    </AppProvider>
  );
}
