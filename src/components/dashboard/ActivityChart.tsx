import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { month: "Jan", academic: 65, placement: 30 },
  { month: "Feb", academic: 70, placement: 35 },
  { month: "Mar", academic: 62, placement: 42 },
  { month: "Apr", academic: 75, placement: 48 },
  { month: "May", academic: 78, placement: 55 },
  { month: "Jun", academic: 72, placement: 60 },
  { month: "Jul", academic: 80, placement: 64 },
];

export function ActivityChart() {
  return (
    <div className="rounded-2xl bg-card shadow-card p-5 animate-fade-in" style={{ animationDelay: "150ms" }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-foreground">Performance Trends</h3>
        <div className="flex gap-3 text-[10px] font-semibold">
          <span className="flex items-center gap-1.5 text-primary">
            <span className="h-2 w-2 rounded-full gradient-primary" /> Academic
          </span>
          <span className="flex items-center gap-1.5 text-warning">
            <span className="h-2 w-2 rounded-full gradient-warm" /> Placement
          </span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={180}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="gradAcademic" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(166, 60%, 45%)" stopOpacity={0.3} />
              <stop offset="100%" stopColor="hsl(166, 60%, 45%)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gradPlacement" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(38, 92%, 55%)" stopOpacity={0.3} />
              <stop offset="100%" stopColor="hsl(38, 92%, 55%)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
          <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(220, 10%, 50%)" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: "hsl(220, 10%, 50%)" }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{
              borderRadius: "12px",
              border: "1px solid hsl(220, 13%, 91%)",
              boxShadow: "0 4px 12px hsl(220 20% 10% / 0.08)",
              fontSize: "12px",
            }}
          />
          <Area type="monotone" dataKey="academic" stroke="hsl(166, 60%, 45%)" strokeWidth={2} fill="url(#gradAcademic)" />
          <Area type="monotone" dataKey="placement" stroke="hsl(38, 92%, 55%)" strokeWidth={2} fill="url(#gradPlacement)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
