import { Search, Bell, MessageSquare } from "lucide-react";

export function TopBar() {
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
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[9px] font-bold text-destructive-foreground">
            3
          </span>
        </button>
        <button className="rounded-xl bg-secondary p-2.5 text-muted-foreground transition-colors hover:text-foreground">
          <MessageSquare className="h-[18px] w-[18px]" />
        </button>

        {/* Profile */}
        <div className="flex items-center gap-3 rounded-xl bg-secondary px-3 py-2">
          <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center text-xs font-bold text-primary-foreground">
            AS
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Arjun S.</p>
            <p className="text-[10px] text-muted-foreground">B.Tech CSE</p>
          </div>
        </div>
      </div>
    </header>
  );
}
