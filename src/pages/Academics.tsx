import { useState, useEffect } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { TopBar } from "@/components/dashboard/TopBar";
import { subjects as mockSubjects, gradeTrends, academicRisk } from "@/lib/mock-data";
import { AlertTriangle, TrendingUp, Brain, Zap, Shield, Activity, GraduationCap, Inbox } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Progress } from "@/components/ui/progress";

export default function Academics() {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<any>(null);
  const [simScore, setSimScore] = useState(70);
  const [missClasses, setMissClasses] = useState(0);

  useEffect(() => {
    // Load data from teacher's records if available (Dynamic fresh start)
    const teacherRecords = localStorage.getItem("teacher_student_records");
    const currentStudent = localStorage.getItem("student_profile_data");

    if (teacherRecords && currentStudent) {
      const student = JSON.parse(currentStudent);
      const records = JSON.parse(teacherRecords);
      const myRecord = records.find((r: any) => r.name === student.name || r.roll === student.roll);

      if (myRecord) {
        // Map simple teacher record to complex subject objects for simulation
        const dynamicSubjects = [
          {
            id: "s1",
            name: "Core Engineering Concepts",
            code: "CORE-301",
            instructor: "Dr. Smith (HOD)",
            total_classes: 60,
            attended_classes: Math.round((myRecord.attendance / 100) * 60),
            attendance_pct: parseInt(myRecord.attendance),
            credits: 4,
            grade: myRecord.score >= 9 ? "A+" : myRecord.score >= 8 ? "A" : "B",
            internal_marks: Math.round(myRecord.score * 5),
            max_internal: 50,
            risk_level: parseInt(myRecord.attendance) < 75 ? "danger" : "safe"
          },
          {
            id: "s2",
            name: "Technical Lab Proficiency",
            code: "LAB-302",
            instructor: "Prof. Wilson",
            total_classes: 24,
            attended_classes: Math.round((myRecord.attendance / 100) * 24),
            attendance_pct: parseInt(myRecord.attendance),
            credits: 2,
            grade: "A",
            internal_marks: 42,
            max_internal: 50,
            risk_level: "safe"
          },
          {
            id: "s3",
            name: "Professional Ethics & Communication",
            code: "HS-101",
            instructor: "Ms. Sarah",
            total_classes: 30,
            attended_classes: Math.round((myRecord.attendance / 100) * 30),
            attendance_pct: parseInt(myRecord.attendance),
            credits: 2,
            grade: "A+",
            internal_marks: 48,
            max_internal: 50,
            risk_level: "safe"
          }
        ];
        setSubjects(dynamicSubjects);
        setSelectedSubject(dynamicSubjects[0]);
      }
    }
  }, []);

  // Simulation logic with safety
  const simulatedFinal = selectedSubject
    ? Math.round(((selectedSubject.internal_marks / selectedSubject.max_internal * 100) * 0.5) + (simScore * 0.5))
    : 0;

  const simulatedGrade =
    simulatedFinal >= 90 ? "A+" : simulatedFinal >= 80 ? "A" : simulatedFinal >= 70 ? "B+" :
      simulatedFinal >= 60 ? "B" : simulatedFinal >= 50 ? "C" : "F";

  const simAttendance = selectedSubject
    ? Math.round((selectedSubject.attended_classes / (selectedSubject.total_classes + missClasses)) * 100)
    : 0;

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Academic Intelligence</h2>
            <p className="text-sm text-muted-foreground">AI-powered tracking initialized from institutional records</p>
          </div>

          {!selectedSubject ? (
            <div className="h-[60vh] flex flex-col items-center justify-center text-center space-y-4">
              <div className="p-6 rounded-full bg-accent/50 text-muted-foreground animate-pulse">
                <Inbox className="h-12 w-12" />
              </div>
              <div>
                <h3 className="text-xl font-black text-foreground">No Academic Data Found</h3>
                <p className="text-sm text-muted-foreground max-w-sm">Please ensure your teacher has uploaded your records or your profile setup is complete.</p>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "Risk Score", value: academicRisk.risk_score, icon: AlertTriangle, color: "text-success", suffix: "/100" },
                  { label: "Learning Velocity", value: academicRisk.learning_velocity, icon: Zap, color: "text-primary", suffix: "%" },
                  { label: "Consistency", value: academicRisk.consistency_score, icon: Shield, color: "text-primary", suffix: "%" },
                  { label: "Burnout Risk", value: academicRisk.burnout_probability, icon: Activity, color: "text-success", suffix: "%" },
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
                <div className="flex-1 min-w-0 space-y-4">
                  <h3 className="text-lg font-bold text-foreground">Active Performance Tracks</h3>
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
                            <span className={`rounded-lg px-2 py-1 text-[10px] font-bold ${sub.risk_level === "safe" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
                              }`}>
                              {sub.risk_level === "safe" ? "Verified" : "Attention Required"}
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

                <div className="hidden xl:flex w-80 shrink-0 flex-col gap-5">
                  <div className="rounded-2xl bg-card shadow-card p-5 animate-fade-in">
                    <h3 className="text-sm font-bold text-foreground mb-3">Grade Simulator</h3>
                    <p className="text-xs text-muted-foreground mb-3">
                      Subject: <span className="font-semibold text-foreground">{selectedSubject.name}</span>
                    </p>
                    <label className="text-xs text-muted-foreground">Simulate External Exam Score:</label>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={simScore}
                      onChange={(e) => setSimScore(Number(e.target.value))}
                      className="w-full mt-1 accent-primary"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>0</span><span className="font-bold text-foreground">{simScore}/100</span><span>100</span>
                    </div>
                    <div className="mt-3 rounded-xl bg-accent p-3 text-center">
                      <p className="text-[10px] text-muted-foreground">Predicted Final Grade</p>
                      <p className="text-3xl font-extrabold text-primary">{simulatedGrade}</p>
                      <p className="text-xs text-muted-foreground">{simulatedFinal}% overall</p>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-card shadow-card p-5 animate-fade-in">
                    <h3 className="text-sm font-bold text-foreground mb-3">Attendance Prediction</h3>
                    <div className={`mt-3 rounded-xl p-3 text-center ${simAttendance >= 75 ? "bg-success/10" : "bg-destructive/10"}`}>
                      <p className="text-[10px] text-muted-foreground">Institutional Integrity</p>
                      <p className={`text-3xl font-extrabold ${simAttendance >= 75 ? "text-success" : "text-destructive"}`}>{simAttendance}%</p>
                      <p className="text-xs text-muted-foreground">
                        {simAttendance >= 75 ? "Exam Eligible ✓" : "Low Attendance Alert"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
