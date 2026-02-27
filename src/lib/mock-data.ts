// Centralized data layer — Fresh setup
export type UserRole = "student" | "teacher";

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
  profile_pic?: string;
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

// Initial Empty States
export const currentUser: User = {
  id: "u1",
  name: "IntellEdge User",
  email: "auth@intelledge.univ",
  role: "student",
  department: "Neural Systems",
  avatar_initials: "IU",
  semester: 5,
  cgpa: 8.5,
  enrollment_year: 2026,
};

export const subjects: Subject[] = [];
export const placementDrives: PlacementDrive[] = [];
export const assignments: Assignment[] = [];
export const notifications: Notification[] = [];
export const gradeTrends: any[] = [];
export const calendarEvents: any[] = [];
export const skillGaps: any[] = [];
export const departmentStats: any[] = [];
export const monthlyAttendance: any[] = [];

export const careerReadiness: CareerReadiness = {
  resume_score: 0,
  skill_match: 0,
  interview_readiness: 0,
  domain_fit: 0,
  placement_probability: 0,
};

export const academicRisk: AcademicRisk = {
  risk_score: 0,
  learning_velocity: 0,
  consistency_score: 0,
  burnout_probability: 0,
};
