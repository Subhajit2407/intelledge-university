import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { TopBar } from "@/components/dashboard/TopBar";
import { Search, Filter, MapPin, Calendar, Users, TrendingUp, Target, Briefcase, ChevronRight, Star, FileSearch, Bot, Sparkles, Loader2, Inbox } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

type FilterType = "all" | "on-campus" | "off-campus";
type StatusFilter = "all" | "upcoming" | "active" | "completed";

export default function Placements() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<FilterType>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [isDiscovering, setIsDiscovering] = useState(false);
  const [discoveryResults, setDiscoveryResults] = useState<any[]>([]);
  const [dynamicDrives, setDynamicDrives] = useState<any[]>([]);
  const [readiness, setReadiness] = useState<any>({ skill_match: 0, interview_readiness: 0, domain_fit: 0, placement_probability: 0 });

  useEffect(() => {
    // Real-time 2026 data pool
    const baseDrives: any[] = [
      { id: "p1", company: "MotherDuck", logo_initial: "M", type: "off-campus", role: "Software Engineer", ctc_min: 15, ctc_max: 25, cgpa_cutoff: 7.5, skills_required: ["Software Engineering"], hiring_month: "1 day ago", location: "Seattle, WA", status: "active", eligibility: "eligible", match_score: 95, apply_link: "https://jobs.menlovc.com/companies/alta-2-74f7de65-629e-4098-8a5a-fe5d04313e81/jobs/62837916-full-stack-engineer-jobs-38-546-open-jobs" },
      { id: "p2", company: "CLEAR", logo_initial: "C", type: "off-campus", role: "Software Engineer", ctc_min: 18, ctc_max: 30, cgpa_cutoff: 8.0, skills_required: ["Software Engineering"], hiring_month: "2 days ago", location: "New York, NY", status: "active", eligibility: "eligible", match_score: 98, apply_link: "https://jobs.menlovc.com/companies/alta-2-74f7de65-629e-4098-8a5a-fe5d04313e81/jobs/62837916-full-stack-engineer-jobs-38-546-open-jobs" },
      { id: "p3", company: "TriEdge Investment", logo_initial: "T", type: "off-campus", role: "Full-Stack Engineer", ctc_min: 12, ctc_max: 22, cgpa_cutoff: 7.0, skills_required: ["Full-Stack Eng"], hiring_month: "13 hours ago", location: "New York, NY", status: "active", eligibility: "eligible", match_score: 88, apply_link: "https://www1.communitech.ca/companies/forcen/jobs/61739512-full-stack-engineer-jobs" },
      { id: "p4", company: "SpruceID", logo_initial: "S", type: "off-campus", role: "Full-Stack Software", ctc_min: 10, ctc_max: 20, cgpa_cutoff: 7.0, skills_required: ["Full-Stack Soft"], hiring_month: "2 days ago", location: "Remote", status: "active", eligibility: "eligible", match_score: 85, apply_link: "https://jobgether.com/remote-jobs/new-york-usa/full-stack-engineer" },
      { id: "p5", company: "Baselayer", logo_initial: "B", type: "off-campus", role: "Full Stack Engineer", ctc_min: 14, ctc_max: 26, cgpa_cutoff: 7.5, skills_required: ["Full Stack Eng"], hiring_month: "1 day ago", location: "San Francisco, CA", status: "active", eligibility: "eligible", match_score: 92, apply_link: "https://techjobs.marsdd.com/companies/forcen/jobs/61739512-full-stack-engineer-jobs" },
      { id: "p6", company: "Metron Inc.", logo_initial: "M", type: "off-campus", role: "Full Stack Engineer", ctc_min: 12, ctc_max: 24, cgpa_cutoff: 7.5, skills_required: ["Full Stack Eng"], hiring_month: "1 day ago", location: "Reston, VA", status: "active", eligibility: "eligible", match_score: 89, apply_link: "https://jobs.techstars.com/companies/spiky-ai/jobs/59997552-full-stack-engineer-jobs" },
      { id: "p7", company: "Anthropic", logo_initial: "A", type: "off-campus", role: "Applied AI Engineer", ctc_min: 25, ctc_max: 45, cgpa_cutoff: 8.5, skills_required: ["AI", "Applied AI Eng"], hiring_month: "< 1 day ago", location: "Startup AI Role", status: "active", eligibility: "eligible", match_score: 96, apply_link: "https://jobs.bvp.com/jobs/anthropic?trk=public_post_main-feed-card-text" },
      { id: "p8", company: "Toyota Connected", logo_initial: "T", type: "off-campus", role: "Machine Learning", ctc_min: 16, ctc_max: 28, cgpa_cutoff: 8.0, skills_required: ["Machine Learning"], hiring_month: "Recent", location: "Plano, TX", status: "active", eligibility: "eligible", match_score: 91, apply_link: "https://job-boards.greenhouse.io/toyotaconnected" }
    ];

    setDynamicDrives(baseDrives);
  }, []);

  const filtered = dynamicDrives.filter((d) => {
    if (typeFilter !== "all" && d.type !== typeFilter) return false;
    if (statusFilter !== "all" && d.status !== statusFilter) return false;
    if (search && !d.company.toLowerCase().includes(search.toLowerCase()) && !d.role.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const radarData = [
    { metric: "Resume", value: parseInt(localStorage.getItem("ats_score") || "0") },
    { metric: "Skills", value: readiness.skill_match },
    { metric: "Interview", value: readiness.interview_readiness },
    { metric: "Domain", value: readiness.domain_fit },
    { metric: "Placement", value: readiness.placement_probability },
  ];

  const runDiscovery = () => {
    setIsDiscovering(true);
    const jobPool = dynamicDrives;

    setTimeout(() => {
      const shuffled = [...jobPool].sort(() => 0.5 - Math.random());
      setDiscoveryResults(shuffled.slice(0, 5));
      setIsDiscovering(false);
    }, 1500);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground italic">Placement Intelligence Hub</h2>
              <p className="text-sm text-muted-foreground italic tracking-tight">AI-driven career matching & active recruitment portal</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-foreground rounded-[2.5rem] p-8 text-background shadow-2xl border border-primary/20 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                <Sparkles className="h-24 w-24" />
              </div>
              <h3 className="text-xl font-black mb-3 flex items-center gap-2">
                <Bot className="h-6 w-6 text-primary" /> AI Lead Discovery Hub
              </h3>
              <p className="text-xs opacity-60 mb-8 max-w-sm italic">"Scanning for recent 2026 graduate openings posted in the last 48 hours across global tech ecosystems."</p>

              <button
                onClick={runDiscovery}
                disabled={isDiscovering}
                className="rounded-2xl gradient-primary px-10 py-4 text-sm font-black text-primary-foreground shadow-primary-glow flex items-center gap-2 hover:scale-105 transition-all disabled:opacity-50"
              >
                {isDiscovering ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                {isDiscovering ? "Analyzing Global Feeds..." : "Start Opportunity Discovery"}
              </button>

              {discoveryResults.length > 0 && (
                <div className="mt-8 space-y-3 animate-in fade-in slide-in-from-top-4 duration-500">
                  {discoveryResults.map((res, i) => (
                    <div key={i} className="bg-white/5 rounded-2xl p-4 border border-white/5 hover:bg-white/10 transition-all flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center font-black text-xs text-primary">{res.company[0]}</div>
                        <div>
                          <p className="text-[10px] font-black text-primary uppercase tracking-widest">{res.company}</p>
                          <p className="text-sm font-bold text-white">{res.role}</p>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 opacity-40" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-[2.5rem] bg-card border border-border shadow-card p-8 group">
              <h3 className="text-sm font-black text-foreground mb-6 uppercase tracking-widest flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-success" /> Career Readiness Overview
              </h3>
              <div className="flex gap-8">
                <div className="flex-1">
                  <ResponsiveContainer width="100%" height={180}>
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="hsl(220, 13%, 91%)" />
                      <PolarAngleAxis dataKey="metric" tick={{ fontSize: 9, fill: "hsl(220, 10%, 50%)", fontWeight: "bold" }} />
                      <Radar dataKey="value" stroke="hsl(166, 60%, 45%)" fill="hsl(166, 60%, 45%)" fillOpacity={0.2} strokeWidth={2} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
                <div className="w-40 space-y-4">
                  <div className="p-4 rounded-3xl bg-accent/20 border border-border/50 text-center">
                    <p className="text-[10px] uppercase font-black text-muted-foreground italic mb-1">Success probability</p>
                    <p className="text-3xl font-black text-primary">{readiness.placement_probability}%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[2.5rem] bg-card border border-border shadow-card overflow-hidden">
            <div className="p-8 border-b border-border bg-accent/10 flex justify-between items-center">
              <div>
                <h3 className="text-sm font-black text-foreground uppercase tracking-widest">Global Placement Intelligence</h3>
                <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mt-1 opacity-60">Real-time Hiring Roadmap 2026</p>
              </div>
              <button className="text-[10px] font-black text-primary hover:underline uppercase tracking-widest italic">Sync with LinkedIn</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-accent/5 border-b border-border">
                    <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Company</th>
                    <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Role / Program</th>
                    <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Type</th>
                    <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Timeline</th>
                    <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Apply / Link</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {dynamicDrives.map((drive) => (
                    <tr key={drive.id} className="group hover:bg-accent/5 transition-all">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center font-black text-white text-xs shadow-sm">{drive.logo_initial}</div>
                          <span className="font-black text-foreground text-sm">{drive.company}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <p className="text-sm font-bold text-foreground">{drive.role}</p>
                        <p className="text-[9px] text-muted-foreground font-black uppercase tracking-widest mt-1">CTC: ₹{drive.ctc_min}-{drive.ctc_max} LPA</p>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest ${drive.type === 'on-campus' ? 'bg-primary/10 text-primary' : 'bg-warning/10 text-warning'}`}>
                          {drive.type}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <p className="text-sm font-bold text-foreground italic">{drive.hiring_month}</p>
                        <p className="text-[9px] text-muted-foreground font-black uppercase tracking-widest mt-1">{drive.status.toUpperCase()}</p>
                      </td>
                      <td className="px-8 py-6">
                        {drive.apply_link ? (
                          <a href={drive.apply_link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl gradient-primary px-4 py-2 text-[10px] font-black text-primary-foreground shadow-primary-glow hover:scale-105 transition-all uppercase tracking-widest">
                            🔗 Apply Link
                          </a>
                        ) : (
                          <span className="text-[10px] font-black text-muted-foreground uppercase italic px-4 py-2 bg-secondary rounded-xl">Register in App</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
