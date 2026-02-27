import welcomeImg from "@/assets/welcome-illustration.png";
import { Progress } from "@/components/ui/progress";

export function WelcomeBanner() {
  const studentData = JSON.parse(localStorage.getItem("student_profile_data") || '{"name": "Student", "semester": "5"}');

  return (
    <div className="rounded-2xl bg-card shadow-card p-6 animate-fade-in border border-border/50">
      <div className="flex items-center gap-6">
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-foreground mb-1">Welcome Back, {studentData.name}!</h2>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-md">
            Your personal neural dashboard is active. You are currently in **Semester {studentData.semester}**.
          </p>

          <div className="mt-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-foreground">Semester Progress</span>
              <span className="text-sm font-bold text-primary">72%</span>
            </div>
            <Progress value={72} className="h-2.5 bg-accent [&>div]:gradient-primary [&>div]:rounded-full" />
          </div>
        </div>

        <img
          src={welcomeImg}
          alt="Welcome illustration"
          className="hidden lg:block h-36 w-36 object-contain"
        />
      </div>
    </div>
  );
}
