import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GraduationCap, LogIn, User, Bot, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function Login() {
  const navigate = useNavigate();
  const [role, setRoleState] = useState<"student" | "teacher">("student");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate auth logic
    setTimeout(() => {
      localStorage.setItem("intelledge_role", role);
      toast.success("Login Successful", {
        description: `Welcome back to IntellEdge as a ${role === 'student' ? 'Student' : 'Faculty Member'}.`,
      });
      setIsLoading(false);
      // Use window.location.href to force a full app reload and pick up the new role
      window.location.href = "/";
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background relative overflow-hidden">
      {/* Background Aesthetic Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px]" />

      <div className="w-full max-w-md p-8 relative z-10">
        <div className="text-center mb-10 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-3xl gradient-primary shadow-primary-glow mb-6 hover:rotate-3 transition-transform cursor-pointer">
            <GraduationCap className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-black text-foreground tracking-tight italic">IntellEdge AI</h1>
          <p className="text-sm text-muted-foreground mt-2 font-medium">Neural University Management & Intelligence</p>
        </div>

        <div className="bg-card border border-border rounded-[3rem] p-10 shadow-2xl backdrop-blur-xl bg-opacity-80 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <form onSubmit={handleLogin} className="space-y-8">
            <div className="flex p-1.5 bg-accent/50 rounded-2xl mb-4 border border-border/50">
              <button
                type="button"
                onClick={() => setRoleState("student")}
                className={`flex-1 flex items-center justify-center gap-3 py-3 rounded-xl text-xs font-black transition-all ${role === "student" ? "bg-background text-primary shadow-lg border border-border/10" : "text-muted-foreground hover:text-foreground"}`}
              >
                <User className="h-4 w-4" /> STUDENT
              </button>
              <button
                type="button"
                onClick={() => setRoleState("teacher")}
                className={`flex-1 flex items-center justify-center gap-3 py-3 rounded-xl text-xs font-black transition-all ${role === "teacher" ? "bg-background text-primary shadow-lg border border-border/10" : "text-muted-foreground hover:text-foreground"}`}
              >
                <Bot className="h-4 w-4" /> TEACHER
              </button>
            </div>

            <div className="space-y-5">
              <div className="group space-y-2">
                <label className="text-[10px] uppercase font-black text-muted-foreground tracking-widest pl-1 group-focus-within:text-primary transition-colors italic">Institutional Identifier</label>
                <input
                  type="text"
                  placeholder={role === "student" ? "College Email / Student ID" : "Faculty ID / Official Email"}
                  className="w-full rounded-2xl bg-background border border-border px-6 py-4 text-sm font-bold outline-none focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-muted-foreground/30 focus:border-primary/50"
                  required
                />
              </div>
              <div className="group space-y-2">
                <label className="text-[10px] uppercase font-black text-muted-foreground tracking-widest pl-1 group-focus-within:text-primary transition-colors italic">Access Token</label>
                <input
                  type="password"
                  placeholder="Security Password"
                  className="w-full rounded-2xl bg-background border border-border px-6 py-4 text-sm font-bold outline-none focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-muted-foreground/30 focus:border-primary/50"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-3xl gradient-primary py-5 text-sm font-black text-primary-foreground shadow-primary-glow flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <span className="tracking-widest uppercase">Initializing...</span>
                </>
              ) : (
                <>
                  <LogIn className="h-6 w-6" />
                  <span className="tracking-widest uppercase text-[12px]">Initialize Dashboard</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-dashed border-border text-center">
            <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em] italic opacity-40">
              Secured by Intelledge Neural Gateway V4.0
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
