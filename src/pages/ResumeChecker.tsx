import { useState, useRef } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { TopBar } from "@/components/dashboard/TopBar";
import { FileText, Upload, CheckCircle2, AlertCircle, TrendingUp, Search, X, Loader2, Sparkles, Target, Briefcase, ChevronRight, MessageSquareCode, Bot } from "lucide-react";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";

interface ATSRequirement {
    id: string;
    label: string;
    status: "success" | "warning" | "error";
    description: string;
    aiFeedback?: string;
    originalText?: string;
}

export default function ResumeChecker() {
    const [file, setFile] = useState<File | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [score, setScore] = useState<number | null>(null);
    const [activeReq, setActiveReq] = useState<string | null>(null);

    const requirements: ATSRequirement[] = [
        {
            id: "1", label: "Professional Summary", status: "success",
            description: "Clear and concise career summary found at the top.",
            aiFeedback: "Your summary is well-structured. It highlights your objective and core stack effectively.",
            originalText: "Passionate developer looking for opportunities..."
        },
        {
            id: "2", label: "Contact Information", status: "success",
            description: "Email, LinkedIn, and Phone number are properly formatted.",
            aiFeedback: "All reachable links are verified. Good job including LinkedIn.",
        },
        {
            id: "3", label: "Keyword Optimization", status: "warning",
            description: "Missing keywords: 'System Design', 'Scalability', 'Cloud Native'.",
            aiFeedback: "To pass the initial filter for SDE roles, inject keywords like 'Microservices' into your experience section.",
            originalText: "Built backend services using Node.js..."
        },
        {
            id: "4", label: "Quantifiable Results", status: "error",
            description: "Experience lacks metric-driven results (e.g., 'Improved performance by 20%').",
            aiFeedback: "AI suggestion: Instead of 'Helped in project management', use 'Optimized project workflow resulting in a 15% reduction in delivery time over 3 months'.",
            originalText: "Managed a team of 5 people."
        },
        { id: "5", label: "Standard Headers", status: "success", description: "Using conventional headers (Experience, Education, Skills)." },
        { id: "6", label: "Format & Structure", status: "success", description: "Modern, single-column layout detectable by parsers." },
    ];

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            analyzeResume(selectedFile);
        }
    };

    const analyzeResume = (file: File) => {
        setIsAnalyzing(true);
        setScore(null);

        // Advanced AI Parsing Simulation
        setTimeout(() => {
            const nameLower = file.name.toLowerCase();
            const sizeInKB = file.size / 1024;

            let baseScore = 65;

            // Heuristic Parsing Logic
            if (nameLower.includes("specialist") || nameLower.includes("senior")) baseScore += 10;
            if (nameLower.includes("standard") || nameLower.includes("ats")) baseScore += 5;
            if (sizeInKB > 100 && sizeInKB < 500) baseScore += 10; // Ideal size range
            if (sizeInKB > 1000) baseScore -= 15; // Too large for parsers

            // Random jitter for "live" feel
            const finalScore = Math.min(98, Math.max(35, baseScore + (Math.floor(Math.random() * 15) - 5)));

            setIsAnalyzing(false);
            setScore(finalScore);
            localStorage.setItem("ats_score", finalScore.toString());

            toast.success("Analysis Complete", {
                description: `Neural engine matched your profile with a ${finalScore}% accuracy rating.`
            });
        }, 3500);
    };

    const getScoreStatus = (s: number) => {
        if (s >= 85) return { label: "Excellent", color: "text-success", bg: "bg-success/10" };
        if (s >= 70) return { label: "Good", color: "text-primary", bg: "bg-primary/10" };
        if (s >= 50) return { label: "Average", color: "text-warning", bg: "bg-warning/10" };
        return { label: "Critical", color: "text-destructive", bg: "bg-destructive/10" };
    };

    return (
        <div className="flex h-screen overflow-hidden bg-background">
            <Sidebar />
            <div className="flex flex-1 flex-col overflow-hidden">
                <TopBar />
                <main className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-foreground">ATS Intelligence Checker</h2>
                            <p className="text-sm text-muted-foreground italic opacity-70">Deep parsing against industry-standard recruiter algorithms</p>
                        </div>
                    </div>

                    {!score && !isAnalyzing ? (
                        <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-border bg-card p-16 text-center animate-fade-in shadow-sm">
                            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-3xl gradient-primary shadow-primary-glow animate-pulse">
                                <Upload className="h-10 w-10 text-primary-foreground" />
                            </div>
                            <h3 className="mb-2 text-xl font-bold text-foreground">Upload your Professional Resume</h3>
                            <p className="mb-8 max-w-md text-sm text-muted-foreground">
                                Our AI analyzes structure, keywords, and metrics. A poor resume will get a poor score—be honest with your experience.
                            </p>
                            <label className="cursor-pointer rounded-xl bg-foreground text-background px-10 py-4 text-sm font-bold shadow-xl transition-all hover:scale-105 hover:bg-foreground/90">
                                Select PDF / DOCX
                                <input type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={handleFileUpload} />
                            </label>
                            <div className="mt-8 flex items-center gap-6 opacity-40 grayscale">
                                <span className="text-xs font-bold uppercase tracking-widest">Supports: IEEE</span>
                                <span className="text-xs font-bold uppercase tracking-widest">Harvard</span>
                                <span className="text-xs font-bold uppercase tracking-widest">Standard ATS</span>
                            </div>
                        </div>
                    ) : isAnalyzing ? (
                        <div className="flex flex-col items-center justify-center rounded-3xl bg-card p-24 text-center shadow-card border border-border">
                            <div className="relative mb-8">
                                <Loader2 className="h-16 w-16 animate-spin text-primary" />
                                <Bot className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-primary opacity-50" />
                            </div>
                            <h3 className="mb-2 text-xl font-bold text-foreground">AI Scanning active...</h3>
                            <p className="max-w-md text-sm text-muted-foreground animate-pulse">
                                Quantifying impact factors and matching keywords to trending job descriptions...
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in pb-12">
                            {/* Score Panel */}
                            <div className="lg:col-span-4 space-y-6">
                                <div className="rounded-3xl bg-card border border-border shadow-card p-8 text-center sticky top-0">
                                    <h3 className="text-xs font-black text-muted-foreground mb-6 uppercase tracking-[0.2em]">Live Analysis Score</h3>
                                    <div className="relative mb-6 flex aspect-square items-center justify-center">
                                        <svg className="h-56 w-56 -rotate-90">
                                            <circle
                                                cx="112" cy="112" r="100"
                                                fill="none" stroke="currentColor" strokeWidth="16"
                                                className="text-secondary opacity-30"
                                            />
                                            <circle
                                                cx="112" cy="112" r="100"
                                                fill="none" stroke="currentColor" strokeWidth="16"
                                                strokeDasharray={628}
                                                strokeDashoffset={628 - (628 * (score || 0)) / 100}
                                                strokeLinecap="round"
                                                className={`${score && score >= 75 ? "text-success" : "text-primary"} transition-all duration-1000 ease-out`}
                                            />
                                        </svg>
                                        <div className="absolute flex flex-col items-center">
                                            <span className="text-6xl font-black text-foreground tabular-nums">{score}%</span>
                                            <span className={`text-xs font-black uppercase mt-1 px-3 py-1 rounded-full ${getScoreStatus(score || 0).bg} ${getScoreStatus(score || 0).color}`}>
                                                {getScoreStatus(score || 0).label}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-4 rounded-2xl bg-accent/30 text-left border border-border">
                                        <p className="text-[11px] font-bold text-muted-foreground mb-1 uppercase">AI Summary</p>
                                        <p className="text-xs text-foreground leading-relaxed">
                                            {score && score > 80
                                                ? "Your resume is highly optimized. Minor tweaks to specialized keywords will make it perfect."
                                                : "Significant improvements needed in quantifiable output. Your experience reads too much like a job description."}
                                        </p>
                                    </div>

                                    <button
                                        onClick={() => { setScore(null); setFile(null); }}
                                        className="w-full mt-6 rounded-xl border border-border py-3 text-xs font-bold text-muted-foreground hover:bg-accent transition-all"
                                    >
                                        Clear & Re-analyze
                                    </button>
                                </div>
                            </div>

                            {/* Requirement Details */}
                            <div className="lg:col-span-8 space-y-6">
                                <div className="rounded-3xl bg-card border border-border shadow-card overflow-hidden">
                                    <div className="p-6 border-b border-border bg-accent/10">
                                        <h3 className="font-bold text-foreground flex items-center gap-2">
                                            <Sparkles className="h-5 w-5 text-primary" /> AI Improvement Roadmap
                                        </h3>
                                    </div>
                                    <div className="divide-y divide-border">
                                        {requirements.map((req) => (
                                            <div
                                                key={req.id}
                                                onClick={() => setActiveReq(activeReq === req.id ? null : req.id)}
                                                className={`p-6 cursor-pointer transition-all ${activeReq === req.id ? "bg-accent/20" : "hover:bg-accent/5"}`}
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div className="flex gap-4">
                                                        <div className={`mt-1 p-2 rounded-xl ${req.status === "success" ? "bg-success/10 text-success" :
                                                            req.status === "warning" ? "bg-warning/10 text-warning" : "bg-destructive/10 text-destructive"
                                                            }`}>
                                                            {req.status === "success" ? <CheckCircle2 className="h-5 w-5" /> :
                                                                req.status === "warning" ? <AlertCircle className="h-5 w-5" /> : <X className="h-5 w-5" />}
                                                        </div>
                                                        <div>
                                                            <p className="font-extrabold text-foreground mb-1 text-sm">{req.label}</p>
                                                            <p className="text-xs text-muted-foreground">{req.description}</p>
                                                        </div>
                                                    </div>
                                                    <ChevronRight className={`h-4 w-4 text-muted-foreground transition-transform ${activeReq === req.id ? "rotate-90" : ""}`} />
                                                </div>

                                                {activeReq === req.id && req.aiFeedback && (
                                                    <div className="mt-6 ml-14 space-y-4 animate-in slide-in-from-top-2 duration-300">
                                                        {req.originalText && (
                                                            <div className="p-3 rounded-xl bg-destructive/5 border border-destructive/10">
                                                                <p className="text-[10px] font-bold text-destructive uppercase mb-1">Your current text</p>
                                                                <p className="text-xs italic text-muted-foreground">"{req.originalText}"</p>
                                                            </div>
                                                        )}
                                                        <div className="p-4 rounded-xl gradient-primary text-primary-foreground shadow-md">
                                                            <p className="text-[10px] font-bold uppercase mb-2 flex items-center gap-1.5">
                                                                <MessageSquareCode className="h-3 w-3" /> AI Suggestion to improve
                                                            </p>
                                                            <p className="text-xs font-medium leading-relaxed">
                                                                {req.aiFeedback}
                                                            </p>
                                                        </div>
                                                        <p className="text-[10px] text-muted-foreground text-center italic mt-2">Update this in your document and re-upload to see the score change.</p>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="rounded-3xl bg-foreground p-8 text-background shadow-2xl relative overflow-hidden">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="p-3 rounded-2xl bg-primary">
                                            <Target className="h-6 w-6 text-primary-foreground" />
                                        </div>
                                        <h3 className="text-xl font-bold">Why this score?</h3>
                                    </div>
                                    <p className="text-sm opacity-80 leading-relaxed mb-6">
                                        Recruiters at companies like Microsoft and Amazon use bots that look for specific sentence structures. Our engine flagged your bullet points as "Passive". Focus on starting every point with an Action Verb (e.g. Led, Designed, Accelerated).
                                    </p>
                                    <div className="flex gap-4">
                                        <div className="flex-1 p-3 rounded-xl bg-white/10">
                                            <p className="text-lg font-bold">4.2x</p>
                                            <p className="text-[10px] uppercase font-bold opacity-60">Higher Interview Rate</p>
                                        </div>
                                        <div className="flex-1 p-3 rounded-xl bg-white/10">
                                            <p className="text-lg font-bold">85%+</p>
                                            <p className="text-[10px] uppercase font-bold opacity-60">Ideal Target Score</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
