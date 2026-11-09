import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { requestStudyPlan } from '../../services/api';
import {
  CalendarDays,
  Sparkles,
  Plus,
  Trash2,
  CheckCircle2,
  Clock,
  BookOpen,
  TrendingUp,
  BarChart3,
  RefreshCw,
  AlertCircle,
  Check,
} from 'lucide-react';
import { StudyPlannerSubject } from '../../types';

export const StudyPlanner: React.FC = () => {
  const {
    plannerSubjects,
    addPlannerSubject,
    updatePlannerSubject,
    removePlannerSubject,
    showToast,
  } = useApp();

  const [dailyHours, setDailyHours] = useState(3.5);
  const [targetDays, setTargetDays] = useState(14);
  const [loading, setLoading] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<string>('');
  const [isDemo, setIsDemo] = useState(false);

  // Form state to add new subject
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSubName, setNewSubName] = useState('');
  const [newSubExamDate, setNewSubExamDate] = useState('2026-11-25');
  const [newSubDifficulty, setNewSubDifficulty] = useState<'Easy' | 'Moderate' | 'Challenging'>('Moderate');
  const [newSubTotalUnits, setNewSubTotalUnits] = useState(5);
  const [newSubUnitsCovered, setNewSubUnitsCovered] = useState(1);
  const [newSubPriority, setNewSubPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');

  // Milestone checklists
  const [completedMilestones, setCompletedMilestones] = useState<Record<string, boolean>>({
    'm1': true,
    'm2': false,
    'm3': false,
  });

  const handleAddSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubName.trim()) return;

    addPlannerSubject({
      name: newSubName.trim(),
      examDate: newSubExamDate,
      difficulty: newSubDifficulty,
      totalUnits: Number(newSubTotalUnits),
      unitsCovered: Number(newSubUnitsCovered),
      priority: newSubPriority,
    });

    setNewSubName('');
    setShowAddModal(false);
  };

  const handleGeneratePlan = async () => {
    if (plannerSubjects.length === 0) {
      showToast('Please add at least one subject to plan your schedule.', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await requestStudyPlan(plannerSubjects, dailyHours, targetDays);
      setGeneratedPlan(res.plan);
      setIsDemo(Boolean(res.isDemo));
      showToast('Personalized AI study plan generated!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to generate study plan', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Overall readiness calculation
  const totalUnits = plannerSubjects.reduce((acc, s) => acc + s.totalUnits, 0);
  const coveredUnits = plannerSubjects.reduce((acc, s) => acc + s.unitsCovered, 0);
  const readinessPercent = totalUnits > 0 ? Math.round((coveredUnits / totalUnits) * 100) : 0;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header and Summary */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            <CalendarDays className="w-4 h-4" />
            <span>Smart Study Planner</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white mt-1">
            Exam Revision Strategy & Progress Tracker
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Optimize syllabus coverage with intelligent spaced repetition roadmaps.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-lg text-xs font-medium flex items-center gap-1.5 hover:bg-neutral-800 transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Subject</span>
          </button>
        </div>
      </div>

      {/* Top Planner Controls & Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Study hours slider */}
        <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-neutral-900 dark:text-white flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-indigo-600" />
              Daily Study Capacity
            </span>
            <span className="font-bold tabular-nums text-indigo-600 dark:text-indigo-400">
              {dailyHours} Hours/Day
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="8"
            step="0.5"
            value={dailyHours}
            onChange={(e) => setDailyHours(parseFloat(e.target.value))}
            className="w-full accent-indigo-600 cursor-pointer"
          />
          <div className="flex justify-between text-[11px] text-neutral-400">
            <span>Light (1h)</span>
            <span>Balanced (4h)</span>
            <span>Intensive (8h)</span>
          </div>
        </div>

        {/* Card 2: Target Exam Window */}
        <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-neutral-900 dark:text-white flex items-center gap-1.5">
              <CalendarDays className="w-4 h-4 text-emerald-600" />
              Target Revision Window
            </span>
            <span className="font-bold tabular-nums text-emerald-600 dark:text-emerald-400">
              {targetDays} Days
            </span>
          </div>
          <input
            type="range"
            min="7"
            max="30"
            step="1"
            value={targetDays}
            onChange={(e) => setTargetDays(parseInt(e.target.value, 10))}
            className="w-full accent-emerald-600 cursor-pointer"
          />
          <div className="flex justify-between text-[11px] text-neutral-400">
            <span>Sprint (7d)</span>
            <span>2 Weeks (14d)</span>
            <span>Full Month (30d)</span>
          </div>
        </div>

        {/* Card 3: Overall Readiness Metric */}
        <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-neutral-900 dark:text-white flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4 text-purple-600" />
              Overall Syllabus Readiness
            </span>
            <span className="font-bold tabular-nums text-purple-600 dark:text-purple-400">
              {readinessPercent}%
            </span>
          </div>
          <div className="w-full bg-neutral-100 dark:bg-neutral-800 h-2 rounded-full overflow-hidden my-2">
            <div
              className="bg-purple-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${readinessPercent}%` }}
            />
          </div>
          <div className="text-[11px] text-neutral-500 flex justify-between">
            <span>{coveredUnits} of {totalUnits} units completed</span>
            <span>{plannerSubjects.length} Active Subjects</span>
          </div>
        </div>
      </div>

      {/* Main Split: Subjects & Progress (Left) + AI Generated Plan (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (6 cols): Active Subjects Progress */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-neutral-900 dark:text-white">
                  Subject Syllabus Progress
                </h2>
                <p className="text-xs text-neutral-500">
                  Click + / - to track completed chapters and units
                </p>
              </div>

              <button
                onClick={handleGeneratePlan}
                disabled={loading || plannerSubjects.length === 0}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
              >
                {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                <span>Generate AI Roadmap</span>
              </button>
            </div>

            <div className="space-y-3">
              {plannerSubjects.map((sub) => {
                const percent = Math.round((sub.unitsCovered / sub.totalUnits) * 100);
                return (
                  <div
                    key={sub.id}
                    className="p-3.5 rounded-lg border border-neutral-100 dark:border-neutral-800/80 bg-neutral-50/50 dark:bg-neutral-800/40 space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-xs font-semibold text-neutral-900 dark:text-white">
                          {sub.name}
                        </div>
                        <div className="text-[11px] text-neutral-500 mt-0.5">
                          Exam Date: {sub.examDate} · Priority: {sub.priority}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                            sub.difficulty === 'Challenging'
                              ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                              : 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300'
                          }`}
                        >
                          {sub.difficulty}
                        </span>

                        <button
                          onClick={() => removePlannerSubject(sub.id)}
                          className="text-neutral-400 hover:text-rose-500 p-1"
                          title="Remove subject"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-neutral-500">
                          Units: {sub.unitsCovered} / {sub.totalUnits}
                        </span>
                        <span className="font-semibold tabular-nums text-neutral-700 dark:text-neutral-300">
                          {percent}%
                        </span>
                      </div>
                      <div className="w-full bg-neutral-200 dark:bg-neutral-700 h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            percent >= 80
                              ? 'bg-emerald-600'
                              : percent >= 40
                              ? 'bg-indigo-600'
                              : 'bg-amber-500'
                          }`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>

                    {/* Step buttons */}
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] text-neutral-400">Update units completed:</span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() =>
                            updatePlannerSubject(sub.id, {
                              unitsCovered: Math.max(0, sub.unitsCovered - 1),
                            })
                          }
                          className="w-6 h-6 rounded bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs flex items-center justify-center font-bold text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100"
                        >
                          -
                        </button>
                        <span className="text-xs font-mono tabular-nums px-1">
                          {sub.unitsCovered}
                        </span>
                        <button
                          onClick={() =>
                            updatePlannerSubject(sub.id, {
                              unitsCovered: Math.min(sub.totalUnits, sub.unitsCovered + 1),
                            })
                          }
                          className="w-6 h-6 rounded bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs flex items-center justify-center font-bold text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column (6 cols): AI Generated Revision Roadmap */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 min-h-[420px] flex flex-col justify-between">
            <div className="border-b border-neutral-100 dark:border-neutral-800 pb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-neutral-900 dark:text-white">
                  Personalized AI Study Schedule
                </span>
                {isDemo && (
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 font-medium">
                    Demo Mode
                  </span>
                )}
              </div>

              <span className="text-[11px] text-neutral-400">
                {dailyHours * targetDays} Total Study Hours Planned
              </span>
            </div>

            <div className="flex-1 py-4">
              {loading ? (
                <div className="py-20 flex flex-col items-center justify-center text-center space-y-3">
                  <RefreshCw className="w-7 h-7 text-indigo-600 dark:text-indigo-400 animate-spin" />
                  <div className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                    Constructing balanced study timetable...
                  </div>
                  <p className="text-[11px] text-neutral-400 max-w-xs">
                    Allocating high-weightage topics, revision buffers and practice questions
                  </p>
                </div>
              ) : generatedPlan ? (
                <div className="text-xs text-neutral-800 dark:text-neutral-200 leading-relaxed whitespace-pre-line space-y-2 font-sans">
                  {generatedPlan}
                </div>
              ) : (
                <div className="py-20 text-center space-y-2 text-xs text-neutral-400">
                  <CalendarDays className="w-8 h-8 mx-auto text-neutral-300 dark:text-neutral-600" />
                  <p>Click "Generate AI Roadmap" to build your day-by-day revision schedule.</p>
                </div>
              )}
            </div>

            {/* Quick Strategy Tip */}
            <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 text-[11px] text-neutral-500 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
              <span>Pro Tip: Schedule difficult numerical topics during your peak morning focus window.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Add Subject Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
              Add New Subject for Examination Planning
            </h3>

            <form onSubmit={handleAddSubject} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Subject Name
                </label>
                <input
                  type="text"
                  required
                  value={newSubName}
                  onChange={(e) => setNewSubName(e.target.value)}
                  placeholder="e.g. Distributed Systems"
                  className="w-full px-3 py-1.5 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Exam Date
                  </label>
                  <input
                    type="date"
                    required
                    value={newSubExamDate}
                    onChange={(e) => setNewSubExamDate(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Difficulty
                  </label>
                  <select
                    value={newSubDifficulty}
                    onChange={(e) => setNewSubDifficulty(e.target.value as any)}
                    className="w-full px-3 py-1.5 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white focus:outline-none"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Challenging">Challenging</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Units Covered
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={newSubUnitsCovered}
                    onChange={(e) => setNewSubUnitsCovered(parseInt(e.target.value, 10))}
                    className="w-full px-3 py-1.5 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Total Syllabus Units
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={newSubTotalUnits}
                    onChange={(e) => setNewSubTotalUnits(parseInt(e.target.value, 10))}
                    className="w-full px-3 py-1.5 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3.5 py-1.5 text-xs text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold"
                >
                  Save Subject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
