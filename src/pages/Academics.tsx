import { useState, useEffect } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { TopBar } from "@/components/dashboard/TopBar";
import { AlertTriangle, TrendingUp, Zap, Shield, Activity, Inbox, ChevronRight, Info, Clock, BarChart2, Database, Sparkles, Trophy } from "lucide-react";

export default function Academics() {
  const role = localStorage.getItem("intelledge_role");
  const [subjects, setSubjects] = useState<any[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<any>(null);
  const [simScore, setSimScore] = useState(70);
  const [missClasses, setMissClasses] = useState(0);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const loadAcademicData = () => {
    const teacherRecordsRaw = localStorage.getItem("teacher_student_records");
    const currentStudentRaw = localStorage.getItem("student_profile_data");

    if (role === 'teacher') {
      const records = teacherRecordsRaw ? JSON.parse(teacherRecordsRaw) : [];
      if (records.length > 0) {
        // Mocking aggregate data if it's a teacher
        setSubjects([
          { id: '1', name: 'Batch-A (CSE)', code: 'BTECH-2026', attendance_pct: 82, grade: 'B+', instructor: 'Dr. Neural' },
          { id: '2', name: 'Batch-B (CSE)', code: 'BTECH-2026', attendance_pct: 68, grade: 'C', instructor: 'Dr. Sync' }
        ]);
        setIsDataLoaded(true);
      } else {
        setSubjects([]);
        setIsDataLoaded(false);
      }
      return;
    }

    if (teacherRecordsRaw && currentStudentRaw) {
      const student = JSON.parse(currentStudentRaw);
      const records = JSON.parse(teacherRecordsRaw);
      const myRecord = records.find((r: any) => (r.name === student.name || r.roll === student.roll));

      if (myRecord && myRecord.subjects && myRecord.subjects.length > 0) {
        const actualSubjects = myRecord.subjects || [];
        const mappedSubjects = actualSubjects.map((s: any) => ({
          ...s,
          attendance_pct: s.totalClasses ? Math.round((s.attendedClasses / s.totalClasses) * 100) : 0,
          risk_level: (s.totalClasses && (s.attendedClasses / s.totalClasses) < 0.75) ? "danger" : "safe"
        }));

        setSubjects(mappedSubjects);
        setIsDataLoaded(true);
        if (mappedSubjects.length > 0 && !selectedSubject) {
          setSelectedSubject(mappedSubjects[0]);
        }
      } else {
        setSubjects([]);
        setIsDataLoaded(false);
        setSelectedSubject(null);
      }
    } else {
      setSubjects([]);
      setIsDataLoaded(false);
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
              <h1 className="text-4xl font-bold tracking-tight text-slate-900">
                {role === 'teacher' ? 'Faculty Insight Center' : 'Academic Vault'}
              </h1>
              <p className="text-sm font-medium text-slate-500 mt-1">
                {role === 'teacher'
                  ? 'Aggregate institutional metrics and batch performance ledger'
                  : 'Intelligence synchronized via institutional ledger'}
              </p>
            </div>
            {isDataLoaded && (
              <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white rounded-2xl shadow-sm border border-slate-100">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  {role === 'teacher' ? 'Master Ledger Active' : 'Real-time Sync Active'}
                </span>
              </div>
            )}
          </div>

          {!isDataLoaded ? (
            <div className="h-[70vh] flex flex-col items-center justify-center text-center">
              <div className="relative mb-10">
                <div className="absolute inset-0 bg-primary/10 blur-3xl rounded-full scale-150 animate-pulse-slow" />
                <div className="relative w-28 h-28 rounded-[2.5rem] bg-white flex items-center justify-center ios-shadow animate-in zoom-in duration-1000">
                  <Database className="h-10 w-10 text-slate-200" />
                </div>
                <div className="absolute -bottom-2 -right-2 h-10 w-10 bg-[#0D2B1D] rounded-2xl flex items-center justify-center shadow-lg animate-bounce">
                  <Sparkles className="h-5 w-5 text-emerald-400" />
                </div>
              </div>

              <h3 className="text-2xl font-bold text-slate-900 mb-3 tracking-tight">
                {role === 'teacher' ? 'Initialize Batch Vault' : 'Sync Your Academic DNA'}
              </h3>
              <p className="text-slate-500 max-w-sm font-medium leading-relaxed px-4">
                {role === 'teacher'
                  ? 'No institutional data has been pushed to the vault. Start by uploading student records in the Faculty Control Center.'
                  : 'No academic records found in the vault. Complete your profile setup and wait for the institutional sync to initialize your intelligence dashboard.'}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mt-12">
                <button
                  onClick={() => window.location.href = '/dashboard'}
                  className="px-10 py-4 bg-[#0D2B1D] text-white rounded-2xl font-bold text-sm shadow-[0_10px_30px_rgba(13,43,29,0.3)] hover:scale-105 active:scale-95 transition-all"
                >
                  Go to Control Center
                </button>
              </div>


              <div className="mt-20 pt-10 border-t border-slate-100/50 w-full max-w-lg">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">Security & Synchronization Protocol</p>
                <div className="grid grid-cols-3 gap-6">
                  {[
                    { icon: Shield, label: "Encrypted" },
                    { icon: Zap, label: "Real-time" },
                    { icon: Info, label: "Verified" }
                  ].map((item, i) => (
                    <div key={i} className="flex flex-col items-center gap-2 opacity-30">
                      <item.icon className="h-5 w-5 text-slate-900" />
                      <span className="text-[10px] font-bold text-slate-900 uppercase tracking-wider">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Stats Row - Only show values if data exists */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: "Risk Factor", value: subjects.some(s => s.attendance_pct < 75) ? "High" : "Low", icon: AlertTriangle, color: subjects.some(s => s.attendance_pct < 75) ? "text-rose-500" : "text-emerald-500", bg: subjects.some(s => s.attendance_pct < 75) ? "bg-rose-50" : "bg-emerald-50" },
                  { label: "Velocity", value: "Optimal", icon: Zap, color: "text-[#007AFF]", bg: "bg-blue-50" },
                  { label: "Consistency", value: "92%", icon: Shield, color: "text-indigo-500", bg: "bg-indigo-50" },
                  { label: "Burnout", value: "Low", icon: Activity, color: "text-amber-500", bg: "bg-amber-50" },
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
                      <span className={`text-2xl font-bold ${stat.color}`}>{stat.value}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-8 pb-10">
                <div className="space-y-6">
                  <div className="flex items-center justify-between px-2">
                    <h3 className="text-xl font-bold text-slate-800 tracking-tight">Master Performance Tracks</h3>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{subjects.length} Synchronized Elements</span>
                  </div>
                  <div className="space-y-4">
                    {subjects.map((sub, i) => (
                      <div
                        key={sub.id}
                        onClick={() => setSelectedSubject(sub)}
                        className={`group relative overflow-hidden ios-card transition-all duration-500 cursor-pointer p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 animate-in fade-in slide-in-from-bottom-8 ${selectedSubject?.id === sub.id ? "ring-2 ring-[#007AFF] shadow-[0_30px_60px_-15px_rgba(0,122,255,0.15)]" : "hover:bg-slate-50/50"
                          }`}
                        style={{ animationDelay: `${(i) * 80}ms` }}
                      >
                        {selectedSubject?.id === sub.id && (
                          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#007AFF]" />
                        )}
                        <div className="flex items-center gap-6">
                          <div className={`h-16 w-16 rounded-[1.25rem] flex items-center justify-center text-2xl font-bold transition-all group-hover:rotate-3 ${selectedSubject?.id === sub.id ? 'bg-[#1C1C1E] text-white' : 'bg-slate-100 text-slate-400'
                            }`}>
                            {sub.name[0]}
                          </div>
                          <div>
                            <h4 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                              {sub.name}
                            </h4>
                            <p className="text-sm font-medium text-slate-400 tracking-tight">{sub.code} · {sub.instructor || "Assigned Faculty"}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-10">
                          <div className="w-40 hidden md:block">
                            <div className="flex justify-between text-[11px] mb-2 font-bold uppercase tracking-widest text-slate-400">
                              <span>Attendance Integrity</span>
                              <span className={sub.attendance_pct >= 75 ? "text-emerald-500" : "text-rose-500"}>{sub.attendance_pct}%</span>
                            </div>
                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full transition-all duration-1000 ${sub.attendance_pct >= 75 ? "bg-emerald-500" : "bg-rose-500"}`}
                                style={{ width: `${sub.attendance_pct}%` }}
                              />
                            </div>
                          </div>

                          <div className="text-right min-w-[80px]">
                            <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-1">Grade Point</p>
                            <p className="text-2xl font-black text-slate-900 tracking-tighter">{sub.grade || "—"}</p>
                          </div>

                          <div className="h-10 border-l border-slate-100 hidden md:block" />

                          <div className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-all ${selectedSubject?.id === sub.id ? "bg-[#007AFF]/10 text-[#007AFF]" : "bg-slate-50 text-slate-300 group-hover:text-slate-500"}`}>
                            <BarChart2 className="h-5 w-5" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  {selectedSubject && (
                    <>
                      <div className="ios-card p-8 animate-in slide-in-from-right-4 border-[#007AFF]/10">
                        <h3 className="text-lg font-bold text-slate-900 mb-8 flex items-center gap-3">
                          <div className="h-10 w-10 flex items-center justify-center bg-blue-50 text-[#007AFF] rounded-2xl">
                            <Info className="h-5 w-5" />
                          </div>
                          Intelligence Insight
                        </h3>

                        <div className="space-y-8">
                          <div className="p-6 rounded-[2rem] bg-emerald-50 text-emerald-900 border border-emerald-100 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 rotate-12 group-hover:rotate-0 transition-transform">
                              <Trophy className="h-16 w-16" />
                            </div>
                            <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] mb-3">Grade Projection</p>
                            <div className="flex items-center justify-between relative z-10">
                              <div>
                                <p className="text-4xl font-black text-[#0D2B1D] tracking-tighter">{simulatedGrade}</p>
                                <p className="text-[10px] font-bold text-emerald-600 mt-1">{simulatedFinal}% Neural Probability</p>
                              </div>
                              <div className="h-14 w-14 rounded-full border-4 border-emerald-200 border-t-emerald-500 flex items-center justify-center rotate-45">
                                <TrendingUp className="h-6 w-6 text-emerald-500 -rotate-45" />
                              </div>
                            </div>
                          </div>

                          <div className="space-y-5">
                            <div className="flex justify-between items-center px-1">
                              <div>
                                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Exam Simulation</label>
                                <p className="text-[9px] text-slate-400 font-medium italic">Adjust predicted exam score</p>
                              </div>
                              <span className="text-[11px] font-black text-slate-900 bg-slate-100 px-2 py-1 rounded-lg">{simScore}%</span>
                            </div>
                            <input
                              type="range"
                              min={0}
                              max={100}
                              value={simScore}
                              onChange={(e) => setSimScore(Number(e.target.value))}
                              className="w-full h-1.5 bg-slate-100 rounded-full appearance-none cursor-pointer accent-[#007AFF]"
                            />
                            <div className="p-4 rounded-xl bg-slate-50 text-[10px] font-medium text-slate-500 leading-relaxed italic border border-slate-100">
                              Neural projection based on internal metrics: <span className="font-bold text-slate-900">{selectedSubject.internal_marks || 0}/{selectedSubject.max_internal || 100}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-[#0D2B1D] rounded-[2.5rem] p-10 shadow-2xl text-white relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full -mr-24 -mt-24 blur-3xl" />
                        <h3 className="text-lg font-bold mb-8 flex items-center gap-3">
                          <div className="h-10 w-10 flex items-center justify-center bg-white/10 text-emerald-400 rounded-2xl">
                            <Clock className="h-5 w-5" />
                          </div>
                          Attendance Audit
                        </h3>

                        <div className="space-y-6 relative z-10">
                          <div>
                            <div className="flex justify-between text-[11px] font-bold uppercase tracking-[0.2em] mb-4 text-emerald-400/80">
                              <span>Sync Integrity</span>
                              <span>{simAttendance}%</span>
                            </div>
                            <div className="h-2.5 w-full bg-white/10 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-emerald-500 rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                                style={{ width: `${simAttendance}%` }}
                              />
                            </div>
                          </div>
                          <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                            <p className="text-xs font-medium text-emerald-100/70 leading-relaxed italic">
                              "Your attendance sync is <span className={`font-black uppercase tracking-widest ${simAttendance >= 75 ? "text-emerald-400" : "text-rose-400"}`}>{simAttendance >= 75 ? "stable" : "critical"}</span>.
                              {simAttendance >= 75 ? " Full eligibility confirmed for final assessment cycle." : " High risk detected. Immediate faculty intervention required."}"
                            </p>
                          </div>
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
      <style>{`
        @keyframes pulseS { 0%, 100% { opacity: 0.1; } 50% { opacity: 0.2; } }
        .animate-pulse-slow { animation: pulseS 4s ease-in-out infinite; }
      `}</style>
    </div>
  );
}
