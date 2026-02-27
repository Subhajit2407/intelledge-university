import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useEffect, useState } from "react";

export function ActivityChart() {
  const [data, setData] = useState([
    { month: "Jan", academic: 0, placement: 0 },
    { month: "Feb", academic: 0, placement: 0 },
    { month: "Mar", academic: 0, placement: 0 },
    { month: "Apr", academic: 0, placement: 0 },
    { month: "May", academic: 0, placement: 0 },
    { month: "Jun", academic: 0, placement: 0 },
    { month: "Jul", academic: 0, placement: 0 },
  ]);

  useEffect(() => {
    // In a real app, we'd fetch historical scores. 
    // For now, let's see if we have some data in localStorage to start a trend.
    const studentData = JSON.parse(localStorage.getItem("student_profile_data") || "{}");
    const teacherRecords = JSON.parse(localStorage.getItem("teacher_student_records") || "[]");
    const myRecord = teacherRecords.find((r: any) => r.name === studentData.name || r.roll === studentData.roll);

    if (myRecord) {
      const score = parseFloat(myRecord.score);
      const placement = parseInt(studentData.placementScore || "0");

      // Update only the current month (simplified)
      const currentMonth = new Date().toLocaleString('default', { month: 'short' });
      setData(prev => prev.map(d => d.month === currentMonth ? { ...d, academic: score, placement: placement } : d));
    }
  }, []);

  const hasData = data.some(d => d.academic > 0 || d.placement > 0);

  return (
    <div className="rounded-2xl bg-card shadow-card p-5 animate-fade-in relative min-h-[250px]" style={{ animationDelay: "150ms" }}>
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

      {!hasData && (
        <div className="absolute inset-0 flex items-center justify-center bg-card/60 backdrop-blur-[1px] z-10 rounded-2xl">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest italic pt-8">Awaiting Neural Synchronization...</p>
        </div>
      )}

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
