import { useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { TopBar } from "@/components/dashboard/TopBar";
import { subjects } from "@/lib/mock-data";
import { FileText, Upload, BookOpen, CheckCircle, AlertCircle, Clock, Search, Brain } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface Resource {
  id: string;
  title: string;
  subject: string;
  type: "notes" | "syllabus" | "paper" | "lab" | "papers" | "labs";
  topics_total: number;
  topics_completed: number;
  ai_summary: string;
  uploaded_at: string;
  behind_schedule: boolean;
  subjectCode?: string;
  size?: string;
  date?: string;
  progress?: number;
}

const typeIcons: Record<string, any> = {
  notes: FileText,
  syllabus: BookOpen,
  paper: FileText,
  papers: FileText,
  lab: Brain,
  labs: Brain
};

export default function Resources() {
  const [search, setSearch] = useState("");
  const [resources, setResources] = useState<Resource[]>([]);
  const [filter, setFilter] = useState<"all" | "behind">("all");

  const filtered = resources.filter((r) => {
    if (filter === "behind" && !r.behind_schedule) return false;
    if (search && !r.title.toLowerCase().includes(search.toLowerCase()) && !r.subject.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Resources & Knowledge</h2>
              <p className="text-sm text-muted-foreground">AI-powered syllabus tracking, auto-summaries & progress detection</p>
            </div>
            <button className="flex items-center gap-2 rounded-xl gradient-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-primary-glow hover:scale-[1.02] transition-transform">
              <Upload className="h-4 w-4" /> Upload Resource
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-2xl bg-card shadow-card p-4 animate-fade-in">
              <p className="text-[11px] text-muted-foreground font-medium">Total Resources</p>
              <p className="text-2xl font-extrabold text-foreground">{resources.length}</p>
            </div>
            <div className="rounded-2xl bg-card shadow-card p-4 animate-fade-in">
              <p className="text-[11px] text-muted-foreground font-medium">Topics Covered</p>
              <p className="text-2xl font-extrabold text-primary">{resources.reduce((a, r) => a + r.topics_completed, 0)}/{resources.reduce((a, r) => a + r.topics_total, 0)}</p>
            </div>
            <div className="rounded-2xl bg-card shadow-card p-4 animate-fade-in">
              <p className="text-[11px] text-muted-foreground font-medium">On Track</p>
              <p className="text-2xl font-extrabold text-success">{resources.filter((r) => !r.behind_schedule).length}</p>
            </div>
            <div className="rounded-2xl bg-card shadow-card p-4 animate-fade-in">
              <p className="text-[11px] text-muted-foreground font-medium">Behind Schedule</p>
              <p className="text-2xl font-extrabold text-destructive">{resources.filter((r) => r.behind_schedule).length}</p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input type="text" placeholder="Search resources..." value={search} onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-ring/20" />
            </div>
            <button onClick={() => setFilter("all")} className={`rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${filter === "all" ? "gradient-primary text-primary-foreground shadow-primary-glow" : "bg-secondary text-muted-foreground"}`}>All</button>
            <button onClick={() => setFilter("behind")} className={`rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${filter === "behind" ? "bg-destructive text-destructive-foreground" : "bg-secondary text-muted-foreground"}`}>
              <AlertCircle className="h-3 w-3 inline mr-1" />Behind Schedule
            </button>
          </div>

          {/* Resource cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((r, i) => {
              const Icon = typeIcons[r.type];
              const pct = Math.round((r.topics_completed / r.topics_total) * 100);
              return (
                <div key={r.id} className="rounded-2xl bg-card shadow-card p-5 transition-all hover:shadow-card-hover animate-fade-in" style={{ animationDelay: `${i * 60}ms` }}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent">
                        <Icon className="h-5 w-5 text-accent-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground">{r.title}</p>
                        <p className="text-xs text-muted-foreground">{r.subject}</p>
                      </div>
                    </div>
                    {r.behind_schedule ? (
                      <span className="flex items-center gap-1 rounded-lg bg-destructive/10 px-2 py-1 text-[10px] font-bold text-destructive">
                        <AlertCircle className="h-3 w-3" /> Behind
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 rounded-lg bg-success/10 px-2 py-1 text-[10px] font-bold text-success">
                        <CheckCircle className="h-3 w-3" /> On Track
                      </span>
                    )}
                  </div>

                  <div className="rounded-xl bg-accent/50 p-3 mb-3">
                    <p className="text-[10px] font-semibold text-accent-foreground mb-1 flex items-center gap-1"><Brain className="h-3 w-3" /> AI Summary</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{r.ai_summary}</p>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Topics</span>
                      <span className="font-bold text-foreground">{r.topics_completed}/{r.topics_total}</span>
                    </div>
                    <Progress value={pct} className={`h-2 ${pct === 100 ? "[&>div]:bg-success" : r.behind_schedule ? "[&>div]:bg-destructive" : "[&>div]:gradient-primary"}`} />
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}
