import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  BrainCircuit,
  MessageSquareCode,
  CalendarDays,
  FileCheck2,
  FileText,
  Briefcase,
  Building2,
  UserCircle,
  Sparkles,
  LogOut,
  X,
  Compass,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenLanding?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, onOpenLanding }) => {
  const { activeTab, setActiveTab, assignments, profile, logout } = useApp();

  const pendingAssignmentsCount = assignments.filter((a) => a.status !== 'Submitted').length;

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
      section: 'Main',
    },
    {
      id: 'study-assistant',
      label: 'AI Study Assistant',
      icon: BrainCircuit,
      badge: 'AI',
      section: 'Academics',
    },
    {
      id: 'doubt-solver',
      label: 'AI Doubt Solver',
      icon: MessageSquareCode,
      badge: 'AI',
      section: 'Academics',
    },
    {
      id: 'study-planner',
      label: 'Smart Study Planner',
      icon: CalendarDays,
      badge: null,
      section: 'Academics',
    },
    {
      id: 'assignments',
      label: 'Assignment Manager',
      icon: FileCheck2,
      badge: pendingAssignmentsCount > 0 ? pendingAssignmentsCount.toString() : null,
      badgeAlert: true,
      section: 'Productivity',
    },
    {
      id: 'organizer',
      label: 'College Organizer',
      icon: Building2,
      badge: null,
      section: 'Productivity',
    },
    {
      id: 'resume-builder',
      label: 'ATS Resume Builder',
      icon: FileText,
      badge: null,
      section: 'Career & Placement',
    },
    {
      id: 'placement-prep',
      label: 'Placement Prep',
      icon: Briefcase,
      badge: 'Prep',
      section: 'Career & Placement',
    },
    {
      id: 'profile',
      label: 'User Profile',
      icon: UserCircle,
      badge: null,
      section: 'Settings',
    },
  ];

  const handleSelect = (id: string) => {
    setActiveTab(id);
    onClose();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-neutral-900/50 backdrop-blur-xs z-40 lg:hidden"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 w-64 bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 z-50 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } no-print`}
      >
        {/* Brand Header */}
        <div className="h-16 px-5 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between shrink-0">
          <button
            onClick={() => {
              setActiveTab('dashboard');
              onClose();
            }}
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-xs group-hover:bg-indigo-700 transition-colors">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-sm tracking-tight text-neutral-900 dark:text-white block">
                CampusMate AI
              </span>
              <span className="text-[11px] text-neutral-500 dark:text-neutral-400 block -mt-0.5">
                College Companion
              </span>
            </div>
          </button>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 lg:hidden"
            aria-label="Close navigation"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map((item, idx) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const showSectionLabel =
              idx === 0 || navItems[idx - 1]?.section !== item.section;

            return (
              <React.Fragment key={item.id}>
                {showSectionLabel && (
                  <div className="pt-3 pb-1.5 px-3 text-[11px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                    {item.section}
                  </div>
                )}
                <button
                  onClick={() => handleSelect(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-xs'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-md font-semibold tracking-tight ${
                        isActive
                          ? 'bg-neutral-800 text-neutral-200 dark:bg-neutral-100 dark:text-neutral-800'
                          : item.badgeAlert
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                          : 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              </React.Fragment>
            );
          })}
        </div>

        {/* Footer info & Landing link */}
        <div className="p-3 border-t border-neutral-200 dark:border-neutral-800 space-y-2 shrink-0">
          {onOpenLanding && (
            <button
              onClick={() => {
                onOpenLanding();
                onClose();
              }}
              className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Explore Landing Page</span>
            </button>
          )}

          <div className="flex items-center justify-between px-2 pt-1 text-[11px] text-neutral-400 dark:text-neutral-500">
            <span>Branch: {profile.branch.split(' ')[0]}</span>
            <button
              onClick={logout}
              className="hover:text-rose-500 transition-colors flex items-center gap-1 text-[11px]"
              title="Sign Out"
            >
              <LogOut className="w-3 h-3" />
              <span>Exit</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
