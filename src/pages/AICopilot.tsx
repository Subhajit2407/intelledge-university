import { useState, useRef, useEffect, useMemo } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { TopBar } from "@/components/dashboard/TopBar";
import {
  Send, Bot, User, Sparkles, Brain, Calendar, TrendingUp,
  FileText, Zap, Mic, MicOff, Languages, X, Loader2,
  ChevronRight, ArrowUpRight, BarChart3, Target, Info
} from "lucide-react";
import { getAIResponse } from "@/lib/gemini";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const quickActions = [
  { icon: TrendingUp, label: "Predict my final CGPA", prompt: "Predict my final CGPA based on my actual performance trends." },
  { icon: Calendar, label: "Optimize my week", prompt: "Optimize my week for placement prep while maintaining academics." },
  { icon: Target, label: "Am I ready for Microsoft?", prompt: "Analyze my match score for a Microsoft SDE role based on my profile." },
  { icon: FileText, label: "Attendance Recovery", prompt: "Analyze my current attendance risks and suggest a recovery plan." },
  { icon: Brain, label: "Skill Gap Analysis", prompt: "Analyze my technical skill gaps based on my projects." },
  { icon: Sparkles, label: "Faculty Email Draft", prompt: "Draft a professional email to my professor regarding extra classes." },
];

export default function AICopilot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceLang, setVoiceLang] = useState<"en" | "kn" | "hi">("en");
  const [voiceStatus, setVoiceStatus] = useState("Awaiting neural input...");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Load Real Context
  const context = useMemo(() => {
    const student = JSON.parse(localStorage.getItem("student_profile_data") || "{}");
    const records = JSON.parse(localStorage.getItem("teacher_student_records") || "[]");
    const myRecord = records.find((r: any) => r.roll === student.roll || r.name === student.name);
    const projects = JSON.parse(localStorage.getItem("student_projects") || "[]");
    return { student, record: myRecord, projects };
  }, []);

  useEffect(() => {
    if (messages.length === 0) {
      const name = context.student.name?.split(" ")[0] || "Student";
      setMessages([
        {
          id: "welcome",
          role: "assistant",
          content: `# 👋 Hello, ${name}\n\nI am your **Neural Academic Copilot**. My session is currently synchronized with your institutional profile and project vault.\n\n### Accessing Core Intelligence:\n- **Predictive Analytics:** CGPA modeling and grade forecasting.\n- **Career Readiness:** Real-time matching for companies like Microsoft or Google.\n- **Sync Audits:** Precise attendance risk assessments.\n- **Multi-Language:** I speak English, ಕನ್ನಡ, and हिंदी.\n\nType a command or use **Voice Interaction** below.`,
          timestamp: new Date(),
        }
      ]);
    }
  }, [context]);

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
        setVoiceStatus("Processing neural query...");
      };
      recognitionRef.current.onend = () => setIsListening(false);
      recognitionRef.current.onerror = () => {
        setIsListening(false);
        setVoiceStatus("Could not hear clearly. Try again.");
      };
    }
  }, []);

  const speak = (text: string) => {
    const cleanText = text.replace(/[#*`|]/g, "").replace(/\[.*\]\(.*\)/g, "").replace(/✅|📌|📊|🔮|⚠️|👋|🧠|🏢/g, "");
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(cleanText);

    // Smart voice selection
    const voices = window.speechSynthesis.getVoices();
    let selectedVoice = null;

    if (voiceLang === "en") {
      selectedVoice = voices.find(v => v.name.includes("Google US English") || v.name.includes("Premium")) ||
        voices.find(v => v.lang.startsWith("en-") && v.name.includes("Female")) ||
        voices.find(v => v.lang.startsWith("en-"));
    } else if (voiceLang === "kn") {
      selectedVoice = voices.find(v => v.lang.startsWith("kn")) || voices.find(v => v.lang.startsWith("hi"));
    } else if (voiceLang === "hi") {
      selectedVoice = voices.find(v => v.lang.startsWith("hi"));
    }

    if (selectedVoice) utterance.voice = selectedVoice;
    utterance.lang = voiceLang === "en" ? "en-US" : voiceLang === "kn" ? "kn-IN" : "hi-IN";
    utterance.rate = 1.0;
    utterance.pitch = 1.05;
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
  };

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), role: "user", content: text, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const aiResponse = await getAIResponse(text, context, voiceLang);

      const response: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: aiResponse.message,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, response]);

      if (isVoiceMode) {
        speak(aiResponse.message);
        setVoiceStatus("Response synchronized. Tap to speak again.");
      }
    } catch (error) {
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I encountered a processing error. Please try your query again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const toggleVoiceMode = () => {
    setIsVoiceMode(!isVoiceMode);
    if (!isVoiceMode) {
      setVoiceStatus("Awaiting neural input...");
    }
  };

  const startListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = voiceLang === "en" ? "en-US" : voiceLang === "kn" ? "kn-IN" : "hi-IN";
      recognitionRef.current.start();
      setIsListening(true);
      const langLabel = voiceLang === "en" ? "English" : voiceLang === "kn" ? "ಕನ್ನಡ" : "हिंदी";
      setVoiceStatus(`Listening in ${langLabel}...`);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden ios-bg font-sans">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 flex flex-col overflow-hidden relative">

          {/* Premium AI Header */}
          <div className="px-10 py-6 border-b border-slate-100 bg-white/40 backdrop-blur-xl z-20 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500/20 blur-lg rounded-full animate-pulse" />
                <div className="relative flex h-12 w-12 items-center justify-center rounded-[1.25rem] bg-[#1C1C1E] text-white shadow-lg">
                  <Bot className="h-6 w-6" />
                </div>
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">AI Copilot</h2>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                    Neural Engine Active · {voiceLang === "en" ? "English" : voiceLang === "kn" ? "ಕನ್ನಡ" : "हिंदी"}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setVoiceLang(prev => prev === "en" ? "kn" : prev === "kn" ? "hi" : "en")}
                className="flex items-center gap-2 rounded-2xl px-5 py-2.5 text-xs font-bold bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all active:scale-95"
              >
                <Languages className="h-4 w-4 text-blue-500" />
                {voiceLang === "en" ? "ENG" : voiceLang === "kn" ? "KAN" : "HIN"}
              </button>
              <button
                onClick={stopSpeaking}
                className="flex items-center gap-2 rounded-2xl px-5 py-2.5 text-xs font-bold bg-rose-50 text-rose-500 hover:bg-rose-100 transition-all active:scale-95"
              >
                <X className="h-4 w-4" /> Stop
              </button>
              <button
                onClick={toggleVoiceMode}
                className={`flex items-center gap-2 rounded-2xl px-5 py-2.5 text-xs font-bold transition-all active:scale-95 ${isVoiceMode
                  ? "bg-[#007AFF] text-white shadow-[#007AFF]/25 shadow-lg"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
              >
                <Mic className="h-4 w-4" /> {isVoiceMode ? "Terminal Mode" : "Voice Sync"}
              </button>
            </div>
          </div>

          {isVoiceMode ? (
            <div className="flex-1 flex flex-col items-center justify-center p-12 bg-gradient-to-b from-blue-50/50 to-white animate-in fade-in duration-500">
              {/* Visualizer Aura */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
                <div className={`h-[500px] w-[500px] rounded-full border border-blue-100/30 transition-all duration-1000 ${isListening ? "scale-125 bg-blue-500/5 rotate-180" : "scale-100 bg-transparent rotate-0"}`} />
                <div className={`absolute h-[600px] w-[600px] rounded-full border border-blue-50/50 transition-all duration-[2000ms] ${isListening ? "scale-150 rotate-[-180deg]" : "scale-110"}`} />
              </div>

              <div className="relative z-10 flex flex-col items-center text-center max-w-xl">
                <button
                  onClick={() => setVoiceLang(prev => prev === "en" ? "kn" : prev === "kn" ? "hi" : "en")}
                  className="mb-10 flex items-center gap-2 rounded-xl bg-white border border-slate-200 px-4 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest shadow-sm hover:border-blue-200 transition-all"
                >
                  <Languages className="h-4 w-4 text-blue-500" />
                  {voiceLang === "en" ? "English" : voiceLang === "kn" ? "ಕನ್ನಡ (Kannada)" : "हिंदी (Hindi)"}
                </button>

                <div className={`relative mb-16 flex h-40 w-40 items-center justify-center rounded-[3rem] shadow-2xl transition-all duration-500 ${isListening ? "bg-[#007AFF] scale-110 shadow-blue-500/40" : "bg-[#1C1C1E]"}`}>
                  <div className={`absolute inset-0 rounded-[3rem] border-8 border-blue-500/20 ${isListening ? "animate-ping" : ""}`} />
                  <Sparkles className={`h-16 w-16 ${isListening ? "text-white" : "text-blue-500"} transition-all`} />
                </div>

                <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tighter">{voiceStatus}</h3>
                <p className="text-sm font-medium text-slate-400 mb-16 leading-relaxed max-w-xs">
                  {voiceLang === "en"
                    ? "I am listening to your career and academic queries. Speak clearly for best results."
                    : voiceLang === "kn"
                      ? "ನಿಮ್ಮ ಶೈಕ್ಷಣಿಕ ಅಥವಾ ಉದ್ಯೋಗದ ಬಗ್ಗೆ ಮಾಹಿತಿಗಾಗಿ ಮಾತನಾಡಿ. ಸ್ಪಷ್ಟವಾಗಿ ಹೇಳಿ."
                      : "अपनी शैक्षणिक या करियर से जुड़ी जानकारी के लिए बोलें। स्पष्ट रूप से बोलें।"}
                </p>

                <button
                  onClick={startListening}
                  disabled={isListening}
                  className={`flex h-24 w-24 items-center justify-center rounded-full shadow-2xl transition-all hover:scale-110 active:scale-90 ${isListening
                    ? "bg-rose-500 text-white animate-pulse"
                    : "bg-[#007AFF] text-white shadow-blue-500/40"
                    }`}
                >
                  {isListening ? <MicOff className="h-10 w-10" /> : <Mic className="h-10 w-10" />}
                </button>
              </div>

              {/* Action Indicators */}
              <div className="absolute bottom-20 flex gap-12">
                {[
                  { icon: BarChart3, label: voiceLang === "en" ? "Analytics" : voiceLang === "kn" ? "ವಿಶ್ಲೇಷಣೆ" : "विश्लेषण" },
                  { icon: Target, label: voiceLang === "en" ? "Placement" : voiceLang === "kn" ? "ಪ್ಲೇಸ್ಮೆಂಟ್" : "प्लेसमेंट" },
                  { icon: Brain, label: voiceLang === "en" ? "Knowledge" : voiceLang === "kn" ? "ಜ್ಞಾನ" : "ज्ञान" }
                ].map((item, i) => (
                  <div key={i} className="flex flex-col items-center gap-3 opacity-20">
                    <item.icon className="h-6 w-6 text-slate-900" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <>
              {/* Chat Canvas */}
              <div className="flex-1 overflow-y-auto px-10 py-10 custom-scrollbar">
                <div className="max-w-4xl mx-auto space-y-10">
                  {messages.map((msg) => (
                    <div key={msg.id} className={`flex gap-6 animate-in fade-in slide-in-from-bottom-5 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl shadow-sm ${msg.role === "assistant"
                        ? "bg-[#1C1C1E] text-white"
                        : "bg-blue-50 text-[#007AFF]"
                        }`}>
                        {msg.role === "assistant" ? <Bot className="h-6 w-6" /> : <User className="h-6 w-6" />}
                      </div>

                      <div className={`max-w-[80%] space-y-2 ${msg.role === "user" ? "text-right" : ""}`}>
                        <div className={`rounded-[2rem] p-8 shadow-sm border ${msg.role === "user"
                          ? "bg-[#007AFF] text-white border-[#007AFF]/20"
                          : "bg-white text-slate-700 border-slate-100"
                          }`}>
                          <div className={`text-[15px] leading-[1.6] prose prose-slate max-w-none ${msg.role === "user" ? "prose-invert" : ""}`}>
                            {msg.content.split('\n').map((line, i) => (
                              <p key={i} className={line.startsWith('#') ? "text-xl font-bold mb-4" : "mb-2"}>
                                {line.replace(/^[# ]+/, '')}
                              </p>
                            ))}
                          </div>
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4">
                          {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </div>
                  ))}

                  {isTyping && (
                    <div className="flex gap-6 animate-pulse">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#1C1C1E] text-white">
                        <Bot className="h-6 w-6" />
                      </div>
                      <div className="rounded-[2rem] bg-white border border-slate-100 p-8 shadow-sm flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: "0ms" }} />
                        <div className="h-2 w-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: "150ms" }} />
                        <div className="h-2 w-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="px-10 pb-4">
                <div className="max-w-4xl mx-auto">
                  <div className="flex items-center gap-3 mb-4 overflow-x-auto pb-2 custom-scrollbar">
                    <div className="flex-shrink-0 flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest pr-4 border-r border-slate-100">
                      <Zap className="h-3 w-3 text-amber-500" /> Suggestions
                    </div>
                    {quickActions.map((action) => (
                      <button
                        key={action.label}
                        onClick={() => sendMessage(action.prompt)}
                        className="flex-shrink-0 flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:border-blue-300 transition-all hover:translate-y-[-2px] shadow-sm"
                      >
                        <action.icon className="h-3.5 w-3.5 text-[#007AFF]" />
                        {action.label}
                      </button>
                    ))}
                  </div>

                  {/* Main Input */}
                  <div className="relative group">
                    <div className="absolute inset-0 bg-blue-500/5 blur-xl group-focus-within:bg-blue-500/10 transition-all rounded-3xl" />
                    <form
                      onSubmit={(e) => { e.preventDefault(); sendMessage(input); }}
                      className="relative flex items-center gap-4 bg-white/80 backdrop-blur-xl border border-slate-200 rounded-[2rem] p-3 shadow-xl transition-all focus-within:ring-4 focus-within:ring-blue-500/5 focus-within:border-blue-400"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-[1.25rem] bg-slate-50 text-slate-400">
                        <Brain className="h-6 w-6" />
                      </div>
                      <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={voiceLang === "en" ? "Command your career analytics..." : voiceLang === "kn" ? "ನಿಮ್ಮ ಶೈಕ್ಷಣಿಕ ಪ್ರಶ್ನೆ ಬರೆಯಿರಿ..." : "अपना शैक्षणिक प्रश्न लिखें..."}
                        className="flex-1 bg-transparent px-2 py-3 text-base font-medium text-slate-900 outline-none placeholder:text-slate-400"
                        disabled={isTyping}
                      />
                      <button
                        type="submit"
                        disabled={!input.trim() || isTyping}
                        className="flex h-12 w-12 items-center justify-center rounded-[1.25rem] bg-[#007AFF] text-white shadow-lg shadow-blue-500/30 disabled:opacity-50 hover:scale-105 active:scale-95 transition-all"
                      >
                        {isTyping ? <Loader2 className="h-5 w-5 animate-spin" /> : <ArrowUpRight className="h-6 w-6" />}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
