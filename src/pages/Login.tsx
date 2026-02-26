import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GraduationCap, Eye, EyeOff, ArrowRight } from "lucide-react";
import type { UserRole } from "@/lib/mock-data";

const roles: { value: UserRole; label: string; desc: string }[] = [
  { value: "student", label: "Student", desc: "Access academics, placements & AI copilot" },
  { value: "teacher", label: "Teacher", desc: "Manage courses, attendance & grading" },
  { value: "admin", label: "Admin", desc: "Institutional analytics & management" },
  { value: "placement_officer", label: "Placement Officer", desc: "Drive management & readiness tracking" },
];

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>("student");
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock auth — will be replaced with real auth
    localStorage.setItem("intelledge_role", selectedRole);
    localStorage.setItem("intelledge_logged_in", "true");
    navigate("/");
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Left branding panel */}
      <div className="hidden lg:flex lg:w-1/2 gradient-primary flex-col justify-between p-12">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
            <GraduationCap className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-primary-foreground tracking-tight">IntellEdge</h1>
            <p className="text-xs font-medium text-primary-foreground/70 uppercase tracking-widest">University AI</p>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-4xl font-extrabold text-primary-foreground leading-tight">
            The AI Operating System<br />for Universities
          </h2>
          <p className="text-lg text-primary-foreground/80 max-w-md leading-relaxed">
            Predictive academics, career intelligence, and autonomous AI — all in one decision-making infrastructure.
          </p>
          <div className="flex gap-4">
            {["Predict", "Automate", "Optimize", "Advise"].map((w) => (
              <span key={w} className="rounded-full bg-white/15 backdrop-blur-sm px-4 py-1.5 text-sm font-semibold text-primary-foreground">
                {w}
              </span>
            ))}
          </div>
        </div>

        <p className="text-sm text-primary-foreground/50">© 2026 IntellEdge. Enterprise-grade university intelligence.</p>
      </div>

      {/* Right form panel */}
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary shadow-primary-glow">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold text-foreground">IntellEdge</h1>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground">{isSignUp ? "Create Account" : "Welcome Back"}</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {isSignUp ? "Join your university's intelligence platform" : "Sign in to your intelligence dashboard"}
            </p>
          </div>

          {/* Role selector */}
          <div className="grid grid-cols-2 gap-2">
            {roles.map((r) => (
              <button
                key={r.value}
                type="button"
                onClick={() => setSelectedRole(r.value)}
                className={`rounded-xl border-2 p-3 text-left transition-all ${
                  selectedRole === r.value
                    ? "border-primary bg-accent"
                    : "border-border hover:border-primary/30"
                }`}
              >
                <p className="text-sm font-bold text-foreground">{r.label}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{r.desc}</p>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-foreground">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="arjun@university.edu"
                className="mt-1 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring/20"
                required
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-foreground">Password</label>
              <div className="relative mt-1">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 pr-10 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring/20"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl gradient-primary px-4 py-3 text-sm font-bold text-primary-foreground shadow-primary-glow transition-transform hover:scale-[1.02]"
            >
              {isSignUp ? "Create Account" : "Sign In"}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <button onClick={() => setIsSignUp(!isSignUp)} className="font-semibold text-primary hover:underline">
              {isSignUp ? "Sign In" : "Sign Up"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
