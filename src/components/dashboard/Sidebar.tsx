import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  FolderOpen,
  CheckSquare,
  BarChart3,
  Calendar,
  Briefcase,
  Bot,
  GraduationCap,
  ChevronRight,
  FileSearch,
  LogOut,
} from "lucide-react";
import { logout } from "@/utils/auth";

export function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const role = localStorage.getItem("intelledge_role") || "student";

  const navItems = role === "teacher"
    ? [
      { icon: LayoutDashboard, label: "Teacher Dashboard", path: "/dashboard" },
      { icon: BookOpen, label: "Manage Subjects", path: "/academics" },
      { icon: FolderOpen, label: "Project Repos", path: "/projects" },
      { icon: CheckSquare, label: "Attendance Control", path: "/resources" },
      { icon: BarChart3, label: "Batch Analytics", path: "/analytics" },
    ]
    : [
      { icon: LayoutDashboard, label: "Student Dashboard", path: "/dashboard" },
      { icon: BookOpen, label: "Academic Vault", path: "/academics" },
      { icon: Briefcase, label: "Placement Hub", path: "/placements" },
      { icon: FolderOpen, label: "Project Vault", path: "/projects" },
      { icon: BarChart3, label: "Growth Analytics", path: "/analytics" },
      { icon: FolderOpen, label: "Study Resources", path: "/resources" },
      { icon: Bot, label: "AI Copilot", path: "/ai-copilot" },
      { icon: FileSearch, label: "ATS Checker", path: "/resume-checker" },
    ];

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-border bg-card px-4 py-6">
      {/* Logo */}
      <div className="mb-8 flex items-center gap-3 px-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary shadow-primary-glow">
          <GraduationCap className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-foreground tracking-tight">IntellEdge</h1>
          <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">University AI</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${isActive
                ? "gradient-primary text-primary-foreground shadow-primary-glow"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
            >
              <item.icon className="h-[18px] w-[18px]" />
              <span>{item.label}</span>
              {isActive && <ChevronRight className="ml-auto h-4 w-4 opacity-70" />}
            </button>
          );
        })}
      </nav>

      {/* Upgrade card */}
      <div className="mt-4 rounded-2xl bg-accent p-4 mb-4">
        <div className="mb-2 text-xs font-semibold text-accent-foreground">Upgrade to Pro</div>
        <p className="mb-3 text-[11px] text-muted-foreground leading-relaxed">
          Unlock AI Copilot, advanced analytics & placement intelligence.
        </p>
        <button className="w-full rounded-lg gradient-primary px-3 py-2 text-xs font-semibold text-primary-foreground shadow-primary-glow transition-transform hover:scale-[1.02]">
          Get Pro Access
        </button>
      </div>

      <button
        onClick={logout}
        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/10 transition-all mt-auto"
      >
        <LogOut className="h-4 w-4" />
        <span>Log Out</span>
      </button>
    </aside>
  );
}
