import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Building2,
  Calendar,
  Bell,
  Sparkles,
  BookOpen,
  CheckSquare,
  Plus,
  Trash2,
  ExternalLink,
  MapPin,
  Clock,
  Search,
  Filter,
  Check,
  Info,
} from 'lucide-react';
import { TimetableSlot, AcademicResource } from '../../types';

export const CollegeOrganizer: React.FC = () => {
  const {
    timetable,
    addTimetableSlot,
    removeTimetableSlot,
    announcements,
    events,
    resources,
    addResource,
    dailyGoals,
    addDailyGoal,
    toggleDailyGoal,
    deleteDailyGoal,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'timetable' | 'announcements' | 'events' | 'resources' | 'tasks'>('timetable');
  const [selectedDay, setSelectedDay] = useState<string>('Monday');

  // Timetable Add Modal
  const [showAddClass, setShowAddClass] = useState(false);
  const [classSubject, setClassSubject] = useState('');
  const [classCode, setClassCode] = useState('CS307');
  const [classTime, setClassTime] = useState('11:00 - 12:00 PM');
  const [classRoom, setClassRoom] = useState('LH-301');
  const [classFaculty, setClassFaculty] = useState('Dr. Alan Turing');
  const [classType, setClassType] = useState<TimetableSlot['type']>('Lecture');

  // Resource Add Modal
  const [showAddResource, setShowAddResource] = useState(false);
  const [resTitle, setResTitle] = useState('');
  const [resSubject, setResSubject] = useState('Operating Systems');
  const [resType, setResType] = useState<AcademicResource['type']>('Cheatsheet');
  const [resDesc, setResDesc] = useState('');

  // Task state
  const [newTaskText, setNewTaskText] = useState('');

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const handleAddClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!classSubject.trim()) return;

    addTimetableSlot({
      day: selectedDay as any,
      subject: classSubject.trim(),
      code: classCode.trim(),
      time: classTime.trim(),
      room: classRoom.trim(),
      faculty: classFaculty.trim(),
      type: classType,
    });

    setClassSubject('');
    setShowAddClass(false);
  };

  const handleAddResource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resTitle.trim()) return;

    addResource({
      title: resTitle.trim(),
      subject: resSubject.trim(),
      type: resType,
      link: '#',
      description: resDesc.trim() || 'Shared by student academic representative.',
    });

    setResTitle('');
    setResDesc('');
    setShowAddResource(false);
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    addDailyGoal(newTaskText.trim(), 'Study');
    setNewTaskText('');
  };

  const filteredTimetable = timetable.filter((slot) => slot.day === selectedDay);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Title & Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            <Building2 className="w-4 h-4" />
            <span>College Organizer</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white mt-1">
            Campus Pulse, Timetable & Shared Resources
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Your university schedule, official notices, hackathon events and study material hub.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1 p-1 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-x-auto shadow-xs">
          {[
            { id: 'timetable', label: 'Weekly Timetable' },
            { id: 'announcements', label: 'Announcements' },
            { id: 'events', label: 'Campus Events' },
            { id: 'resources', label: 'Study Resources' },
            { id: 'tasks', label: 'Personal Tasks' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 1. TIMETABLE TAB */}
      {activeTab === 'timetable' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Day Selector */}
            <div className="flex items-center gap-1 p-1 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-x-auto">
              {days.map((d) => (
                <button
                  key={d}
                  onClick={() => setSelectedDay(d)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                    selectedDay === d
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowAddClass(true)}
              className="px-3.5 py-1.5 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-lg text-xs font-semibold flex items-center gap-1.5 hover:bg-neutral-800 transition-colors shadow-xs shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Class to {selectedDay}</span>
            </button>
          </div>

          {/* Timetable Grid Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTimetable.length === 0 ? (
              <div className="col-span-full py-16 text-center text-xs text-neutral-400 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800">
                No classes scheduled for {selectedDay}.
              </div>
            ) : (
              filteredTimetable.map((slot) => (
                <div
                  key={slot.id}
                  className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex flex-col justify-between hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="font-mono font-semibold text-indigo-600 dark:text-indigo-400">
                        {slot.code}
                      </span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                          slot.type === 'Lab'
                            ? 'bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300'
                            : 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                        }`}
                      >
                        {slot.type}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                      {slot.subject}
                    </h3>

                    <div className="mt-3 space-y-1 text-xs text-neutral-500">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                        <span className="tabular-nums">{slot.time}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                        <span>Room: {slot.room}</span>
                      </div>
                      <div className="text-[11px] text-neutral-400 pt-1">
                        Instructor: {slot.faculty}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800 flex justify-end">
                    <button
                      onClick={() => removeTimetableSlot(slot.id)}
                      className="text-[11px] text-neutral-400 hover:text-rose-600 transition-colors flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 2. ANNOUNCEMENTS TAB */}
      {activeTab === 'announcements' && (
        <div className="space-y-4">
          <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 rounded-xl text-xs text-amber-800 dark:text-amber-200 flex items-center gap-2">
            <Info className="w-4 h-4 shrink-0 text-amber-600" />
            <span>
              Disclaimer: These are simulated sample college board notices for demonstration. CampusMate AI does not connect directly to proprietary university ERP servers without authorized IT credentials.
            </span>
          </div>

          <div className="space-y-3">
            {announcements.map((item) => (
              <div
                key={item.id}
                className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-2 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                      {item.department}
                    </span>
                    {item.urgent && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300">
                        Urgent Notice
                      </span>
                    )}
                    <span className="text-[10px] text-neutral-400">{item.date}</span>
                  </div>
                  <span className="text-[10px] text-neutral-500">{item.category}</span>
                </div>

                <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                  {item.title}
                </h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  {item.summary}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. CAMPUS EVENTS TAB */}
      {activeTab === 'events' && (
        <div className="space-y-4">
          <div className="text-xs text-neutral-500">
            Upcoming engineering hackathons, tech talks and workshops on campus.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {events.map((ev) => (
              <div
                key={ev.id}
                className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                    {ev.category}
                  </span>
                  <h3 className="text-sm font-bold text-neutral-900 dark:text-white mt-2">
                    {ev.title}
                  </h3>
                  <div className="mt-2 space-y-1 text-xs text-neutral-500">
                    <div>📅 {ev.date}</div>
                    <div>📍 {ev.location}</div>
                    <div className="text-[11px] text-neutral-400">By {ev.organizer}</div>
                  </div>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-2.5 leading-relaxed">
                    {ev.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800">
                  <button
                    onClick={() => showToast(`Registered for ${ev.title}! Check your college email.`, 'success')}
                    className="w-full py-1.5 text-xs font-semibold bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-lg hover:bg-neutral-800 transition-colors"
                  >
                    Register / RSVP
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. NOTES & RESOURCES REPOSITORY TAB */}
      {activeTab === 'resources' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-neutral-500">
              Community and faculty shared cheatsheets, revision summaries, and PYQ banks
            </span>
            <button
              onClick={() => setShowAddResource(true)}
              className="px-3.5 py-1.5 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-lg text-xs font-semibold flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Share Resource</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {resources.map((res) => (
              <div
                key={res.id}
                className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-2 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] text-neutral-400 mb-1">
                    <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                      {res.subject}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                      {res.type}
                    </span>
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-neutral-900 dark:text-white">
                    {res.title}
                  </h3>
                  <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                    {res.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex justify-end">
                  <button
                    onClick={() => showToast(`Opening resource: ${res.title}`, 'info')}
                    className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                  >
                    <span>Access Resource</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. PERSONAL TASK MANAGER TAB */}
      {activeTab === 'tasks' && (
        <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-4 max-w-2xl mx-auto">
          <div>
            <h2 className="text-sm font-bold text-neutral-900 dark:text-white">
              Personal Academic Task Checklist
            </h2>
            <p className="text-xs text-neutral-500">
              Track your daily study agenda, revision goals, and lab experiments
            </p>
          </div>

          <form onSubmit={handleAddTask} className="flex gap-2">
            <input
              type="text"
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
              placeholder="Add personal task (e.g., Read Section 3.2 on Memory Management)..."
              className="flex-1 px-3 py-2 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </form>

          <div className="space-y-2">
            {dailyGoals.map((task) => (
              <div
                key={task.id}
                className="p-3 rounded-lg border border-neutral-100 dark:border-neutral-800/80 bg-neutral-50/50 dark:bg-neutral-800/40 flex items-center justify-between gap-3 text-xs"
              >
                <div
                  onClick={() => toggleDailyGoal(task.id)}
                  className="flex items-center gap-2.5 flex-1 cursor-pointer"
                >
                  <div
                    className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                      task.completed
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'border-neutral-300 dark:border-neutral-600'
                    }`}
                  >
                    {task.completed && <Check className="w-3 h-3" />}
                  </div>
                  <span
                    className={`${
                      task.completed
                        ? 'line-through text-neutral-400 dark:text-neutral-500'
                        : 'text-neutral-800 dark:text-neutral-200'
                    }`}
                  >
                    {task.text}
                  </span>
                </div>

                <button
                  onClick={() => deleteDailyGoal(task.id)}
                  className="text-neutral-400 hover:text-rose-500 p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Class Modal */}
      {showAddClass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
              Add Class to {selectedDay}'s Timetable
            </h3>

            <form onSubmit={handleAddClass} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Subject Name
                </label>
                <input
                  type="text"
                  required
                  value={classSubject}
                  onChange={(e) => setClassSubject(e.target.value)}
                  placeholder="e.g. Distributed Operating Systems"
                  className="w-full px-3 py-1.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Course Code
                  </label>
                  <input
                    type="text"
                    value={classCode}
                    onChange={(e) => setClassCode(e.target.value)}
                    className="w-full px-3 py-1.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Class Type
                  </label>
                  <select
                    value={classType}
                    onChange={(e) => setClassType(e.target.value as any)}
                    className="w-full px-3 py-1.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white focus:outline-none"
                  >
                    <option value="Lecture">Lecture</option>
                    <option value="Lab">Lab Session</option>
                    <option value="Tutorial">Tutorial</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Time Slot
                  </label>
                  <input
                    type="text"
                    value={classTime}
                    onChange={(e) => setClassTime(e.target.value)}
                    className="w-full px-3 py-1.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Room / Hall
                  </label>
                  <input
                    type="text"
                    value={classRoom}
                    onChange={(e) => setClassRoom(e.target.value)}
                    className="w-full px-3 py-1.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Faculty / Professor
                </label>
                <input
                  type="text"
                  value={classFaculty}
                  onChange={(e) => setClassFaculty(e.target.value)}
                  className="w-full px-3 py-1.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddClass(false)}
                  className="px-3.5 py-1.5 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold"
                >
                  Save Class
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Resource Modal */}
      {showAddResource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
              Share Academic Resource
            </h3>

            <form onSubmit={handleAddResource} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Resource Title
                </label>
                <input
                  type="text"
                  required
                  value={resTitle}
                  onChange={(e) => setResTitle(e.target.value)}
                  placeholder="e.g. End-Term Compiler Design Solved PYQs"
                  className="w-full px-3 py-1.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={resSubject}
                    onChange={(e) => setResSubject(e.target.value)}
                    className="w-full px-3 py-1.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Category
                  </label>
                  <select
                    value={resType}
                    onChange={(e) => setResType(e.target.value as any)}
                    className="w-full px-3 py-1.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white focus:outline-none"
                  >
                    <option value="Cheatsheet">Cheatsheet</option>
                    <option value="Lecture Notes">Lecture Notes</option>
                    <option value="PYQ (Previous Questions)">PYQ Bank</option>
                    <option value="Reference Book">Reference Book</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Description / Topic Notes
                </label>
                <textarea
                  rows={2}
                  value={resDesc}
                  onChange={(e) => setResDesc(e.target.value)}
                  placeholder="e.g. Covers LR parsers, syntax-directed translation, and DAG generation..."
                  className="w-full px-3 py-1.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white focus:outline-none resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddResource(false)}
                  className="px-3.5 py-1.5 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold"
                >
                  Publish Resource
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
