import { useState, useEffect } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { TopBar } from "@/components/dashboard/TopBar";
import { User, Camera, Save, ArrowLeft, GraduationCap, Mail, Book, Hash } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function Profile() {
    const navigate = useNavigate();
    const [profileData, setProfileData] = useState<any>({
        name: "",
        roll: "",
        department: "B.Tech CSE",
        semester: "",
        email: "",
        bio: "",
        profilePic: ""
    });

    const role = localStorage.getItem("intelledge_role");

    useEffect(() => {
        const key = role === 'teacher' ? "teacher_profile_data" : "student_profile_data";
        const savedData = localStorage.getItem(key);
        if (savedData) {
            setProfileData(JSON.parse(savedData));
        }
    }, [role]);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileData((prev: any) => ({ ...prev, profilePic: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const key = role === 'teacher' ? "teacher_profile_data" : "student_profile_data";
        localStorage.setItem(key, JSON.stringify(profileData));
        if (role === 'student') localStorage.setItem("student_setup_complete", "true");
        else localStorage.setItem("teacher_setup_complete", "true");
        toast.success("Intelligence profile updated successfully!");
    };

    return (
        <div className="flex h-screen overflow-hidden bg-background">
            <Sidebar />
            <div className="flex flex-1 flex-col overflow-hidden">
                <TopBar />
                <main className="flex-1 overflow-y-auto px-8 py-6">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex items-center gap-4 mb-8">
                            <button
                                onClick={() => navigate(-1)}
                                className="p-2 rounded-xl bg-accent hover:bg-accent/80 transition-colors"
                            >
                                <ArrowLeft className="h-5 w-5" />
                            </button>
                            <div>
                                <h1 className="text-2xl font-black italic tracking-tight">
                                    {role === 'teacher' ? 'Faculty Identity Node' : 'Intelligence Profile'}
                                </h1>
                                <p className="text-sm text-muted-foreground">
                                    {role === 'teacher' ? 'Manage your teaching credentials and institutional presence' : 'Manage your academic identity and system parameters'}
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Left Column - Avatar & Info Summary */}
                            <div className="lg:col-span-1 space-y-6">
                                <div className="rounded-[2.5rem] bg-card border border-border p-8 shadow-card flex flex-col items-center text-center">
                                    <div className="relative group mb-6">
                                        <div className="h-32 w-32 rounded-[2rem] bg-accent border-4 border-background overflow-hidden shadow-xl ring-4 ring-primary/10">
                                            {profileData.profilePic ? (
                                                <img src={profileData.profilePic} alt="Profile" className="h-full w-full object-cover" />
                                            ) : (
                                                <div className="h-full w-full flex items-center justify-center bg-primary/10 text-primary font-black text-4xl">
                                                    {profileData.name?.[0] || <User className="h-12 w-12" />}
                                                </div>
                                            )}
                                        </div>
                                        <label className="absolute -bottom-2 -right-2 p-2.5 rounded-2xl bg-primary text-white shadow-primary-glow cursor-pointer hover:scale-110 transition-transform">
                                            <Camera className="h-4 w-4" />
                                            <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                        </label>
                                    </div>
                                    <h2 className="text-xl font-black text-foreground">{profileData.name || (role === 'teacher' ? "Faculty Member" : "System User")}</h2>
                                    <p className="text-xs font-bold text-primary uppercase tracking-[0.2em] mb-4">{profileData.department}</p>

                                    <div className="w-full pt-6 border-t border-border space-y-3">
                                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">
                                            <span>Auth Tier</span>
                                            <span className="text-success italic">{role === 'teacher' ? 'Faculty Admin' : 'Standard Student'}</span>
                                        </div>
                                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">
                                            <span>System Node</span>
                                            <span className="text-foreground">{role === 'teacher' ? 'Master-Node-A' : 'Edge-Node-12'}</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => {
                                            if (confirm("This will permanently wipe all local intelligence, records, and sessions. Proceed?")) {
                                                localStorage.clear();
                                                window.location.href = "/login";
                                            }
                                        }}
                                        className="w-full mt-6 py-3 rounded-2xl bg-rose-50 text-rose-600 text-[10px] font-black uppercase tracking-widest border border-rose-100 hover:bg-rose-100 transition-all active:scale-95"
                                    >
                                        Cold System Reset
                                    </button>
                                </div>
                            </div>

                            {/* Right Column - Edit Form */}
                            <div className="lg:col-span-2">
                                <form onSubmit={handleSubmit} className="rounded-[2.5rem] bg-card border border-border p-10 shadow-card space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                                                <User className="h-3 w-3" /> {role === 'teacher' ? 'Display Name' : 'Full Name'}
                                            </label>
                                            <input
                                                type="text"
                                                value={profileData.name}
                                                onChange={e => setProfileData({ ...profileData, name: e.target.value })}
                                                className="w-full rounded-2xl bg-background border border-border px-5 py-3.5 text-sm font-bold outline-none focus:ring-4 focus:ring-primary/10 transition-all"
                                                placeholder={role === 'teacher' ? "Dr. Jane Smith" : "Alex Johnson"}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                                                <Mail className="h-3 w-3" /> Official Email
                                            </label>
                                            <input
                                                type="email"
                                                value={profileData.email}
                                                onChange={e => setProfileData({ ...profileData, email: e.target.value })}
                                                className="w-full rounded-2xl bg-background border border-border px-5 py-3.5 text-sm font-bold outline-none focus:ring-4 focus:ring-primary/10 transition-all"
                                                placeholder="univ-faculty@edu.com"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                                                <Hash className="h-3 w-3" /> {role === 'teacher' ? 'Faculty ID' : 'Roll Number'}
                                            </label>
                                            <input
                                                type="text"
                                                value={profileData.roll}
                                                onChange={e => setProfileData({ ...profileData, roll: e.target.value })}
                                                className="w-full rounded-2xl bg-background border border-border px-5 py-3.5 text-sm font-bold outline-none focus:ring-4 focus:ring-primary/10 transition-all"
                                                placeholder={role === 'teacher' ? "EMP-2026-X" : "CSE-2023-001"}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                                                <Book className="h-3 w-3" /> {role === 'teacher' ? 'Experience (Years)' : 'Semester'}
                                            </label>
                                            <input
                                                type="number"
                                                value={profileData.semester}
                                                onChange={e => setProfileData({ ...profileData, semester: e.target.value })}
                                                className="w-full rounded-2xl bg-background border border-border px-5 py-3.5 text-sm font-bold outline-none focus:ring-4 focus:ring-primary/10 transition-all"
                                                placeholder={role === 'teacher' ? "15" : "5"}
                                            />
                                        </div>
                                        <div className="md:col-span-2 space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                                                <GraduationCap className="h-3 w-3" /> Department / Faculty
                                            </label>
                                            <select
                                                value={profileData.department}
                                                onChange={e => setProfileData({ ...profileData, department: e.target.value })}
                                                className="w-full rounded-2xl bg-background border border-border px-5 py-3.5 text-sm font-bold outline-none focus:ring-4 focus:ring-primary/10 transition-all appearance-none"
                                            >
                                                <option>CSE - Computer Science</option>
                                                <option>ECE - Electronics</option>
                                                <option>ME - Mechanical</option>
                                                <option>AI - Artificial Intelligence</option>
                                                <option>HSS - Humanities</option>
                                            </select>
                                        </div>
                                        <div className="md:col-span-2 space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                                                Professional Bio & Objective
                                            </label>
                                            <textarea
                                                rows={4}
                                                value={profileData.bio}
                                                onChange={e => setProfileData({ ...profileData, bio: e.target.value })}
                                                className="w-full rounded-2xl bg-background border border-border px-5 py-3.5 text-sm font-bold outline-none focus:ring-4 focus:ring-primary/10 transition-all resize-none"
                                                placeholder={role === 'teacher' ? "Dedicated faculty with 10+ years in distributed systems research..." : "Aspiring software engineer..."}
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full rounded-2xl gradient-primary py-4 text-sm font-black text-primary-foreground shadow-primary-glow flex items-center justify-center gap-3 hover:scale-[1.01] transition-all uppercase tracking-widest active:scale-95"
                                    >
                                        <Save className="h-5 w-5" /> Sync with IntellEdge Node
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
