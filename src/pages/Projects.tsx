import { useState, useEffect } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { TopBar } from "@/components/dashboard/TopBar";
import { CheckCircle, Clock, AlertCircle, Plus, FolderGit2, Calendar, TrendingUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";

type StatusFilter = "all" | "pending" | "submitted" | "graded";

interface Project {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  category: string;
  useManualProgress: boolean;
  manualProgress: number;
  platform?: string;
  studentName?: string;
  roll?: string;
}

export default function Projects() {
  const role = localStorage.getItem("intelledge_role");
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [projects, setProjects] = useState<Project[]>(() => {
    const key = role === 'teacher' ? "faculty_assigned_tasks" : "student_projects";
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : [];
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newProj, setNewProj] = useState<Partial<Project>>({
    name: "", startDate: "", endDate: "", useManualProgress: false, manualProgress: 0
  });
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => {
    const key = role === 'teacher' ? "faculty_assigned_tasks" : "student_projects";
    if (projects.length === 0 && role === 'teacher') {
      setProjects([
        { id: 'm1', name: 'Neural Network Optimization', category: 'AI/ML', studentName: 'Alex Johnson', roll: 'CSE-001', startDate: '2026-01-10', endDate: '2026-03-01', platform: 'GitHub', useManualProgress: true, manualProgress: 85 },
        { id: 'm2', name: 'Blockchain Voting System', category: 'Web3', studentName: 'Sarah Smith', roll: 'CSE-042', startDate: '2026-02-01', endDate: '2026-04-15', platform: 'Vercel', useManualProgress: true, manualProgress: 40 }
      ]);
    }
  }, [role]);

  useEffect(() => {
    const key = role === 'teacher' ? "faculty_assigned_tasks" : "student_projects";
    if (projects.length > 0) localStorage.setItem(key, JSON.stringify(projects));
  }, [projects, role]);


  const calculateProgress = (proj: Project) => {
    if (proj.useManualProgress) return proj.manualProgress;
    const s = new Date(proj.startDate).getTime();
    const e = new Date(proj.endDate).getTime();
    const now = new Date().getTime();
    if (now < s) return 0;
    if (now > e) return 100;
    return Math.round(((now - s) / (e - s)) * 100);
  };

  const addProject = () => {
    if (!newProj.name || !newProj.startDate || !newProj.endDate) return;
    const proj: Project = {
      id: Date.now().toString(),
      name: newProj.name,
      startDate: newProj.startDate,
      endDate: newProj.endDate,
      category: "Academic Project",
      useManualProgress: !!newProj.useManualProgress,
      manualProgress: newProj.manualProgress || 0,
    };
    setProjects([...projects, proj]);
    setNewProj({ name: "", startDate: "", endDate: "", useManualProgress: false, manualProgress: 0 });
    setShowAdd(false);
  };

  const deleteProject = (id: string) => setProjects(projects.filter(p => p.id !== id));

  const toggleManual = (id: string) => {
    setProjects(projects.map(p => p.id === id ? { ...p, useManualProgress: !p.useManualProgress } : p));
  };

  const updateProgress = (id: string, val: number) => {
    setProjects(projects.map(p => p.id === id ? { ...p, manualProgress: Math.min(100, Math.max(0, val)) } : p));
  };

  const statusConfig = {
    pending: { icon: Clock, color: "text-warning", bg: "bg-warning/10", label: "Pending" },
    submitted: { icon: AlertCircle, color: "text-primary", bg: "bg-primary/10", label: "Submitted" },
    graded: { icon: CheckCircle, color: "text-success", bg: "bg-success/10", label: "Graded" },
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto px-8 py-6 space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                {role === 'teacher' ? "Batch Assignment Vault" : "Project Intelligence"}
              </h2>
              <p className="text-sm text-muted-foreground">
                {role === 'teacher'
                  ? "Distribute assignments, track batch submissions & set academic milestones"
                  : "Track and manage your project milestones and lifecycle"}
              </p>
            </div>
            <button
              onClick={() => setShowAdd(!showAdd)}
              className="flex items-center gap-2 rounded-xl gradient-primary px-4 py-2.5 text-sm font-bold text-primary-foreground shadow-primary-glow hover:scale-105 transition-transform"
            >
              <Plus className="h-4 w-4" /> {role === 'teacher' ? "Assign New Task" : "New Project"}
            </button>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
              <FolderGit2 className="h-5 w-5 text-primary" /> Active Projects
            </h3>

            {showAdd && (
              <div className="rounded-2xl border border-border bg-card p-6 animate-fade-in shadow-xl max-w-2xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-[10px] uppercase font-bold text-muted-foreground italic">Project Name</label>
                    <input
                      type="text" value={newProj.name} onChange={e => setNewProj({ ...newProj, name: e.target.value })}
                      placeholder="e.g. Distributed Operating System"
                      className="w-full rounded-xl bg-background border border-border px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-muted-foreground italic">Start Date</label>
                    <input
                      type="date" value={newProj.startDate} onChange={e => setNewProj({ ...newProj, startDate: e.target.value })}
                      className="w-full rounded-xl bg-background border border-border px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-muted-foreground italic">Target End Date</label>
                    <input
                      type="date" value={newProj.endDate} onChange={e => setNewProj({ ...newProj, endDate: e.target.value })}
                      className="w-full rounded-xl bg-background border border-border px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div className="md:col-span-2 flex items-center gap-3 py-2 border-t border-border mt-2">
                    <input
                      type="checkbox"
                      id="manual-mode"
                      checked={newProj.useManualProgress}
                      onChange={e => setNewProj({ ...newProj, useManualProgress: e.target.checked })}
                    />
                    <label htmlFor="manual-mode" className="text-xs font-bold text-foreground">Enable Manual Progress Tracking (%)</label>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <button onClick={() => setShowAdd(false)} className="rounded-xl px-4 py-2 text-sm font-bold text-muted-foreground hover:bg-accent transition-colors">Cancel</button>
                  <button onClick={addProject} className="rounded-xl gradient-primary px-6 py-2 text-sm font-bold text-primary-foreground shadow-primary-glow">Save Project</button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.length === 0 && !showAdd && (
                <div className="md:col-span-2 rounded-2xl border-2 border-dashed border-border p-12 text-center">
                  <FolderGit2 className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-muted-foreground font-medium">No projects found. Start by creating a new one.</p>
                </div>
              )}
              {projects.map((proj) => {
                const prog = calculateProgress(proj);
                return (
                  <div key={proj.id} className="rounded-2xl bg-card border border-border p-5 hover:shadow-card-hover transition-all animate-fade-in group relative overflow-hidden">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[9px] uppercase font-bold px-2 py-0.5 rounded-md bg-primary/10 text-primary">{proj.category}</span>
                          <button
                            onClick={() => deleteProject(proj.id)}
                            className="text-[9px] uppercase font-bold px-2 py-0.5 rounded-md bg-destructive/10 text-destructive hover:bg-destructive hover:text-white transition-colors ml-auto flex items-center gap-1"
                          >
                            Delete
                          </button>
                        </div>
                        <h4 className="font-bold text-foreground text-base group-hover:text-primary transition-colors">{proj.name}</h4>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between text-xs items-center">
                        <span className="text-muted-foreground italic flex items-center gap-1.5">
                          <Calendar className="h-3 w-3" /> {new Date(proj.startDate).toLocaleDateString()} — {new Date(proj.endDate).toLocaleDateString()}
                        </span>
                        <div className="flex items-center gap-2">
                          {proj.useManualProgress ? (
                            <input
                              type="number"
                              className="w-12 rounded border border-border bg-background px-1 py-0.5 text-center font-bold text-primary"
                              value={proj.manualProgress}
                              onChange={(e) => updateProgress(proj.id, parseInt(e.target.value))}
                            />
                          ) : (
                            <span className="font-bold text-primary">{prog}% Complete</span>
                          )}
                        </div>
                      </div>
                      <Progress value={prog} className="h-2 [&>div]:gradient-primary" />
                      <div className="flex justify-end gap-3 mt-4 opacity-0 group-hover:opacity-100 transition-opacity pt-2 border-t border-border/50">
                        <button
                          onClick={() => toggleManual(proj.id)}
                          className="text-[10px] font-bold text-muted-foreground hover:text-primary underline flex items-center gap-1"
                        >
                          {proj.useManualProgress ? "Switch to Auto" : "Manual Toggle"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
