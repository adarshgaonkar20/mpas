import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  ArrowRight,
  BrainCircuit,
  MessageSquareCode,
  CalendarDays,
  FileCheck2,
  FileText,
  Briefcase,
  Building2,
  CheckCircle2,
  ShieldCheck,
  Zap,
  BookOpen,
} from 'lucide-react';

interface LandingPageProps {
  onEnterApp: () => void;
  onOpenAuth: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp, onOpenAuth }) => {
  const { isDarkMode, toggleDarkMode } = useApp();

  const features = [
    {
      icon: BrainCircuit,
      title: 'AI Study Assistant',
      description: 'Upload lecture notes to generate crisp concept summaries, flashcards, 2/5/10-mark exam questions, and intuitive analogies.',
      highlight: 'High-Yield Revision',
    },
    {
      icon: MessageSquareCode,
      title: 'Academic Doubt Solver',
      description: 'Step-by-step mathematical derivations, algorithmic traces, code snippets, and verified engineering proofs.',
      highlight: 'Step-by-Step Logic',
    },
    {
      icon: CalendarDays,
      title: 'Smart Study Planner',
      description: 'AI-tailored study schedules balancing difficult modules with buffer days and spaced repetition leading to exam day.',
      highlight: 'Exam Countdown',
    },
    {
      icon: FileCheck2,
      title: 'Assignment Manager',
      description: 'Track lab deliverables, problem sets, and group project deadlines with priority flags and quick submission status.',
      highlight: 'Zero Missed Deadlines',
    },
    {
      icon: FileText,
      title: 'ATS Resume Builder',
      description: 'Build recruiter-approved, single-column ATS resumes with Google XYZ bullet point enhancer and one-click PDF export.',
      highlight: 'Recruiter Verified',
    },
    {
      icon: Briefcase,
      title: 'Placement Preparation',
      description: 'Curated technical interview questions, STAR-method HR answers, coding challenges, and interactive AI mock interviews.',
      highlight: 'Campus Placements',
    },
    {
      icon: Building2,
      title: 'College Organizer',
      description: 'Weekly schedule grid, official exam hall notices, hackathon events, and peer-contributed subject resources.',
      highlight: 'Campus Pulse',
    },
    {
      icon: Zap,
      title: 'Daily Productivity Loop',
      description: 'Focused study timer with daily goal checklists and weekly hour progress charts tailored to university schedules.',
      highlight: 'Pomodoro Focused',
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors">
      {/* Top Bar Contract: Brand, Links, 1 Primary Action */}
      <header className="h-16 px-6 lg:px-12 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between gap-8 sticky top-0 z-40 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md">
        {/* Brand Zone */}
        <a href="#hero" className="flex items-center gap-2.5 whitespace-nowrap shrink-0 group">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-xs group-hover:bg-indigo-700 transition-colors">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="font-bold text-base tracking-tight text-neutral-900 dark:text-white">
            CampusMate AI
          </span>
        </a>

        {/* Navigation Zone */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-medium text-neutral-600 dark:text-neutral-400">
          <a href="#features" className="hover:text-neutral-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0">
            Features
          </a>
          <a href="#study-ai" className="hover:text-neutral-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0">
            Study Assistant
          </a>
          <a href="#placement" className="hover:text-neutral-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0">
            Placements
          </a>
          <a href="#ats-resume" className="hover:text-neutral-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0">
            Resume Builder
          </a>
        </nav>

        {/* Primary Action Zone */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={toggleDarkMode}
            className="p-2 text-xs font-medium text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
            aria-label="Toggle theme"
          >
            {isDarkMode ? 'Light' : 'Dark'}
          </button>
          <button
            onClick={onOpenAuth}
            className="hidden sm:inline-block px-3.5 py-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            Sign In
          </button>
          <button
            onClick={onEnterApp}
            className="px-4 py-2 text-xs font-semibold bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            <span>Launch Workspace</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section id="hero" className="pt-12 pb-16 px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-2 text-xs font-medium text-neutral-500 dark:text-neutral-400">
              <span>Campus Companion</span>
              <span aria-hidden="true">·</span>
              <span>Engineering & Computer Science</span>
              <span aria-hidden="true">·</span>
              <span>Built with Gemini</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-white leading-[1.15]">
              Master your engineering semesters, assignments, and campus placements.
            </h1>

            <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-300 leading-relaxed max-w-2xl">
              An intelligent college productivity operating system designed for university students. Turn dense lecture notes into exam flashcards, resolve tough algorithmic doubts step-by-step, plan revision timetables, and craft ATS-ready resumes.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={onEnterApp}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold flex items-center gap-2 shadow-sm transition-all"
              >
                <span>Open Student Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={onOpenAuth}
                className="px-5 py-3 border border-neutral-300 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-900 rounded-xl text-sm font-medium transition-all"
              >
                Student Demo Login
              </button>
            </div>

            {/* Unboxed Trust Markers */}
            <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-neutral-500 dark:text-neutral-400">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Zero Hallucinated Notes</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>ATS Resume Scanner Compatible</span>
              </div>
              <div className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Full Semester Timetable Integration</span>
              </div>
            </div>
          </div>

          {/* Right Hero Visual */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 shadow-xl bg-white dark:bg-neutral-900">
              <img
                src="/src/assets/images/hero_campus_student_1794249744802.jpg"
                alt="Student studying in university library"
                className="w-full h-80 sm:h-96 object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-neutral-950/20 to-transparent flex flex-col justify-end p-6 text-white">
                <span className="text-xs font-semibold tracking-wider uppercase text-indigo-300">
                  Real-Time Academic Copilot
                </span>
                <h3 className="text-base font-bold mt-1">
                  From Lecture Hall to Dream Campus Offer
                </h3>
                <p className="text-xs text-neutral-200 mt-1">
                  Organize daily schedules, track assignment deadlines, and crack technical rounds with AI interview mock tests.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid Section */}
      <section id="features" className="py-16 px-6 lg:px-12 border-t border-neutral-200 dark:border-neutral-800 max-w-7xl mx-auto">
        <div className="max-w-2xl mb-12">
          <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-2">
            Complete College Suite
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white">
            Everything an engineering student needs in one unified console.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.title}
                className="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-900 dark:text-white mb-4">
                    <Icon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-1">
                    {feat.highlight}
                  </div>
                  <h3 className="text-base font-semibold text-neutral-900 dark:text-white mb-2">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    {feat.description}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800/80">
                  <button
                    onClick={onEnterApp}
                    className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1"
                  >
                    <span>Try feature</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Mechanism to Outcome Chain Section */}
      <section id="study-ai" className="py-16 px-6 lg:px-12 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-100/50 dark:bg-neutral-900/40">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            <div className="p-8 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex flex-col justify-between">
              <div>
                <span className="text-xs font-semibold text-neutral-400 dark:text-neutral-500">01. Academic Input</span>
                <h3 className="text-lg font-bold text-neutral-900 dark:text-white mt-2 mb-3">
                  Upload Notes or Doubts
                </h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  Paste raw lecture transcriptions, textbook excerpts, or complex coding problems. CampusMate digests raw notes without losing technical formulas.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-neutral-100 dark:border-neutral-800 text-xs font-medium text-neutral-500">
                Supports OS, DBMS, DAA, Networks, ML & Math
              </div>
            </div>

            <div className="p-8 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex flex-col justify-between">
              <div>
                <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">02. AI Processing</span>
                <h3 className="text-lg font-bold text-neutral-900 dark:text-white mt-2 mb-3">
                  Intelligent Synthesis
                </h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  Gemini models synthesize the text into university-grade 2-mark definitions, 5-mark answer outlines, 10-mark PYQs, and interactive comprehension quizzes.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-neutral-100 dark:border-neutral-800 text-xs font-medium text-neutral-500">
                Server-side private execution with zero key exposure
              </div>
            </div>

            <div className="p-8 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex flex-col justify-between">
              <div>
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">03. High Performance</span>
                <h3 className="text-lg font-bold text-neutral-900 dark:text-white mt-2 mb-3">
                  Ace Exams & Land Offers
                </h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  Turn hours of cramming into efficient 25-minute Pomodoro revisions. Practice technical and HR mock interviews with immediate scoring and advice.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-neutral-100 dark:border-neutral-800 text-xs font-medium text-neutral-500">
                Proven structure for engineering top rankers
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Footer Banner */}
      <section className="py-16 px-6 lg:px-12 max-w-7xl mx-auto text-center">
        <h2 className="text-2xl sm:text-4xl font-extrabold text-neutral-900 dark:text-white tracking-tight max-w-xl mx-auto">
          Ready to transform your college semester?
        </h2>
        <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-400 max-w-md mx-auto">
          Join thousands of engineering students managing their academic goals and placement prep with CampusMate AI.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <button
            onClick={onEnterApp}
            className="px-6 py-3 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-semibold text-xs rounded-xl hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors shadow-xs"
          >
            Launch Student App
          </button>
        </div>
      </section>

      {/* Clean Footer */}
      <footer className="py-8 px-6 lg:px-12 border-t border-neutral-200 dark:border-neutral-800 text-xs text-neutral-500 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          © 2026 CampusMate AI. Built for engineering and university students.
        </div>
        <div className="flex items-center gap-4 text-xs">
          <span>Academics</span>
          <span>·</span>
          <span>Exams</span>
          <span>·</span>
          <span>Assignments</span>
          <span>·</span>
          <span>Placements</span>
        </div>
      </footer>
    </div>
  );
};
