import { TrendingUp, TrendingDown, Target, Brain, Shield, Zap } from "lucide-react";

const stats = [
  {
    label: "Academic Score",
    value: "78",
    suffix: "/100",
    change: "+5",
    trend: "up" as const,
    icon: Brain,
  },
  {
    label: "Attendance",
    value: "82",
    suffix: "%",
    change: "-2",
    trend: "down" as const,
    icon: Shield,
  },
  {
    label: "Placement Ready",
    value: "64",
    suffix: "%",
    change: "+8",
    trend: "up" as const,
    icon: Target,
  },
  {
    label: "AI Copilot Tasks",
    value: "12",
    suffix: "",
    change: "+3",
    trend: "up" as const,
    icon: Zap,
  },
];

export function StatsCards() {
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
              className={`flex items-center gap-0.5 text-[11px] font-bold ${
                stat.trend === "up" ? "text-success" : "text-destructive"
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
