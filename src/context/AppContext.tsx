import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  StudentProfile,
  TimetableSlot,
  Examination,
  Assignment,
  DailyGoal,
  CollegeAnnouncement,
  CampusEvent,
  AcademicResource,
  ResumeData,
  StudyPlannerSubject,
} from '../types';

interface ToastNotification {
  id: string;
  type: 'success' | 'info' | 'error';
  message: string;
}

interface AppContextType {
  // Authentication & View
  isAuthenticated: boolean;
  login: (email?: string, name?: string) => void;
  logout: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;

  // Theme
  isDarkMode: boolean;
  toggleDarkMode: () => void;

  // Search
  searchQuery: string;
  setSearchQuery: (q: string) => void;

  // Student Profile
  profile: StudentProfile;
  updateProfile: (updated: Partial<StudentProfile>) => void;

  // Timetable
  timetable: TimetableSlot[];
  addTimetableSlot: (slot: Omit<TimetableSlot, 'id'>) => void;
  removeTimetableSlot: (id: string) => void;

  // Examinations
  examinations: Examination[];
  addExamination: (exam: Omit<Examination, 'id'>) => void;
  updateExamination: (id: string, exam: Partial<Examination>) => void;
  deleteExamination: (id: string) => void;

  // Assignments
  assignments: Assignment[];
  addAssignment: (item: Omit<Assignment, 'id'>) => void;
  updateAssignment: (id: string, item: Partial<Assignment>) => void;
  deleteAssignment: (id: string) => void;

  // Daily Goals
  dailyGoals: DailyGoal[];
  addDailyGoal: (text: string, category?: DailyGoal['category']) => void;
  toggleDailyGoal: (id: string) => void;
  deleteDailyGoal: (id: string) => void;

  // Study hours tracker
  studyHoursToday: number;
  addStudyMinutes: (mins: number) => void;
  weeklyTargetHours: number;
  setWeeklyTargetHours: (hrs: number) => void;

  // Planner Subjects
  plannerSubjects: StudyPlannerSubject[];
  addPlannerSubject: (s: Omit<StudyPlannerSubject, 'id'>) => void;
  updatePlannerSubject: (id: string, s: Partial<StudyPlannerSubject>) => void;
  removePlannerSubject: (id: string) => void;

  // College Announcements & Events
  announcements: CollegeAnnouncement[];
  events: CampusEvent[];
  resources: AcademicResource[];
  addResource: (res: Omit<AcademicResource, 'id'>) => void;

  // Resume Data
  resumeData: ResumeData;
  updateResumeData: (data: Partial<ResumeData>) => void;

  // Notifications
  toasts: ToastNotification[];
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  dismissToast: (id: string) => void;

  // Reset demo data
  resetToSampleData: () => void;
}

const initialProfile: StudentProfile = {
  name: 'Sarah Okeke',
  email: 'sarah.okeke@campus.edu',
  college: 'National Institute of Engineering & Technology',
  branch: 'Computer Science & Engineering',
  semester: 6,
  rollNumber: 'CS22B1042',
  cgpa: 8.92,
  targetRole: 'Software Development Engineer (SDE-1)',
  skills: ['Data Structures & Algorithms', 'TypeScript', 'React', 'Python', 'PostgreSQL', 'System Design'],
  careerGoal: 'Secure a full-time engineering role at a top-tier tech company or high-growth startup.',
  avatarUrl: '/src/assets/images/avatar_student_lead_1794249744935.jpg',
};

const initialTimetable: TimetableSlot[] = [
  { id: '1', day: 'Monday', time: '09:00 - 10:00 AM', subject: 'Operating Systems', code: 'CS301', room: 'LH-204', faculty: 'Dr. Ramesh Sharma', type: 'Lecture' },
  { id: '2', day: 'Monday', time: '10:15 - 11:15 AM', subject: 'Database Systems', code: 'CS302', room: 'LH-102', faculty: 'Prof. Ananya Roy', type: 'Lecture' },
  { id: '3', day: 'Monday', time: '02:00 - 04:00 PM', subject: 'Networks Lab', code: 'CS305L', room: 'Lab 3 (Ground Floor)', faculty: 'Prof. S. K. Gupta', type: 'Lab' },
  { id: '4', day: 'Tuesday', time: '09:00 - 10:00 AM', subject: 'Design & Analysis of Algorithms', code: 'CS303', room: 'LH-204', faculty: 'Dr. Michael Chen', type: 'Lecture' },
  { id: '5', day: 'Tuesday', time: '11:30 - 12:30 PM', subject: 'Compiler Design', code: 'CS304', room: 'LH-105', faculty: 'Dr. V. Narayanan', type: 'Lecture' },
  { id: '6', day: 'Wednesday', time: '10:00 - 12:00 PM', subject: 'Operating Systems Lab', code: 'CS301L', room: 'Systems Lab 1', faculty: 'Dr. Ramesh Sharma', type: 'Lab' },
  { id: '7', day: 'Thursday', time: '02:00 - 03:00 PM', subject: 'Computer Networks', code: 'CS305', room: 'LH-204', faculty: 'Prof. S. K. Gupta', type: 'Lecture' },
  { id: '8', day: 'Friday', time: '10:00 - 11:00 AM', subject: 'Web Technologies & Cloud', code: 'CS306', room: 'Audi-B', faculty: 'Prof. Lisa Tanaka', type: 'Lecture' },
];

const initialExaminations: Examination[] = [
  { id: 'ex1', subject: 'Operating Systems', code: 'CS301', examType: 'End-Semester', date: '2026-11-20', time: '09:30 AM - 12:30 PM', venue: 'Exam Hall 4B', syllabus: 'Modules 1 to 5: Process Sync, Deadlocks, Memory Management, File Systems', priority: 'High', targetScore: '90%' },
  { id: 'ex2', subject: 'Design & Analysis of Algorithms', code: 'CS303', examType: 'End-Semester', date: '2026-11-24', time: '02:00 PM - 05:00 PM', venue: 'Exam Hall 2A', syllabus: 'Greedy, Dynamic Programming, Graph Traversal, NP-Completeness', priority: 'High', targetScore: '95%' },
  { id: 'ex3', subject: 'Database Management Systems', code: 'CS302', examType: 'End-Semester', date: '2026-11-28', time: '09:30 AM - 12:30 PM', venue: 'Exam Hall 1C', syllabus: 'Normalization (BCNF), Query Optimization, Concurrency Control & Recovery', priority: 'Medium', targetScore: '88%' },
  { id: 'ex4', subject: 'Computer Networks Lab Exam', code: 'CS305L', examType: 'Practical / Lab', date: '2026-11-17', time: '10:00 AM - 01:00 PM', venue: 'Lab 3', syllabus: 'Socket Programming, Wireshark Packet Analysis, RIP & OSPF routing scripts', priority: 'Medium', targetScore: '100%' },
];

const initialAssignments: Assignment[] = [
  { id: 'as1', title: 'Implement Banker\'s Algorithm in C++', subject: 'Operating Systems', deadline: '2026-11-14', priority: 'High', status: 'In Progress', description: 'Simulate safe state check and resource-request algorithm with multiple threads.' },
  { id: 'as2', title: 'B-Tree & Red-Black Tree Comparative Analysis', subject: 'Design & Analysis of Algorithms', deadline: '2026-11-16', priority: 'High', status: 'Pending', description: 'Submit benchmark report comparing disk I/O costs and branch factors.' },
  { id: 'as3', title: 'Relational Schema Normalization Problem Set 4', subject: 'Database Systems', deadline: '2026-11-18', priority: 'Medium', status: 'Pending', description: 'Decompose relation into 3NF and BCNF with lossless join and dependency preservation proof.' },
  { id: 'as4', title: 'HTTP/2 vs HTTP/3 Multiplexing Presentation', subject: 'Computer Networks', deadline: '2026-11-22', priority: 'Low', status: 'Submitted', description: 'Presentation slides explaining QUIC protocol and Head-of-Line blocking mitigation.' },
];

const initialDailyGoals: DailyGoal[] = [
  { id: 'g1', text: 'Solve 2 LeetCode Medium graph problems (BFS / DFS cycle detection)', completed: true, category: 'Coding' },
  { id: 'g2', text: 'Revise Virtual Memory and Page Replacement algorithms (LRU, Optimal)', completed: false, category: 'Study' },
  { id: 'g3', text: 'Draft Banker\'s Algorithm source code for OS assignment', completed: false, category: 'Assignment' },
  { id: 'g4', text: 'Practice 3 HR behavioral interview stories using STAR method', completed: false, category: 'Study' },
];

const initialAnnouncements: CollegeAnnouncement[] = [
  { id: 'an1', title: 'End-Semester Exam Hall Tickets Released', department: 'Examination Branch', date: 'Nov 8, 2026', summary: 'Hall tickets for Semester 6 examinations are now available on the university portal. Verify roll numbers and report discrepancies before Nov 12.', category: 'Examination', urgent: true },
  { id: 'an2', title: 'Campus Recruitment Drive: Google, Microsoft & Atlassian', department: 'Training & Placement Cell', date: 'Nov 6, 2026', summary: 'SDE-1 campus placement shortlisting tests commence next week. Ensure your updated ATS resume is uploaded on the college portal.', category: 'Placement', urgent: true },
  { id: 'an3', title: 'National Hackathon "HackSprint 2026" Registrations Open', department: 'Computer Science Department', date: 'Nov 4, 2026', summary: '36-hour hackathon with cash prizes over $10,000. Themes include AI in Education, FinTech and Sustainable Systems.', category: 'Campus Life' },
  { id: 'an4', title: 'Central Library Extended 24x7 Hours during Finals', department: 'Library Council', date: 'Nov 2, 2026', summary: 'Quiet study halls on floors 2 & 3 will remain open 24 hours daily with high-speed Wi-Fi and power outlets.', category: 'Academic' },
];

const initialEvents: CampusEvent[] = [
  { id: 'ev1', title: 'HackSprint 2026: 36-Hr University Hackathon', organizer: 'ACM Student Chapter', date: 'Nov 21 - 22, 2026', location: 'Tech Innovation Complex', category: 'Hackathon', description: 'Annual collegiate hackathon with industry mentors and live pitch presentations to venture investors.' },
  { id: 'ev2', title: 'Mastering System Design & High Scale Architectures', organizer: 'Google Developer Student Club', date: 'Nov 15, 2026 · 04:00 PM', location: 'Seminar Hall 1', category: 'Workshop', description: 'Interactive workshop led by alumni SDEs covering load balancing, caching tiers, and database sharding.' },
  { id: 'ev3', title: 'Mock Coding Interviews with Senior FAANG Engineers', organizer: 'Placement Preparation Cell', date: 'Nov 18, 2026 · 05:30 PM', location: 'Computer Lab 2', category: 'Workshop', description: 'One-on-one 45-minute technical mock interviews followed by immediate constructive rubrics.' },
];

const initialResources: AcademicResource[] = [
  { id: 'r1', title: 'Operating Systems Ultimate Revision Sheet', subject: 'Operating Systems', type: 'Cheatsheet', link: '#', description: 'Comprehensive formulas, CPU scheduling algorithms, semaphore primitives and deadlock criteria.' },
  { id: 'r2', title: 'DSA Handcrafted PYQ Question Bank (2020-2025)', subject: 'Algorithms', type: 'PYQ (Previous Questions)', link: '#', description: '5 years of university questions classified by topic with complexity derivations.' },
  { id: 'r3', title: 'DBMS SQL & Normalization Comprehensive Guide', subject: 'Database Systems', type: 'Lecture Notes', link: '#', description: 'Concise step-by-step algorithms for finding candidate keys, minimal cover, and 3NF/BCNF decomposition.' },
  { id: 'r4', title: 'Computer Networking Top 50 Interview Questions', subject: 'Computer Networks', type: 'Cheatsheet', link: '#', description: 'TCP vs UDP, 3-way handshake, OSI layers, DNS resolution, and subnetting math.' },
];

const initialResume: ResumeData = {
  personalInfo: {
    fullName: 'Sarah Okeke',
    email: 'sarah.okeke@campus.edu',
    phone: '+1 (555) 349-8120',
    location: 'Bangalore / Seattle',
    linkedin: 'linkedin.com/in/sarah-okeke',
    github: 'github.com/sarahokeke',
    portfolio: 'sarahokeke.dev',
  },
  education: [
    {
      id: 'ed1',
      institution: 'National Institute of Engineering & Technology',
      degree: 'Bachelor of Technology (B.Tech)',
      field: 'Computer Science & Engineering',
      startYear: '2023',
      endYear: '2027',
      cgpa: '8.92 / 10.0',
    },
  ],
  skills: {
    languages: 'TypeScript, JavaScript, C++, Python, SQL, HTML5, CSS3',
    frameworks: 'React 19, Next.js, Node.js, Express, Tailwind CSS, REST APIs',
    tools: 'Git, GitHub, Docker, Postman, Linux, Vite, Vercel',
    coreConcepts: 'Data Structures & Algorithms, Object-Oriented Design, Operating Systems, Database Management (DBMS), System Design basics',
  },
  projects: [
    {
      id: 'p1',
      title: 'Distributed Task Queue & Job Scheduler',
      technologies: 'Node.js, TypeScript, Redis, Docker',
      link: 'github.com/sarahokeke/task-queue',
      bullets: [
        'Architected a distributed background worker processing 1,200+ asynchronous jobs per minute with priority queueing.',
        'Implemented automatic exponential backoff retry logic and dead-letter queues, achieving a 99.8% execution success rate.',
        'Containerized microservices using Docker, streamlining local setup time by 60% for team contributors.',
      ],
    },
    {
      id: 'p2',
      title: 'Campus Peer Tutoring & Doubt Clearing Platform',
      technologies: 'React, Express, Tailwind CSS, PostgreSQL',
      link: 'github.com/sarahokeke/campustutor',
      bullets: [
        'Engineered responsive web app used by 450+ engineering students to schedule peer code reviews and academic doubt sessions.',
        'Optimized PostgreSQL index queries, decreasing average search response latency from 420ms to 78ms.',
        'Designed accessible dark/light UI following WCAG 2.1 AA standards, maintaining 100% lighthouse accessibility score.',
      ],
    },
  ],
  experience: [
    {
      id: 'exp1',
      role: 'Software Engineering Intern',
      company: 'Novus Cloud Technologies',
      location: 'Remote',
      startDate: 'Jun 2025',
      endDate: 'Aug 2025',
      bullets: [
        'Developed reusable UI components for telemetry analytics dashboard viewed by 15,000+ enterprise users.',
        'Collaborated with senior engineers to migrate legacy REST endpoints to modular GraphQL schemas, reducing payload size by 32%.',
        'Authored comprehensive unit and integration tests, elevating repository code coverage from 68% to 84%.',
      ],
    },
  ],
  achievements: [
    'Ranked in top 2% across 8,000+ candidates in National Collegiate Coding Championship 2025.',
    'Winner (1st Prize) at Intra-College 24-Hour Hackathon for automated lab grading assistant.',
    'Dean\'s Academic Honor List for 4 consecutive university semesters.',
  ],
};

const initialPlannerSubjects: StudyPlannerSubject[] = [
  { id: 'ps1', name: 'Operating Systems', examDate: '2026-11-20', difficulty: 'Challenging', unitsCovered: 3, totalUnits: 5, priority: 'High' },
  { id: 'ps2', name: 'Design & Analysis of Algorithms', examDate: '2026-11-24', difficulty: 'Challenging', unitsCovered: 2, totalUnits: 5, priority: 'High' },
  { id: 'ps3', name: 'Database Management Systems', examDate: '2026-11-28', difficulty: 'Moderate', unitsCovered: 4, totalUnits: 5, priority: 'Medium' },
  { id: 'ps4', name: 'Computer Networks', examDate: '2026-12-02', difficulty: 'Moderate', unitsCovered: 2, totalUnits: 5, priority: 'Medium' },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Authentication & Navigation
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('cm_auth') === 'true';
  });

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Dark Mode
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('cm_theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('cm_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('cm_theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  // Profile
  const [profile, setProfile] = useState<StudentProfile>(() => {
    const saved = localStorage.getItem('cm_profile');
    return saved ? JSON.parse(saved) : initialProfile;
  });

  useEffect(() => {
    localStorage.setItem('cm_profile', JSON.stringify(profile));
  }, [profile]);

  const updateProfile = (updated: Partial<StudentProfile>) => {
    setProfile((prev) => ({ ...prev, ...updated }));
    showToast('Profile updated successfully', 'success');
  };

  // Timetable
  const [timetable, setTimetable] = useState<TimetableSlot[]>(() => {
    const saved = localStorage.getItem('cm_timetable');
    return saved ? JSON.parse(saved) : initialTimetable;
  });

  useEffect(() => {
    localStorage.setItem('cm_timetable', JSON.stringify(timetable));
  }, [timetable]);

  const addTimetableSlot = (slot: Omit<TimetableSlot, 'id'>) => {
    const newSlot: TimetableSlot = { ...slot, id: 'slot_' + Date.now() };
    setTimetable((prev) => [...prev, newSlot]);
    showToast(`Added ${slot.subject} to timetable`, 'success');
  };

  const removeTimetableSlot = (id: string) => {
    setTimetable((prev) => prev.filter((s) => s.id !== id));
    showToast('Class removed from timetable', 'info');
  };

  // Examinations
  const [examinations, setExaminations] = useState<Examination[]>(() => {
    const saved = localStorage.getItem('cm_exams');
    return saved ? JSON.parse(saved) : initialExaminations;
  });

  useEffect(() => {
    localStorage.setItem('cm_exams', JSON.stringify(examinations));
  }, [examinations]);

  const addExamination = (exam: Omit<Examination, 'id'>) => {
    const newExam: Examination = { ...exam, id: 'ex_' + Date.now() };
    setExaminations((prev) => [...prev, newExam]);
    showToast(`Examination for ${exam.subject} scheduled`, 'success');
  };

  const updateExamination = (id: string, updated: Partial<Examination>) => {
    setExaminations((prev) => prev.map((e) => (e.id === id ? { ...e, ...updated } : e)));
    showToast('Exam details updated', 'success');
  };

  const deleteExamination = (id: string) => {
    setExaminations((prev) => prev.filter((e) => e.id !== id));
    showToast('Exam removed', 'info');
  };

  // Assignments
  const [assignments, setAssignments] = useState<Assignment[]>(() => {
    const saved = localStorage.getItem('cm_assignments');
    return saved ? JSON.parse(saved) : initialAssignments;
  });

  useEffect(() => {
    localStorage.setItem('cm_assignments', JSON.stringify(assignments));
  }, [assignments]);

  const addAssignment = (item: Omit<Assignment, 'id'>) => {
    const newItem: Assignment = { ...item, id: 'as_' + Date.now() };
    setAssignments((prev) => [newItem, ...prev]);
    showToast(`Assignment added: ${item.title}`, 'success');
  };

  const updateAssignment = (id: string, item: Partial<Assignment>) => {
    setAssignments((prev) => prev.map((a) => (a.id === id ? { ...a, ...item } : a)));
  };

  const deleteAssignment = (id: string) => {
    setAssignments((prev) => prev.filter((a) => a.id !== id));
    showToast('Assignment deleted', 'info');
  };

  // Daily Goals
  const [dailyGoals, setDailyGoals] = useState<DailyGoal[]>(() => {
    const saved = localStorage.getItem('cm_goals');
    return saved ? JSON.parse(saved) : initialDailyGoals;
  });

  useEffect(() => {
    localStorage.setItem('cm_goals', JSON.stringify(dailyGoals));
  }, [dailyGoals]);

  const addDailyGoal = (text: string, category: DailyGoal['category'] = 'Study') => {
    if (!text.trim()) return;
    const newGoal: DailyGoal = { id: 'g_' + Date.now(), text: text.trim(), completed: false, category };
    setDailyGoals((prev) => [...prev, newGoal]);
    showToast('Daily goal added', 'success');
  };

  const toggleDailyGoal = (id: string) => {
    setDailyGoals((prev) =>
      prev.map((g) => {
        if (g.id === id) {
          const nextState = !g.completed;
          if (nextState) showToast('Goal marked complete! 🎉', 'success');
          return { ...g, completed: nextState };
        }
        return g;
      })
    );
  };

  const deleteDailyGoal = (id: string) => {
    setDailyGoals((prev) => prev.filter((g) => g.id !== id));
  };

  // Study Tracker
  const [studyHoursToday, setStudyHoursToday] = useState<number>(() => {
    const saved = localStorage.getItem('cm_study_hours');
    return saved ? parseFloat(saved) : 2.5;
  });

  const [weeklyTargetHours, setWeeklyTargetHours] = useState<number>(() => {
    const saved = localStorage.getItem('cm_weekly_target');
    return saved ? parseInt(saved, 10) : 25;
  });

  const addStudyMinutes = (mins: number) => {
    const additionalHours = mins / 60;
    setStudyHoursToday((prev) => {
      const updated = +(prev + additionalHours).toFixed(2);
      localStorage.setItem('cm_study_hours', updated.toString());
      return updated;
    });
    showToast(`Logged +${mins} minutes of focused study!`, 'success');
  };

  // Planner Subjects
  const [plannerSubjects, setPlannerSubjects] = useState<StudyPlannerSubject[]>(() => {
    const saved = localStorage.getItem('cm_planner_subjects');
    return saved ? JSON.parse(saved) : initialPlannerSubjects;
  });

  useEffect(() => {
    localStorage.setItem('cm_planner_subjects', JSON.stringify(plannerSubjects));
  }, [plannerSubjects]);

  const addPlannerSubject = (s: Omit<StudyPlannerSubject, 'id'>) => {
    const newSub: StudyPlannerSubject = { ...s, id: 'ps_' + Date.now() };
    setPlannerSubjects((prev) => [...prev, newSub]);
    showToast(`Added ${s.name} to study planner`, 'success');
  };

  const updatePlannerSubject = (id: string, s: Partial<StudyPlannerSubject>) => {
    setPlannerSubjects((prev) => prev.map((sub) => (sub.id === id ? { ...sub, ...s } : sub)));
  };

  const removePlannerSubject = (id: string) => {
    setPlannerSubjects((prev) => prev.filter((sub) => sub.id !== id));
    showToast('Subject removed from planner', 'info');
  };

  // Announcements & Events & Resources
  const [announcements] = useState<CollegeAnnouncement[]>(initialAnnouncements);
  const [events] = useState<CampusEvent[]>(initialEvents);
  const [resources, setResources] = useState<AcademicResource[]>(() => {
    const saved = localStorage.getItem('cm_resources');
    return saved ? JSON.parse(saved) : initialResources;
  });

  const addResource = (res: Omit<AcademicResource, 'id'>) => {
    const newRes: AcademicResource = { ...res, id: 'res_' + Date.now() };
    setResources((prev) => [newRes, ...prev]);
    localStorage.setItem('cm_resources', JSON.stringify([newRes, ...resources]));
    showToast(`Added resource: ${res.title}`, 'success');
  };

  // Resume Data
  const [resumeData, setResumeData] = useState<ResumeData>(() => {
    const saved = localStorage.getItem('cm_resume');
    return saved ? JSON.parse(saved) : initialResume;
  });

  useEffect(() => {
    localStorage.setItem('cm_resume', JSON.stringify(resumeData));
  }, [resumeData]);

  const updateResumeData = (updated: Partial<ResumeData>) => {
    setResumeData((prev) => ({ ...prev, ...updated }));
  };

  // Notifications
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'info') => {
    const id = 'toast_' + Date.now() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      dismissToast(id);
    }, 3800);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Auth methods
  const login = (email?: string, name?: string) => {
    setIsAuthenticated(true);
    localStorage.setItem('cm_auth', 'true');
    if (name || email) {
      setProfile((prev) => ({
        ...prev,
        name: name || prev.name,
        email: email || prev.email,
      }));
    }
    showToast(`Welcome back, ${name || profile.name}!`, 'success');
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('cm_auth');
    showToast('Signed out of CampusMate AI', 'info');
  };

  // Reset to sample data
  const resetToSampleData = () => {
    setProfile(initialProfile);
    setTimetable(initialTimetable);
    setExaminations(initialExaminations);
    setAssignments(initialAssignments);
    setDailyGoals(initialDailyGoals);
    setStudyHoursToday(2.5);
    setPlannerSubjects(initialPlannerSubjects);
    setResources(initialResources);
    setResumeData(initialResume);
    localStorage.clear();
    localStorage.setItem('cm_auth', 'true');
    showToast('Reset all workspace data to default engineering sample data', 'success');
  };

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
        activeTab,
        setActiveTab,
        isDarkMode,
        toggleDarkMode,
        searchQuery,
        setSearchQuery,
        profile,
        updateProfile,
        timetable,
        addTimetableSlot,
        removeTimetableSlot,
        examinations,
        addExamination,
        updateExamination,
        deleteExamination,
        assignments,
        addAssignment,
        updateAssignment,
        deleteAssignment,
        dailyGoals,
        addDailyGoal,
        toggleDailyGoal,
        deleteDailyGoal,
        studyHoursToday,
        addStudyMinutes,
        weeklyTargetHours,
        setWeeklyTargetHours,
        plannerSubjects,
        addPlannerSubject,
        updatePlannerSubject,
        removePlannerSubject,
        announcements,
        events,
        resources,
        addResource,
        resumeData,
        updateResumeData,
        toasts,
        showToast,
        dismissToast,
        resetToSampleData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
