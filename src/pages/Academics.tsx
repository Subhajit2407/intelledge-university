import { useState, useEffect } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { TopBar } from "@/components/dashboard/TopBar";
import { AlertTriangle, TrendingUp, Zap, Shield, Activity, Inbox, ChevronRight, Info, Clock, BarChart2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function Academics() {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<any>(null);
  const [simScore, setSimScore] = useState(70);
  const [missClasses, setMissClasses] = useState(0);

  const loadAcademicData = () => {
    const teacherRecords = localStorage.getItem("teacher_student_records");
    const currentStudentRaw = localStorage.getItem("student_profile_data");

    if (teacherRecords && currentStudentRaw) {
      const student = JSON.parse(currentStudentRaw);
      const records = JSON.parse(teacherRecords);
      const myRecord = records.find((r: any) => (r.name === student.name || r.roll === student.roll));

      if (myRecord) {
        const actualSubjects = myRecord.subjects || [];
        const mappedSubjects = actualSubjects.map((s: any) => ({
          ...s,
          attendance_pct: s.totalClasses ? Math.round((s.attendedClasses / s.totalClasses) * 100) : 0,
          risk_level: (s.totalClasses && (s.attendedClasses / s.totalClasses) < 0.75) ? "danger" : "safe"
        }));

        setSubjects(mappedSubjects);
        if (mappedSubjects.length > 0 && !selectedSubject) {
          setSelectedSubject(mappedSubjects[0]);
        } else if (mappedSubjects.length === 0) {
          setSelectedSubject(null);
        }
      } else {
        setSubjects([]);
        setSelectedSubject(null);
      }
    } else {
      setSubjects([]);
      setSelectedSubject(null);
    }
  };

  useEffect(() => {
    loadAcademicData();
    window.addEventListener('storage', loadAcademicData);
    return () => window.removeEventListener('storage', loadAcademicData);
  }, []);

  const simulatedFinal = selectedSubject
    ? Math.round(((selectedSubject.internal_marks || 0) / (selectedSubject.max_internal || 100) * 100 * 0.5) + (simScore * 0.5))
    : 0;

  const simulatedGrade =
    simulatedFinal >= 90 ? "A+" : simulatedFinal >= 80 ? "A" : simulatedFinal >= 70 ? "B+" :
      simulatedFinal >= 60 ? "B" : simulatedFinal >= 50 ? "C" : "F";

  const simAttendance = (selectedSubject && selectedSubject.totalClasses)
    ? Math.round((selectedSubject.attendedClasses / (selectedSubject.totalClasses + missClasses)) * 100)
    : 0;

  return (
    <div className="flex h-screen overflow-hidden ios-bg">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto px-10 py-10 space-y-10 custom-scrollbar">
          <div className="flex items-end justify-between animate-in fade-in duration-700">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-slate-900">Academic Vault</h1>
              <p className="text-sm font-medium text-slate-500 mt-1">Intelligence synchronized via institutional ledger</p>
            </div>
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white rounded-2xl shadow-sm border border-slate-100">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Real-time Sync Active</span>
            </div>
          </div>

          {subjects.length === 0 ? (
            <div className="h-[65vh] flex flex-col items-center justify-center text-center">
              <div className="w-24 h-24 rounded-[2.5rem] bg-white flex items-center justify-center ios-shadow mb-8 animate-in zoom-in duration-700">
                <Inbox className="h-10 w-10 text-slate-300" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Fresh Academic Profile</h3>
              <p className="text-slate-500 max-w-sm font-medium leading-relaxed">
                Connect with your faculty to initialize your academic records. Once synchronized, your subjects and performance metrics will appear here.
              </p>
              <button
                onClick={() => window.location.href = '/dashboard'}
                className="mt-8 px-8 py-3 bg-[#0D2B1D] text-white rounded-2xl font-bold text-sm shadow-lg hover:scale-105 active:scale-95 transition-all"
              >
                Return to Command Center
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: "Risk Factor", value: "0", icon: AlertTriangle, color: "text-rose-500", bg: "bg-rose-50", suffix: "/100" },
                  { label: "Velocity", value: "0", icon: Zap, color: "text-[#007AFF]", bg: "bg-blue-50", suffix: "%" },
                  { label: "Consistency", value: "0", icon: Shield, color: "text-indigo-500", bg: "bg-indigo-50", suffix: "%" },
                  { label: "Burnout", value: "0", icon: Activity, color: "text-emerald-500", bg: "bg-emerald-50", suffix: "%" },
                ].map((stat, i) => (
                  <div key={stat.label}
                    className="ios-card group p-6 hover:shadow-[0_20px_60px_-20px_rgba(0,0,0,0.1)] transition-all duration-500 animate-in fade-in slide-in-from-bottom-4"
                    style={{ animationDelay: `${i * 100}ms` }}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`h-11 w-11 flex items-center justify-center rounded-2xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                        <stat.icon className="h-5 w-5" />
                      </div>
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-none">{stat.label}</span>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className={`text-3xl font-bold ${stat.color}`}>{stat.value}</span>
                      <span className="text-sm font-medium text-slate-400">{stat.suffix}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-8 pb-10">
                <div className="space-y-6">
                  <div className="flex items-center justify-between px-2">
                    <h3 className="text-xl font-bold text-slate-800">Master Performance Tracks</h3>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{subjects.length} Total Subjects</span>
                  </div>
                  <div className="space-y-4">
                    {subjects.map((sub, i) => (
                      <div
                        key={sub.id}
                        onClick={() => setSelectedSubject(sub)}
                        className={`group relative overflow-hidden ios-card transition-all duration-500 cursor-pointer p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 animate-in fade-in slide-in-from-bottom-8 ${selectedSubject?.id === sub.id ? "ring-2 ring-[#007AFF] shadow-xl" : ""
                          }`}
                        style={{ animationDelay: `${(i + 4) * 100}ms` }}
                      >
                        <div className="flex items-center gap-6">
                          <div className={`h-16 w-16 rounded-[1.25rem] flex items-center justify-center text-2xl font-bold transition-all group-hover:rotate-3 ${selectedSubject?.id === sub.id ? 'bg-[#007AFF] text-white shadow-[#007AFF]/20 shadow-lg' : 'bg-slate-100 text-slate-400'
                            }`}>
                            {sub.name[0]}
                          </div>
                          <div>
                            <h4 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                              {sub.name}
                              {selectedSubject?.id === sub.id && <ChevronRight className="h-4 w-4 text-[#007AFF]" />}
                            </h4>
                            <p className="text-sm font-medium text-slate-400 tracking-tight">{sub.code} · {sub.instructor}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-10">
                          <div className="w-32 hidden md:block">
                            <div className="flex justify-between text-[11px] mb-2 font-bold uppercase tracking-widest text-slate-400">
                              <span>Attendance</span>
                              <span className={sub.attendance_pct >= 75 ? "text-emerald-500" : "text-rose-500"}>{sub.attendance_pct}%</span>
                            </div>
                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full transition-all duration-1000 ${sub.attendance_pct >= 75 ? "bg-emerald-500" : "bg-rose-500"}`}
                                style={{ width: `${sub.attendance_pct}%` }}
                              />
                            </div>
                          </div>

                          <div className="text-right">
                            <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-1">Grade Point</p>
                            <p className="text-2xl font-black text-slate-900">{sub.grade || "—"}</p>
                          </div>

                          <div className="h-10 border-l border-slate-100 hidden md:block" />

                          <div className="h-12 w-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center hover:bg-white hover:shadow-sm transition-all group-hover:scale-105">
                            <BarChart2 className="h-5 w-5 text-slate-400" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  {selectedSubject && (
                    <>
                      <div className="ios-card p-8 animate-in slide-in-from-right-4">
                        <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                          <Info className="h-5 w-5 text-[#007AFF]" /> Intelligence Insight
                        </h3>

                        <div className="space-y-6">
                          <div className="p-5 rounded-[1.5rem] bg-emerald-50/50 border border-emerald-100/50">
                            <p className="text-xs font-bold text-emerald-700 uppercase tracking-widest mb-2">Grade Predictor</p>
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-3xl font-black text-emerald-600">{simulatedGrade}</p>
                                <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">{simulatedFinal}% Potential</p>
                              </div>
                              <div className="h-12 w-12 rounded-full border-4 border-emerald-500/20 border-t-emerald-500 flex items-center justify-center rotate-45">
                                <TrendingUp className="h-5 w-5 text-emerald-500 -rotate-45" />
                              </div>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div className="flex justify-between items-center px-1">
                              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Exam Simulation</label>
                              <span className="text-[11px] font-black text-slate-900">{simScore}%</span>
                            </div>
                            <input
                              type="range"
                              min={0}
                              max={100}
                              value={simScore}
                              onChange={(e) => setSimScore(Number(e.target.value))}
                              className="w-full h-1.5 bg-slate-100 rounded-full appearance-none cursor-pointer accent-[#007AFF]"
                            />
                            <p className="text-[10px] font-medium text-slate-400 leading-relaxed italic">
                              * Simulating final exam performance based on current internal score of {selectedSubject.internal_marks || 0}/{selectedSubject.max_internal || 100}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-[#0D2B1D] rounded-[2.5rem] p-8 ios-shadow text-white relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-emerald-500/20 transition-all duration-700" />
                        <h3 className="text-lg font-bold mb-6 flex items-center gap-2 relative z-10">
                          <Clock className="h-5 w-5 text-emerald-400" /> Efficiency Check
                        </h3>

                        <div className="space-y-5 relative z-10">
                          <div>
                            <div className="flex justify-between text-[11px] font-bold uppercase tracking-[0.2em] mb-3 text-emerald-400/80">
                              <span>Sync Integrity</span>
                              <span>{simAttendance}%</span>
                            </div>
                            <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-emerald-500 rounded-full transition-all duration-1000"
                                style={{ width: `${simAttendance}%` }}
                              />
                            </div>
                          </div>
                          <p className="text-sm font-medium text-emerald-100/70 leading-relaxed italic">
                            "Your attendance sync is {simAttendance >= 75 ? "stable" : "critical"}.
                            {simAttendance >= 75 ? " You are fully eligible for the upcoming examination cycle." : " Please contact your faculty to resolve low attendance records."}"
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
