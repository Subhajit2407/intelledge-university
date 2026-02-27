import { Search, Bell, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function TopBar() {
  const navigate = useNavigate();
  const role = localStorage.getItem("intelledge_role") || "student";
  const studentData = JSON.parse(localStorage.getItem("student_profile_data") || '{"name": "User", "semester": "N/A"}');
  const displayName = role === "teacher" ? "Faculty Member" : studentData.name;
  const displayRole = role === "teacher" ? "Academic Dept." : `Semester ${studentData.semester}`;

  return (
    <header className="flex items-center justify-between border-b border-border bg-card px-8 py-4">
      {/* Search */}
      <div className="relative w-96">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search courses, students, analytics..."
          className="w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring/20 transition-shadow"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <button className="relative rounded-xl bg-secondary p-2.5 text-muted-foreground transition-colors hover:text-foreground">
          <Bell className="h-[18px] w-[18px]" />
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-white shadow-primary-glow">
            0
          </span>
        </button>
        <button className="rounded-xl bg-secondary p-2.5 text-muted-foreground transition-colors hover:text-foreground">
          <MessageSquare className="h-[18px] w-[18px]" />
        </button>

        {/* Profile */}
        <div
          onClick={() => navigate("/profile")}
          className="flex items-center gap-3 rounded-xl bg-secondary px-3 py-2 border border-border/50 shadow-sm cursor-pointer hover:bg-accent transition-all group"
        >
          <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center text-[10px] font-black text-white shadow-primary-glow overflow-hidden">
            {studentData.profilePic ? (
              <img src={studentData.profilePic} alt="P" className="h-full w-full object-cover" />
            ) : (
              displayName.split(" ").map((n: string) => n[0]).join("").toUpperCase()
            )}
          </div>
          <div>
            <p className="text-[11px] font-black text-foreground uppercase tracking-tight group-hover:text-primary transition-colors">{displayName}</p>
            <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">{displayRole}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
