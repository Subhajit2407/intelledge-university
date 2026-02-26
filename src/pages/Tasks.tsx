import { useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { TopBar } from "@/components/dashboard/TopBar";
import { assignments } from "@/lib/mock-data";
import { CheckCircle, Clock, AlertCircle, FileText } from "lucide-react";

type StatusFilter = "all" | "pending" | "submitted" | "graded";

export default function Tasks() {
  const [filter, setFilter] = useState<StatusFilter>("all");

  const filtered = filter === "all" ? assignments : assignments.filter((a) => a.status === filter);

  const statusConfig = {
    pending: { icon: Clock, color: "text-warning", bg: "bg-warning/10", label: "Pending" },
    submitted: { icon: AlertCircle, color: "text-primary", bg: "bg-primary/10", label: "Submitted" },
    graded: { icon: CheckCircle, color: "text-success", bg: "bg-success/10", label: "Graded" },
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Tasks & Assignments</h2>
            <p className="text-sm text-muted-foreground">Track submissions, deadlines & grades</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-2xl bg-card shadow-card p-4 animate-fade-in">
              <p className="text-[11px] text-muted-foreground font-medium">Pending</p>
              <p className="text-2xl font-extrabold text-warning">{assignments.filter((a) => a.status === "pending").length}</p>
            </div>
            <div className="rounded-2xl bg-card shadow-card p-4 animate-fade-in">
              <p className="text-[11px] text-muted-foreground font-medium">Submitted</p>
              <p className="text-2xl font-extrabold text-primary">{assignments.filter((a) => a.status === "submitted").length}</p>
            </div>
            <div className="rounded-2xl bg-card shadow-card p-4 animate-fade-in">
              <p className="text-[11px] text-muted-foreground font-medium">Graded</p>
              <p className="text-2xl font-extrabold text-success">{assignments.filter((a) => a.status === "graded").length}</p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-2">
            {(["all", "pending", "submitted", "graded"] as StatusFilter[]).map((s) => (
              <button key={s} onClick={() => setFilter(s)}
                className={`rounded-lg px-3 py-2 text-xs font-semibold capitalize transition-colors ${filter === s ? "gradient-primary text-primary-foreground shadow-primary-glow" : "bg-secondary text-muted-foreground"}`}>
                {s === "all" ? "All" : s}
              </button>
            ))}
          </div>

          {/* Task list */}
          <div className="space-y-3">
            {filtered.map((a, i) => {
              const cfg = statusConfig[a.status];
              const isOverdue = a.status === "pending" && new Date(a.due_date) < new Date();
              return (
                <div key={a.id} className="rounded-2xl bg-card shadow-card p-4 flex items-center gap-4 animate-fade-in transition-all hover:shadow-card-hover" style={{ animationDelay: `${i * 60}ms` }}>
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${cfg.bg}`}>
                    <cfg.icon className={`h-5 w-5 ${cfg.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-foreground">{a.title}</p>
                    <p className="text-xs text-muted-foreground">{a.subject}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className={`text-xs font-semibold ${isOverdue ? "text-destructive" : "text-muted-foreground"}`}>
                      {isOverdue ? "Overdue" : `Due ${new Date(a.due_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`}
                    </p>
                    {a.score !== null && (
                      <p className="text-sm font-extrabold text-foreground">{a.score}/{a.max_score}</p>
                    )}
                  </div>
                  <span className={`rounded-lg px-2 py-1 text-[10px] font-bold ${cfg.bg} ${cfg.color}`}>{cfg.label}</span>
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}
