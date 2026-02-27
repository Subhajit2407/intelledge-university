import { useState, useMemo } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { TopBar } from "@/components/dashboard/TopBar";
import {
  Search, TrendingUp, Bot, Sparkles, Loader2, Globe, Building2, Calendar,
  ExternalLink, Clock, CheckCircle2, BookOpen, ChevronDown, ChevronUp, ChevronRight, Zap, Trophy, Target, Users
} from "lucide-react";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer } from "recharts";

type CategoryFilter = "all" | string;

const COMPANY_DATABASE = [
  { id: "c1", company: "Tata Consultancy Services (TCS)", category: "IT & Services", roles: "Graduate software / consulting roles, large campus drives", timeline: "Jul–Nov (campus), Dec–Mar (off-campus)", logo: "T", color: "#0066B3" },
  { id: "c2", company: "Infosys", category: "IT & Services", roles: "Structured campus programs, developer tracks", timeline: "Jul–Nov (campus), Dec–Mar (off-campus)", logo: "I", color: "#007CC3" },
  { id: "c3", company: "Wipro", category: "IT & Services", roles: "Cloud, cybersecurity, software roles", timeline: "Jul–Nov (campus), Dec–Mar (off-campus)", logo: "W", color: "#341F52" },
  { id: "c4", company: "HCL Technologies", category: "IT & Services", roles: "Freshers programs, engineering roles", timeline: "Jul–Nov (campus), Dec–Mar (off-campus)", logo: "H", color: "#0076AD" },
  { id: "c5", company: "Tech Mahindra", category: "IT & Services", roles: "IT solutions, telecom & network engineering", timeline: "Jul–Nov (campus)", logo: "T", color: "#EE3124" },
  { id: "c6", company: "Capgemini", category: "IT / Consulting", roles: "Graduate tech & consulting roles", timeline: "Jul–Nov (campus)", logo: "C", color: "#0070AD" },
  { id: "c7", company: "Cognizant", category: "IT & Services", roles: "Off-campus & campus software hiring", timeline: "Jul–Nov (campus), Dec–Mar (off-campus)", logo: "C", color: "#1455C0" },
  { id: "c8", company: "CGI", category: "IT / Software", roles: "Software & systems engineering positions", timeline: "Jul–Nov", logo: "C", color: "#E31837" },
  { id: "c9", company: "Equifax", category: "Data / FinTech", roles: "Data engineering, software roles", timeline: "Aug–Dec, Dec–Mar", logo: "E", color: "#C8102E" },
  { id: "c10", company: "Microsoft", category: "Product / Cloud", roles: "Internships, SDE, program roles", timeline: "Feb–Apr & Aug–Dec (select campuses/off-campus)", logo: "M", color: "#00A4EF" },
  { id: "c11", company: "Amazon", category: "Product / E-commerce", roles: "SDE, QA, operations tech roles", timeline: "Feb–Apr & Aug–Dec; off-campus drives Dec–Mar", logo: "A", color: "#FF9900" },
  { id: "c12", company: "Samsung C&T", category: "Core / Manufacturing", roles: "Graduate engineer programs (hardware/embedded)", timeline: "Aug–Jan", logo: "S", color: "#1428A0" },
  { id: "c13", company: "Swiggy", category: "Product / Tech", roles: "Software development, SDE roles", timeline: "Aug–Dec; off-campus drives", logo: "S", color: "#FC8019" },
  { id: "c14", company: "bp (British Petroleum)", category: "Energy / Tech", roles: "Engineering & tech positions (IoT, analytics)", timeline: "Aug–Jan", logo: "B", color: "#00A651" },
  { id: "c15", company: "Google", category: "Product / Tech", roles: "SWE, product, internships (select top campuses)", timeline: "Feb–Apr & Aug–Dec (select campuses)", logo: "G", color: "#4285F4" },
  { id: "c16", company: "Qualcomm", category: "Semiconductor", roles: "Chip design, embedded, firmware roles", timeline: "Aug–Dec, campus specific", logo: "Q", color: "#3253DC" },
  { id: "c17", company: "Intel", category: "Semiconductor / Hardware", roles: "VLSI, hardware, firmware positions", timeline: "Aug–Dec", logo: "I", color: "#0071C5" },
  { id: "c18", company: "Adobe Systems", category: "Product / Software", roles: "Software engineering, product & design roles", timeline: "Aug–Dec; internships Feb–Apr", logo: "A", color: "#FF0000" },
  { id: "c19", company: "L&T Technology Services", category: "Core Engineering", roles: "Design, R&D, product engineering", timeline: "Jul–Nov", logo: "L", color: "#004A97" },
  { id: "c20", company: "Bosch Engineering & Business Solutions", category: "Engineering R&D", roles: "Embedded systems, automotive R&D roles", timeline: "Aug–Dec", logo: "B", color: "#EA0016" },
  { id: "c21", company: "Virtusa", category: "IT / Consulting", roles: "Software engineering roles via campus lists", timeline: "Jul–Nov", logo: "V", color: "#FF6600" },
  { id: "c22", company: "ITC Infotech", category: "IT / Services", roles: "Software & domain-specific roles", timeline: "Jul–Nov", logo: "I", color: "#004B87" },
  { id: "c23", company: "Cybage", category: "IT / Services", roles: "Software dev & QA roles", timeline: "Jul–Nov", logo: "C", color: "#E2231A" },
  { id: "c24", company: "Unisys", category: "IT / Systems", roles: "Systems engineering & software", timeline: "Jul–Nov", logo: "U", color: "#005DAA" },
  { id: "c25", company: "Amdocs", category: "Telecom / Software", roles: "Telecom software engineering", timeline: "Jul–Nov", logo: "A", color: "#00B0CA" },
  { id: "c26", company: "Hitachi", category: "Core / Industrial", roles: "Engineering, R&D & systems roles", timeline: "Aug–Dec", logo: "H", color: "#CF0019" },
  { id: "c27", company: "Eclerx", category: "Analytics / BPM", roles: "Analytics, data & tech roles", timeline: "Jul–Nov", logo: "E", color: "#FF6B35" },
  { id: "c28", company: "Credforce", category: "FinTech / Software", roles: "Finance software & product roles", timeline: "Dec–Mar / off-campus", logo: "C", color: "#5E35B1" },
  { id: "c29", company: "1mg", category: "HealthTech", roles: "Product & backend roles", timeline: "Aug–Dec / pooled drives", logo: "1", color: "#EE4D2D" },
  { id: "c30", company: "Aboota", category: "Startup / Tech", roles: "Early-stage product engineering roles", timeline: "Variable (pooled/off-campus)", logo: "A", color: "#6C5CE7" },
  { id: "c31", company: "Accolite Software", category: "IT / Services", roles: "Software engineering via campus/off-campus", timeline: "Jul–Nov / Dec–Mar", logo: "A", color: "#E36B0A" },
  { id: "c32", company: "Airbnb", category: "Product / Tech", roles: "Select campus visits for product/infra roles", timeline: "Select campuses (Aug–Dec)", logo: "A", color: "#FF5A5F" },
  { id: "c33", company: "Addverb Technologies", category: "Robotics / Automation", roles: "Robotics engineers & firmware roles", timeline: "Aug–Jan (core recruitment)", logo: "A", color: "#2D3436" },
  { id: "c34", company: "Akamai", category: "Cloud / Network", roles: "Network engineering, SRE, backend", timeline: "Dec–Mar (off-campus) & select campus visits", logo: "A", color: "#0099CC" },
  { id: "c35", company: "Chargebee", category: "SaaS / Product", roles: "Backend, infra, SDE roles", timeline: "Dec–Mar (off-campus) & select campus drives", logo: "C", color: "#F78DA7" },
  { id: "c36", company: "Amadeus Software", category: "Travel Tech", roles: "Software engineering, product roles", timeline: "Jul–Nov / pooled drives", logo: "A", color: "#004A97" },
  { id: "c37", company: "CDM Smith Global Services", category: "Consulting / Engineering", roles: "Infrastructure & design engineering roles", timeline: "Aug–Jan", logo: "C", color: "#009B77" },
  { id: "c38", company: "Bharti Airtel", category: "Telecom / Tech", roles: "Network engineering, software roles", timeline: "Jul–Nov", logo: "B", color: "#EA1D24" },
  { id: "c39", company: "Bank of America", category: "Banking / Tech", roles: "Tech roles in banking, analytics", timeline: "Dec–Mar (tech hiring)", logo: "B", color: "#0067B1" },
];

const CATEGORY_COLORS: Record<string, string> = {
  "IT & Services": "#007AFF",
  "IT / Services": "#007AFF",
  "IT / Consulting": "#5E5CE6",
  "IT / Software": "#5AC8FA",
  "IT / Systems": "#30D158",
  "Product / Tech": "#FF9F0A",
  "Product / Cloud": "#00B4D8",
  "Product / E-commerce": "#FF6B00",
  "Product / Software": "#FF375F",
  "Semiconductor": "#BF5AF2",
  "Semiconductor / Hardware": "#AC39D4",
  "Core Engineering": "#64D2FF",
  "Engineering R&D": "#48CAE4",
  "Core / Manufacturing": "#0A84FF",
  "Core / Industrial": "#FF453A",
  "Data / FinTech": "#30D158",
  "Telecom / Software": "#00C7BE",
  "Analytics / BPM": "#FF6B35",
  "FinTech / Software": "#9CE1F4",
  "HealthTech": "#EE4D2D",
  "Startup / Tech": "#6C5CE7",
  "Robotics / Automation": "#2D3436",
  "Cloud / Network": "#0099CC",
  "SaaS / Product": "#F78DA7",
  "Travel Tech": "#1E3799",
  "Energy / Tech": "#00A651",
  "Banking / Tech": "#0067B1",
  "Consulting / Engineering": "#009B77",
};

export default function Placements() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");
  const [isDiscovering, setIsDiscovering] = useState(false);
  const [discoveryResults, setDiscoveryResults] = useState<any[]>([]);
  const [showAllCompanies, setShowAllCompanies] = useState(false);
  const [readiness] = useState({ resume: parseInt(localStorage.getItem("ats_score") || "0"), skills: 0, interview: 0, domain: 0, placement: 0 });

  const radarData = [
    { metric: "Resume", value: readiness.resume },
    { metric: "Skills", value: readiness.skills },
    { metric: "Interview", value: readiness.interview },
    { metric: "Domain", value: readiness.domain },
    { metric: "Placement", value: readiness.placement },
  ];

  const categories = useMemo(() => {
    const cats = Array.from(new Set(COMPANY_DATABASE.map(c => c.category)));
    return cats.sort();
  }, []);

  const filtered = useMemo(() => {
    return COMPANY_DATABASE.filter(c => {
      if (categoryFilter !== "all" && c.category !== categoryFilter) return false;
      if (search && !c.company.toLowerCase().includes(search.toLowerCase()) && !c.roles.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [categoryFilter, search]);

  const displayedCompanies = showAllCompanies ? filtered : filtered.slice(0, 15);

  const runDiscovery = () => {
    setIsDiscovering(true);
    setTimeout(() => {
      const live = COMPANY_DATABASE.filter(c => c.category.includes("Product") || c.category.includes("Tech"));
      const shuffled = [...live].sort(() => 0.5 - Math.random());
      setDiscoveryResults(shuffled.slice(0, 5));
      setIsDiscovering(false);
    }, 1500);
  };

  const statsList = [
    { icon: Building2, value: `${COMPANY_DATABASE.length}+`, label: "Partner Companies", color: "#007AFF" },
    { icon: Trophy, value: "98.3%", label: "Placement Rate", color: "#34C759" },
    { icon: Globe, value: "15+", label: "Countries Hiring", color: "#FF9F0A" },
    { icon: Zap, value: "Live", label: "Real-time Sync", color: "#BF5AF2" },
  ];

  const role = localStorage.getItem("intelledge_role");

  return (
    <div className="flex h-screen overflow-hidden ios-bg">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto px-10 py-10 space-y-10 custom-scrollbar">

          {/* ── Header ── */}
          <div className="flex items-end justify-between animate-in fade-in duration-700">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-slate-900">Hiring Season Calendar 2026</h1>
              <p className="text-sm font-medium text-slate-500 mt-1">
                {role === 'teacher'
                  ? "Faculty Dashboard: Batch placement metrics and institutional hiring trends"
                  : "AI-driven career matching & active recruitment portal"}
              </p>
            </div>
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white rounded-2xl shadow-sm border border-slate-100">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                {role === 'teacher' ? 'Master Sync Active' : 'Live Recruiting Active'}
              </span>
            </div>
          </div>

          {/* ── Stats Row ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {statsList.map((s, i) => (
              <div key={i} className="ios-card p-6 flex items-center gap-5 hover:shadow-lg transition-all animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="h-12 w-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${s.color}10` }}>
                  <s.icon className="h-6 w-6" style={{ color: s.color }} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{s.value}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-1">{s.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* ── Top 2 Cards ── */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">

            {/* AI Lead Discovery / Faculty Insights */}
            <div className={`${role === 'teacher' ? 'ios-card' : 'bg-[#0D2B1D]'} rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group`}>
              {role === 'teacher' ? (
                <>
                  <div className="absolute top-0 right-0 p-8 opacity-10">
                    <TrendingUp className="h-32 w-32 text-primary" />
                  </div>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <TrendingUp className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">Batch Placement Insight</h3>
                  </div>
                  <p className="text-sm text-slate-500 mb-8 max-w-sm italic leading-relaxed">
                    "Analyzing collective batch performance against 2026 hiring benchmarks. Current trends indicate a high matching probability for Product roles."
                  </p>
                  <div className="grid grid-cols-2 gap-4 w-full">
                    <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                      <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Avg. Resume Score</p>
                      <p className="text-3xl font-black text-slate-900">74<span className="text-sm text-slate-400">/100</span></p>
                    </div>
                    <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                      <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Placement Prob.</p>
                      <p className="text-3xl font-black text-emerald-500">HIGH</p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                    <Sparkles className="h-32 w-32" />
                  </div>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center">
                      <Bot className="h-6 w-6 text-emerald-400" />
                    </div>
                    <h3 className="text-xl font-bold">Neural Discovery Engine</h3>
                  </div>
                  <p className="text-sm text-emerald-100/60 mb-8 max-w-sm italic leading-relaxed">
                    "Scanning global tech ecosystems for 2026 graduate openings. Cross-referencing requirements with your profile context."
                  </p>

                  <button
                    onClick={runDiscovery}
                    disabled={isDiscovering}
                    className="rounded-2xl bg-emerald-500 px-10 py-4 text-sm font-bold text-white shadow-[0_10px_30px_rgba(16,185,129,0.3)] flex items-center gap-3 hover:scale-105 transition-all disabled:opacity-50">
                    {isDiscovering ? <Loader2 className="h-5 w-5 animate-spin" /> : <Search className="h-5 w-5" />}
                    {isDiscovering ? "Analyzing global feeds..." : "Start Discovery"}
                  </button>

                  {discoveryResults.length > 0 && (
                    <div className="mt-8 space-y-3 animate-in fade-in slide-in-from-top-4 duration-500">
                      {discoveryResults.map((res, i) => (
                        <div key={i} className="bg-white/5 rounded-[1.5rem] p-4 border border-white/5 hover:bg-white/10 transition-all flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-xl flex items-center justify-center font-bold text-xs"
                              style={{ background: (CATEGORY_COLORS[res.category] || "#34C759") + "30", color: CATEGORY_COLORS[res.category] || "#34C759" }}>
                              {res.logo}
                            </div>
                            <div>
                              <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">{res.company}</p>
                              <p className="text-sm font-semibold text-white/80">{res.roles.split("–")[0].split(",")[0]}</p>
                            </div>
                          </div>
                          <ChevronRight className="h-4 w-4 text-white/20" />
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Readiness Radar / Master Stats */}
            <div className={`ios-card p-10 flex flex-col items-center ${role === 'teacher' ? 'bg-[#1C1C1E] text-white' : ''}`}>
              <h3 className={`text-sm font-black uppercase tracking-widest flex items-center gap-2 mb-8 self-start ${role === 'teacher' ? 'text-emerald-400' : 'text-slate-400'}`}>
                <Target className="h-4 w-4" /> {role === 'teacher' ? 'Batch Readiness Radar' : 'Career Readiness'}
              </h3>
              <div className="w-full">
                <ResponsiveContainer width="100%" height={220}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke={role === 'teacher' ? "rgba(255,255,255,0.1)" : "hsl(220, 13%, 91%)"} />
                    <PolarAngleAxis dataKey="metric" tick={{ fontSize: 10, fill: role === 'teacher' ? "rgba(255,255,255,0.5)" : "hsl(220, 10%, 50%)", fontWeight: "bold" }} />
                    <Radar dataKey="value" stroke={role === 'teacher' ? "#34C759" : "#007AFF"} fill={role === 'teacher' ? "#34C759" : "#007AFF"} fillOpacity={0.15} strokeWidth={2} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-4 w-full mt-8">
                <div className={`p-4 rounded-2xl border text-center ${role === 'teacher' ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-100'}`}>
                  <p className="text-[10px] uppercase font-bold opacity-60 mb-1">{role === 'teacher' ? 'Placement Rate' : 'Success Prob.'}</p>
                  <p className={`text-2xl font-bold ${role === 'teacher' ? 'text-white' : 'text-slate-900'}`}>{role === 'teacher' ? '98%' : `${readiness.placement}%`}</p>
                </div>
                <div className={`p-4 rounded-2xl border text-center ${role === 'teacher' ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-100'}`}>
                  <p className="text-[10px] uppercase font-bold opacity-60 mb-1">{role === 'teacher' ? 'Active Offers' : 'ATS Match'}</p>
                  <p className="text-2xl font-bold text-emerald-500">{role === 'teacher' ? '142' : `${readiness.resume}%`}</p>
                </div>
              </div>
            </div>

          </div>

          {/* ── Hiring Season Calendar 2026 ── */}
          <div className="ios-card overflow-hidden">
            <div className="px-10 py-8 border-b border-slate-50 bg-slate-50/30">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Hiring Season Calendar 2026</h2>
                  <p className="text-sm font-medium text-slate-500 mt-1">
                    Master list of recruitment cycles and active opportunities
                  </p>
                </div>
                <div className="flex flex-wrap gap-3 items-center">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      placeholder="Search companies or roles..."
                      className="pl-10 pr-5 py-2.5 rounded-2xl bg-white border border-slate-200 text-sm font-medium outline-none focus:ring-4 focus:ring-blue-500/5 transition-all w-64" />
                  </div>
                  <select
                    value={categoryFilter}
                    onChange={e => setCategoryFilter(e.target.value)}
                    className="px-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-sm font-medium outline-none focus:ring-4 focus:ring-blue-500/5 cursor-pointer">
                    <option value="all">All Sectors</option>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-10 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Company</th>
                    <th className="px-10 py-5 text-[10px] font-bold text-slate-400 text-right uppercase tracking-widest">Category</th>
                    <th className="px-10 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Typical Roles / Notes</th>
                    <th className="px-10 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Typical Hiring Months</th>
                    <th className="px-10 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      {role === 'teacher' ? 'Batch Prep %' : 'Match'}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {displayedCompanies.map((company, i) => (
                    <tr key={company.id} className="group hover:bg-slate-50/80 transition-all animate-in fade-in" style={{ animationDelay: `${(i % 15) * 30}ms` }}>
                      <td className="px-10 py-6">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-[0.85rem] flex items-center justify-center font-bold text-white text-xs shadow-sm flex-shrink-0"
                            style={{ background: company.color || "#007AFF" }}>
                            {company.logo}
                          </div>
                          <span className="font-bold text-slate-900">{company.company}</span>
                        </div>
                      </td>
                      <td className="px-10 py-6 text-right">
                        <span className="px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest"
                          style={{
                            background: (CATEGORY_COLORS[company.category] || "#007AFF") + "10",
                            color: CATEGORY_COLORS[company.category] || "#007AFF"
                          }}>
                          {company.category}
                        </span>
                      </td>
                      <td className="px-10 py-6">
                        <p className="text-sm font-medium text-slate-600 max-w-sm leading-relaxed">{company.roles}</p>
                      </td>
                      <td className="px-10 py-6">
                        <div className="flex items-center gap-2">
                          <Clock className="h-3.5 w-3.5 text-slate-300 flex-shrink-0" />
                          <p className="text-xs font-bold text-slate-700">{company.timeline}</p>
                        </div>
                      </td>
                      <td className="px-10 py-6">
                        <div className="flex items-center gap-4">
                          <div className="flex-1 h-1.5 w-16 bg-slate-100 rounded-full overflow-hidden">
                            <div className={`h-full ${role === 'teacher' ? 'bg-[#007AFF]' : 'bg-emerald-400'} rounded-full animate-pulse-slow`} style={{ width: `${role === 'teacher' ? (70 + (i % 25)) : (60 + (i % 35))}%` }} />
                          </div>
                          <ChevronRight className="h-4 w-4 text-slate-200 group-hover:text-[#007AFF] transition-all" />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filtered.length > 15 && (
              <div className="px-10 py-8 border-t border-slate-50 flex justify-center bg-slate-50/10">
                <button
                  onClick={() => setShowAllCompanies(!showAllCompanies)}
                  className="px-8 py-3 rounded-2xl bg-white border border-slate-200 text-sm font-bold text-slate-900 hover:shadow-md hover:border-slate-300 transition-all flex items-center gap-2">
                  {showAllCompanies
                    ? <><ChevronUp className="h-4 w-4" /> Show Initial Results</>
                    : <><ChevronDown className="h-4 w-4" /> View Full Directory ({filtered.length} Companies)</>}
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
      <style>{`
        .animate-pulse-slow { animation: pulseS 3s ease-in-out infinite; }
        @keyframes pulseS { 0%, 100% { opacity: 0.6; } 50% { opacity: 1; } }
      `}</style>
    </div>
  );
}
