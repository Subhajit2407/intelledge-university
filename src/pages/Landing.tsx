import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
    GraduationCap, ArrowRight, Bot, BarChart3, Layout, Zap, Shield,
    Briefcase, Star, Users, ChevronDown, Sparkles, BookOpen, Trophy,
    TrendingUp, Globe, CheckCircle, Menu, X
} from "lucide-react";

export default function Landing() {
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeFeature, setActiveFeature] = useState(0);
    const heroRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 30);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => setActiveFeature(f => (f + 1) % 3), 3500);
        return () => clearInterval(interval);
    }, []);

    const navLinks = ["Features", "Modules", "Stats", "Network"];

    const features = [
        {
            icon: Bot,
            title: "AI Academic Copilot",
            desc: "Multilingual AI assistant with deep contextual understanding of course materials. Ask, clarify, and learn seamlessly.",
            color: "#34C759",
            bg: "rgba(52,199,89,0.08)"
        },
        {
            icon: BarChart3,
            title: "Growth Analytics",
            desc: "Visual data tracking to monitor progress, predict performance gaps, and identify tailored career paths.",
            color: "#007AFF",
            bg: "rgba(0,122,255,0.08)"
        },
        {
            icon: Briefcase,
            title: "Placement Intelligence",
            desc: "AI-driven career matching with live recruitment portal, company roadmaps, and readiness scoring.",
            color: "#FF9F0A",
            bg: "rgba(255,159,10,0.08)"
        }
    ];

    const stats = [
        { value: "10,000+", label: "Students Enrolled", icon: Users },
        { value: "98.3%", label: "Placement Rate", icon: Trophy },
        { value: "500+", label: "Partner Companies", icon: Globe },
        { value: "4.9★", label: "Average Rating", icon: Star },
    ];

    const modules = [
        { icon: BookOpen, label: "Academic Vault", desc: "Track subjects, attendance & grades in real-time", color: "#5E5CE6" },
        { icon: BarChart3, label: "Growth Analytics", desc: "GitHub-style performance visualization", color: "#007AFF" },
        { icon: Briefcase, label: "Placement Hub", desc: "Live job listings with AI matching engine", color: "#FF9F0A" },
        { icon: Layout, label: "Project Vault", desc: "Organize and showcase your project portfolio", color: "#FF375F" },
        { icon: Bot, label: "AI Copilot", desc: "24/7 multilingual academic assistant", color: "#34C759" },
        { icon: Shield, label: "ATS Checker", desc: "Resume analysis with industry-grade scoring", color: "#FF6B6B" },
    ];

    const testimonials = [
        { name: "Priya Sharma", role: "B.Tech CSE, Semester 6", text: "IntellEdge transformed how I track my academic progress. The AI copilot helped me crack my Java exam!", avatar: "P" },
        { name: "Rahul Verma", role: "B.Tech ECE, Semester 4", text: "The Placement Hub is incredible. Got matched with 3 companies in my first week. Real-time job listings!", avatar: "R" },
        { name: "Anjali Nair", role: "M.Tech AI, Semester 2", text: "Growth Analytics gave me insights I never had before. My GPA improved by a full point in one semester.", avatar: "A" },
    ];

    return (
        <div style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Plus Jakarta Sans', sans-serif" }}
            className="min-h-screen bg-[#F2F2F7] text-[#1C1C1E] overflow-hidden selection:bg-blue-200/40">

            {/* Ambient Backgrounds */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
                <div className="absolute top-[-15%] left-[-10%] w-[60%] h-[60%] rounded-full"
                    style={{ background: "radial-gradient(circle, rgba(52,199,89,0.12) 0%, transparent 70%)", filter: "blur(80px)" }} />
                <div className="absolute bottom-0 right-[-15%] w-[70%] h-[70%] rounded-full"
                    style={{ background: "radial-gradient(circle, rgba(0,122,255,0.08) 0%, transparent 70%)", filter: "blur(100px)" }} />
                <div className="absolute top-[40%] left-[30%] w-[40%] h-[40%] rounded-full"
                    style={{ background: "radial-gradient(circle, rgba(94,92,230,0.06) 0%, transparent 70%)", filter: "blur(80px)" }} />
            </div>

            {/* ── NAVIGATION ── */}
            <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled
                ? "backdrop-blur-2xl bg-white/80 border-b border-white/30 shadow-sm"
                : "bg-transparent"}`}
                style={{ WebkitBackdropFilter: "blur(20px)" }}>
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center gap-2.5 cursor-pointer group" onClick={() => navigate("/")}>
                        <div className="h-9 w-9 rounded-2xl flex items-center justify-center shadow-lg transition-all group-hover:scale-110 group-hover:rotate-3"
                            style={{ background: "linear-gradient(135deg, #0D2B1D 0%, #1a5c3a 100%)" }}>
                            <GraduationCap className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <span className="text-[17px] font-bold tracking-tight text-[#1C1C1E]">IntellEdge</span>
                            <span className="text-[9px] font-semibold block text-[#34C759] uppercase tracking-widest leading-none -mt-0.5">University AI</span>
                        </div>
                    </div>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map(item => (
                            <a key={item} href={`#${item.toLowerCase()}`}
                                className="text-sm font-semibold text-[#3A3A3C] hover:text-[#1C1C1E] transition-colors relative group">
                                {item}
                                <span className="absolute -bottom-0.5 left-0 w-0 h-[1.5px] bg-[#34C759] transition-all duration-300 group-hover:w-full rounded-full" />
                            </a>
                        ))}
                    </div>

                    {/* CTA Buttons */}
                    <div className="hidden md:flex items-center gap-3">
                        <button onClick={() => navigate("/login")}
                            className="text-sm font-semibold text-[#3A3A3C] hover:text-[#1C1C1E] px-4 py-2 rounded-xl transition-all hover:bg-black/5">
                            Log In
                        </button>
                        <button onClick={() => navigate("/login?mode=signup")}
                            className="text-sm font-bold px-5 py-2.5 rounded-2xl text-white shadow-lg hover:scale-105 transition-all active:scale-95"
                            style={{ background: "linear-gradient(135deg, #0D2B1D 0%, #1a5c3a 100%)", boxShadow: "0 4px 20px rgba(13,43,29,0.35)" }}>
                            Get Started →
                        </button>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button className="md:hidden p-2 rounded-xl hover:bg-black/5 transition-colors"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                        {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden px-6 pb-6 pt-2 space-y-2 border-t border-black/5"
                        style={{ background: "rgba(242,242,247,0.98)", backdropFilter: "blur(20px)" }}>
                        {navLinks.map(item => (
                            <a key={item} href={`#${item.toLowerCase()}`}
                                onClick={() => setMobileMenuOpen(false)}
                                className="block py-3 px-4 rounded-xl font-semibold text-sm text-[#3A3A3C] hover:bg-black/5 transition-colors">
                                {item}
                            </a>
                        ))}
                        <div className="pt-2 flex flex-col gap-2">
                            <button onClick={() => navigate("/login")}
                                className="w-full py-3 rounded-2xl font-semibold text-sm border border-black/10 hover:bg-black/5 transition-all">
                                Log In
                            </button>
                            <button onClick={() => navigate("/login?mode=signup")}
                                className="w-full py-3 rounded-2xl font-bold text-sm text-white"
                                style={{ background: "linear-gradient(135deg, #0D2B1D 0%, #1a5c3a 100%)" }}>
                                Get Started
                            </button>
                        </div>
                    </div>
                )}
            </nav>

            {/* ── HERO SECTION ── */}
            <main ref={heroRef} className="pt-36 pb-28 px-6 relative">
                <div className="max-w-5xl mx-auto text-center">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-10 border border-[#34C759]/20"
                        style={{ background: "rgba(52,199,89,0.08)", backdropFilter: "blur(12px)" }}>
                        <span className="h-1.5 w-1.5 rounded-full bg-[#34C759] animate-pulse" />
                        <span className="text-[11px] font-bold text-[#1a5c3a] uppercase tracking-[0.15em]">
                            Now Live · 2026 Placement Season
                        </span>
                    </div>

                    {/* Headline */}
                    <h1 className="text-5xl md:text-7xl font-black tracking-tight text-[#1C1C1E] mb-6 leading-[1.06]"
                        style={{ letterSpacing: "-0.03em" }}>
                        Academic Intelligence<br />
                        <span className="relative">
                            <span style={{ background: "linear-gradient(135deg, #34C759 0%, #007AFF 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                                Reimagined
                            </span>
                        </span>
                    </h1>

                    {/* Sub */}
                    <p className="text-lg md:text-xl text-[#48484A] max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
                        IntellEdge powers students and faculty with AI-driven insights,
                        real-time placement matching, and intelligent academic tracking.
                    </p>

                    {/* CTA Row */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
                        <button onClick={() => navigate("/login?mode=signup")}
                            className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl font-bold text-base text-white shadow-2xl hover:scale-[1.03] transition-all active:scale-95 group"
                            style={{ background: "linear-gradient(135deg, #0D2B1D 0%, #1a5c3a 100%)", boxShadow: "0 8px 32px rgba(13,43,29,0.35)" }}>
                            Start for Free
                            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button onClick={() => navigate("/login")}
                            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold text-base border transition-all hover:shadow-md active:scale-95"
                            style={{ background: "rgba(255,255,255,0.8)", backdropFilter: "blur(12px)", borderColor: "rgba(0,0,0,0.1)" }}>
                            <span className="text-[#3A3A3C]">Sign In</span>
                        </button>
                    </div>

                    {/* iOS-style App Preview Card */}
                    <div className="relative mx-auto max-w-4xl">
                        {/* Floating Pill Left */}
                        <div className="absolute -left-6 top-16 z-20 hidden lg:block animate-bounce-slow">
                            <div className="flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl border border-white/50"
                                style={{ background: "rgba(255,255,255,0.9)", backdropFilter: "blur(20px)" }}>
                                <div className="h-8 w-8 rounded-xl flex items-center justify-center"
                                    style={{ background: "rgba(52,199,89,0.15)" }}>
                                    <Zap className="h-4 w-4 text-[#34C759]" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-[#8E8E93] uppercase tracking-wider">Sync Status</p>
                                    <p className="text-sm font-black text-[#1C1C1E]">99.9% <span className="text-[10px] text-[#34C759] font-bold">Live</span></p>
                                </div>
                            </div>
                        </div>

                        {/* Floating Pill Right */}
                        <div className="absolute -right-6 bottom-24 z-20 hidden lg:block animate-float-delayed">
                            <div className="flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl border border-white/50"
                                style={{ background: "rgba(255,255,255,0.9)", backdropFilter: "blur(20px)" }}>
                                <div className="h-8 w-8 rounded-xl flex items-center justify-center"
                                    style={{ background: "rgba(0,122,255,0.15)" }}>
                                    <TrendingUp className="h-4 w-4 text-[#007AFF]" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-[#8E8E93] uppercase tracking-wider">AI Match Score</p>
                                    <p className="text-sm font-black text-[#1C1C1E]">96% <span className="text-[10px] text-[#007AFF] font-bold">+12%</span></p>
                                </div>
                            </div>
                        </div>

                        {/* macOS Window Frame */}
                        <div className="rounded-[2.5rem] border overflow-hidden shadow-2xl"
                            style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(40px)", borderColor: "rgba(0,0,0,0.08)", boxShadow: "0 40px 120px rgba(0,0,0,0.15), 0 0 0 1px rgba(255,255,255,0.5)" }}>
                            {/* Mac Chrome */}
                            <div className="flex items-center gap-2 px-6 py-4 border-b" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
                                <span className="h-3 w-3 rounded-full bg-[#FF5F57]" />
                                <span className="h-3 w-3 rounded-full bg-[#FFBD2E]" />
                                <span className="h-3 w-3 rounded-full bg-[#28C840]" />
                                <div className="ml-4 flex-1 max-w-xs mx-auto">
                                    <div className="rounded-lg px-3 py-1.5 text-xs text-center font-medium"
                                        style={{ background: "rgba(0,0,0,0.04)", color: "#8E8E93" }}>
                                        intelledge.university/dashboard
                                    </div>
                                </div>
                            </div>

                            {/* App Preview */}
                            <div className="grid" style={{ gridTemplateColumns: "200px 1fr", height: "480px" }}>
                                {/* Sidebar Preview */}
                                <div className="border-r p-5 flex flex-col gap-4" style={{ borderColor: "rgba(0,0,0,0.06)", background: "rgba(250,250,252,0.8)" }}>
                                    <div className="h-8 w-28 rounded-xl animate-pulse" style={{ background: "rgba(0,0,0,0.07)" }} />
                                    <div className="flex flex-col gap-2">
                                        {[
                                            { label: "Dashboard", active: true, color: "#34C759" },
                                            { label: "Academics", active: false },
                                            { label: "Placement Hub", active: false },
                                            { label: "Analytics", active: false },
                                            { label: "AI Copilot", active: false },
                                        ].map((item, i) => (
                                            <div key={i} className="h-9 rounded-xl px-3 flex items-center gap-2"
                                                style={{ background: item.active ? "rgba(52,199,89,0.12)" : "transparent" }}>
                                                <div className="h-2 w-2 rounded-full" style={{ background: item.active ? "#34C759" : "rgba(0,0,0,0.1)" }} />
                                                <div className="h-2 rounded flex-1" style={{ background: item.active ? "rgba(52,199,89,0.3)" : "rgba(0,0,0,0.08)" }} />
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-auto">
                                        <div className="h-16 rounded-2xl p-3" style={{ background: "rgba(52,199,89,0.08)", border: "1px solid rgba(52,199,89,0.2)" }}>
                                            <div className="h-2 w-20 rounded mb-2" style={{ background: "rgba(52,199,89,0.4)" }} />
                                            <div className="h-2 w-16 rounded" style={{ background: "rgba(0,0,0,0.08)" }} />
                                        </div>
                                    </div>
                                </div>

                                {/* Main Content Preview */}
                                <div className="p-8 overflow-hidden flex flex-col gap-6">
                                    {/* Header */}
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <div className="h-3 w-24 rounded mb-2" style={{ background: "rgba(0,0,0,0.06)" }} />
                                            <div className="h-7 w-52 rounded-xl" style={{ background: "rgba(0,0,0,0.08)" }} />
                                        </div>
                                        <div className="flex gap-2">
                                            <div className="h-9 w-9 rounded-full" style={{ background: "rgba(0,0,0,0.06)" }} />
                                            <div className="h-9 w-28 rounded-xl" style={{ background: "rgba(0,0,0,0.06)" }} />
                                        </div>
                                    </div>

                                    {/* Stats Row */}
                                    <div className="grid grid-cols-4 gap-3">
                                        {[
                                            { c: "#34C759", v: "8.7", l: "CGPA" },
                                            { c: "#007AFF", v: "87%", l: "Attendance" },
                                            { c: "#FF9F0A", v: "96%", l: "AI Match" },
                                            { c: "#5E5CE6", v: "12", l: "Tasks" },
                                        ].map((s, i) => (
                                            <div key={i} className="rounded-2xl p-3"
                                                style={{ background: `rgba(${s.c === "#34C759" ? "52,199,89" : s.c === "#007AFF" ? "0,122,255" : s.c === "#FF9F0A" ? "255,159,10" : "94,92,230"},0.08)` }}>
                                                <div className="h-5 w-10 rounded-lg mb-1" style={{ background: `${s.c}30` }} />
                                                <div className="h-2 w-full rounded" style={{ background: `${s.c}20` }} />
                                            </div>
                                        ))}
                                    </div>

                                    {/* Chart Mock */}
                                    <div className="flex-1 rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.8)", border: "1px solid rgba(0,0,0,0.05)" }}>
                                        <div className="h-3 w-28 rounded mb-4" style={{ background: "rgba(0,0,0,0.07)" }} />
                                        <div className="flex items-end gap-1.5 h-24">
                                            {[35, 60, 50, 80, 65, 90, 55, 75, 85, 70, 95, 60].map((h, i) => (
                                                <div key={i} className="flex-1 rounded-t-lg transition-all hover:opacity-80"
                                                    style={{ height: `${h}%`, background: i === 10 ? "linear-gradient(to top, #34C759, #007AFF)" : "rgba(0,0,0,0.07)" }} />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Scroll cue */}
                    <div className="mt-16 flex flex-col items-center gap-2 opacity-40">
                        <p className="text-xs font-semibold uppercase tracking-widest text-[#8E8E93]">Scroll to explore</p>
                        <ChevronDown className="h-4 w-4 text-[#8E8E93] animate-bounce" />
                    </div>
                </div>
            </main>

            {/* ── STATS SECTION ── */}
            <section id="stats" className="py-20 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {stats.map((s, i) => (
                            <div key={i} className="rounded-3xl p-6 text-center transition-all hover:-translate-y-1 hover:shadow-lg"
                                style={{ background: "rgba(255,255,255,0.8)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.6)", boxShadow: "0 2px 20px rgba(0,0,0,0.04)" }}>
                                <s.icon className="h-6 w-6 mx-auto mb-3 text-[#34C759]" />
                                <p className="text-3xl font-black text-[#1C1C1E] mb-1">{s.value}</p>
                                <p className="text-xs font-semibold text-[#8E8E93] uppercase tracking-wider">{s.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── FEATURES SECTION ── */}
            <section id="features" className="py-24 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-5"
                            style={{ background: "rgba(0,122,255,0.08)", border: "1px solid rgba(0,122,255,0.15)" }}>
                            <Sparkles className="h-3.5 w-3.5 text-[#007AFF]" />
                            <span className="text-[11px] font-bold text-[#007AFF] uppercase tracking-widest">Core Intelligence</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-[#1C1C1E] mb-5 tracking-tight" style={{ letterSpacing: "-0.02em" }}>
                            Precision tools for<br />next-gen learners
                        </h2>
                        <p className="text-lg text-[#48484A] max-w-xl mx-auto font-medium">
                            Built with neural architectures that predict gaps and streamline the academic journey for every stakeholder.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-5">
                        {features.map((f, i) => (
                            <div key={i}
                                onMouseEnter={() => setActiveFeature(i)}
                                className={`group rounded-[2rem] p-8 cursor-default transition-all duration-500 ${activeFeature === i ? "scale-[1.02] shadow-2xl" : "hover:scale-[1.01]"}`}
                                style={{
                                    background: activeFeature === i ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.7)",
                                    backdropFilter: "blur(20px)",
                                    border: `1px solid ${activeFeature === i ? f.color + "30" : "rgba(0,0,0,0.06)"}`,
                                    boxShadow: activeFeature === i ? `0 20px 60px ${f.color}15` : "0 2px 20px rgba(0,0,0,0.04)"
                                }}>
                                <div className="h-14 w-14 rounded-2xl flex items-center justify-center mb-6 transition-all group-hover:scale-110 group-hover:rotate-3"
                                    style={{ background: f.bg, border: `1px solid ${f.color}20` }}>
                                    <f.icon className="h-7 w-7" style={{ color: f.color }} />
                                </div>
                                <h3 className="text-xl font-black text-[#1C1C1E] mb-3">{f.title}</h3>
                                <p className="text-[#48484A] font-medium leading-relaxed text-sm">{f.desc}</p>
                                <div className="mt-6 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <CheckCircle className="h-3.5 w-3.5" style={{ color: f.color }} />
                                    <span className="text-xs font-bold" style={{ color: f.color }}>Module fully operational</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── MODULES SECTION ── */}
            <section id="modules" className="py-24 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-5"
                            style={{ background: "rgba(94,92,230,0.08)", border: "1px solid rgba(94,92,230,0.15)" }}>
                            <Layout className="h-3.5 w-3.5 text-[#5E5CE6]" />
                            <span className="text-[11px] font-bold text-[#5E5CE6] uppercase tracking-widest">Platform Modules</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-[#1C1C1E] mb-5 tracking-tight" style={{ letterSpacing: "-0.02em" }}>
                            Everything you need,<br />nothing you don't
                        </h2>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {modules.map((m, i) => (
                            <div key={i} className="group rounded-3xl p-6 transition-all hover:-translate-y-1 hover:shadow-xl cursor-default"
                                style={{ background: "rgba(255,255,255,0.8)", backdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,0.6)", boxShadow: "0 2px 20px rgba(0,0,0,0.04)" }}>
                                <div className="h-12 w-12 rounded-2xl flex items-center justify-center mb-4 transition-all group-hover:scale-110"
                                    style={{ background: `${m.color}12` }}>
                                    <m.icon className="h-6 w-6" style={{ color: m.color }} />
                                </div>
                                <h3 className="text-base font-black text-[#1C1C1E] mb-1.5">{m.label}</h3>
                                <p className="text-xs text-[#8E8E93] font-medium leading-relaxed">{m.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── TESTIMONIALS ── */}
            <section className="py-24 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-black text-[#1C1C1E] mb-4 tracking-tight" style={{ letterSpacing: "-0.02em" }}>
                            Loved by students
                        </h2>
                        <p className="text-lg text-[#48484A] font-medium">Real results from real learners across India.</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-5">
                        {testimonials.map((t, i) => (
                            <div key={i} className="rounded-3xl p-7 transition-all hover:-translate-y-1 hover:shadow-xl"
                                style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,0.6)", boxShadow: "0 2px 20px rgba(0,0,0,0.04)" }}>
                                <div className="flex mb-4 gap-0.5">
                                    {[...Array(5)].map((_, j) => (
                                        <Star key={j} className="h-4 w-4 text-[#FF9F0A] fill-[#FF9F0A]" />
                                    ))}
                                </div>
                                <p className="text-sm text-[#3A3A3C] font-medium leading-relaxed mb-6 italic">"{t.text}"</p>
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-2xl flex items-center justify-center font-black text-white text-sm"
                                        style={{ background: "linear-gradient(135deg, #0D2B1D, #34C759)" }}>
                                        {t.avatar}
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-[#1C1C1E]">{t.name}</p>
                                        <p className="text-[11px] text-[#8E8E93] font-semibold">{t.role}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── NETWORK SECTION ── */}
            <section id="network" className="py-24 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="rounded-[3rem] p-14 text-center relative overflow-hidden"
                        style={{ background: "linear-gradient(135deg, #0D2B1D 0%, #1a4a2e 50%, #0D2B1D 100%)", boxShadow: "0 40px 100px rgba(13,43,29,0.4)" }}>
                        {/* Decorative Blobs */}
                        <div className="absolute top-0 left-0 w-64 h-64 rounded-full -translate-x-1/2 -translate-y-1/2"
                            style={{ background: "radial-gradient(circle, rgba(52,199,89,0.15) 0%, transparent 70%)" }} />
                        <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full translate-x-1/2 translate-y-1/2"
                            style={{ background: "radial-gradient(circle, rgba(0,122,255,0.15) 0%, transparent 70%)" }} />

                        <div className="relative z-10">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8"
                                style={{ background: "rgba(52,199,89,0.15)", border: "1px solid rgba(52,199,89,0.2)" }}>
                                <Globe className="h-4 w-4 text-[#34C759]" />
                                <span className="text-xs font-bold text-[#34C759] uppercase tracking-widest">Hiring Network 2026</span>
                            </div>
                            <h2 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight" style={{ letterSpacing: "-0.02em" }}>
                                Bridge education<br />and career
                            </h2>
                            <p className="text-lg text-white/60 max-w-xl mx-auto mb-10 font-medium">
                                Connect with 500+ companies actively recruiting through IntellEdge's AI-powered placement network.
                            </p>

                            <div className="flex flex-wrap justify-center gap-3 mb-10">
                                {["TCS", "Infosys", "Microsoft", "Google", "Amazon", "Wipro", "Anthropic", "Adobe"].map(c => (
                                    <span key={c} className="px-4 py-2 rounded-xl text-sm font-bold text-white/80"
                                        style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}>
                                        {c}
                                    </span>
                                ))}
                            </div>

                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <button onClick={() => navigate("/login?mode=signup")}
                                    className="px-10 py-4 rounded-2xl font-black text-base text-[#0D2B1D] hover:scale-105 transition-all shadow-lg active:scale-95"
                                    style={{ background: "#34C759", boxShadow: "0 8px 30px rgba(52,199,89,0.4)" }}>
                                    Start Your Journey →
                                </button>
                                <button onClick={() => navigate("/login")}
                                    className="px-10 py-4 rounded-2xl font-bold text-base text-white border hover:bg-white/10 transition-all"
                                    style={{ borderColor: "rgba(255,255,255,0.2)" }}>
                                    Already a member? Sign in
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── FOOTER ── */}
            <footer className="px-6 pt-16 pb-10">
                <div className="max-w-6xl mx-auto">
                    <div className="rounded-[2.5rem] px-10 pt-12 pb-8"
                        style={{ background: "rgba(255,255,255,0.8)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.6)", boxShadow: "0 2px 20px rgba(0,0,0,0.04)" }}>

                        {/* Footer Top */}
                        <div className="grid md:grid-cols-4 gap-10 mb-12">
                            {/* Brand */}
                            <div className="md:col-span-2">
                                <div className="flex items-center gap-2.5 mb-4">
                                    <div className="h-9 w-9 rounded-2xl flex items-center justify-center"
                                        style={{ background: "linear-gradient(135deg, #0D2B1D 0%, #1a5c3a 100%)" }}>
                                        <GraduationCap className="h-5 w-5 text-white" />
                                    </div>
                                    <div>
                                        <span className="text-[17px] font-bold tracking-tight text-[#1C1C1E]">IntellEdge</span>
                                        <span className="text-[9px] font-semibold block text-[#34C759] uppercase tracking-widest leading-none">University AI</span>
                                    </div>
                                </div>
                                <p className="text-sm text-[#8E8E93] font-medium leading-relaxed max-w-xs">
                                    Transforming academic journeys with AI-powered insights, real-time placement matching, and data-driven intelligence.
                                </p>
                                <div className="flex items-center gap-2 mt-5 text-xs text-[#34C759] font-bold">
                                    <span className="h-2 w-2 rounded-full bg-[#34C759] animate-pulse" />
                                    All systems operational · v4.2.2-STABLE
                                </div>
                            </div>

                            {/* Links */}
                            <div>
                                <h4 className="text-xs font-black text-[#1C1C1E] uppercase tracking-widest mb-4">Platform</h4>
                                <ul className="space-y-3">
                                    {["Student Dashboard", "Academic Vault", "Placement Hub", "AI Copilot", "ATS Checker"].map(item => (
                                        <li key={item}>
                                            <a href="#" className="text-sm text-[#8E8E93] font-medium hover:text-[#1C1C1E] transition-colors">{item}</a>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div>
                                <h4 className="text-xs font-black text-[#1C1C1E] uppercase tracking-widest mb-4">Company</h4>
                                <ul className="space-y-3">
                                    {["About Us", "Privacy Policy", "Terms of Service", "Support", "Contact"].map(item => (
                                        <li key={item}>
                                            <a href="#" className="text-sm text-[#8E8E93] font-medium hover:text-[#1C1C1E] transition-colors">{item}</a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Footer Bottom */}
                        <div className="pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-4"
                            style={{ borderColor: "rgba(0,0,0,0.06)" }}>
                            <p className="text-xs text-[#8E8E93] font-medium">
                                © 2026 IntellEdge University AI · Inceptrix Systems · All rights reserved.
                            </p>
                            <div className="flex items-center gap-6">
                                {["Privacy", "Terms", "Infrastructure", "Support"].map(item => (
                                    <a key={item} href="#"
                                        className="text-xs font-semibold text-[#8E8E93] hover:text-[#1C1C1E] transition-colors">
                                        {item}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </footer>

            {/* Animations */}
            <style>{`
        @keyframes bounceSlow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-slow {
          animation: bounceSlow 4s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: bounceSlow 4s ease-in-out infinite 2s;
        }
      `}</style>
        </div>
    );
}
