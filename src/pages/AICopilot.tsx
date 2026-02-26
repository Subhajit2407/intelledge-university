import { useState, useRef, useEffect } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { TopBar } from "@/components/dashboard/TopBar";
import { Send, Bot, User, Sparkles, Brain, Calendar, TrendingUp, FileText, Zap } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const quickActions = [
  { icon: TrendingUp, label: "Predict my final CGPA", prompt: "Predict my final CGPA based on my current performance trends." },
  { icon: Calendar, label: "Optimize my week", prompt: "Optimize my week for placement prep while maintaining academics." },
  { icon: Brain, label: "Am I ready for Microsoft?", prompt: "Am I ready for the Microsoft SDE Intern role? Analyze my skills and suggest a preparation plan." },
  { icon: FileText, label: "Create recovery plan", prompt: "Create a recovery plan for my low attendance in Computer Networks." },
  { icon: Zap, label: "Generate study plan", prompt: "Generate an AI study plan for my upcoming ML mid-semester exam." },
  { icon: Sparkles, label: "Draft email to faculty", prompt: "Draft a professional email to my Computer Networks professor requesting extra classes." },
];

// Mock AI responses — will be replaced with real AI
const mockResponses: Record<string, string> = {
  "predict": `## 📊 CGPA Prediction Analysis

Based on your current performance data:

**Current CGPA:** 7.8 (Semester 4)
**Semester 5 Projected GPA:** 8.1

### Prediction Model:
| Scenario | Final CGPA |
|----------|-----------|
| 🟢 Best Case | **8.3** |
| 🟡 Most Likely | **8.0** |
| 🔴 Worst Case | **7.6** |

### Key Factors:
- **Positive:** Strong upward trend in DSA and DBMS
- **Risk:** Operating Systems and Computer Networks need improvement
- **Action:** Focus 60% effort on weak subjects for next 4 weeks

> 💡 *If you score above 75% in CN and OS finals, your CGPA will cross 8.0*`,

  "optimize": `## 📅 Optimized Weekly Schedule

Here's your AI-balanced week for placement prep + academics:

### Monday–Friday:
| Time | Activity |
|------|----------|
| 6:00–7:30 AM | DSA Practice (LeetCode Medium) |
| 8:00–4:00 PM | Classes & Labs |
| 4:30–5:30 PM | OS Revision (Recovery) |
| 6:00–7:30 PM | System Design Study |
| 8:00–9:00 PM | CN Attendance Recovery |

### Weekend:
| Time | Activity |
|------|----------|
| 9:00–12:00 PM | Mock Interview Practice |
| 2:00–5:00 PM | Project Work |
| 6:00–8:00 PM | Resume & Portfolio Update |

### ⚡ Automation Activated:
- Calendar synced with assignments
- Reminders set for CN classes
- DSA streak tracker enabled`,

  "microsoft": `## 🏢 Microsoft Readiness Analysis

### Your Match Score: **82%**

| Criteria | Status | Score |
|----------|--------|-------|
| CGPA (≥7.5) | ✅ Met (7.8) | 100% |
| DSA Skills | ✅ Strong | 85% |
| System Design | ⚠️ Developing | 45% |
| Communication | ✅ Good | 70% |
| Projects | ✅ Relevant | 80% |

### 🎯 30-Day Prep Plan:
1. **Week 1–2:** System Design fundamentals (15 hrs)
2. **Week 2–3:** LeetCode Medium/Hard (20 problems)
3. **Week 3–4:** Mock interviews (3 sessions)
4. **Week 4:** Behavioral prep + resume polish

### ⚠️ Gap Alert:
- System Design is your weakest area
- Recommended: Complete "Grokking System Design" course
- Estimated time: 20 hours`,

  "default": `I've analyzed your academic data and here's what I found:

### 📋 Quick Summary:
- **Academic Score:** 78/100 (Good, trending up)
- **Attendance:** 82% (Watch CN closely)
- **Placement Readiness:** 64% (Improving)

### 🎯 Top 3 Priorities:
1. Attend next 5 CN classes to stay above 75%
2. Complete Binary Search assignment (due tomorrow)
3. Start System Design prep for Microsoft drive

Would you like me to create a detailed action plan for any of these?`,
};

function getResponse(prompt: string): string {
  const lower = prompt.toLowerCase();
  if (lower.includes("cgpa") || lower.includes("predict")) return mockResponses.predict;
  if (lower.includes("optimize") || lower.includes("week") || lower.includes("schedule")) return mockResponses.optimize;
  if (lower.includes("microsoft") || lower.includes("ready")) return mockResponses.microsoft;
  return mockResponses.default;
}

export default function AICopilot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `# 🤖 Welcome to IntellEdge AI Copilot

I'm your autonomous academic & career intelligence assistant. I can:

- **Predict** your CGPA and placement outcomes
- **Optimize** your weekly schedule
- **Simulate** grade scenarios
- **Generate** study plans and recovery strategies
- **Draft** professional communications
- **Analyze** your career readiness

What would you like me to help with?`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), role: "user", content: text, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const response: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: getResponse(text),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, response]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="px-8 py-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary shadow-primary-glow">
                <Bot className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground">AI Copilot</h2>
                <p className="text-xs text-muted-foreground">Autonomous intelligence · Context-aware · Action-driven</p>
              </div>
              <div className="ml-auto flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
                <span className="text-[10px] font-semibold text-success">Online</span>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-8 py-6">
            <div className="max-w-3xl mx-auto space-y-6">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}>
                  {msg.role === "assistant" && (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg gradient-primary">
                      <Bot className="h-4 w-4 text-primary-foreground" />
                    </div>
                  )}
                  <div className={`max-w-[85%] rounded-2xl p-4 ${
                    msg.role === "user"
                      ? "gradient-primary text-primary-foreground shadow-primary-glow"
                      : "bg-card shadow-card"
                  }`}>
                    <div className={`text-sm leading-relaxed whitespace-pre-wrap ${msg.role === "assistant" ? "text-foreground" : ""}`}>
                      {msg.content}
                    </div>
                    <p className={`text-[9px] mt-2 ${msg.role === "user" ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
                      {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                  {msg.role === "user" && (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary">
                      <User className="h-4 w-4 text-foreground" />
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg gradient-primary">
                    <Bot className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <div className="rounded-2xl bg-card shadow-card p-4">
                    <div className="flex gap-1">
                      <span className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Quick actions */}
          {messages.length <= 1 && (
            <div className="px-8 pb-2">
              <div className="max-w-3xl mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {quickActions.map((action) => (
                    <button
                      key={action.label}
                      onClick={() => sendMessage(action.prompt)}
                      className="flex items-center gap-2 rounded-xl border border-border bg-card p-3 text-left text-xs font-medium text-foreground hover:bg-accent hover:border-primary/30 transition-all"
                    >
                      <action.icon className="h-4 w-4 text-primary shrink-0" />
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Input */}
          <div className="px-8 py-4 border-t border-border">
            <div className="max-w-3xl mx-auto">
              <form onSubmit={(e) => { e.preventDefault(); sendMessage(input); }} className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask anything... 'Predict my CGPA', 'Optimize my week', 'Am I ready for Microsoft?'"
                  className="flex-1 rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring/20 placeholder:text-muted-foreground"
                  disabled={isTyping}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className="rounded-xl gradient-primary p-3 text-primary-foreground shadow-primary-glow disabled:opacity-50 hover:scale-105 transition-transform"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
