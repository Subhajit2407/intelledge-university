import { useState, useEffect } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { TopBar } from "@/components/dashboard/TopBar";
import { WelcomeBanner } from "@/components/dashboard/WelcomeBanner";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { CourseCards } from "@/components/dashboard/CourseCards";
import { ActivityChart } from "@/components/dashboard/ActivityChart";
import { CalendarWidget } from "@/components/dashboard/CalendarWidget";
import { UpcomingTasks } from "@/components/dashboard/UpcomingTasks";
import { User, GraduationCap, Upload, Save, UserCheck, Database, Plus, Trash2, Edit2, Bell, BookOpen, AlertCircle, Send, CheckCircle2, Sparkles } from "lucide-react";
import IntellEdgeDB, { TeacherRecord } from "@/lib/db";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";

export default function Index() {
  const [role, setRole] = useState<string | null>(null);
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const [studentData, setStudentData] = useState<any>(null);
  const [teacherRecords, setTeacherRecords] = useState<any[]>([]);

  const [selectedForVault, setSelectedForVault] = useState<TeacherRecord | null>(null);
  const [alertTarget, setAlertTarget] = useState<string>("ALL");
  const [alertMessage, setAlertMessage] = useState("");

  const loadData = async () => {
    const records = await IntellEdgeDB.getRecords();
    setTeacherRecords(records);

    const savedRole = localStorage.getItem("intelledge_role");
    setRole(savedRole);

    const savedSetup = localStorage.getItem("student_setup_complete");
    setIsSetupComplete(savedSetup === "true");

    const savedStudent = localStorage.getItem("student_profile_data");
    if (savedStudent) setStudentData(JSON.parse(savedStudent));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleTeacherUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData) as any;
    await IntellEdgeDB.addRecord(data);
    toast.success("Student Synchronized", { description: `${data.name} is now in the master ledger.` });
    loadData();
    (e.target as HTMLFormElement).reset();
  };

  const deleteRecord = async (id: string) => {
    await IntellEdgeDB.deleteRecord(id);
    toast.error("Record Purged");
    loadData();
  };

  const handleSendAlert = async () => {
    if (!alertMessage) return;
    await IntellEdgeDB.sendAlert({
      title: "Faculty Alert",
      message: alertMessage,
      type: "warning",
      studentId: alertTarget
    });
    toast.success("Alert Broadcasted", { description: alertTarget === "ALL" ? "Sent to entire batch." : `Sent to ${alertTarget}.` });
    setAlertMessage("");
  };

  const handleAddSubject = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedForVault) return;
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData) as any;
    await IntellEdgeDB.addSubject(selectedForVault.id, {
      ...data,
      totalClasses: parseInt(data.totalClasses),
      attendedClasses: parseInt(data.attendedClasses),
      credits: parseInt(data.credits)
    });
    toast.success("Subject Added to Vault");
    loadData();
    (e.target as HTMLFormElement).reset();
  };

  const handleStudentSetup = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);
    const finalData = { ...data, profilePic: studentData?.profilePic };
    localStorage.setItem("student_profile_data", JSON.stringify(finalData));
    localStorage.setItem("student_setup_complete", "true");
    setIsSetupComplete(true);
    setStudentData(finalData);
  };

  if (role === "teacher") {
    const totalStudents = teacherRecords.length;
    const avgScore = totalStudents > 0 ? (teacherRecords.reduce((acc, r) => acc + parseFloat(r.score), 0) / totalStudents).toFixed(2) : "0.00";
    const lowAttendanceCount = teacherRecords.filter(r => parseInt(r.attendance) < 75).length;

    return (
      <div className="flex h-screen overflow-hidden bg-background">
        <Sidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <TopBar />
          <main className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-4 rounded-[2rem] gradient-primary text-white shadow-primary-glow">
                  <Database className="h-7 w-7" />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-foreground italic tracking-tight">Faculty Control Center</h2>
                  <p className="text-sm text-muted-foreground font-medium italic">Batch academic record management & intelligence sync</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="bg-card border border-border px-6 py-3 rounded-2xl shadow-sm">
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-none mb-1">Total Students</p>
                  <p className="text-xl font-black text-foreground">{totalStudents}</p>
                </div>
                <div className="bg-card border border-border px-6 py-3 rounded-2xl shadow-sm">
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-none mb-1">Avg. Batch CGPA</p>
                  <p className="text-xl font-black text-primary">{avgScore}</p>
                </div>
                <div className="bg-card border border-border px-6 py-3 rounded-2xl shadow-sm border-destructive/20">
                  <p className="text-[10px] font-black text-destructive/60 uppercase tracking-widest leading-none mb-1">Attendance Alerts</p>
                  <p className="text-xl font-black text-destructive">{lowAttendanceCount}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1 rounded-[2.5rem] bg-card border border-border p-8 shadow-card flex flex-col">
                <h3 className="text-sm font-black mb-6 flex items-center gap-2 uppercase tracking-widest">
                  <Plus className="h-4 w-4 text-primary" /> Register Student
                </h3>
                <form onSubmit={handleTeacherUpload} className="space-y-5 flex-1">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-black text-muted-foreground italic tracking-widest pl-1 opacity-60">Full Name</label>
                    <input name="name" required className="w-full rounded-2xl bg-background border border-border px-5 py-3 text-sm font-bold outline-none focus:ring-4 focus:ring-primary/10 transition-all" placeholder="Student Name" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-black text-muted-foreground italic tracking-widest pl-1 opacity-60">Roll Number</label>
                    <input name="roll" required className="w-full rounded-2xl bg-background border border-border px-5 py-3 text-sm font-bold outline-none focus:ring-4 focus:ring-primary/10 transition-all" placeholder="INT-2026-XXX" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-black text-muted-foreground italic tracking-widest pl-1 opacity-60">CGPA</label>
                      <input name="score" type="number" step="0.01" required className="w-full rounded-2xl bg-background border border-border px-5 py-3 text-sm font-bold outline-none focus:ring-4 focus:ring-primary/10" placeholder="0.0" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-black text-muted-foreground italic tracking-widest pl-1 opacity-60">Att. %</label>
                      <input name="attendance" type="number" required className="w-full rounded-2xl bg-background border border-border px-5 py-3 text-sm font-bold outline-none focus:ring-4 focus:ring-primary/10" placeholder="0" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-black text-muted-foreground italic tracking-widest pl-1 opacity-60">Semester</label>
                    <select name="semester" className="w-full rounded-2xl bg-background border border-border px-5 py-3 text-sm font-bold outline-none focus:ring-4 focus:ring-primary/10 transition-all">
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(s => <option key={s} value={s}>Semester {s}</option>)}
                    </select>
                  </div>
                  <button type="submit" className="w-full rounded-2xl gradient-primary py-4 text-xs font-black text-primary-foreground shadow-primary-glow flex items-center justify-center gap-2 hover:scale-[1.02] transition-all uppercase tracking-widest">
                    <Save className="h-4 w-4" /> Sync Record to Cloud
                  </button>
                </form>

                {/* Broadcast Alerts */}
                <div className="mt-8 pt-8 border-t border-border">
                  <h3 className="text-[10px] font-black mb-4 flex items-center gap-2 uppercase tracking-[0.2em] text-muted-foreground italic">
                    <Bell className="h-3 w-3" /> Neural Broadcast
                  </h3>
                  <div className="space-y-3">
                    <select
                      value={alertTarget}
                      onChange={(e) => setAlertTarget(e.target.value)}
                      className="w-full rounded-xl bg-background border border-border px-4 py-2 text-[10px] font-bold outline-none"
                    >
                      <option value="ALL">Entire Batch 2026</option>
                      {teacherRecords.map(r => <option key={r.id} value={r.roll}>{r.name} ({r.roll})</option>)}
                    </select>
                    <textarea
                      value={alertMessage}
                      onChange={(e) => setAlertMessage(e.target.value)}
                      placeholder="Enter urgent notification message..."
                      className="w-full rounded-xl bg-background border border-border p-4 text-xs font-medium outline-none min-h-[100px] resize-none focus:ring-2 focus:ring-primary/10"
                    />
                    <button
                      onClick={handleSendAlert}
                      className="w-full rounded-xl bg-foreground text-background py-3 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-foreground/90 transition-colors"
                    >
                      <Send className="h-3 w-3" /> Transmit Alert
                    </button>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2 rounded-[2.5rem] bg-card border border-border shadow-card overflow-hidden flex flex-col">
                <div className="p-8 border-b border-border bg-accent/10 flex justify-between items-center">
                  <h3 className="text-sm font-black text-foreground uppercase tracking-widest">Master Student Records (Batch 2026)</h3>
                  <button className="text-[10px] font-black text-primary hover:underline uppercase tracking-widest italic">Export CSV</button>
                </div>
                <div className="flex-1 overflow-y-auto">
                  {teacherRecords.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center p-12 text-center">
                      <div className="h-16 w-16 rounded-3xl bg-accent flex items-center justify-center mb-4">
                        <Database className="h-8 w-8 text-muted-foreground/30" />
                      </div>
                      <p className="text-sm font-bold text-muted-foreground italic">No student records synchronized.</p>
                      <p className="text-xs text-muted-foreground/60 mt-1 max-w-[200px]">Use the registry panel to add students and their academic metrics.</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-border">
                      {teacherRecords.map(record => (
                        <div key={record.id} className="p-6 flex flex-col gap-4 hover:bg-accent/5 transition-all group">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black text-lg shadow-sm group-hover:scale-110 transition-transform">{record.name[0]}</div>
                              <div>
                                <p className="font-black text-foreground text-sm tracking-tight">{record.name}</p>
                                <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.1em] italic opacity-60">ID: {record.roll} • SEMESTER {record.semester}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-8">
                              <div className="text-center min-w-[60px]">
                                <p className="text-[9px] font-black text-muted-foreground uppercase opacity-40 mb-1">Academic</p>
                                <p className="text-sm font-black text-foreground">{record.score} <span className="text-[10px] opacity-40">GPA</span></p>
                              </div>
                              <div className="text-center min-w-[80px]">
                                <p className="text-[9px] font-black text-muted-foreground uppercase opacity-40 mb-1">Attendance</p>
                                <p className={`text-sm font-black ${parseInt(record.attendance) < 75 ? 'text-destructive' : 'text-success'}`}>{record.attendance}%</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => setSelectedForVault(selectedForVault?.id === record.id ? null : record)}
                                  className={`p-2.5 rounded-xl transition-all ${selectedForVault?.id === record.id ? 'bg-primary text-white shadow-primary-glow' : 'bg-accent text-muted-foreground hover:text-primary'}`}
                                >
                                  <BookOpen className="h-3.5 w-3.5" />
                                </button>
                                <button onClick={() => deleteRecord(record.id)} className="p-2.5 rounded-xl bg-destructive/10 text-destructive hover:bg-destructive hover:text-white transition-all">
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Academic Vault Expandable */}
                          {selectedForVault?.id === record.id && (
                            <div className="mt-4 p-6 bg-accent/20 rounded-[2rem] border border-border/50 animate-in slide-in-from-top-4 duration-500">
                              <div className="flex items-center justify-between mb-6">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                                  <Sparkles className="h-3 w-3" /> Academic Intelligence Vault
                                </h4>
                                <span className="text-[10px] font-bold text-muted-foreground italic">Managing records for {record.name}</span>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                  <p className="text-[10px] font-black uppercase text-muted-foreground border-b border-border pb-2">Active Subjects</p>
                                  {(record.subjects || []).length === 0 ? (
                                    <p className="text-xs text-muted-foreground italic py-4">No subjects injected into vault.</p>
                                  ) : (
                                    <div className="space-y-3">
                                      {record.subjects?.map(s => (
                                        <div key={s.id} className="bg-card p-4 rounded-2xl border border-border shadow-sm flex items-center justify-between">
                                          <div>
                                            <p className="text-xs font-black text-foreground">{s.name}</p>
                                            <p className="text-[10px] text-muted-foreground uppercase font-bold">{s.code} · {s.credits} Credits</p>
                                          </div>
                                          <div className="text-right">
                                            <p className="text-xs font-black text-primary">{Math.round((s.attendedClasses / s.totalClasses) * 100)}%</p>
                                            <p className="text-[9px] text-muted-foreground uppercase font-bold">Attendance</p>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>

                                <div className="bg-card p-6 rounded-[2rem] border border-border shadow-sm">
                                  <p className="text-[10px] font-black uppercase text-muted-foreground mb-4">Inject New Subject Data</p>
                                  <form onSubmit={handleAddSubject} className="space-y-4">
                                    <input name="name" required placeholder="Subject Name" className="w-full rounded-xl bg-accent/50 border border-border px-4 py-2.5 text-xs font-bold outline-none" />
                                    <div className="grid grid-cols-2 gap-3">
                                      <input name="code" required placeholder="Code" className="w-full rounded-xl bg-accent/50 border border-border px-4 py-2.5 text-xs font-bold outline-none" />
                                      <input name="credits" type="number" required placeholder="Credits" className="w-full rounded-xl bg-accent/50 border border-border px-4 py-2.5 text-xs font-bold outline-none" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                      <input name="totalClasses" type="number" required placeholder="Total Classes" className="w-full rounded-xl bg-accent/50 border border-border px-4 py-2.5 text-xs font-bold outline-none" />
                                      <input name="attendedClasses" type="number" required placeholder="Attended" className="w-full rounded-xl bg-accent/50 border border-border px-4 py-2.5 text-xs font-bold outline-none" />
                                    </div>
                                    <button className="w-full rounded-xl bg-[#0D2B1D] text-white py-3 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg">
                                      <Plus className="h-3 w-3" /> Commit Subject
                                    </button>
                                  </form>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (role === "student" && !isSetupComplete) {
    return (
      <div className="flex h-screen overflow-hidden bg-background">
        <Sidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <TopBar />
          <main className="flex-1 overflow-y-auto px-8 py-6">
            <div className="max-w-2xl mx-auto space-y-8 animate-fade-in py-12">
              <div className="text-center">
                <div className="h-20 w-20 gradient-primary rounded-3xl mx-auto flex items-center justify-center shadow-primary-glow mb-6">
                  <GraduationCap className="h-10 w-10 text-white" />
                </div>
                <h2 className="text-3xl font-black text-foreground mb-2 italic">Student Profile Setup</h2>
                <p className="text-sm text-muted-foreground">Welcome to IntellEdge AI. Let's initialize your academic profile.</p>
              </div>

              <form onSubmit={handleStudentSetup} className="bg-card border border-border rounded-[3rem] p-10 shadow-2xl space-y-8">
                <div className="flex flex-col items-center">
                  <div className="relative group cursor-pointer">
                    <div className="h-24 w-24 rounded-[1.5rem] bg-accent border-2 border-dashed border-primary/30 flex items-center justify-center overflow-hidden group-hover:border-primary transition-colors">
                      {studentData?.profilePic ? (
                        <img src={studentData.profilePic} className="h-full w-full object-cover" />
                      ) : (
                        <Upload className="h-8 w-8 text-primary/50 group-hover:text-primary animate-bounce" />
                      )}
                    </div>
                    <input
                      type="file"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setStudentData({ ...studentData, profilePic: reader.result });
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                    <div className="absolute -bottom-1 -right-1 bg-foreground text-background p-1.5 rounded-full shadow-lg">
                      <Save className="h-3 w-3" />
                    </div>
                  </div>
                  <p className="text-[10px] font-black text-muted-foreground uppercase mt-4 tracking-widest">Upload Profile Picture</p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-black text-muted-foreground italic tracking-[0.2em]">Full Name</label>
                    <input name="name" required className="w-full rounded-2xl bg-background border border-border px-5 py-3.5 text-sm font-bold outline-none focus:ring-4 focus:ring-primary/10" placeholder="e.g. Arjun Sharma" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-black text-muted-foreground italic tracking-[0.2em]">Roll Code</label>
                    <input name="roll" required className="w-full rounded-2xl bg-background border border-border px-5 py-3.5 text-sm font-bold outline-none focus:ring-4 focus:ring-primary/10" placeholder="CSE-2023-442" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-black text-muted-foreground italic tracking-[0.2em]">Department</label>
                    <select name="department" className="w-full rounded-2xl bg-background border border-border px-5 py-3.5 text-sm font-bold outline-none focus:ring-4 focus:ring-primary/10">
                      <option>B.Tech CSE</option>
                      <option>B.Tech ECE</option>
                      <option>B.Tech ME</option>
                      <option>M.Tech AI</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-black text-muted-foreground italic tracking-[0.2em]">Semester</label>
                    <input name="semester" type="number" required className="w-full rounded-2xl bg-background border border-border px-5 py-3.5 text-sm font-bold outline-none focus:ring-4 focus:ring-primary/10" placeholder="e.g. 5" />
                  </div>
                </div>

                <button type="submit" className="w-full rounded-2xl gradient-primary py-5 text-sm font-black text-primary-foreground shadow-primary-glow flex items-center justify-center gap-3 hover:scale-[1.02] transition-all">
                  <UserCheck className="h-5 w-5" /> Initialize Intelligence Dashboard
                </button>
              </form>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto px-8 py-6">
          <div className="flex gap-6">
            <div className="flex-1 space-y-6 min-w-0">
              <WelcomeBanner />
              <StatsCards />
              <CourseCards />
              <ActivityChart />
            </div>
            <div className="hidden xl:flex w-72 shrink-0 flex-col gap-5">
              <CalendarWidget />
              <UpcomingTasks />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
