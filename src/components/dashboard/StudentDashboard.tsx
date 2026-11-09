import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Calendar,
  Clock,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Plus,
  Play,
  BrainCircuit,
  MessageSquareCode,
  FileText,
  Briefcase,
  TrendingUp,
  Award,
  Check,
  Flame,
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const {
    profile,
    timetable,
    examinations,
    assignments,
    dailyGoals,
    addDailyGoal,
    toggleDailyGoal,
    deleteDailyGoal,
    studyHoursToday,
    addStudyMinutes,
    weeklyTargetHours,
    setActiveTab,
    showToast,
  } = useApp();

  const [newGoalText, setNewGoalText] = useState('');
  const [selectedDay, setSelectedDay] = useState<string>('Monday');

  // Days list
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  // Filter timetable for selected day
  const todayClasses = timetable.filter((slot) => slot.day === selectedDay);

  // Pending assignments
  const pendingAssignments = assignments.filter((a) => a.status !== 'Submitted');

  // Next upcoming exams sorted by date
  const sortedExams = [...examinations].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const calculateDaysLeft = (dateStr: string) => {
    const diff = new Date(dateStr).getTime() - new Date().getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days;
  };

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalText.trim()) return;
    addDailyGoal(newGoalText.trim(), 'Study');
    setNewGoalText('');
  };

  const completedGoalsCount = dailyGoals.filter((g) => g.completed).length;
  const goalProgressPercent =
    dailyGoals.length > 0 ? Math.round((completedGoalsCount / dailyGoals.length) * 100) : 0;

  const weeklyProgressPercent = Math.min(
    100,
    Math.round(((studyHoursToday * 4) / weeklyTargetHours) * 100)
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 1. Welcome Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-900 to-slate-900 text-white relative overflow-hidden shadow-sm">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-200">
              <span>{profile.college}</span>
              <span aria-hidden="true">·</span>
              <span>Semester {profile.semester}</span>
              <span aria-hidden="true">·</span>
              <span>{profile.branch}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mt-1">
              Welcome back, {profile.name} 👋
            </h1>
            <p className="text-xs sm:text-sm text-neutral-300 mt-1 max-w-xl">
              You have <span className="text-amber-300 font-semibold">{pendingAssignments.length} pending assignments</span> and your next exam is in <span className="text-emerald-300 font-semibold">{calculateDaysLeft(sortedExams[0]?.date || '2026-11-20')} days</span>. Let's make today count!
            </p>
          </div>

          {/* Quick study logging buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => addStudyMinutes(25)}
              className="px-3.5 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-xs rounded-xl text-xs font-semibold text-white border border-white/15 flex items-center gap-1.5 transition-all"
            >
              <Play className="w-3.5 h-3.5 text-emerald-400" />
              <span>+25m Focus Log</span>
            </button>
            <button
              onClick={() => addStudyMinutes(50)}
              className="px-3.5 py-2 bg-indigo-500 hover:bg-indigo-600 rounded-xl text-xs font-semibold text-white flex items-center gap-1.5 transition-all shadow-xs"
            >
              <Flame className="w-3.5 h-3.5 text-amber-300" />
              <span>+50m Deep Work</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Top Metric KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Study Progress */}
        <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
            <span>Study Today</span>
            <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold tabular-nums text-neutral-900 dark:text-white">
              {studyHoursToday} <span className="text-xs font-normal text-neutral-500">hrs</span>
            </div>
            <div className="mt-2 w-full bg-neutral-100 dark:bg-neutral-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, (studyHoursToday / 4) * 100)}%` }}
              />
            </div>
            <div className="text-[11px] text-neutral-500 mt-1 flex justify-between">
              <span>Goal: 4.0 hrs/day</span>
              <span className="tabular-nums font-medium">{Math.round((studyHoursToday / 4) * 100)}%</span>
            </div>
          </div>
        </div>

        {/* KPI 2: Pending Deliverables */}
        <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
            <span>Pending Tasks</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold tabular-nums text-neutral-900 dark:text-white">
              {pendingAssignments.length}
            </div>
            <div className="text-[11px] text-neutral-500 mt-2 truncate">
              {pendingAssignments[0]?.title ? `Next: ${pendingAssignments[0].title}` : 'All caught up!'}
            </div>
            <div className="text-[11px] text-indigo-600 dark:text-indigo-400 mt-1">
              <button onClick={() => setActiveTab('assignments')} className="hover:underline">
                View submission queue →
              </button>
            </div>
          </div>
        </div>

        {/* KPI 3: Next Examination */}
        <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
            <span>Next Exam</span>
            <Calendar className="w-4 h-4 text-rose-500" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold tabular-nums text-rose-600 dark:text-rose-400">
              {calculateDaysLeft(sortedExams[0]?.date || '2026-11-20')} <span className="text-xs font-normal text-neutral-500">days left</span>
            </div>
            <div className="text-[11px] font-semibold text-neutral-800 dark:text-neutral-200 mt-2 truncate">
              {sortedExams[0]?.subject || 'No upcoming exam'}
            </div>
            <div className="text-[11px] text-neutral-500 mt-1">
              {sortedExams[0]?.date} · {sortedExams[0]?.time}
            </div>
          </div>
        </div>

        {/* KPI 4: Academic CGPA */}
        <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
            <span>Cumulative CGPA</span>
            <Award className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold tabular-nums text-neutral-900 dark:text-white">
              {profile.cgpa} <span className="text-xs font-normal text-neutral-500">/ 10.0</span>
            </div>
            <div className="text-[11px] text-neutral-500 mt-2">
              Target: <span className="font-semibold text-neutral-800 dark:text-neutral-200">{profile.targetRole}</span>
            </div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1">
              First Class with Distinction
            </div>
          </div>
        </div>
      </div>

      {/* 3. Quick AI Action Launchpad */}
      <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-100/50 dark:bg-neutral-900/50">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>AI Copilot Quick Access</span>
          </div>
          <span className="text-xs text-neutral-400">Powered by Gemini 3.8 Flash</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button
            onClick={() => setActiveTab('study-assistant')}
            className="p-3 bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:border-indigo-500/50 dark:hover:border-indigo-500/50 text-left transition-all group"
          >
            <div className="w-7 h-7 rounded-md bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-2 group-hover:scale-105 transition-transform">
              <BrainCircuit className="w-4 h-4" />
            </div>
            <div className="text-xs font-semibold text-neutral-900 dark:text-white">
              AI Study Assistant
            </div>
            <div className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
              Summaries & Flashcards
            </div>
          </button>

          <button
            onClick={() => setActiveTab('doubt-solver')}
            className="p-3 bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:border-indigo-500/50 dark:hover:border-indigo-500/50 text-left transition-all group"
          >
            <div className="w-7 h-7 rounded-md bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-2 group-hover:scale-105 transition-transform">
              <MessageSquareCode className="w-4 h-4" />
            </div>
            <div className="text-xs font-semibold text-neutral-900 dark:text-white">
              AI Doubt Solver
            </div>
            <div className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
              Formulas & Algorithms
            </div>
          </button>

          <button
            onClick={() => setActiveTab('resume-builder')}
            className="p-3 bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:border-indigo-500/50 dark:hover:border-indigo-500/50 text-left transition-all group"
          >
            <div className="w-7 h-7 rounded-md bg-amber-50 dark:bg-amber-950/60 flex items-center justify-center text-amber-600 dark:text-amber-400 mb-2 group-hover:scale-105 transition-transform">
              <FileText className="w-4 h-4" />
            </div>
            <div className="text-xs font-semibold text-neutral-900 dark:text-white">
              ATS Resume Builder
            </div>
            <div className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
              Bullet Enhancer & Export
            </div>
          </button>

          <button
            onClick={() => setActiveTab('placement-prep')}
            className="p-3 bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:border-indigo-500/50 dark:hover:border-indigo-500/50 text-left transition-all group"
          >
            <div className="w-7 h-7 rounded-md bg-purple-50 dark:bg-purple-950/60 flex items-center justify-center text-purple-600 dark:text-purple-400 mb-2 group-hover:scale-105 transition-transform">
              <Briefcase className="w-4 h-4" />
            </div>
            <div className="text-xs font-semibold text-neutral-900 dark:text-white">
              Placement Mock Tests
            </div>
            <div className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
              Technical & HR Rounds
            </div>
          </button>
        </div>
      </div>

      {/* 4. Two-Column Split: Today's Timetable + Upcoming Exams & Goals */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (7 cols): Today's Timetable */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h2 className="text-sm font-bold text-neutral-900 dark:text-white">
                  Class Timetable
                </h2>
                <p className="text-xs text-neutral-500">
                  Lectures, laboratory sessions and tutorial schedules
                </p>
              </div>

              {/* Day filter tabs */}
              <div className="flex items-center gap-1 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-lg overflow-x-auto">
                {days.map((d) => (
                  <button
                    key={d}
                    onClick={() => setSelectedDay(d)}
                    className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                      selectedDay === d
                        ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs'
                        : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
                    }`}
                  >
                    {d.slice(0, 3)}
                  </button>
                ))}
              </div>
            </div>

            {/* Timetable slot rows */}
            {todayClasses.length === 0 ? (
              <div className="py-12 text-center text-xs text-neutral-400">
                No classes scheduled for {selectedDay}. Ideal time for self-study or lab assignments!
              </div>
            ) : (
              <div className="space-y-2.5">
                {todayClasses.map((slot) => (
                  <div
                    key={slot.id}
                    className="p-3 rounded-lg border border-neutral-100 dark:border-neutral-800/80 bg-neutral-50/50 dark:bg-neutral-800/40 hover:bg-neutral-100/60 dark:hover:bg-neutral-800/70 transition-colors flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0 flex items-start gap-3">
                      <div className="text-center px-2 py-1 rounded bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shrink-0">
                        <span className="text-[10px] font-mono tabular-nums text-neutral-500 block">
                          {slot.time.split(' - ')[0]}
                        </span>
                        <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 block">
                          {slot.code}
                        </span>
                      </div>
                      <div className="truncate">
                        <div className="text-xs font-semibold text-neutral-900 dark:text-white truncate">
                          {slot.subject}
                        </div>
                        <div className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5 truncate">
                          Room: <span className="font-medium text-neutral-700 dark:text-neutral-300">{slot.room}</span> · {slot.faculty}
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      <span
                        className={`text-[10px] font-medium px-2 py-0.5 rounded ${
                          slot.type === 'Lab'
                            ? 'bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300'
                            : 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                        }`}
                      >
                        {slot.type}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pending Assignments List on Dashboard */}
          <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-bold text-neutral-900 dark:text-white">
                  Active Assignments ({pendingAssignments.length})
                </h2>
                <p className="text-xs text-neutral-500">Upcoming coursework deliverables</p>
              </div>
              <button
                onClick={() => setActiveTab('assignments')}
                className="text-xs text-indigo-600 dark:text-indigo-400 font-medium hover:underline flex items-center gap-1"
              >
                <span>Manage all</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-2">
              {pendingAssignments.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-lg border border-neutral-100 dark:border-neutral-800/80 bg-neutral-50/50 dark:bg-neutral-800/40 flex items-center justify-between gap-3"
                >
                  <div className="truncate">
                    <div className="text-xs font-semibold text-neutral-900 dark:text-white truncate">
                      {item.title}
                    </div>
                    <div className="text-[11px] text-neutral-500 mt-0.5">
                      {item.subject} · Due {item.deadline}
                    </div>
                  </div>
                  <div className="shrink-0 flex items-center gap-2">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                        item.priority === 'High'
                          ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                          : 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300'
                      }`}
                    >
                      {item.priority}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Daily Goals & Examination Countdown */}
        <div className="lg:col-span-5 space-y-4">
          {/* Daily Goals Checklist */}
          <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-sm font-bold text-neutral-900 dark:text-white">
                  Daily Goals ({completedGoalsCount}/{dailyGoals.length})
                </h2>
                <p className="text-xs text-neutral-500">Track targeted accomplishments</p>
              </div>
              <span className="text-xs font-bold tabular-nums text-emerald-600 dark:text-emerald-400">
                {goalProgressPercent}%
              </span>
            </div>

            {/* Quick add goal form */}
            <form onSubmit={handleAddGoal} className="flex gap-2 mb-3">
              <input
                type="text"
                value={newGoalText}
                onChange={(e) => setNewGoalText(e.target.value)}
                placeholder="Add daily goal (e.g., solve 2 PYQs)..."
                className="flex-1 px-3 py-1.5 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white focus:outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                className="p-1.5 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-lg hover:bg-neutral-800 transition-colors"
                title="Add Goal"
              >
                <Plus className="w-4 h-4" />
              </button>
            </form>

            <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
              {dailyGoals.map((goal) => (
                <div
                  key={goal.id}
                  onClick={() => toggleDailyGoal(goal.id)}
                  className={`p-2 rounded-lg cursor-pointer flex items-start gap-2.5 text-xs transition-colors ${
                    goal.completed
                      ? 'bg-emerald-50/60 dark:bg-emerald-950/20 text-neutral-400 dark:text-neutral-500 line-through'
                      : 'hover:bg-neutral-50 dark:hover:bg-neutral-800/50 text-neutral-800 dark:text-neutral-200'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                      goal.completed
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'border-neutral-300 dark:border-neutral-600'
                    }`}
                  >
                    {goal.completed && <Check className="w-3 h-3" />}
                  </div>
                  <span className="flex-1 leading-snug">{goal.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Examinations Countdown */}
          <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-sm font-bold text-neutral-900 dark:text-white">
                  Upcoming Examinations
                </h2>
                <p className="text-xs text-neutral-500">Official university end-term papers</p>
              </div>
              <button
                onClick={() => setActiveTab('study-planner')}
                className="text-xs text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
              >
                Plan Roadmap
              </button>
            </div>

            <div className="space-y-3">
              {sortedExams.slice(0, 3).map((exam) => {
                const daysLeft = calculateDaysLeft(exam.date);
                return (
                  <div
                    key={exam.id}
                    className="p-3 rounded-lg border border-neutral-100 dark:border-neutral-800/80 bg-neutral-50/50 dark:bg-neutral-800/40"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-xs font-semibold text-neutral-900 dark:text-white">
                          {exam.subject}
                        </div>
                        <div className="text-[11px] text-neutral-500 mt-0.5">
                          {exam.examType} · {exam.venue}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span
                          className={`text-xs font-bold tabular-nums ${
                            daysLeft <= 10
                              ? 'text-rose-600 dark:text-rose-400'
                              : 'text-amber-600 dark:text-amber-400'
                          }`}
                        >
                          {daysLeft}d left
                        </span>
                        <div className="text-[10px] text-neutral-400">{exam.date}</div>
                      </div>
                    </div>
                    <div className="mt-2 text-[11px] text-neutral-500 bg-white dark:bg-neutral-800/60 p-2 rounded border border-neutral-100 dark:border-neutral-800 truncate">
                      📖 {exam.syllabus}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
