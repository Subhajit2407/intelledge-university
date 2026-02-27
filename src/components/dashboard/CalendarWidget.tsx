import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const today = new Date();

export function CalendarWidget() {
  const [month] = useState(today.getMonth());
  const [year] = useState(today.getFullYear());
  const [eventDays, setEventDays] = useState<number[]>([]);

  useEffect(() => {
    // Try to get events from projects or alerts
    const alerts = JSON.parse(localStorage.getItem("intelledge_alerts") || "[]");
    const projects = JSON.parse(localStorage.getItem("student_projects") || "[]");

    const days: number[] = [];

    alerts.forEach((a: any) => {
      const d = new Date(a.timestamp);
      if (d.getMonth() === month && d.getFullYear() === year) {
        days.push(d.getDate());
      }
    });

    projects.forEach((p: any) => {
      const d = new Date(p.endDate);
      if (d.getMonth() === month && d.getFullYear() === year) {
        days.push(d.getDate());
      }
    });

    setEventDays([...new Set(days)]);
  }, [month, year]);

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthName = new Date(year, month).toLocaleString("default", { month: "long" });

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div className="rounded-2xl bg-card shadow-card p-5 animate-fade-in" style={{ animationDelay: "200ms" }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-foreground">
          {monthName} {year}
        </h3>
        <div className="flex gap-1">
          <button className="rounded-lg bg-secondary p-1.5 text-muted-foreground hover:text-foreground transition-colors">
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
          <button className="rounded-lg bg-secondary p-1.5 text-muted-foreground hover:text-foreground transition-colors">
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {DAYS.map((d) => (
          <div key={d} className="py-1 text-[10px] font-semibold text-muted-foreground">
            {d}
          </div>
        ))}
        {cells.map((day, i) => {
          const isToday = day === today.getDate();
          const hasEvent = day !== null && eventDays.includes(day);
          return (
            <div
              key={i}
              className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-medium transition-colors mx-auto ${isToday
                  ? "gradient-primary text-primary-foreground shadow-primary-glow"
                  : hasEvent
                    ? "bg-accent text-accent-foreground font-bold"
                    : day
                      ? "text-foreground hover:bg-secondary cursor-pointer"
                      : ""
                }`}
            >
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
}
