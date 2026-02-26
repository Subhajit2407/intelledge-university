import { useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { TopBar } from "@/components/dashboard/TopBar";
import { subjects, gradeTrends, academicRisk } from "@/lib/mock-data";
import { AlertTriangle, TrendingUp, Brain, Zap, Shield, Activity, ChevronDown } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { Progress } from "@/components/ui/progress";

export default function Academics() {
  const [simScore, setSimScore] = useState(70);
  const [selectedSubject, setSelectedSubject] = useState(subjects[0]);

  // Simulation: predict final grade
  const currentAvg = selectedSubject.internal_marks / selectedSubject.max_internal * 100;
  const simulatedFinal = Math.round((currentAvg * 0.5) + (simScore * 0.5));
  const simulatedGrade =
    simulatedFinal >= 90 ? "A+" : simulatedFinal >= 80 ? "A" : simulatedFinal >= 70 ? "B+" :
    simulatedFinal >= 60 ? "B" : simulatedFinal >= 50 ? "C" : "F";

  // Attendance simulation
  const [missClasses, setMissClasses] = useState(0);
  const simAttendance = Math.round(
    (selectedSubject.attended_classes / (selectedSubject.total_classes + missClasses)) * 100
  );

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Academic Intelligence</h2>
            <p className="text-sm text-muted-foreground">AI-powered academic tracking, risk prediction & grade simulation</p>
          </div>

          {/* Academic Risk Scores */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Risk Score", value: academicRisk.risk_score, icon: AlertTriangle, color: academicRisk.risk_score > 50 ? "text-destructive" : "text-success", suffix: "/100" },
              { label: "Learning Velocity", value: academicRisk.learning_velocity, icon: Zap, color: "text-primary", suffix: "%" },
              { label: "Consistency", value: academicRisk.consistency_score, icon: Shield, color: "text-primary", suffix: "%" },
              { label: "Burnout Risk", value: academicRisk.burnout_probability, icon: Activity, color: academicRisk.burnout_probability > 50 ? "text-warning" : "text-success", suffix: "%" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-2xl bg-card shadow-card p-4 animate-fade-in">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent">
                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                  <span className="text-[11px] font-medium text-muted-foreground">{stat.label}</span>
                </div>
                <p className={`text-2xl font-extrabold ${stat.color}`}>
                  {stat.value}<span className="text-sm font-medium text-muted-foreground">{stat.suffix}</span>
                </p>
              </div>
            ))}
          </div>

          <div className="flex gap-6">
            {/* Subject list */}
            <div className="flex-1 min-w-0 space-y-4">
              <h3 className="text-lg font-bold text-foreground">Subject Attendance & Performance</h3>
              <div className="space-y-3">
                {subjects.map((sub) => (
                  <button
                    key={sub.id}
                    onClick={() => setSelectedSubject(sub)}
                    className={`w-full rounded-2xl bg-card shadow-card p-4 text-left transition-all hover:shadow-card-hover ${selectedSubject.id === sub.id ? "ring-2 ring-primary" : ""}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="text-sm font-bold text-foreground">{sub.name}</p>
                        <p className="text-xs text-muted-foreground">{sub.code} · {sub.instructor}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`rounded-lg px-2 py-1 text-[10px] font-bold ${
                          sub.risk_level === "safe" ? "bg-success/10 text-success" :
                          sub.risk_level === "warning" ? "bg-warning/10 text-warning" :
                          "bg-destructive/10 text-destructive"
                        }`}>
                          {sub.risk_level === "safe" ? "Safe" : sub.risk_level === "warning" ? "At Risk" : "Critical"}
                        </span>
                        {sub.grade && (
                          <span className="text-lg font-extrabold text-foreground">{sub.grade}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <div className="flex justify-between text-[11px] mb-1">
                          <span className="text-muted-foreground">Attendance</span>
                          <span className={`font-bold ${sub.attendance_pct >= 75 ? "text-success" : "text-destructive"}`}>{sub.attendance_pct}%</span>
                        </div>
                        <Progress
                          value={sub.attendance_pct}
                          className={`h-2 ${sub.attendance_pct >= 75 ? "[&>div]:bg-success" : "[&>div]:bg-destructive"}`}
                        />
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-muted-foreground">Internal</p>
                        <p className="text-sm font-bold text-foreground">{sub.internal_marks}/{sub.max_internal}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Right panel */}
            <div className="hidden xl:flex w-80 shrink-0 flex-col gap-5">
              {/* GPA Trend */}
              <div className="rounded-2xl bg-card shadow-card p-5 animate-fade-in">
                <h3 className="text-sm font-bold text-foreground mb-4">CGPA Trend</h3>
                <ResponsiveContainer width="100%" height={160}>
                  <AreaChart data={gradeTrends}>
                    <defs>
                      <linearGradient id="gpaGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="hsl(166, 60%, 45%)" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="hsl(166, 60%, 45%)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
                    <XAxis dataKey="semester" tick={{ fontSize: 10, fill: "hsl(220, 10%, 50%)" }} axisLine={false} tickLine={false} />
                    <YAxis domain={[6, 10]} tick={{ fontSize: 10, fill: "hsl(220, 10%, 50%)" }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12, border: "1px solid hsl(220,13%,91%)" }} />
                    <Area type="monotone" dataKey="gpa" stroke="hsl(166, 60%, 45%)" strokeWidth={2} fill="url(#gpaGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Grade Simulator */}
              <div className="rounded-2xl bg-card shadow-card p-5 animate-fade-in">
                <h3 className="text-sm font-bold text-foreground mb-3">Grade Simulator</h3>
                <p className="text-xs text-muted-foreground mb-3">
                  Subject: <span className="font-semibold text-foreground">{selectedSubject.name}</span>
                </p>
                <label className="text-xs text-muted-foreground">If I score in external exam:</label>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={simScore}
                  onChange={(e) => setSimScore(Number(e.target.value))}
                  className="w-full mt-1 accent-primary"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0</span><span className="font-bold text-foreground">{simScore}/100</span><span>100</span>
                </div>
                <div className="mt-3 rounded-xl bg-accent p-3 text-center">
                  <p className="text-[10px] text-muted-foreground">Predicted Final Grade</p>
                  <p className="text-3xl font-extrabold text-primary">{simulatedGrade}</p>
                  <p className="text-xs text-muted-foreground">{simulatedFinal}% overall</p>
                </div>
              </div>

              {/* Attendance Simulator */}
              <div className="rounded-2xl bg-card shadow-card p-5 animate-fade-in">
                <h3 className="text-sm font-bold text-foreground mb-3">Attendance Simulator</h3>
                <p className="text-xs text-muted-foreground mb-2">If I miss more classes in <span className="font-semibold text-foreground">{selectedSubject.code}</span>:</p>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={0}
                    max={10}
                    value={missClasses}
                    onChange={(e) => setMissClasses(Number(e.target.value))}
                    className="flex-1 accent-primary"
                  />
                  <span className="text-sm font-bold text-foreground w-12 text-right">{missClasses} classes</span>
                </div>
                <div className={`mt-3 rounded-xl p-3 text-center ${simAttendance >= 75 ? "bg-success/10" : "bg-destructive/10"}`}>
                  <p className="text-[10px] text-muted-foreground">Projected Attendance</p>
                  <p className={`text-3xl font-extrabold ${simAttendance >= 75 ? "text-success" : "text-destructive"}`}>{simAttendance}%</p>
                  <p className="text-xs text-muted-foreground">
                    {simAttendance >= 75 ? "You're safe ✓" : "⚠ Below minimum threshold"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
