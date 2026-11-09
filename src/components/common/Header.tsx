import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sun,
  Moon,
  Search,
  Sparkles,
  GraduationCap,
  Menu,
  RotateCcw,
} from 'lucide-react';

interface HeaderProps {
  onToggleSidebar?: () => void;
  onOpenAuthModal?: () => void;
}

const TAB_TITLES: Record<string, { title: string; subtitle: string }> = {
  dashboard: { title: 'Student Dashboard', subtitle: 'Academic overview & daily schedule' },
  'study-assistant': { title: 'AI Study Assistant', subtitle: 'Summaries, flashcards & exam questions' },
  'doubt-solver': { title: 'AI Doubt Solver', subtitle: 'Step-by-step academic clarifications' },
  'study-planner': { title: 'Smart Study Planner', subtitle: 'Personalized exam revision roadmaps' },
  assignments: { title: 'Assignment Manager', subtitle: 'Deadlines, deliverables & submissions' },
  'resume-builder': { title: 'ATS Resume Builder', subtitle: 'Engineering resume preview & export' },
  'placement-prep': { title: 'Placement Preparation', subtitle: 'Technical, HR questions & mock interviews' },
  organizer: { title: 'College Organizer', subtitle: 'Timetable, notices & campus events' },
  profile: { title: 'Student Profile', subtitle: 'Academics, skills & target career' },
};

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar, onOpenAuthModal }) => {
  const {
    activeTab,
    isDarkMode,
    toggleDarkMode,
    searchQuery,
    setSearchQuery,
    profile,
    isAuthenticated,
    resetToSampleData,
    setActiveTab,
  } = useApp();

  const currentView = TAB_TITLES[activeTab] || { title: 'CampusMate AI', subtitle: 'College Companion' };

  return (
    <header className="h-16 px-4 md:px-6 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between gap-4 sticky top-0 z-30 transition-colors no-print">
      {/* Left: Mobile Toggle & Contextual Breadcrumb */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-lg text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0">
          <div className="flex items-center gap-2 text-xs font-medium text-neutral-500 dark:text-neutral-400">
            <span>CampusMate AI</span>
            <span>/</span>
            <span className="text-neutral-900 dark:text-neutral-200 truncate">{currentView.title}</span>
          </div>
          <h1 className="text-base font-semibold text-neutral-900 dark:text-white truncate hidden sm:block">
            {currentView.title}
          </h1>
        </div>
      </div>

      {/* Middle: Universal Search Bar */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search subjects, assignments, exams, or interview topics..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-neutral-100 dark:bg-neutral-800/80 border border-transparent focus:border-indigo-500 rounded-lg text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-neutral-600"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Right: Actions, Theme Toggle, Profile */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Reset sample data button */}
        <button
          onClick={resetToSampleData}
          title="Reset to default sample data"
          className="p-2 text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors text-xs flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden xl:inline text-xs font-medium">Reset Demo</span>
        </button>

        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          aria-label="Toggle theme mode"
          className="p-2 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
        >
          {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-neutral-600" />}
        </button>

        {/* Auth / Profile trigger */}
        {isAuthenticated ? (
          <button
            onClick={() => setActiveTab('profile')}
            className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <div className="text-right hidden sm:block">
              <div className="text-xs font-semibold text-neutral-900 dark:text-white truncate max-w-[110px]">
                {profile.name}
              </div>
              <div className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate max-w-[110px]">
                Sem {profile.semester} · {profile.branch.split(' ')[0]}
              </div>
            </div>
            <img
              src={profile.avatarUrl}
              alt={profile.name}
              className="w-8 h-8 rounded-full object-cover border border-neutral-200 dark:border-neutral-700 shrink-0"
              onError={(e) => {
                // styled fallback if image fails
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </button>
        ) : (
          <button
            onClick={onOpenAuthModal}
            className="px-3.5 py-1.5 text-xs font-medium bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors shrink-0"
          >
            Sign In
          </button>
        )}
      </div>
    </header>
  );
};
