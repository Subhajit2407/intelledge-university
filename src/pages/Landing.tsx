import { useNavigate } from "react-router-dom";
import { GraduationCap, ArrowRight, CheckCircle2, Bot, Users, Sparkles, Globe, Shield, Zap, BarChart3, Layout, Layers } from "lucide-react";

export default function Landing() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-primary/20 overflow-hidden">
            {/* Background Gradients */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
                <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-emerald-100/30 rounded-full blur-[120px] animate-pulse-slow" />
                <div className="absolute bottom-[20%] right-[-10%] w-[50%] h-[50%] bg-blue-50/50 rounded-full blur-[120px]" />
                <div className="absolute top-[40%] left-[20%] w-[30%] h-[30%] bg-primary/5 rounded-full blur-[100px] animate-float" />
            </div>

            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 glass px-8 py-5">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-2 group cursor-pointer" onClick={() => navigate("/")}>
                        <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-[#0D2B1D] text-white shadow-xl group-hover:rotate-6 transition-transform">
                            <GraduationCap className="h-6 w-6" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-[#0D2B1D]">IntellEdge</span>
                    </div>

                    <div className="hidden lg:flex items-center gap-10">
                        {["Features", "Systems", "Network", "Impact"].map((item) => (
                            <a
                                key={item}
                                href={`#${item.toLowerCase()}`}
                                className="text-sm font-semibold text-slate-600 hover:text-[#0D2B1D] transition-colors relative group"
                            >
                                {item}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#0D2B1D] transition-all group-hover:w-full" />
                            </a>
                        ))}
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate("/login")}
                            className="text-sm font-bold text-slate-600 hover:text-[#0D2B1D] px-4 py-2 transition-colors"
                        >
                            Log In
                        </button>
                        <button
                            onClick={() => navigate("/login?mode=signup")}
                            className="bg-[#0D2B1D] text-white text-sm font-bold px-7 py-3 rounded-full hover:shadow-[0_20px_40px_-10px_rgba(13,43,29,0.3)] hover:-translate-y-0.5 transition-all active:scale-95"
                        >
                            Get Started
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="pt-48 pb-20 px-8 relative">
                <div className="max-w-5xl mx-auto text-center relative">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-slate-200 text-[#0D2B1D] text-xs font-bold uppercase tracking-widest mb-10 animate-in fade-in slide-in-from-top-4 duration-1000">
                        <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                        30% more efficient academic syncing
                    </div>

                    <h1 className="text-6xl md:text-[5.5rem] font-bold tracking-tight text-[#0D2B1D] mb-8 leading-[1.05] animate-in fade-in slide-in-from-bottom-8 duration-700">
                        Intelligent AI-powered <br />
                        <span className="text-slate-400 font-medium">Academic Platform</span>
                    </h1>

                    <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-14 font-medium leading-relaxed animate-in fade-in slide-in-from-bottom-12 duration-1000">
                        IntellEdge helps you track progress, automate workflows, and empower
                        students and faculty with data-driven academic intelligence.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-5 animate-in fade-in slide-in-from-bottom-16 duration-1000">
                        <button
                            onClick={() => navigate("/login?mode=signup")}
                            className="bg-[#0D2B1D] text-white px-10 py-4.5 rounded-2xl font-bold text-base shadow-2xl hover:scale-105 transition-all flex items-center gap-3 group"
                        >
                            Initialize System <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button
                            className="bg-white border border-slate-200 text-[#0D2B1D] px-10 py-4.5 rounded-2xl font-bold text-base shadow-sm hover:bg-slate-50 transition-all hover:border-slate-300"
                        >
                            View Blueprint
                        </button>
                    </div>

                    {/* Platform Mockup - High Fidelity */}
                    <div className="mt-32 relative group">
                        <div className="absolute inset-0 bg-primary/20 blur-[150px] rounded-full -z-10 opacity-30 group-hover:opacity-50 transition-opacity duration-1000" />

                        <div className="bg-slate-100/50 p-3 rounded-[3rem] border border-slate-200 relative overflow-hidden animate-in fade-in slide-in-from-bottom-24 duration-1000 shadow-2xl">
                            <div className="bg-white rounded-[2.2rem] border border-slate-200 shadow-inner p-2 relative">
                                {/* Browser Chrome */}
                                <div className="flex items-center gap-1.5 px-6 py-4 border-b border-slate-100">
                                    <div className="flex gap-1.5">
                                        <div className="h-3 w-3 rounded-full bg-red-400" />
                                        <div className="h-3 w-3 rounded-full bg-amber-400" />
                                        <div className="h-3 w-3 rounded-full bg-green-400" />
                                    </div>
                                    <div className="ml-4 h-6 w-64 bg-slate-50 rounded-full border border-slate-100 flex items-center px-4">
                                        <div className="h-2 w-20 bg-slate-200 rounded-full" />
                                    </div>
                                </div>

                                {/* Actual UI Preview */}
                                <div className="bg-slate-50 grid grid-cols-[200px_1fr] h-[550px] overflow-hidden">
                                    {/* Mock Sidebar */}
                                    <div className="border-r border-slate-200 p-6 space-y-6">
                                        <div className="h-8 w-32 bg-slate-200 rounded-lg animate-pulse" />
                                        <div className="space-y-3">
                                            {[1, 2, 3, 4, 5].map(i => (
                                                <div key={i} className={`h-8 rounded-lg ${i === 1 ? 'bg-primary/20 cursor-default' : 'bg-slate-100'}`} />
                                            ))}
                                        </div>
                                        <div className="pt-20">
                                            <div className="h-12 w-full bg-slate-200 rounded-xl" />
                                        </div>
                                    </div>

                                    {/* Mock Content */}
                                    <div className="p-10 space-y-8 overflow-y-auto custom-scrollbar">
                                        <div className="flex items-end justify-between">
                                            <div className="space-y-2">
                                                <div className="h-4 w-24 bg-slate-200 rounded" />
                                                <div className="h-8 w-48 bg-slate-300 rounded-lg" />
                                            </div>
                                            <div className="flex gap-3">
                                                <div className="h-10 w-10 rounded-full bg-slate-200" />
                                                <div className="h-10 w-24 bg-slate-200 rounded-lg" />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-3 gap-6">
                                            <div className="glass p-6 rounded-3xl space-y-4 shadow-sm border-slate-200">
                                                <div className="h-3 w-20 bg-slate-200 rounded" />
                                                <div className="h-10 w-12 bg-primary/20 rounded-lg" />
                                                <div className="h-2 w-full bg-slate-100 rounded-full">
                                                    <div className="h-full w-2/3 bg-primary rounded-full" />
                                                </div>
                                            </div>
                                            <div className="glass p-6 rounded-3xl space-y-4 shadow-sm border-slate-200">
                                                <div className="h-3 w-20 bg-slate-200 rounded" />
                                                <div className="h-10 w-12 bg-blue-100 rounded-lg" />
                                                <div className="h-2 w-full bg-slate-100 rounded-full">
                                                    <div className="h-full w-4/5 bg-blue-500 rounded-full" />
                                                </div>
                                            </div>
                                            <div className="glass p-6 rounded-3xl space-y-4 shadow-sm border-slate-200">
                                                <div className="h-3 w-20 bg-slate-200 rounded" />
                                                <div className="h-10 w-12 bg-amber-100 rounded-lg" />
                                                <div className="h-2 w-full bg-slate-100 rounded-full">
                                                    <div className="h-full w-1/2 bg-amber-500 rounded-full" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
                                            <div className="h-4 w-32 bg-slate-200 rounded mb-6" />
                                            <div className="h-48 w-full bg-slate-50 rounded-2xl flex items-end gap-2 p-6 justify-between">
                                                {[45, 75, 55, 95, 65, 85, 50, 70, 90, 60].map((h, i) => (
                                                    <div key={i} style={{ height: `${h}%` }} className="w-full bg-slate-200 rounded-t-lg transition-all hover:bg-primary/40 cursor-pointer" />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Floating Stats */}
                            <div className="absolute top-1/4 -left-12 p-6 glass rounded-3xl shadow-2xl border-white animate-float z-20 hidden md:block">
                                <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Sync Status</p>
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                                        <Zap className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-xl font-bold text-[#0D2B1D]">99.9%</p>
                                        <p className="text-[10px] text-emerald-600 font-bold">Operational</p>
                                    </div>
                                </div>
                            </div>

                            <div className="absolute bottom-1/3 -right-12 p-6 glass rounded-3xl shadow-2xl border-white animate-float-delayed z-20 hidden md:block">
                                <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Academic Index</p>
                                <div className="flex items-center gap-4 font-bold text-2xl text-[#0D2B1D]">
                                    9.3 <span className="text-xs text-emerald-600 px-2 py-1 bg-emerald-100 rounded-full">+12%</span>
                                </div>
                                <div className="mt-4 flex gap-1">
                                    {[1, 2, 3, 4, 5, 6].map(i => (
                                        <div key={i} className="h-1 w-6 bg-slate-100 rounded-full overflow-hidden">
                                            <div className="h-full w-full bg-primary" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Trusted By Section */}
            <section className="bg-white py-24 relative">
                <div className="max-w-7xl mx-auto px-8 text-center">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.4em] mb-12">Empowering Digital Foundations</p>
                    <div className="grid grid-cols-2 md:grid-cols-5 items-center gap-12 md:gap-20 opacity-30 grayscale group hover:grayscale-0 transition-all duration-700">
                        <div className="flex items-center justify-center gap-2">
                            <Layers className="h-6 w-6" />
                            <span className="text-xl font-bold tracking-tighter">METRICLY</span>
                        </div>
                        <div className="flex items-center justify-center gap-2">
                            <Box className="h-6 w-6" />
                            <span className="text-xl font-bold tracking-tighter">VELOX</span>
                        </div>
                        <div className="flex items-center justify-center gap-2">
                            <Circle className="h-6 w-6" />
                            <span className="text-xl font-bold tracking-tighter">NEURALINK</span>
                        </div>
                        <div className="flex items-center justify-center gap-2">
                            <Square className="h-6 w-6" />
                            <span className="text-xl font-bold tracking-tighter">FLUXBIT</span>
                        </div>
                        <div className="flex items-center justify-center gap-2">
                            <Triangle className="h-6 w-6" />
                            <span className="text-xl font-bold tracking-tighter">TASKLY</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-32 px-8 bg-slate-50/50">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
                        <div className="max-w-xl">
                            <h2 className="text-4xl md:text-5xl font-bold text-[#0D2B1D] mb-6 leading-tight">Precision Intelligence <br /> for Next-Gen Learning</h2>
                            <p className="text-slate-500 font-medium text-lg leading-relaxed">
                                Built with neural architectures to predict performance gaps and
                                streamline the academic journey for every stakeholder.
                            </p>
                        </div>
                        <button className="text-[#0D2B1D] font-bold flex items-center gap-2 group hover:text-primary transition-colors">
                            Explore All Modules <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Bot,
                                title: "AI Academic Copilot",
                                desc: "Dynamic multilingual support with deep contextual understanding of course materials.",
                                color: "emerald"
                            },
                            {
                                icon: BarChart3,
                                title: "Growth Analytics",
                                desc: "Visual data tracking for students to monitor their progress and identify potential career paths.",
                                color: "blue"
                            },
                            {
                                icon: Layout,
                                title: "Resource Vault",
                                desc: "Centralized hub for all academic documents, projects, and institutional resources.",
                                color: "amber"
                            }
                        ].map((feature, i) => (
                            <div key={i} className="group bg-white p-10 rounded-[3rem] border border-slate-100 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.03)] hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] transition-all hover:-translate-y-2">
                                <div className={`h-16 w-16 flex items-center justify-center rounded-2xl mb-8 transition-transform group-hover:scale-110 group-hover:rotate-3 ${feature.color === 'emerald' ? 'bg-emerald-50 text-emerald-600' :
                                        feature.color === 'blue' ? 'bg-blue-50 text-blue-600' :
                                            'bg-amber-50 text-amber-600'
                                    }`}>
                                    <feature.icon className="h-8 w-8" />
                                </div>
                                <h3 className="text-2xl font-bold text-[#0D2B1D] mb-4">{feature.title}</h3>
                                <p className="text-slate-500 font-medium leading-relaxed">{feature.desc}</p>
                                <div className="mt-8 pt-6 border-t border-slate-50 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="text-xs font-bold text-slate-400 flex items-center gap-2">
                                        Module fully operational <Zap className="h-3 w-3 text-primary" />
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer / Final CTA */}
            <footer className="bg-[#0D2B1D] text-white pt-32 pb-16 px-8 rounded-t-[4rem] relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-32">
                        <div className="h-20 w-20 flex items-center justify-center rounded-[2rem] bg-emerald-500/10 backdrop-blur-xl border border-white/5 mx-auto mb-10">
                            <GraduationCap className="h-10 w-10 text-emerald-400" />
                        </div>
                        <h2 className="text-4xl md:text-6xl font-bold mb-10 leading-[1.1]">Bridge the gap between <br /> education and career.</h2>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                            <button
                                onClick={() => navigate("/login?mode=signup")}
                                className="bg-emerald-500 text-white px-12 py-5 rounded-2xl font-bold text-lg shadow-[0_20px_50px_-10px_rgba(16,185,129,0.3)] hover:bg-emerald-400 hover:scale-105 transition-all flex items-center gap-3 group"
                            >
                                Start Your Sync <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row items-center justify-between pt-16 border-t border-white/5 gap-10">
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 flex items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
                                <GraduationCap className="h-5 w-5" />
                            </div>
                            <span className="text-lg font-bold tracking-tight">IntellEdge AI</span>
                        </div>

                        <div className="flex flex-wrap justify-center gap-10 font-semibold text-slate-400 text-sm">
                            <a href="#" className="hover:text-white transition-colors">Infrastructure</a>
                            <a href="#" className="hover:text-white transition-colors">Privacy</a>
                            <a href="#" className="hover:text-white transition-colors">Terms</a>
                            <a href="#" className="hover:text-white transition-colors">Support</a>
                        </div>

                        <p className="text-slate-500 text-sm">© 2026 Neural Systems. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

// Simple Icon Components for trust section
function Box({ className }: { className?: string }) {
    return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" /><path d="m3.3 7 8.7 5 8.7-5" /><path d="M12 22V12" /></svg>
}
function Circle({ className }: { className?: string }) {
    return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /></svg>
}
function Square({ className }: { className?: string }) {
    return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" /></svg>
}
function Triangle({ className }: { className?: string }) {
    return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /></svg>
}
