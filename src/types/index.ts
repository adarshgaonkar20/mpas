export interface StudentProfile {
  name: string;
  email: string;
  college: string;
  branch: string;
  semester: number;
  rollNumber: string;
  cgpa: number;
  targetRole: string;
  skills: string[];
  careerGoal: string;
  avatarUrl: string;
}

export interface TimetableSlot {
  id: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  time: string;
  subject: string;
  code: string;
  room: string;
  faculty: string;
  type: 'Lecture' | 'Lab' | 'Tutorial';
}

export interface Examination {
  id: string;
  subject: string;
  code: string;
  examType: 'Mid-Term' | 'End-Semester' | 'Practical / Lab' | 'Internal Quiz';
  date: string; // YYYY-MM-DD
  time: string;
  venue: string;
  syllabus: string;
  priority: 'High' | 'Medium' | 'Low';
  targetScore: string;
}

export interface Assignment {
  id: string;
  title: string;
  subject: string;
  deadline: string; // YYYY-MM-DD
  priority: 'High' | 'Medium' | 'Low';
  status: 'Pending' | 'In Progress' | 'Submitted';
  description?: string;
}

export interface DailyGoal {
  id: string;
  text: string;
  completed: boolean;
  category: 'Study' | 'Assignment' | 'Coding' | 'Fitness';
}

export interface CollegeAnnouncement {
  id: string;
  title: string;
  department: string;
  date: string;
  summary: string;
  category: 'Academic' | 'Examination' | 'Placement' | 'Campus Life';
  urgent?: boolean;
}

export interface CampusEvent {
  id: string;
  title: string;
  organizer: string;
  date: string;
  location: string;
  category: 'Hackathon' | 'Workshop' | 'Tech Fest' | 'Club Meetup';
  description: string;
}

export interface AcademicResource {
  id: string;
  title: string;
  subject: string;
  type: 'Lecture Notes' | 'Cheatsheet' | 'PYQ (Previous Questions)' | 'Reference Book';
  link: string;
  description: string;
}

export interface ResumeData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    github: string;
    portfolio: string;
  };
  education: Array<{
    id: string;
    institution: string;
    degree: string;
    field: string;
    startYear: string;
    endYear: string;
    cgpa: string;
  }>;
  skills: {
    languages: string;
    frameworks: string;
    tools: string;
    coreConcepts: string;
  };
  projects: Array<{
    id: string;
    title: string;
    technologies: string;
    link?: string;
    bullets: string[];
  }>;
  experience: Array<{
    id: string;
    role: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    bullets: string[];
  }>;
  achievements: string[];
}

export interface InterviewQuestion {
  id: string;
  category: 'Technical' | 'HR' | 'System Design' | 'Aptitude';
  subCategory?: string;
  question: string;
  answerSummary: string;
  codeSnippet?: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface StudyPlannerSubject {
  id: string;
  name: string;
  examDate: string;
  difficulty: 'Easy' | 'Moderate' | 'Challenging';
  unitsCovered: number;
  totalUnits: number;
  priority: 'High' | 'Medium' | 'Low';
}
