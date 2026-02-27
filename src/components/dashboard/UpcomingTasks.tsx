import { Clock, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const tasks = [
  {
    title: "Binary Search Implementation",
    subject: "Data Structures",
    due: "Due Tomorrow",
    color: "bg-primary",
  },
  {
    title: "Component Library Design",
    subject: "UI/UX Design",
    due: "Due 28 Feb",
    color: "bg-warning",
  },
  {
    title: "Linear Regression Lab",
    subject: "Machine Learning",
    due: "Due 2 Mar",
    color: "bg-success",
  },
];

export function UpcomingTasks() {
  const navigate = useNavigate();

  return (
    <div className="rounded-2xl bg-card shadow-card p-5 animate-fade-in" style={{ animationDelay: "300ms" }}>
      <h3 className="text-sm font-bold text-foreground mb-4">Upcoming Tasks</h3>
      <div className="space-y-3">
        {tasks.map((task) => (
          <div key={task.title} className="flex items-start gap-3 group cursor-pointer" onClick={() => navigate("/projects")}>
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
      <button
        onClick={() => navigate("/projects")}
        className="mt-4 flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
      >
        See All <ArrowRight className="h-3 w-3" />
      </button>
    </div>
  );
}
