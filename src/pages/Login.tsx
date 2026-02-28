import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { GraduationCap, LogIn, User, Bot, Loader2, UserPlus, ArrowLeft, ShieldCheck, Cpu, Building2 } from "lucide-react";
import { toast } from "sonner";

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isSignup, setIsSignup] = useState(searchParams.get("mode") === "signup");
  const [role, setRoleState] = useState<"student" | "teacher" | "recruiter">("student");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate auth logic
    setTimeout(() => {
      if (isSignup) {
        toast.success("Account Created!", {
          description: "Your intelligence profile has been initialized. Please log in to continue.",
        });
        setIsSignup(false);
        setIsLoading(false);
      } else {
        localStorage.setItem("intelledge_role", role);
        const roleLabel = role === 'student' ? 'Student' : role === 'teacher' ? 'Faculty Member' : 'Recruitment Partner';
        toast.success("Sync Successful", {
          description: `Welcome back, ${roleLabel}. Your neural session has been restored.`,
        });
        setIsLoading(false);
        // Navigate to dashboard after login
        window.location.href = "/dashboard";
      }
    }, 2000);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white relative overflow-hidden font-sans">
      {/* Background Aesthetic Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-emerald-100/40 rounded-full blur-[120px] animate-pulse-slow" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-50/50 rounded-full blur-[120px]" />

      <div className="w-full max-w-[480px] p-8 relative z-10">
        <button
          onClick={() => navigate("/")}
          className="absolute -top-16 left-8 flex items-center gap-2 text-slate-400 hover:text-[#0D2B1D] transition-colors font-bold text-sm group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Back to System
        </button>

        <div className="text-center mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-[2rem] bg-[#0D2B1D] text-white shadow-2xl mb-8 hover:scale-105 transition-transform cursor-pointer overflow-hidden group">
            <GraduationCap className="h-10 w-10 relative z-10" />
            <div className="absolute inset-0 bg-primary/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
          </div>
          <h1 className="text-4xl font-bold text-[#0D2B1D] tracking-tight">
            {isSignup ? "Create Profile" : "Neural Gateway"}
          </h1>
          <p className="text-sm text-slate-500 mt-4 font-medium max-w-[300px] mx-auto leading-relaxed">
            {isSignup ? "Join the next generation of academic intelligence systems." : "Initialize your academic synchronization and access your workspace."}
          </p>
        </div>

        <div className="glass border-slate-200 rounded-[3rem] p-10 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.08)] animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="flex p-1.5 bg-slate-100/50 rounded-2xl mb-4 border border-slate-200/50">
              <button
                type="button"
                onClick={() => setRoleState("student")}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-bold transition-all ${role === "student" ? "bg-white text-[#0D2B1D] shadow-sm border border-slate-200/50" : "text-slate-400 hover:text-slate-600"}`}
              >
                <User className="h-4 w-4" /> STUDENT
              </button>
              <button
                type="button"
                onClick={() => setRoleState("teacher")}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-bold transition-all ${role === "teacher" ? "bg-white text-[#0D2B1D] shadow-sm border border-slate-200/50" : "text-slate-400 hover:text-slate-600"}`}
              >
                <Cpu className="h-4 w-4" /> FACULTY
              </button>
              <button
                type="button"
                onClick={() => setRoleState("recruiter")}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-bold transition-all ${role === "recruiter" ? "bg-white text-[#0D2B1D] shadow-sm border border-slate-200/50" : "text-slate-400 hover:text-slate-600"}`}
              >
                <Building2 className="h-4 w-4" /> RECRUITER
              </button>
            </div>

            <div className="space-y-5">
              <div className="group space-y-2">
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-[0.2em] pl-1 group-focus-within:text-primary transition-colors">Institutional ID</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder={role === "student" ? "Student ID or Email" : "Faculty ID or Email"}
                    className="w-full rounded-2xl bg-white/50 border border-slate-200 px-6 py-4.5 text-sm font-bold outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/30 transition-all placeholder:text-slate-300"
                    required
                  />
                </div>
              </div>
              <div className="group space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400 tracking-[0.2em] group-focus-within:text-primary transition-colors">Security Token</label>
                  {!isSignup && <button type="button" className="text-[10px] font-bold text-primary hover:underline uppercase tracking-widest">Reset</button>}
                </div>
                <input
                  type="password"
                  placeholder="Access Key"
                  className="w-full rounded-2xl bg-white/50 border border-slate-200 px-6 py-4.5 text-sm font-bold outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/30 transition-all placeholder:text-slate-300"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-2xl bg-[#0D2B1D] py-5 text-sm font-bold text-white shadow-[0_20px_40px_-10px_rgba(13,43,29,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-3 uppercase tracking-widest overflow-hidden relative group"
            >
              <div className="absolute inset-0 bg-primary/20 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500" />
              {isLoading ? (
                <div className="flex items-center gap-3 relative z-10">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Syncing...</span>
                </div>
              ) : (
                <div className="flex items-center gap-3 relative z-10">
                  {isSignup ? <UserPlus className="h-5 w-5" /> : <ShieldCheck className="h-5 w-5" />}
                  <span>{isSignup ? "Create Profile" : "Authorize Sync"}</span>
                </div>
              )}
            </button>
          </form>

          <div className="mt-10 text-center text-sm font-semibold text-slate-400">
            {isSignup ? (
              <p>Already joined the network? <button onClick={() => setIsSignup(false)} className="text-[#0D2B1D] hover:underline font-bold">Log In</button></p>
            ) : (
              <p>New to the system? <button onClick={() => setIsSignup(true)} className="text-[#0D2B1D] hover:underline font-bold">Request Access</button></p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
