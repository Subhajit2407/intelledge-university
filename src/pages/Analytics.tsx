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

export default function Analytics() {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Institutional Analytics</h2>
            <p className="text-sm text-muted-foreground">Enterprise-level insights, risk clustering & placement intelligence</p>
          </div>

          {/* Top stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Total Students", value: "460", icon: Users, color: "text-primary" },
              { label: "Placed Students", value: "272", icon: Target, color: "text-success" },
              { label: "Avg Package", value: "₹8.1L", icon: TrendingUp, color: "text-warning" },
              { label: "At-Risk Students", value: "38", icon: AlertTriangle, color: "text-destructive" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-2xl bg-card shadow-card p-4 animate-fade-in">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent">
                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                  <span className="text-[11px] font-medium text-muted-foreground">{stat.label}</span>
                </div>
                <p className="text-2xl font-extrabold text-foreground">{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Placement by department */}
            <div className="rounded-2xl bg-card shadow-card p-5 animate-fade-in">
              <h3 className="text-sm font-bold text-foreground mb-4">Placement Rate by Department</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={placementByDept}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
                  <XAxis dataKey="dept" tick={{ fontSize: 11, fill: "hsl(220, 10%, 50%)" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "hsl(220, 10%, 50%)" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12, border: "1px solid hsl(220,13%,91%)" }} />
                  <Bar dataKey="rate" fill="hsl(166, 60%, 45%)" radius={[6, 6, 0, 0]} name="Placement %" />
                  <Bar dataKey="avg_package" fill="hsl(38, 92%, 55%)" radius={[6, 6, 0, 0]} name="Avg Package (LPA)" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Attendance trend */}
            <div className="rounded-2xl bg-card shadow-card p-5 animate-fade-in">
              <h3 className="text-sm font-bold text-foreground mb-4">Monthly Attendance Trend</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={monthlyAttendance}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(220, 10%, 50%)" }} axisLine={false} tickLine={false} />
                  <YAxis domain={[60, 100]} tick={{ fontSize: 11, fill: "hsl(220, 10%, 50%)" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12, border: "1px solid hsl(220,13%,91%)" }} />
                  <Line type="monotone" dataKey="avg" stroke="hsl(166, 60%, 45%)" strokeWidth={2.5} dot={{ r: 4, fill: "hsl(166, 60%, 45%)" }} name="Avg Attendance %" />
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
