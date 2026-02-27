import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, Target, Brain, Shield, Zap } from "lucide-react";

const initialStats = [
  {
    label: "Academic Score",
    value: "0.0",
    suffix: "/100",
    change: "+0",
    trend: "up" as const,
    icon: Brain,
  },
  {
    label: "Attendance",
    value: "0",
    suffix: "%",
    change: "+0",
    trend: "up" as const,
    icon: Shield,
  },
  {
    label: "Placement Ready",
    value: "0",
    suffix: "%",
    change: "+0",
    trend: "up" as const,
    icon: Target,
  },
  {
    label: "Active Projects",
    value: "0",
    suffix: "",
    change: "+0",
    trend: "up" as const,
    icon: Zap,
  },
];

export function StatsCards() {
  const [stats, setStats] = useState(initialStats);

  useEffect(() => {
    const studentData = JSON.parse(localStorage.getItem("student_profile_data") || "{}");
    const teacherRecords = JSON.parse(localStorage.getItem("teacher_student_records") || "[]");
    const myRecord = teacherRecords.find((r: any) => r.name === studentData.name || r.roll === studentData.roll);
    const projects = JSON.parse(localStorage.getItem("student_projects") || "[]");

    setStats([
      { ...initialStats[0], value: myRecord?.score || "0.0" },
      { ...initialStats[1], value: myRecord?.attendance || "0" },
      { ...initialStats[2], value: studentData.placementScore || "0" },
      { ...initialStats[3], value: projects.length.toString() },
    ]);
  }, []);
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <div
          key={stat.label}
          className="rounded-2xl bg-card shadow-card p-4 animate-fade-in transition-all hover:shadow-card-hover"
          style={{ animationDelay: `${i * 80}ms` }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent">
              <stat.icon className="h-4 w-4 text-accent-foreground" />
            </div>
            <span
              className={`flex items-center gap-0.5 text-[11px] font-bold ${stat.trend === "up" ? "text-success" : "text-destructive"
                }`}
            >
              {stat.trend === "up" ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              {stat.change}
            </span>
          </div>
          <p className="text-2xl font-extrabold text-foreground">
            {stat.value}
            <span className="text-sm font-medium text-muted-foreground">{stat.suffix}</span>
          </p>
          <p className="text-[11px] font-medium text-muted-foreground mt-0.5">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
