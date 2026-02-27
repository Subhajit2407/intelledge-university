import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { GraduationCap, LogIn, User, Bot, Loader2, UserPlus, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isSignup, setIsSignup] = useState(searchParams.get("mode") === "signup");
  const [role, setRoleState] = useState<"student" | "teacher">("student");
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
        toast.success("Login Successful", {
          description: `Welcome back to IntellEdge as a ${role === 'student' ? 'Student' : 'Faculty Member'}.`,
        });
        setIsLoading(false);
        // Navigate to dashboard after login
        window.location.href = "/dashboard";
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#F8FAFC] relative overflow-hidden">
      {/* Background Aesthetic Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px]" />

      <div className="w-full max-w-md p-8 relative z-10">
        <button
          onClick={() => navigate("/")}
          className="absolute -top-12 left-8 flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors font-bold text-sm"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </button>

        <div className="text-center mb-10 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary shadow-primary-glow mb-6 hover:rotate-3 transition-transform cursor-pointer">
            <GraduationCap className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-black text-[#0D2B1D] tracking-tight italic">
            {isSignup ? "Create Intelligence Account" : "Access Neural Gateway"}
          </h1>
          <p className="text-xs text-slate-500 mt-2 font-medium tracking-wide">
            {isSignup ? "Join the next generation of academic intelligence" : "Initialize your academic synchronization"}
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] animate-in fade-in slide-in-from-bottom-8 duration-700">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex p-1 bg-slate-100 rounded-xl mb-2">
              <button
                type="button"
                onClick={() => setRoleState("student")}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-[10px] font-black transition-all ${role === "student" ? "bg-white text-primary shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
              >
                <User className="h-3 w-3" /> STUDENT
              </button>
              <button
                type="button"
                onClick={() => setRoleState("teacher")}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-[10px] font-black transition-all ${role === "teacher" ? "bg-white text-primary shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
              >
                <Bot className="h-3 w-3" /> TEACHER
              </button>
            </div>

            <div className="space-y-4">
              <div className="group space-y-1.5">
                <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest pl-1 group-focus-within:text-primary transition-colors italic">Institutional ID</label>
                <input
                  type="text"
                  placeholder={role === "student" ? "Student ID or Email" : "Faculty ID or Email"}
                  className="w-full rounded-2xl bg-slate-50 border border-slate-200 px-6 py-4 text-sm font-bold outline-none focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-slate-300 focus:bg-white"
                  required
                />
              </div>
              <div className="group space-y-1.5">
                <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest pl-1 group-focus-within:text-primary transition-colors italic">Access Key</label>
                <input
                  type="password"
                  placeholder="Security Token"
                  className="w-full rounded-2xl bg-slate-50 border border-slate-200 px-6 py-4 text-sm font-bold outline-none focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-slate-300 focus:bg-white"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-2xl bg-[#0D2B1D] py-4 text-xs font-black text-white shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-3 uppercase tracking-widest"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Syncing...</span>
                </>
              ) : (
                <>
                  {isSignup ? <UserPlus className="h-4 w-4" /> : <LogIn className="h-4 w-4" />}
                  <span>{isSignup ? "Create Profile" : "Initialize Sync"}</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-xs font-bold text-slate-400">
            {isSignup ? (
              <p>Already have an account? <button onClick={() => setIsSignup(false)} className="text-primary hover:underline">Sign In</button></p>
            ) : (
              <p>New to IntellEdge? <button onClick={() => setIsSignup(true)} className="text-primary hover:underline">Create Account</button></p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
