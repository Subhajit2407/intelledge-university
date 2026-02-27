import { Sidebar } from "@/components/dashboard/Sidebar";
import { TopBar } from "@/components/dashboard/TopBar";
import { departmentStats, monthlyAttendance, subjects, placementDrives, skillGaps } from "@/lib/mock-data";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, Users, Target, AlertTriangle } from "lucide-react";

const placementByDept = departmentStats.map((d) => ({
  ...d,
  rate: Math.round((d.placed / d.total) * 100),
}));

const riskDistribution = [
  { name: "Safe", value: subjects.filter((s) => s.risk_level === "safe").length, color: "hsl(152, 60%, 45%)" },
  { name: "Warning", value: subjects.filter((s) => s.risk_level === "warning").length, color: "hsl(38, 92%, 55%)" },
  { name: "Critical", value: subjects.filter((s) => s.risk_level === "danger").length, color: "hsl(0, 72%, 55%)" },
];

const ContributionGrid = () => {
  // Generate mock data for a year
  const days = 140; // 20 weeks
  const data = Array.from({ length: days }, (_, i) => ({
    day: i,
    level: Math.floor(Math.random() * 5), // 0 to 4
  }));

  const colors = [
    "bg-secondary/20",
    "bg-success/20",
    "bg-success/50",
    "bg-success/80",
    "bg-success"
  ];

  return (
    <div className="rounded-2xl bg-card border border-border p-6 shadow-xl animate-fade-in mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-foreground">Effort Intelligence Grid</h3>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">Daily system engagement & project activity</p>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-bold">
          <span>Less</span>
          <div className="flex gap-1">
            {colors.map(c => <div key={c} className={`h-2.5 w-2.5 rounded-sm ${c}`} />)}
          </div>
          <span>More</span>
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {data.map((d) => (
          <div
            key={d.day}
            className={`h-3 w-3 rounded-[2px] ${colors[d.level]} transition-all hover:scale-125 hover:shadow-primary-glow cursor-pointer relative group`}
          >
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-foreground text-background text-[9px] font-bold rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none transition-opacity z-50">
              Effort Level: {d.level}/4
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex justify-between text-[10px] text-muted-foreground font-bold uppercase italic tracking-tighter">
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
  const role = localStorage.getItem("intelledge_role");
  const studentDataStr = localStorage.getItem("student_profile_data");
  const studentData = studentDataStr ? JSON.parse(studentDataStr) : null;
  const teacherRecords = JSON.parse(localStorage.getItem("teacher_student_records") || "[]");

  const stats = role === "teacher"
    ? [
      { label: "Tracked Batch Size", value: teacherRecords.length.toString(), icon: Users, color: "text-primary" },
      { label: "Graduation Ready", value: teacherRecords.filter((r: any) => parseFloat(r.score) > 7.5).length.toString(), icon: Target, color: "text-success" },
      { label: "Batch Resilience", value: "88%", icon: TrendingUp, color: "text-warning" },
      { label: "Critical Alerts", value: teacherRecords.filter((r: any) => parseInt(r.attendance) < 75).length.toString(), icon: AlertTriangle, color: "text-destructive" },
    ]
    : [
      { label: "Current Semester", value: studentData?.semester || "5", icon: Users, color: "text-primary" },
      { label: "Placement Score", value: "840", icon: Target, color: "text-success" },
      { label: "Learning Rank", value: "#14", icon: TrendingUp, color: "text-warning" },
      { label: "Course Gaps", value: "2", icon: AlertTriangle, color: "text-destructive" },
    ];

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground tracking-tight">{role === "teacher" ? "Institutional Insights" : "Personal Intelligence"}</h2>
              <p className="text-sm text-muted-foreground">{role === "teacher" ? "Global batch performance and risk clustering" : "Individual growth trajectory and skill analysis"}</p>
            </div>
            <div className="flex items-center gap-1.5 bg-success/10 px-3 py-1.5 rounded-xl border border-success/20">
              <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
              <span className="text-[10px] font-black text-success uppercase tracking-widest">{role === "teacher" ? "Batch Active" : "Profile Synced"}</span>
            </div>
          </div>

          <ContributionGrid />

          {/* Top stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-2xl bg-card border border-border p-5 animate-fade-in group hover:border-primary/30 transition-all">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent group-hover:gradient-primary group-hover:text-primary-foreground transition-all">
                    <stat.icon className={`h-5 w-5 ${stat.color} group-hover:text-current`} />
                  </div>
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</span>
                </div>
                <p className="text-3xl font-black text-foreground">{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Placement by department */}
            <div className="rounded-2xl bg-card border border-border p-6 animate-fade-in">
              <h3 className="text-sm font-bold text-foreground mb-6 uppercase tracking-widest border-b border-border pb-2">Placement Analytics by Stream</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={placementByDept}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" vertical={false} />
                  <XAxis dataKey="dept" tick={{ fontSize: 10, fill: "hsl(220, 10%, 50%)", fontWeight: 700 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "hsl(220, 10%, 50%)", fontWeight: 700 }} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: 'hsl(var(--accent))' }} contentStyle={{ borderRadius: 16, fontSize: 12, border: "1px solid hsl(var(--border))", boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                  <Bar dataKey="rate" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Placement %" />
                  <Bar dataKey="avg_package" fill="hsl(var(--warning))" radius={[4, 4, 0, 0]} name="Avg Package (LPA)" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Attendance trend */}
            <div className="rounded-2xl bg-card border border-border p-6 animate-fade-in">
              <h3 className="text-sm font-bold text-foreground mb-6 uppercase tracking-widest border-b border-border pb-2">Academic Attendance Clustering</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={monthlyAttendance}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 10, fill: "hsl(220, 10%, 50%)", fontWeight: 700 }} axisLine={false} tickLine={false} />
                  <YAxis domain={[60, 100]} tick={{ fontSize: 10, fill: "hsl(220, 10%, 50%)", fontWeight: 700 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 16, fontSize: 12, border: "1px solid hsl(var(--border))", boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                  <Line type="monotone" dataKey="avg" stroke="hsl(var(--primary))" strokeWidth={4} dot={{ r: 6, fill: "hsl(var(--primary))", strokeWidth: 2, stroke: "white" }} name="Avg Attendance %" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Skill gap radar */}
            <div className="rounded-2xl bg-card shadow-card p-5 animate-fade-in">
              <h3 className="text-sm font-bold text-foreground mb-4">Batch Skill Gap Analysis</h3>
              <ResponsiveContainer width="100%" height={250}>
                <RadarChart data={skillGaps}>
                  <PolarGrid stroke="hsl(220, 13%, 91%)" />
                  <PolarAngleAxis dataKey="skill" tick={{ fontSize: 10, fill: "hsl(220, 10%, 50%)" }} />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 9, fill: "hsl(220, 10%, 50%)" }} />
                  <Radar dataKey="current" stroke="hsl(166, 60%, 45%)" fill="hsl(166, 60%, 45%)" fillOpacity={0.2} name="Current" />
                  <Radar dataKey="required" stroke="hsl(0, 72%, 55%)" fill="hsl(0, 72%, 55%)" fillOpacity={0.1} name="Required" strokeDasharray="4 4" />
                  <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12, border: "1px solid hsl(220,13%,91%)" }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Risk distribution */}
            <div className="rounded-2xl bg-card shadow-card p-5 animate-fade-in">
              <h3 className="text-sm font-bold text-foreground mb-4">Academic Risk Distribution</h3>
              <div className="flex items-center gap-8">
                <ResponsiveContainer width="50%" height={200}>
                  <PieChart>
                    <Pie data={riskDistribution} innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value">
                      {riskDistribution.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12, border: "1px solid hsl(220,13%,91%)" }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-3">
                  {riskDistribution.map((r) => (
                    <div key={r.name} className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full" style={{ background: r.color }} />
                      <span className="text-sm font-semibold text-foreground">{r.name}</span>
                      <span className="text-sm text-muted-foreground">({r.value} subjects)</span>
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
