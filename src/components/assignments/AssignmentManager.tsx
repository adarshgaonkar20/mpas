import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileCheck2,
  Plus,
  Trash2,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Calendar,
  Check,
  Edit2,
  BellRing,
} from 'lucide-react';
import { Assignment } from '../../types';

export const AssignmentManager: React.FC = () => {
  const { assignments, addAssignment, updateAssignment, deleteAssignment, showToast } = useApp();

  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'In Progress' | 'Submitted'>('All');
  const [priorityFilter, setPriorityFilter] = useState<'All' | 'High' | 'Medium' | 'Low'>('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Add Assignment Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('Operating Systems');
  const [deadline, setDeadline] = useState('2026-11-18');
  const [priority, setPriority] = useState<Assignment['priority']>('High');
  const [description, setDescription] = useState('');

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addAssignment({
      title: title.trim(),
      subject: subject.trim(),
      deadline,
      priority,
      status: 'Pending',
      description: description.trim(),
    });

    setTitle('');
    setDescription('');
    setShowAddModal(false);
  };

  const calculateDaysLeft = (dateStr: string) => {
    const diff = new Date(dateStr).getTime() - new Date().getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const filteredAssignments = assignments.filter((item) => {
    const matchStatus = statusFilter === 'All' || item.status === statusFilter;
    const matchPriority = priorityFilter === 'All' || item.priority === priorityFilter;
    const matchSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.subject.toLowerCase().includes(searchTerm.toLowerCase());
    return matchStatus && matchPriority && matchSearch;
  });

  const pendingCount = assignments.filter((a) => a.status === 'Pending').length;
  const inProgressCount = assignments.filter((a) => a.status === 'In Progress').length;
  const submittedCount = assignments.filter((a) => a.status === 'Submitted').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header and Add Action */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            <FileCheck2 className="w-4 h-4" />
            <span>Assignment Manager</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white mt-1">
            Coursework & Lab Deliverables
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Keep track of submissions, problem sets, and submission deadlines.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Assignment</span>
        </button>
      </div>

      {/* Metric summary counters */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <div className="text-xs text-neutral-500">Pending Submissions</div>
          <div className="text-2xl font-bold tabular-nums text-rose-600 dark:text-rose-400 mt-1">
            {pendingCount}
          </div>
        </div>
        <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <div className="text-xs text-neutral-500">In Progress</div>
          <div className="text-2xl font-bold tabular-nums text-amber-600 dark:text-amber-400 mt-1">
            {inProgressCount}
          </div>
        </div>
        <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <div className="text-xs text-neutral-500">Completed & Submitted</div>
          <div className="text-2xl font-bold tabular-nums text-emerald-600 dark:text-emerald-400 mt-1">
            {submittedCount}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search assignments or subjects..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto">
          {(['All', 'Pending', 'In Progress', 'Submitted'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                statusFilter === st
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Priority Filter */}
        <div className="flex items-center gap-2 text-xs text-neutral-500 shrink-0">
          <span>Priority:</span>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value as any)}
            className="px-2 py-1 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-800 dark:text-neutral-200 focus:outline-none"
          >
            <option value="All">All Priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>

      {/* Assignment Items List */}
      <div className="space-y-3">
        {filteredAssignments.length === 0 ? (
          <div className="p-12 text-center rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-xs text-neutral-400 space-y-2">
            <FileCheck2 className="w-8 h-8 mx-auto text-neutral-300 dark:text-neutral-600" />
            <p>No assignments found matching your filter criteria.</p>
          </div>
        ) : (
          filteredAssignments.map((item) => {
            const daysLeft = calculateDaysLeft(item.deadline);
            const isOverdue = daysLeft < 0 && item.status !== 'Submitted';

            return (
              <div
                key={item.id}
                className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                {/* Left: Info */}
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-neutral-900 dark:text-white truncate">
                      {item.title}
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                        item.priority === 'High'
                          ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                          : item.priority === 'Medium'
                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                          : 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300'
                      }`}
                    >
                      {item.priority} Priority
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                        item.status === 'Submitted'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : item.status === 'In Progress'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
                          : 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <div className="text-[11px] text-neutral-500 flex items-center gap-2">
                    <span className="font-medium text-neutral-700 dark:text-neutral-300">
                      {item.subject}
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Due {item.deadline}
                    </span>
                    <span>·</span>
                    <span
                      className={`tabular-nums font-semibold ${
                        isOverdue
                          ? 'text-rose-600'
                          : daysLeft <= 2
                          ? 'text-amber-600'
                          : 'text-neutral-500'
                      }`}
                    >
                      {item.status === 'Submitted'
                        ? 'Completed'
                        : isOverdue
                        ? 'Overdue'
                        : `${daysLeft} days remaining`}
                    </span>
                  </div>

                  {item.description && (
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1 line-clamp-2">
                      {item.description}
                    </p>
                  )}
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  {/* Status Toggle Button */}
                  <select
                    value={item.status}
                    onChange={(e) =>
                      updateAssignment(item.id, {
                        status: e.target.value as Assignment['status'],
                      })
                    }
                    className="px-2.5 py-1.5 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-800 dark:text-neutral-200 focus:outline-none"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Submitted">Submitted ✅</option>
                  </select>

                  <button
                    onClick={() => {
                      showToast(`Reminder alert set for ${item.title} (due ${item.deadline})`, 'success');
                    }}
                    className="p-2 text-neutral-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                    title="Set Reminder"
                  >
                    <BellRing className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => deleteAssignment(item.id)}
                    className="p-2 text-neutral-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                    title="Delete Assignment"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Assignment Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
              Create New Assignment Deliverable
            </h3>

            <form onSubmit={handleCreateAssignment} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Assignment Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Implement Dijkstra Algorithm in Python"
                  className="w-full px-3 py-1.5 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Algorithms"
                    className="w-full px-3 py-1.5 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Submission Deadline
                  </label>
                  <input
                    type="date"
                    required
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Priority Level
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="w-full px-3 py-1.5 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white focus:outline-none"
                >
                  <option value="High">High (Major marks weightage)</option>
                  <option value="Medium">Medium (Regular problem set)</option>
                  <option value="Low">Low (Reading / Optional exercise)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Instructions / Deliverable Notes
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Include runtime benchmarking charts and test report PDF..."
                  className="w-full px-3 py-1.5 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white focus:outline-none resize-none"
                />
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
                  Save Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
