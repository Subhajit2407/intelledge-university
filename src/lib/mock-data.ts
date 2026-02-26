// Centralized mock data layer — mirrors future database schema
// Each entity matches the planned DB table structure

export type UserRole = "student" | "teacher" | "admin" | "placement_officer";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  avatar_initials: string;
  semester: number;
  cgpa: number;
  enrollment_year: number;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  instructor: string;
  total_classes: number;
  attended_classes: number;
  attendance_pct: number;
  credits: number;
  grade: string | null;
  internal_marks: number;
  max_internal: number;
  risk_level: "safe" | "warning" | "danger";
}

export interface PlacementDrive {
  id: string;
  company: string;
  logo_initial: string;
  type: "on-campus" | "off-campus";
  role: string;
  ctc_min: number;
  ctc_max: number;
  cgpa_cutoff: number;
  skills_required: string[];
  hiring_month: string;
  location: string;
  status: "upcoming" | "active" | "completed";
  applicants: number;
  selected: number;
  deadline: string;
  eligibility: "eligible" | "almost" | "not_eligible";
  match_score: number;
}

export interface Assignment {
  id: string;
  title: string;
  subject: string;
  due_date: string;
  status: "pending" | "submitted" | "graded";
  score: number | null;
  max_score: number;
}

export interface Notification {
  id: string;
  type: "alert" | "info" | "warning" | "success";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface CareerReadiness {
  resume_score: number;
  skill_match: number;
  interview_readiness: number;
  domain_fit: number;
  placement_probability: number;
}

export interface AcademicRisk {
  risk_score: number;
  learning_velocity: number;
  consistency_score: number;
  burnout_probability: number;
}

// Current user
export const currentUser: User = {
  id: "u1",
  name: "Arjun Sharma",
  email: "arjun.sharma@intelledge.edu",
  role: "student",
  department: "B.Tech CSE",
  avatar_initials: "AS",
  semester: 5,
  cgpa: 7.8,
  enrollment_year: 2023,
};

// Subjects
export const subjects: Subject[] = [
  { id: "s1", name: "Data Structures & Algorithms", code: "CS301", instructor: "Dr. Priya Sharma", total_classes: 42, attended_classes: 35, attendance_pct: 83, credits: 4, grade: "A-", internal_marks: 38, max_internal: 50, risk_level: "safe" },
  { id: "s2", name: "Operating Systems", code: "CS302", instructor: "Prof. Ravi Kumar", total_classes: 38, attended_classes: 28, attendance_pct: 74, credits: 4, grade: "B+", internal_marks: 32, max_internal: 50, risk_level: "warning" },
  { id: "s3", name: "Database Management Systems", code: "CS303", instructor: "Dr. Anand Mehta", total_classes: 40, attended_classes: 36, attendance_pct: 90, credits: 3, grade: "A", internal_marks: 44, max_internal: 50, risk_level: "safe" },
  { id: "s4", name: "Computer Networks", code: "CS304", instructor: "Dr. Sunita Verma", total_classes: 36, attended_classes: 24, attendance_pct: 67, credits: 3, grade: "B", internal_marks: 28, max_internal: 50, risk_level: "danger" },
  { id: "s5", name: "Machine Learning", code: "CS305", instructor: "Dr. Anand Mehta", total_classes: 30, attended_classes: 26, attendance_pct: 87, credits: 4, grade: "A-", internal_marks: 40, max_internal: 50, risk_level: "safe" },
  { id: "s6", name: "Software Engineering", code: "CS306", instructor: "Prof. Neha Singh", total_classes: 34, attended_classes: 30, attendance_pct: 88, credits: 3, grade: "A", internal_marks: 42, max_internal: 50, risk_level: "safe" },
];

// Placement Drives
export const placementDrives: PlacementDrive[] = [
  { id: "p1", company: "Microsoft", logo_initial: "M", type: "on-campus", role: "SDE Intern", ctc_min: 30, ctc_max: 45, cgpa_cutoff: 7.5, skills_required: ["DSA", "System Design", "C++"], hiring_month: "Aug–Oct", location: "Hyderabad", status: "upcoming", applicants: 180, selected: 0, deadline: "2026-03-15", eligibility: "eligible", match_score: 82 },
  { id: "p2", company: "Google", logo_initial: "G", type: "on-campus", role: "SWE Intern", ctc_min: 35, ctc_max: 55, cgpa_cutoff: 8.0, skills_required: ["DSA", "Algorithms", "Python"], hiring_month: "Sep–Nov", location: "Bangalore", status: "upcoming", applicants: 220, selected: 0, deadline: "2026-03-20", eligibility: "almost", match_score: 68 },
  { id: "p3", company: "JP Morgan", logo_initial: "JP", type: "on-campus", role: "Technology Analyst", ctc_min: 18, ctc_max: 25, cgpa_cutoff: 7.0, skills_required: ["Java", "SQL", "Finance"], hiring_month: "Jul–Sep", location: "Mumbai", status: "active", applicants: 150, selected: 12, deadline: "2026-03-05", eligibility: "eligible", match_score: 75 },
  { id: "p4", company: "Amazon", logo_initial: "A", type: "on-campus", role: "SDE-1", ctc_min: 28, ctc_max: 42, cgpa_cutoff: 7.0, skills_required: ["DSA", "OS", "DBMS"], hiring_month: "Aug–Oct", location: "Hyderabad", status: "upcoming", applicants: 200, selected: 0, deadline: "2026-04-01", eligibility: "eligible", match_score: 88 },
  { id: "p5", company: "Deloitte", logo_initial: "D", type: "on-campus", role: "Analyst", ctc_min: 8, ctc_max: 12, cgpa_cutoff: 6.5, skills_required: ["SQL", "Excel", "Communication"], hiring_month: "Oct–Dec", location: "Pune", status: "completed", applicants: 120, selected: 25, deadline: "2026-02-15", eligibility: "eligible", match_score: 70 },
  { id: "p6", company: "Flipkart", logo_initial: "F", type: "off-campus", role: "Backend Engineer", ctc_min: 22, ctc_max: 35, cgpa_cutoff: 7.0, skills_required: ["Java", "Microservices", "DSA"], hiring_month: "Jun–Aug", location: "Bangalore", status: "upcoming", applicants: 0, selected: 0, deadline: "2026-05-10", eligibility: "eligible", match_score: 79 },
];

// Assignments
export const assignments: Assignment[] = [
  { id: "a1", title: "Binary Search Implementation", subject: "Data Structures & Algorithms", due_date: "2026-02-27", status: "pending", score: null, max_score: 100 },
  { id: "a2", title: "Component Library Design", subject: "Software Engineering", due_date: "2026-02-28", status: "pending", score: null, max_score: 50 },
  { id: "a3", title: "Linear Regression Lab", subject: "Machine Learning", due_date: "2026-03-02", status: "pending", score: null, max_score: 100 },
  { id: "a4", title: "SQL Query Optimization", subject: "Database Management Systems", due_date: "2026-02-25", status: "graded", score: 88, max_score: 100 },
  { id: "a5", title: "Process Scheduling Simulation", subject: "Operating Systems", due_date: "2026-02-24", status: "submitted", score: null, max_score: 75 },
];

// Career Readiness
export const careerReadiness: CareerReadiness = {
  resume_score: 72,
  skill_match: 68,
  interview_readiness: 55,
  domain_fit: 80,
  placement_probability: 64,
};

// Academic Risk
export const academicRisk: AcademicRisk = {
  risk_score: 28,
  learning_velocity: 74,
  consistency_score: 81,
  burnout_probability: 35,
};

// Notifications
export const notifications: Notification[] = [
  { id: "n1", type: "alert", title: "Low Attendance Warning", message: "Computer Networks attendance is at 67%. Attend next 5 classes to reach 75%.", timestamp: "2026-02-26T08:00:00", read: false },
  { id: "n2", type: "info", title: "Microsoft Drive Posted", message: "Microsoft SDE Intern drive is now open. You are eligible. Deadline: March 15.", timestamp: "2026-02-26T07:30:00", read: false },
  { id: "n3", type: "warning", title: "Assignment Due Tomorrow", message: "Binary Search Implementation is due tomorrow.", timestamp: "2026-02-26T06:00:00", read: false },
];

// Grade trend data
export const gradeTrends = [
  { semester: "Sem 1", gpa: 7.2 },
  { semester: "Sem 2", gpa: 7.5 },
  { semester: "Sem 3", gpa: 7.4 },
  { semester: "Sem 4", gpa: 7.8 },
  { semester: "Sem 5", gpa: 8.1 },
];

// Calendar events
export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  type: "assignment" | "exam" | "interview" | "study" | "placement";
  time?: string;
}

export const calendarEvents: CalendarEvent[] = [
  { id: "e1", title: "Binary Search Assignment Due", date: "2026-02-27", type: "assignment", time: "11:59 PM" },
  { id: "e2", title: "Component Library Due", date: "2026-02-28", type: "assignment", time: "11:59 PM" },
  { id: "e3", title: "ML Mid-Sem Exam", date: "2026-03-05", type: "exam", time: "10:00 AM" },
  { id: "e4", title: "JP Morgan Online Test", date: "2026-03-05", type: "placement", time: "2:00 PM" },
  { id: "e5", title: "OS Lab Exam", date: "2026-03-10", type: "exam", time: "9:00 AM" },
  { id: "e6", title: "Mock Interview - DSA", date: "2026-03-08", type: "interview", time: "4:00 PM" },
  { id: "e7", title: "AI Study Block: System Design", date: "2026-03-03", type: "study", time: "6:00 PM" },
  { id: "e8", title: "Microsoft Application Deadline", date: "2026-03-15", type: "placement", time: "11:59 PM" },
  { id: "e9", title: "Linear Regression Lab Due", date: "2026-03-02", type: "assignment", time: "11:59 PM" },
  { id: "e10", title: "DBMS Viva", date: "2026-03-12", type: "exam", time: "11:00 AM" },
];

// Skill gap data
export const skillGaps = [
  { skill: "DSA", current: 75, required: 90 },
  { skill: "System Design", current: 40, required: 80 },
  { skill: "SQL", current: 82, required: 85 },
  { skill: "Python", current: 70, required: 80 },
  { skill: "Communication", current: 60, required: 75 },
  { skill: "OS Concepts", current: 55, required: 70 },
];

// Analytics data
export const departmentStats = [
  { dept: "CSE", placed: 85, total: 120, avg_package: 12.5 },
  { dept: "ECE", placed: 62, total: 100, avg_package: 8.2 },
  { dept: "ME", placed: 45, total: 90, avg_package: 6.8 },
  { dept: "EEE", placed: 50, total: 80, avg_package: 7.5 },
  { dept: "Civil", placed: 30, total: 70, avg_package: 5.5 },
];

export const monthlyAttendance = [
  { month: "Aug", avg: 88 },
  { month: "Sep", avg: 84 },
  { month: "Oct", avg: 80 },
  { month: "Nov", avg: 76 },
  { month: "Dec", avg: 72 },
  { month: "Jan", avg: 78 },
  { month: "Feb", avg: 82 },
];
