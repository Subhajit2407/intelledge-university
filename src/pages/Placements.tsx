import { useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { TopBar } from "@/components/dashboard/TopBar";
import { placementDrives, careerReadiness, skillGaps, currentUser } from "@/lib/mock-data";
import { Search, Filter, MapPin, Calendar, Users, TrendingUp, Target, Briefcase, ChevronRight, Star } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const radarData = [
  { metric: "Resume", value: careerReadiness.resume_score },
  { metric: "Skills", value: careerReadiness.skill_match },
  { metric: "Interview", value: careerReadiness.interview_readiness },
  { metric: "Domain", value: careerReadiness.domain_fit },
  { metric: "Placement", value: careerReadiness.placement_probability },
];

type FilterType = "all" | "on-campus" | "off-campus";
type StatusFilter = "all" | "upcoming" | "active" | "completed";

export default function Placements() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<FilterType>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const filtered = placementDrives.filter((d) => {
    if (typeFilter !== "all" && d.type !== typeFilter) return false;
    if (statusFilter !== "all" && d.status !== statusFilter) return false;
    if (search && !d.company.toLowerCase().includes(search.toLowerCase()) && !d.role.toLowerCase().includes(search.toLowerCase())) return false;
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
              <h2 className="text-2xl font-bold text-foreground">Placement Intelligence</h2>
              <p className="text-sm text-muted-foreground">AI-powered career readiness, eligibility tracking & placement drives</p>
            </div>
          </div>

          {/* Career Readiness Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Radar chart */}
            <div className="rounded-2xl bg-card shadow-card p-5 animate-fade-in">
              <h3 className="text-sm font-bold text-foreground mb-2">Career Readiness Radar</h3>
              <ResponsiveContainer width="100%" height={220}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="hsl(220, 13%, 91%)" />
                  <PolarAngleAxis dataKey="metric" tick={{ fontSize: 10, fill: "hsl(220, 10%, 50%)" }} />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 9, fill: "hsl(220, 10%, 50%)" }} />
                  <Radar dataKey="value" stroke="hsl(166, 60%, 45%)" fill="hsl(166, 60%, 45%)" fillOpacity={0.2} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Readiness scores */}
            <div className="rounded-2xl bg-card shadow-card p-5 animate-fade-in space-y-3">
              <h3 className="text-sm font-bold text-foreground">Readiness Breakdown</h3>
              {[
                { label: "Resume Score", value: careerReadiness.resume_score, color: "[&>div]:bg-primary" },
                { label: "Skill Match", value: careerReadiness.skill_match, color: "[&>div]:bg-warning" },
                { label: "Interview Ready", value: careerReadiness.interview_readiness, color: "[&>div]:bg-destructive" },
                { label: "Domain Fit", value: careerReadiness.domain_fit, color: "[&>div]:bg-success" },
                { label: "Placement Probability", value: careerReadiness.placement_probability, color: "[&>div]:gradient-primary" },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">{item.label}</span>
                    <span className="font-bold text-foreground">{item.value}%</span>
                  </div>
                  <Progress value={item.value} className={`h-2 ${item.color}`} />
                </div>
              ))}
            </div>

            {/* Skill Gaps */}
            <div className="rounded-2xl bg-card shadow-card p-5 animate-fade-in">
              <h3 className="text-sm font-bold text-foreground mb-2">Skill Gap Analysis</h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={skillGaps} layout="vertical" margin={{ left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
                  <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10, fill: "hsl(220, 10%, 50%)" }} />
                  <YAxis type="category" dataKey="skill" tick={{ fontSize: 10, fill: "hsl(220, 10%, 50%)" }} width={80} />
                  <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12, border: "1px solid hsl(220,13%,91%)" }} />
                  <Bar dataKey="current" fill="hsl(166, 60%, 45%)" radius={[0, 4, 4, 0]} name="Current" />
                  <Bar dataKey="required" fill="hsl(220, 13%, 85%)" radius={[0, 4, 4, 0]} name="Required" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search companies or roles..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-ring/20"
              />
            </div>
            {(["all", "on-campus", "off-campus"] as FilterType[]).map((f) => (
              <button
                key={f}
                onClick={() => setTypeFilter(f)}
                className={`rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${typeFilter === f ? "gradient-primary text-primary-foreground shadow-primary-glow" : "bg-secondary text-muted-foreground hover:text-foreground"}`}
              >
                {f === "all" ? "All Types" : f === "on-campus" ? "On-Campus" : "Off-Campus"}
              </button>
            ))}
            <div className="h-5 w-px bg-border" />
            {(["all", "upcoming", "active", "completed"] as StatusFilter[]).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`rounded-lg px-3 py-2 text-xs font-semibold capitalize transition-colors ${statusFilter === s ? "gradient-primary text-primary-foreground shadow-primary-glow" : "bg-secondary text-muted-foreground hover:text-foreground"}`}
              >
                {s === "all" ? "All Status" : s}
              </button>
            ))}
          </div>

          {/* Drive cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((drive, i) => (
              <div
                key={drive.id}
                className="rounded-2xl bg-card shadow-card p-5 transition-all hover:shadow-card-hover hover:-translate-y-0.5 animate-fade-in"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl gradient-primary text-sm font-bold text-primary-foreground">
                      {drive.logo_initial}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">{drive.company}</p>
                      <p className="text-xs text-muted-foreground">{drive.role}</p>
                    </div>
                  </div>
                  <span className={`rounded-lg px-2 py-1 text-[10px] font-bold ${
                    drive.eligibility === "eligible" ? "bg-success/10 text-success" :
                    drive.eligibility === "almost" ? "bg-warning/10 text-warning" :
                    "bg-destructive/10 text-destructive"
                  }`}>
                    {drive.eligibility === "eligible" ? "🟢 Eligible" : drive.eligibility === "almost" ? "🟡 Almost" : "🔴 Not Eligible"}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                  <span className="flex items-center gap-1 text-muted-foreground"><Briefcase className="h-3 w-3" />{drive.type}</span>
                  <span className="flex items-center gap-1 text-muted-foreground"><MapPin className="h-3 w-3" />{drive.location}</span>
                  <span className="flex items-center gap-1 text-muted-foreground"><Calendar className="h-3 w-3" />{drive.hiring_month}</span>
                  <span className="flex items-center gap-1 text-muted-foreground"><Target className="h-3 w-3" />CGPA ≥ {drive.cgpa_cutoff}</span>
                </div>

                <div className="flex flex-wrap gap-1 mb-3">
                  {drive.skills_required.map((skill) => (
                    <span key={skill} className="rounded-md bg-accent px-2 py-0.5 text-[10px] font-semibold text-accent-foreground">{skill}</span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <div>
                    <p className="text-lg font-extrabold text-foreground">₹{drive.ctc_min}–{drive.ctc_max} <span className="text-xs font-medium text-muted-foreground">LPA</span></p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <p className="text-[10px] text-muted-foreground">AI Match</p>
                      <p className={`text-sm font-extrabold ${drive.match_score >= 80 ? "text-success" : drive.match_score >= 60 ? "text-warning" : "text-destructive"}`}>{drive.match_score}%</p>
                    </div>
                    <button className="rounded-lg gradient-primary p-2 text-primary-foreground shadow-primary-glow hover:scale-105 transition-transform">
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
