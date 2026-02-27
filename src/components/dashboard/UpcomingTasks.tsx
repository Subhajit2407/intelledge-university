import { useState, useEffect } from "react";
import { Clock, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function UpcomingTasks() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("student_projects");
    if (saved) {
      const allProjects = JSON.parse(saved);
      const formatted = allProjects.slice(0, 3).map((p: any, i: number) => ({
        id: p.id || i.toString(),
        title: p.name,
        subject: p.category,
        due: `Due ${new Date(p.endDate).toLocaleDateString()}`,
        color: i % 3 === 0 ? "bg-primary" : i % 3 === 1 ? "bg-warning" : "bg-success"
      }));
      setTasks(formatted);
    }
  }, []);

  return (
    <div className="rounded-2xl bg-card shadow-card p-5 animate-fade-in" style={{ animationDelay: "300ms" }}>
      <h3 className="text-sm font-bold text-foreground mb-4">Upcoming Tasks</h3>
      {tasks.length > 0 ? (
        <div className="space-y-3">
          {tasks.map((task) => (
            <div key={task.id} className="flex items-start gap-3 group cursor-pointer" onClick={() => navigate("/projects")}>
              <div className={`mt-0.5 h-2 w-2 rounded-full ${task.color} shrink-0`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                  {task.title}
                </p>
                <p className="text-[11px] text-muted-foreground">{task.subject}</p>
              </div>
              <span className="flex items-center gap-1 rounded-lg bg-accent px-2 py-1 text-[10px] font-semibold text-accent-foreground shrink-0">
                <Clock className="h-3 w-3" />
                {task.due}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-muted-foreground italic mb-4">No upcoming tasks listed.</p>
      )}
      <button
        onClick={() => navigate("/projects")}
        className="mt-4 flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
      >
        See All <ArrowRight className="h-3 w-3" />
      </button>
    </div>
  );
}
