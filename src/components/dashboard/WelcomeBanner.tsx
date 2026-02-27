import welcomeImg from "@/assets/welcome-illustration.png";
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";

export function WelcomeBanner() {
  const [progress, setProgress] = useState(0);
  const studentData = JSON.parse(localStorage.getItem("student_profile_data") || '{"name": "Student", "semester": "5"}');

  useEffect(() => {
    // Calculate semester progress based on month
    // Sem 1,3,5,7: Aug - Dec (8-12)
    // Sem 2,4,6,8: Jan - May (1-5)
    const now = new Date();
    const month = now.getMonth() + 1; // 1-indexed

    let currentProgress = 0;
    if (month >= 8 && month <= 12) {
      currentProgress = ((month - 8) / 4) * 100;
    } else if (month >= 1 && month <= 5) {
      currentProgress = ((month - 1) / 4) * 100;
    }

    setProgress(Math.min(100, Math.max(0, Math.round(currentProgress))));
  }, []);

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
              <span className="text-sm font-bold text-primary">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2.5 bg-accent [&>div]:gradient-primary [&>div]:rounded-full" />
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
