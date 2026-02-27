import { useEffect, useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { TopBar } from "@/components/dashboard/TopBar";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, Users, Target, AlertTriangle, Sparkles } from "lucide-react";

const ContributionGrid = () => {
  // Generate random activity for a "vibrant" feel or zeros for fresh
  const days = 140;
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    // Check if we have any data to justify "vibrancy"
    const hasProjects = !!localStorage.getItem("student_projects");
    const gridData = Array.from({ length: days }, (_, i) => ({
      day: i,
      level: hasProjects ? Math.floor(Math.random() * 5) : 0,
    }));
    setData(gridData);
  }, []);

  const colors = [
    "bg-[#ebedf0]", // GitHub Level 0
    "bg-[#9be9a8]", // GitHub Level 1
    "bg-[#40c463]", // GitHub Level 2
    "bg-[#30a14e]", // GitHub Level 3
    "bg-[#216e39]"  // GitHub Level 4
  ];

  return (
    <div className="rounded-[2.5rem] bg-white border border-slate-100 p-8 shadow-[0_20px_50px_rgba(0,0,0,0.03)] animate-fade-in mb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-emerald-500" /> Neural Engagement Ledger
          </h3>
          <p className="text-xs text-slate-400 font-medium uppercase tracking-widest mt-1">Cross-platform activity & contribution heat-map</p>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
          <span>Less</span>
          <div className="flex gap-1 px-1">
            {colors.map(c => <div key={c} className={`h-3 w-3 rounded-[2px] ${c}`} />)}
          </div>
          <span>More</span>
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5 justify-center md:justify-start">
        {data.map((d) => (
          <div
            key={d.day}
            className={`h-3.5 w-3.5 rounded-[2px] ${colors[d.level]} transition-all hover:scale-150 hover:z-10 hover:shadow-lg cursor-crosshair relative group`}
          >
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-slate-900 text-white text-[10px] font-bold rounded-lg opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none transition-all z-50 shadow-xl border border-slate-700">
              {d.level} Cognitive Pulses recorded
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 flex justify-between text-[10px] text-slate-400 font-bold uppercase tracking-widest px-2">
        <span>Aug 2025</span>
        <span>Sep</span>
        <span>Oct</span>
        <span>Nov</span>
        <span>Dec</span>
        <span>Jan</span>
        <span>Feb 2026</span>
      </div>
    </div>
  );
};

export default function Analytics() {
  const [role, setRole] = useState<string | null>(null);
  const [stats, setStats] = useState<any[]>([]);
  const [deptData, setDeptData] = useState<any[]>([]);
  const [riskData, setRiskData] = useState<any[]>([]);
  const [trendData, setTrendData] = useState<any[]>([]);
  const [skillData, setSkillData] = useState<any[]>([]);

  useEffect(() => {
    const savedRole = localStorage.getItem("intelledge_role");
    setRole(savedRole);

    const studentDataStr = localStorage.getItem("student_profile_data");
    const studentData = studentDataStr ? JSON.parse(studentDataStr) : null;
    const teacherRecords = JSON.parse(localStorage.getItem("teacher_student_records") || "[]");

    // Dynamic Stats Logic
    if (savedRole === "teacher") {
      const criticallyLow = teacherRecords.filter((r: any) => parseInt(r.attendance) < 75).length;
      setStats([
        { label: "Managed Cohort", value: teacherRecords.length, icon: Users, color: "text-blue-500" },
        { label: "Apex Performers", value: teacherRecords.filter((r: any) => parseFloat(r.score) > 8.5).length, icon: Target, color: "text-emerald-500" },
        { label: "Mean Resilience", value: "82%", icon: TrendingUp, color: "text-indigo-500" },
        { label: "Anomalies detected", value: criticallyLow, icon: AlertTriangle, color: "text-rose-500" },
      ]);

      // Dept Data
      const cse_count = teacherRecords.length; // Simplified
      setDeptData([
        { dept: 'CSE', total: cse_count, rate: cse_count > 0 ? 85 : 0, avg_package: 12 },
        { dept: 'ECE', total: 0, rate: 0, avg_package: 0 },
        { dept: 'ME', total: 0, rate: 0, avg_package: 0 },
      ]);

      setRiskData([
        { name: "Safe", value: teacherRecords.length - criticallyLow, color: "#10b981" },
        { name: "Warning", value: criticallyLow, color: "#f59e0b" },
        { name: "Critical", value: 0, color: "#ef4444" },
      ]);
    } else {
      setStats([
        { label: "Active Semester", value: studentData?.semester || "N/A", icon: Users, color: "text-blue-500" },
        { label: "Competency Index", value: "0", icon: Target, color: "text-emerald-500" },
        { label: "Global Rank", value: "N/A", icon: TrendingUp, color: "text-indigo-500" },
        { label: "System Syncs", value: "Active", icon: AlertTriangle, color: "text-rose-500" },
      ]);

      setDeptData([
        { dept: 'Personal', total: 100, rate: 70, avg_package: 0 },
        { dept: 'Goal', total: 100, rate: 90, avg_package: 0 },
      ]);

      const myRecord = teacherRecords.find((r: any) => r.name === studentData?.name);
      const att = myRecord ? parseInt(myRecord.attendance) : 0;

      setRiskData([
        { name: "Attendance", value: att, color: att >= 75 ? "#10b981" : "#ef4444" },
        { name: "Remaining", value: 100 - att, color: "#f1f5f9" },
      ]);
    }

    setTrendData([
      { month: "Jan", avg: 82 }, { month: "Feb", avg: 85 }, { month: "Mar", avg: 88 }
    ]);

    setSkillData([
      { skill: "Logic", current: 75, required: 90 },
      { skill: "Design", current: 60, required: 80 },
      { skill: "Systems", current: 40, required: 70 }
    ]);

  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-[#F8FAFC]">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto px-10 py-10 space-y-10 custom-scrollbar">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tight">
                {role === "teacher" ? "Institutional Analytics" : "Neural Growth Progress"}
              </h2>
              <p className="text-sm font-medium text-slate-400 mt-2 italic">Quantifying academic potential through real-time telemetry</p>
            </div>
            <div className="flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-2xl border border-emerald-100">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Analytics Engine Active</span>
            </div>
          </div>

          <ContributionGrid />

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <div key={stat.label}
                className="rounded-[2.5rem] bg-white border border-slate-100 p-8 shadow-sm hover:shadow-xl transition-all duration-500 group animate-in slide-in-from-bottom-4"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 ${stat.color} group-hover:scale-110 transition-transform`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</span>
                </div>
                <p className="text-4xl font-black text-slate-900">{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-10">
            <div className="rounded-[2.5rem] bg-white border border-slate-100 p-8 shadow-sm">
              <h3 className="text-sm font-black text-slate-900 mb-8 uppercase tracking-[0.2em] border-b border-slate-50 pb-4">Cohort Distribution Velocity</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={deptData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="dept" tick={{ fontSize: 10, fill: "#94a3b8", fontWeight: 700 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "#94a3b8", fontWeight: 700 }} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: 24, padding: 16, border: "none", boxShadow: '0 25px 50px -12px rgba(0,0,0,0.1)' }} />
                  <Bar dataKey="rate" fill="#007AFF" radius={[12, 12, 0, 0]} name="Progress %" />
                  <Bar dataKey="avg_package" fill="#0D2B1D" radius={[12, 12, 0, 0]} name="Package Index" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="rounded-[2.5rem] bg-white border border-slate-100 p-8 shadow-sm">
              <h3 className="text-sm font-black text-slate-900 mb-8 uppercase tracking-[0.2em] border-b border-slate-50 pb-4">Academic Integrity Clustering</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#94a3b8", fontWeight: 700 }} axisLine={false} tickLine={false} />
                  <YAxis domain={[60, 100]} tick={{ fontSize: 10, fill: "#94a3b8", fontWeight: 700 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 24, padding: 16, border: "none", boxShadow: '0 25px 50px -12px rgba(0,0,0,0.1)' }} />
                  <Line type="monotone" dataKey="avg" stroke="#007AFF" strokeWidth={5} dot={{ r: 8, fill: "#007AFF", strokeWidth: 4, stroke: "white" }} name="Avg Integrity %" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="rounded-[2.5rem] bg-white border border-slate-100 p-8 shadow-sm">
              <h3 className="text-sm font-black text-slate-900 mb-6 uppercase tracking-widest">Competency Radar Index</h3>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={skillData}>
                  <PolarGrid stroke="#f1f5f9" />
                  <PolarAngleAxis dataKey="skill" tick={{ fontSize: 10, fill: "#64748b", fontWeight: 700 }} />
                  <Radar dataKey="current" stroke="#007AFF" fill="#007AFF" fillOpacity={0.15} strokeWidth={3} name="Current Baseline" />
                  <Radar dataKey="required" stroke="#ef4444" fill="#ef4444" fillOpacity={0.05} strokeDasharray="5 5" name="Target Objective" />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            <div className="rounded-[2.5rem] bg-white border border-slate-100 p-8 shadow-sm">
              <h3 className="text-sm font-black text-slate-900 mb-6 uppercase tracking-widest">Profile Criticality Risk</h3>
              <div className="flex items-center gap-12">
                <ResponsiveContainer width="50%" height={220}>
                  <PieChart>
                    <Pie data={riskData} innerRadius={60} outerRadius={90} paddingAngle={8} dataKey="value">
                      {riskData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: 16, border: "none" }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-4">
                  {riskData.map((r) => (
                    <div key={r.name} className="flex items-center gap-3">
                      <span className="h-3 w-3 rounded-full" style={{ background: r.color }} />
                      <div>
                        <p className="text-xs font-black text-slate-900 uppercase tracking-widest leading-none">{r.name}</p>
                        <p className="text-[10px] text-slate-400 font-bold mt-1">Status Verified</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
