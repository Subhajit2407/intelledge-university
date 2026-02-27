// Core AI intelligence engine imports
import { useState, useRef, useEffect } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { TopBar } from "@/components/dashboard/TopBar";
import { Send, Bot, User, Sparkles, Brain, Calendar, TrendingUp, FileText, Zap, Mic, MicOff, Volume2, Languages, X } from "lucide-react";

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

// Mock AI responses
const mockResponses: Record<string, string> = {
  "predict": `## 📊 CGPA Prediction Analysis\n\nBased on your current performance data:\n\n**Current CGPA:** 7.8 (Semester 4)\n**Semester 5 Projected GPA:** 8.1\n\n### Prediction Model:\n| Scenario | Final CGPA |\n|----------|-----------|\n| 🟢 Best Case | **8.3** |\n| 🟡 Most Likely | **8.0** |\n| 🔴 Worst Case | **7.6** |\n\n### Key Factors:\n- **Positive:** Strong upward trend in DSA and DBMS\n- **Risk:** Operating Systems and Computer Networks need improvement\n- **Action:** Focus 60% effort on weak subjects for next 4 weeks\n\n> 💡 *If you score above 75% in CN and OS finals, your CGPA will cross 8.0*`,
  "optimize": `## 📅 Optimized Weekly Schedule\n\nHere's your AI-balanced week for placement prep + academics:\n\n### Monday–Friday:\n| Time | Activity |\n|------|----------|\n| 6:00–7:30 AM | DSA Practice (LeetCode Medium) |\n| 8:00–4:00 PM | Classes & Labs |\n| 4:30–5:30 PM | OS Revision (Recovery) |\n| 6:00–7:30 PM | System Design Study |\n| 8:00–9:00 PM | CN Attendance Recovery |\n\n### Weekend:\n| Time | Activity |\n|------|----------|\n| 9:00–12:00 PM | Mock Interview Practice |\n| 2:00–5:00 PM | Project Work |\n| 6:00–8:00 PM | Resume & Portfolio Update |\n\n### ⚡ Automation Activated:\n- Calendar synced with assignments\n- Reminders set for CN classes\n- DSA streak tracker enabled`,
  "microsoft": `## 🏢 Microsoft Readiness Analysis\n\n### Your Match Score: **82%**\n\n| Criteria | Status | Score |\n|----------|--------|-------|\n| CGPA (≥7.5) | ✅ Met (7.8) | 100% |\n| DSA Skills | ✅ Strong | 85% |\n| System Design | ⚠️ Developing | 45% |\n| Communication | ✅ Good | 70% |\n| Projects | ✅ Relevant | 80% |\n\n### 🎯 30-Day Prep Plan:\n1. **Week 1–2:** System Design fundamentals (15 hrs)\n2. **Week 2–3:** LeetCode Medium/Hard (20 problems)\n3. **Week 3–4:** Mock interviews (3 sessions)\n4. **Week 4:** Behavioral prep + resume polish\n\n### ⚠️ Gap Alert:\n- System Design is your weakest area\n- Recommended: Complete "Grokking System Design" course\n- Estimated time: 20 hours`,
  "default": `I've successfully synchronized with your academic profile. Everything looks stable.\n\n### 📋 Quick Insights:\n- **Systems:** Online\n- **Data Integrity:** Verified\n- **Target Goals:** Ready for input\n\nHow can I assist you with your studies or placements today?`,
};

export default function AICopilot() {
  const studentData = JSON.parse(localStorage.getItem("student_profile_data") || '{"name": "Student"}');

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `# 🤖 Hello, ${studentData.name}\n\nI am your **Neural Academic Intelligence**. My core systems are online and synced with your institutional profile. \n\nI am ready to assist you with:\n\n- **Live CGPA Projections**\n- **Weekly Schedule Optimization**\n- **Skill Gap & Career Readiness Analysis**\n- **Attendance Recovery Strategies**\n\nHow can I help you excel today?`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceLang, setVoiceLang] = useState<"en" | "kn" | "hi">("en");
  const [voiceStatus, setVoiceStatus] = useState("Tap mic to speak");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.onresult = (e: any) => {
        const text = e.results[0][0].transcript;
        sendMessage(text);
        setIsListening(false);
        setVoiceStatus("Processing...");
      };
      recognitionRef.current.onend = () => setIsListening(false);
    }
  }, []);

  const speak = (text: string) => {
    // Clean markdown for speech
    const cleanText = text.replace(/[#*`|]/g, "").replace(/\[.*\]\(.*\)/g, "");
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = voiceLang === "en" ? "en-US" : voiceLang === "kn" ? "kn-IN" : "hi-IN";
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
  };

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), role: "user", content: text, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const lower = text.toLowerCase();
      let content = mockResponses.default;

      // Multi-language context handling
      if (voiceLang === "kn") {
        if (lower.includes("cgpa") || lower.includes("ಫಲಿತಾಂಶ")) content = "ನಿಮ್ಮ ಪ್ರಸ್ತುತ CGPA 7.8 ಆಗಿದೆ. ಮುಂದಿನ ಸೆಮಿಸ್ಟರ್‌ನಲ್ಲಿ ನೀವು 8.1 ಕ್ಕಿಂತ ಹೆಚ್ಚು ಗಳಿಸುವ ಸಾಧ್ಯತೆಯಿದೆ.";
        else if (lower.includes("ಹಲೋ") || lower.includes("ನಮಸ್ಕಾರ")) content = "ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ ಎಐ ಸಹಾಯಕಿ. ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಲಿ?";
        else content = "ಕ್ಷಮಿಸಿ, ಈ ವಿಷಯದ ಬಗ್ಗೆ ನನಗೆ ಮಾಹಿತಿ ಇಲ್ಲ. ನೀವು ಹಾಜರಾತಿ ಅಥವಾ ಪ್ಲೇಸ್ಮೆಂಟ್ ಬಗ್ಗೆ ಕೇಳಬಹುದು.";
      } else if (voiceLang === "hi") {
        if (lower.includes("cgpa") || lower.includes("परिणाम")) content = "आपका वर्तमान CGPA 7.8 है। अगले सेमेस्टर में आपके 8.1 से ऊपर जाने की संभावना है।";
        else if (lower.includes("नमस्ते") || lower.includes("हेलो")) content = "नमस्ते! मैं आपकी क्या सहायता कर सकता हूँ?";
        else content = "क्षमा करें, मुझे इस बारे में जानकारी नहीं है। कृपया उपस्थिति या प्लेसमेंट के बारे में पूछें।";
      } else {
        if (lower.includes("cgpa") || lower.includes("predict")) content = mockResponses.predict;
        else if (lower.includes("optimize") || lower.includes("week")) content = mockResponses.optimize;
        else if (lower.includes("microsoft") || lower.includes("ready")) content = mockResponses.microsoft;
      }

      const response: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, response]);
      setIsTyping(false);
      if (isVoiceMode) {
        speak(content);
        setVoiceStatus("Response ready. Tap to speak again.");
      }
    }, 1200);
  };

  const toggleVoiceMode = () => {
    setIsVoiceMode(!isVoiceMode);
    if (!isVoiceMode) {
      setVoiceStatus("Tap mic to speak");
    }
  };

  const nextLang = () => {
    setVoiceLang(prev => prev === "en" ? "kn" : prev === "kn" ? "hi" : "en");
  };

  const startListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = voiceLang === "en" ? "en-US" : voiceLang === "kn" ? "kn-IN" : "hi-IN";
      recognitionRef.current.start();
      setIsListening(true);
      setVoiceStatus("Listening...");
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background font-sans">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 flex flex-col overflow-hidden relative">

          {/* Header */}
          <div className="px-8 py-4 border-b border-border bg-card/30 backdrop-blur-sm z-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary shadow-primary-glow">
                <Bot className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground">AI Copilot Core</h2>
                <p className="text-xs text-muted-foreground">Neural Intelligence Engine V4.2</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={stopSpeaking}
                className="flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold bg-destructive/10 text-destructive hover:bg-destructive hover:text-white transition-all"
              >
                <X className="h-4 w-4" /> Stop
              </button>
              <button
                onClick={toggleVoiceMode}
                className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${isVoiceMode ? "bg-primary text-primary-foreground shadow-primary-glow" : "bg-secondary text-foreground hover:bg-accent"}`}
              >
                <Mic className="h-4 w-4" /> {isVoiceMode ? "Exit Voice Mode" : "Voice Interaction"}
              </button>
            </div>
          </div>

          {isVoiceMode ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 bg-gradient-to-b from-card/50 to-background animate-fade-in relative overflow-hidden">
              {/* Visualizer Background */}
              <div className="absolute inset-0 flex items-center justify-center opacity-10 blur-3xl -z-10">
                <div className={`h-96 w-96 rounded-full transition-all duration-1000 ${isListening ? "bg-primary scale-150" : "bg-primary/20 scale-100"}`} />
              </div>

              <div className="mb-8 flex flex-col items-center text-center max-w-md">
                <div className="flex items-center gap-2 mb-4">
                  <button
                    onClick={nextLang}
                    className="flex items-center gap-2 rounded-lg bg-secondary px-3 py-1.5 text-[10px] font-bold text-foreground"
                  >
                    <Languages className="h-3 w-3" /> {voiceLang === "en" ? "English" : voiceLang === "kn" ? "Kannada" : "Hindi"}
                  </button>
                </div>
                <div className={`relative mb-12 flex h-32 w-32 items-center justify-center rounded-full shadow-2xl transition-all duration-500 ${isListening ? "bg-primary scale-110 shadow-primary-glow" : "bg-secondary"}`}>
                  <div className={`absolute inset-0 rounded-full border-4 border-primary/20 ${isListening ? "animate-ping" : ""}`} />
                  <Bot className={`h-16 w-16 ${isListening ? "text-primary-foreground" : "text-primary opacity-50"} transition-all`} />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2">{voiceStatus}</h3>
                <p className="text-sm text-muted-foreground italic mb-12">
                  {voiceLang === "en"
                    ? "I can help with ERP data, Academics, and Career Guidance in English."
                    : "ನಾನು ಸಿಸ್ಟಮ್ ಮತ್ತು ನಿಮ್ಮ ಪ್ರಗತಿಯ ಬಗ್ಗೆ ಕನ್ನಡದಲ್ಲಿ ಮಾಹಿತಿ ನೀಡಬಲ್ಲೆ."}
                </p>

                <button
                  onClick={startListening}
                  disabled={isListening}
                  className={`flex h-20 w-20 items-center justify-center rounded-full shadow-2xl transition-all hover:scale-110 active:scale-95 ${isListening ? "bg-destructive text-destructive-foreground animate-pulse" : "gradient-primary text-primary-foreground shadow-primary-glow"}`}
                >
                  {isListening ? <MicOff className="h-8 w-8" /> : <Mic className="h-8 w-8" />}
                </button>
              </div>

              <div className="flex items-center gap-6 mt-12">
                <div className="text-center group">
                  <TrendingUp className="h-5 w-5 mx-auto mb-2 text-primary opacity-50 group-hover:opacity-100" />
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Academic Analysis</span>
                </div>
                <div className="text-center group">
                  <Zap className="h-5 w-5 mx-auto mb-2 text-primary opacity-50 group-hover:opacity-100" />
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">System Voice Commands</span>
                </div>
              </div>
            </div>
          ) : (
            <>
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
                      <div className={`max-w-[85%] rounded-2xl p-4 ${msg.role === "user"
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
              <div className="px-8 py-4 border-t border-border bg-card/20 backdrop-blur-md">
                <div className="max-w-3xl mx-auto">
                  <form onSubmit={(e) => { e.preventDefault(); sendMessage(input); }} className="flex gap-2">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Ask your academic assistant..."
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
            </>
          )}
        </main>
      </div>
    </div>
  );
}
