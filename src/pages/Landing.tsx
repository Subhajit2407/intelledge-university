import { useNavigate } from "react-router-dom";
import { GraduationCap, ArrowRight, CheckCircle2, Bot, Users, Sparkles, Globe, Shield } from "lucide-react";

export default function Landing() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-primary/20">
            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-slate-200/50 px-8 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-2.5 group cursor-pointer" onClick={() => navigate("/")}>
                        <div className="h-10 w-10 flex items-center justify-center rounded-xl gradient-primary shadow-primary-glow group-hover:rotate-6 transition-transform">
                            <GraduationCap className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-xl font-black tracking-tight text-slate-900 italic">IntellEdge</span>
                    </div>

                    <div className="hidden md:flex items-center gap-8">
                        <a href="#features" className="text-sm font-bold text-slate-500 hover:text-primary transition-colors">Features</a>
                        <a href="#intelligence" className="text-sm font-bold text-slate-500 hover:text-primary transition-colors">Neural Sync</a>
                        <a href="#placements" className="text-sm font-bold text-slate-500 hover:text-primary transition-colors">Placements</a>
                        <a href="#community" className="text-sm font-bold text-slate-500 hover:text-primary transition-colors">Community</a>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate("/login")}
                            className="text-sm font-bold text-slate-600 hover:text-slate-900 px-4 py-2 transition-colors"
                        >
                            Sign In
                        </button>
                        <button
                            onClick={() => navigate("/login?mode=signup")}
                            className="bg-[#0D2B1D] text-white text-sm font-bold px-6 py-2.5 rounded-full hover:shadow-xl hover:scale-105 transition-all active:scale-95"
                        >
                            Get Started
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="pt-40 pb-20 px-8">
                <div className="max-w-7xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 text-xs font-black uppercase tracking-widest mb-8 border border-emerald-100 animate-fade-in">
                        <Sparkles className="h-3 w-3" /> 30% faster academic reporting
                    </div>

                    <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-[#0D2B1D] mb-8 leading-[0.9] animate-in fade-in slide-in-from-bottom-8 duration-700">
                        The AI-Powered <br />
                        <span className="italic text-primary">University OS</span>
                    </h1>

                    <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-12 font-medium leading-relaxed animate-in fade-in slide-in-from-bottom-12 duration-1000">
                        IntellEdge helps you track grades, automate academic syncing, and secure elite placements with neural intelligence. Built for next-gen institutions.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-16 duration-1000">
                        <button
                            onClick={() => navigate("/login?mode=signup")}
                            className="bg-[#0D2B1D] text-white px-10 py-4 rounded-2xl font-black text-sm shadow-2xl hover:scale-105 transition-all flex items-center gap-2 group"
                        >
                            Initialize Profile <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button
                            className="bg-white border border-slate-200 text-[#0D2B1D] px-10 py-4 rounded-2xl font-black text-sm shadow-sm hover:bg-slate-50 transition-all"
                        >
                            Explore Capabilities
                        </button>
                    </div>

                    {/* Platform Mockup */}
                    <div className="mt-24 relative animate-in fade-in slide-in-from-bottom-24 duration-1000">
                        <div className="absolute inset-0 bg-primary/10 blur-[120px] rounded-full -z-10 animate-pulse" />
                        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] p-4 max-w-5xl mx-auto relative group overflow-hidden">
                            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-slate-100 px-4 py-1.5 rounded-full flex items-center gap-2 border border-slate-200 z-10">
                                <Shield className="h-3 w-3 text-emerald-600" />
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Secured for University Networks</span>
                            </div>

                            {/* Fake UI Preview */}
                            <div className="rounded-[1.5rem] bg-slate-50 border border-slate-100 aspect-video overflow-hidden relative">
                                <img
                                    src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2426"
                                    alt="Dashboard Preview"
                                    className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-1000"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-transparent to-transparent" />

                                {/* Floating Widgets */}
                                <div className="absolute top-20 left-10 p-6 bg-white rounded-3xl shadow-xl border border-slate-100 animate-bounce-slow">
                                    <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Academic Risk</p>
                                    <div className="flex items-center gap-4 font-black text-2xl text-emerald-600">
                                        9.3 <span className="text-sm text-slate-400">Stable</span>
                                    </div>
                                </div>

                                <div className="absolute bottom-20 right-10 p-6 bg-[#0D2B1D] text-white rounded-3xl shadow-xl border border-white/10 animate-pulse-slow">
                                    <p className="text-[10px] font-black text-emerald-400 uppercase mb-2">Neural Sync</p>
                                    <p className="text-xl font-bold">100% Operational</p>
                                    <div className="mt-2 h-1 w-full bg-white/10 rounded-full overflow-hidden">
                                        <div className="h-full w-full bg-emerald-500" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Trusted By Section */}
            <section className="bg-white py-20 border-y border-slate-100">
                <div className="max-w-7xl mx-auto px-8 text-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-12">Empowering Digital Institutions</p>
                    <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-40 grayscale group hover:grayscale-0 transition-all duration-500">
                        <span className="text-2xl font-black italic tracking-tighter">Metricly</span>
                        <span className="text-2xl font-black italic tracking-tighter">Velocity</span>
                        <span className="text-2xl font-black italic tracking-tighter">Neuralink</span>
                        <span className="text-2xl font-black italic tracking-tighter">Fluxbit</span>
                        <span className="text-2xl font-black italic tracking-tighter">Taskly</span>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section id="features" className="py-32 px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl font-black text-[#0D2B1D] mb-4">Precision Engineering for Education</h2>
                        <p className="text-slate-500 font-medium">Built with neural architectures to predict and enhance performance.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { icon: Bot, title: "AI Copilot", desc: "Real-time multilingual support for academic queries." },
                            { icon: Users, title: "Faculty Center", desc: "Batch management with institutional-level insights." },
                            { icon: Globe, title: "Placement Hub", desc: "Global hiring roadmap with active 2026 drive sync." }
                        ].map((feature, i) => (
                            <div key={i} className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all hover:-translate-y-2">
                                <div className="h-14 w-14 flex items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 mb-6">
                                    <feature.icon className="h-7 w-7" />
                                </div>
                                <h3 className="text-xl font-black text-[#0D2B1D] mb-3">{feature.title}</h3>
                                <p className="text-slate-500 font-medium leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer / CTA */}
            <footer className="bg-[#0D2B1D] text-white py-32 px-8 rounded-t-[5rem] mt-20">
                <div className="max-w-7xl mx-auto text-center">
                    <div className="h-20 w-20 flex items-center justify-center rounded-3xl bg-emerald-500/20 mx-auto mb-10">
                        <GraduationCap className="h-10 w-10 text-emerald-400" />
                    </div>
                    <h2 className="text-4xl font-black mb-8 leading-tight">Ready to bridge the gap <br /> between education and career?</h2>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <button
                            onClick={() => navigate("/login?mode=signup")}
                            className="bg-emerald-500 text-white px-12 py-5 rounded-2xl font-black text-sm shadow-2xl hover:bg-emerald-400 transition-all flex items-center gap-2 group"
                        >
                            Start Free Sync <ArrowRight className="h-4 w-4" />
                        </button>
                    </div>
                    <div className="mt-32 pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8 opacity-40 uppercase text-[10px] font-black tracking-widest">
                        <p>© 2026 IntellEdge AI Neural Systems</p>
                        <div className="flex gap-10">
                            <a href="#">Privacy</a>
                            <a href="#">Terms</a>
                            <a href="#">Security</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
