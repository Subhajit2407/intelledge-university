import { useState, useMemo } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { TopBar } from "@/components/dashboard/TopBar";
import { calendarEvents, type CalendarEvent } from "@/lib/mock-data";
import { ChevronLeft, ChevronRight, BookOpen, GraduationCap, Briefcase, Brain, Clock } from "lucide-react";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const typeConfig: Record<CalendarEvent["type"], { color: string; icon: typeof BookOpen; label: string }> = {
  assignment: { color: "bg-warning/10 text-warning border-warning/20", icon: BookOpen, label: "Assignment" },
  exam: { color: "bg-destructive/10 text-destructive border-destructive/20", icon: GraduationCap, label: "Exam" },
  placement: { color: "bg-primary/10 text-primary border-primary/20", icon: Briefcase, label: "Placement" },
  interview: { color: "bg-success/10 text-success border-success/20", icon: Brain, label: "Interview" },
  study: { color: "bg-accent text-accent-foreground border-accent-foreground/10", icon: Clock, label: "AI Study Block" },
};

export default function CalendarPage() {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const monthName = new Date(currentYear, currentMonth).toLocaleString("default", { month: "long" });
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const cells: (number | null)[] = useMemo(() => {
    const c: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) c.push(null);
    for (let d = 1; d <= daysInMonth; d++) c.push(d);
    return c;
  }, [firstDay, daysInMonth]);

  const eventsByDate = useMemo(() => {
    const map: Record<string, CalendarEvent[]> = {};
    calendarEvents.forEach((e) => {
      if (!map[e.date]) map[e.date] = [];
      map[e.date].push(e);
    });
    return map;
  }, []);

  const dateStr = (day: number) => `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  const selectedEvents = selectedDate ? eventsByDate[selectedDate] || [] : [];

  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(currentYear - 1); }
    else setCurrentMonth(currentMonth - 1);
  };
  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(currentYear + 1); }
    else setCurrentMonth(currentMonth + 1);
  };

  // Upcoming events
  const upcoming = calendarEvents
    .filter((e) => new Date(e.date) >= today)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 8);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Calendar & Schedule</h2>
            <p className="text-sm text-muted-foreground">AI-optimized academic and placement schedule</p>
          </div>

          <div className="flex gap-6">
            {/* Calendar grid */}
            <div className="flex-1 min-w-0">
              <div className="rounded-2xl bg-card shadow-card p-6 animate-fade-in">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-foreground">{monthName} {currentYear}</h3>
                  <div className="flex gap-2">
                    <button onClick={prevMonth} className="rounded-lg bg-secondary p-2 text-muted-foreground hover:text-foreground transition-colors">
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button onClick={nextMonth} className="rounded-lg bg-secondary p-2 text-muted-foreground hover:text-foreground transition-colors">
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {DAYS.map((d) => (
                    <div key={d} className="py-2 text-center text-xs font-semibold text-muted-foreground">{d}</div>
                  ))}
                  {cells.map((day, i) => {
                    if (!day) return <div key={i} />;
                    const ds = dateStr(day);
                    const events = eventsByDate[ds] || [];
                    const isToday = day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();
                    const isSelected = ds === selectedDate;
                    return (
                      <button
                        key={i}
                        onClick={() => setSelectedDate(ds)}
                        className={`relative flex flex-col items-center rounded-xl p-2 min-h-[72px] transition-all ${
                          isSelected ? "ring-2 ring-primary bg-accent" :
                          isToday ? "bg-accent" :
                          "hover:bg-secondary"
                        }`}
                      >
                        <span className={`text-sm font-semibold ${isToday ? "gradient-primary text-primary-foreground rounded-full h-7 w-7 flex items-center justify-center" : "text-foreground"}`}>
                          {day}
                        </span>
                        {events.length > 0 && (
                          <div className="flex gap-0.5 mt-1 flex-wrap justify-center">
                            {events.slice(0, 3).map((e) => (
                              <span key={e.id} className={`h-1.5 w-1.5 rounded-full ${
                                e.type === "assignment" ? "bg-warning" :
                                e.type === "exam" ? "bg-destructive" :
                                e.type === "placement" ? "bg-primary" :
                                e.type === "interview" ? "bg-success" :
                                "bg-muted-foreground"
                              }`} />
                            ))}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Legend */}
                <div className="flex gap-4 mt-4 pt-4 border-t border-border flex-wrap">
                  {Object.entries(typeConfig).map(([key, cfg]) => (
                    <span key={key} className="flex items-center gap-1.5 text-[10px] font-semibold text-muted-foreground">
                      <span className={`h-2 w-2 rounded-full ${
                        key === "assignment" ? "bg-warning" :
                        key === "exam" ? "bg-destructive" :
                        key === "placement" ? "bg-primary" :
                        key === "interview" ? "bg-success" :
                        "bg-muted-foreground"
                      }`} />
                      {cfg.label}
                    </span>
                  ))}
                </div>
              </div>

              {/* Selected date events */}
              {selectedDate && (
                <div className="rounded-2xl bg-card shadow-card p-5 mt-4 animate-fade-in">
                  <h3 className="text-sm font-bold text-foreground mb-3">
                    Events on {new Date(selectedDate + "T00:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                  </h3>
                  {selectedEvents.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No events scheduled.</p>
                  ) : (
                    <div className="space-y-2">
                      {selectedEvents.map((e) => {
                        const cfg = typeConfig[e.type];
                        return (
                          <div key={e.id} className={`flex items-center gap-3 rounded-xl border p-3 ${cfg.color}`}>
                            <cfg.icon className="h-4 w-4 shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold truncate">{e.title}</p>
                              {e.time && <p className="text-[10px] opacity-70">{e.time}</p>}
                            </div>
                            <span className="text-[10px] font-bold uppercase">{cfg.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Upcoming sidebar */}
            <div className="hidden xl:flex w-72 shrink-0 flex-col gap-5">
              <div className="rounded-2xl bg-card shadow-card p-5 animate-fade-in">
                <h3 className="text-sm font-bold text-foreground mb-4">Upcoming Events</h3>
                <div className="space-y-3">
                  {upcoming.map((e) => {
                    const cfg = typeConfig[e.type];
                    const d = new Date(e.date);
                    return (
                      <div key={e.id} className="flex items-start gap-3">
                        <div className="text-center shrink-0 w-10">
                          <p className="text-lg font-extrabold text-foreground leading-none">{d.getDate()}</p>
                          <p className="text-[9px] text-muted-foreground uppercase">{d.toLocaleString("default", { month: "short" })}</p>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-foreground truncate">{e.title}</p>
                          <div className="flex items-center gap-1 mt-0.5">
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${cfg.color}`}>{cfg.label}</span>
                            {e.time && <span className="text-[9px] text-muted-foreground">{e.time}</span>}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
