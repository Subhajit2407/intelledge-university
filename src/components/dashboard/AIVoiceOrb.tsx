import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Mic, MicOff, MessageSquare, X, Languages, Sparkles, TrendingUp, AlertTriangle, Calendar, Target, Volume2, Bot, Loader2 } from "lucide-react";
import { getAIResponse, AIResponse } from "@/lib/gemini";
import IntellEdgeDB from "@/lib/db";

type OrbMode = "idle" | "listening" | "processing" | "speaking" | "briefing";
type Language = "en" | "kn" | "hi";

export function AIVoiceOrb() {
    const studentData = JSON.parse(localStorage.getItem("student_profile_data") || '{"name": "User", "semester": "5"}');
    const firstName = studentData.name.split(" ")[0];

    const [mode, setMode] = useState<OrbMode>("idle");
    const [lang, setLang] = useState<Language>("en");
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [isQuietMode, setIsQuietMode] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const currentContent = {
        processing: "Syncing with IntelliEdge Neural Core..."
    };

    const toggleLang = () => {
        const nextLang = lang === "en" ? "kn" : lang === "kn" ? "hi" : "en";
        setLang(nextLang);

        // Speak confirmation in new language via AI
        const fetchConfirmation = async () => {
            setMode("processing");
            const aiResponse = await getAIResponse(
                `Confirm that the language has been switched to ${nextLang === 'en' ? 'English' : nextLang === 'kn' ? 'Kannada' : 'Hindi'}.`,
                {},
                nextLang
            );
            setMessage(aiResponse.message);
            speak(aiResponse.message);
        };
        fetchConfirmation();
    };

    // Proactive Briefing on Dashboard or Login
    useEffect(() => {
        // Trigger on Dashboard or Landing
        if ((location.pathname === "/" || location.pathname === "/dashboard") && mode === "idle") {
            const fetchBriefing = async () => {
                const records = await IntellEdgeDB.getRecords();
                const myRecord = records.find((r: any) => r.name === studentData.name);

                const prompt = "Generate a short, proactive greeting for the dashboard. Mention system status (100% operational) and a quick highlight of my status (like attendance or progress).";
                const context = {
                    studentName: studentData.name,
                    record: myRecord,
                    systemStatus: "100% operational"
                };

                // We use a small delay to not overwhelm the user immediately
                setTimer(3000, async () => {
                    setMode("processing");
                    setIsOpen(true);

                    const aiResponse = await getAIResponse(prompt, context, lang);
                    setMessage(aiResponse.message);
                    speak(aiResponse.message);
                });
            };

            fetchBriefing();
        }
    }, [location.pathname]);

    const setTimer = (ms: number, cb: () => void) => {
        if (isQuietMode) return;
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(cb, ms);
    };

    const toggleQuietMode = () => {
        setIsQuietMode(!isQuietMode);
        window.speechSynthesis.cancel();
        if (timerRef.current) clearTimeout(timerRef.current);
        setIsOpen(false);
        setMode("idle");
        setMessage("");
    };

    const toggleOrb = () => {
        if (isOpen) {
            setIsOpen(false);
            setMode("idle");
            window.speechSynthesis.cancel();
        } else {
            setIsOpen(true);
            const fetchWelcome = async () => {
                setMode("processing");
                const aiResponse = await getAIResponse(
                    `Greet the user ${firstName} and ask how you can help.`,
                    { studentName: firstName },
                    lang
                );
                setMessage(aiResponse.message);
                speak(aiResponse.message);
            };
            fetchWelcome();
        }
    };

    const recognitionRef = useRef<any>(null);

    useEffect(() => {
        // Initialize Speech Recognition
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (SpeechRecognition) {
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;
            recognitionRef.current.lang = lang === "en" ? "en-US" : lang === "kn" ? "kn-IN" : "hi-IN";

            recognitionRef.current.onresult = (event: any) => {
                const transcript = event.results[0][0].transcript;
                processVoiceCommand(transcript);
            };

            recognitionRef.current.onend = () => {
                if (mode === "listening") setMode("idle");
            };

            recognitionRef.current.onerror = (e: any) => {
                setMode("idle");
                const errMsg = lang === "en"
                    ? "I couldn't hear you clearly. Please try again."
                    : lang === "kn"
                        ? "ನಾನು ಸ್ಪಷ್ಟವಾಗಿ ಕೇಳಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ."
                        : "मैं स्पष्ट रूप से नहीं सुन सका। कृपया पुनः प्रयास करें।";
                setMessage(errMsg);
            };
        }
    }, [lang, mode]);


    const speak = (text: string) => {
        if (isQuietMode) return;
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);

        // Dynamic Voice Selection
        const voices = window.speechSynthesis.getVoices();
        let selectedVoice = null;

        if (lang === "en") {
            // Priority: Google US English > Microsoft David > Any English
            selectedVoice = voices.find(v => v.name.includes("Google US English") || v.name.includes("Premium")) ||
                voices.find(v => v.lang.startsWith("en-") && v.name.includes("Female")) ||
                voices.find(v => v.lang.startsWith("en-"));
        } else if (lang === "kn") {
            selectedVoice = voices.find(v => v.lang.startsWith("kn")) || voices.find(v => v.lang.startsWith("hi")); // Fallback to Hindi if Kannada not available
        } else if (lang === "hi") {
            selectedVoice = voices.find(v => v.lang.startsWith("hi"));
        }

        if (selectedVoice) utterance.voice = selectedVoice;
        utterance.lang = lang === "en" ? "en-US" : lang === "kn" ? "kn-IN" : "hi-IN";

        // Premium Prosody Settings
        utterance.rate = 1.0;
        utterance.pitch = 1.05; // Slightly higher for a "premium assistant" feel
        utterance.volume = 1.0;

        utterance.onstart = () => setMode("speaking");
        utterance.onend = () => setMode("idle");
        utterance.onerror = () => setMode("idle");

        window.speechSynthesis.speak(utterance);
    };

    // Load voices on mount to ensure availability
    useEffect(() => {
        window.speechSynthesis.getVoices();
        if (window.speechSynthesis.onvoiceschanged !== undefined) {
            window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
        }
    }, []);

    const processVoiceCommand = async (text: string) => {
        setMode("processing");
        setMessage("Processing query...");

        try {
            // Gather contextual data for the AI
            const records = await IntellEdgeDB.getRecords();
            const alerts = await IntellEdgeDB.getAlerts(studentData.name);

            const context = {
                studentName: studentData.name,
                semester: studentData.semester,
                records: records.filter(r => r.name === studentData.name),
                alerts: alerts,
                currentPath: location.pathname
            };

            const aiResponse: AIResponse = await getAIResponse(text, context, lang);

            // Handle language switching if suggested by AI
            if (aiResponse.language !== lang) {
                setLang(aiResponse.language);
            }

            setMessage(aiResponse.message);
            speak(aiResponse.message);

            // Handle navigation action
            if (aiResponse.action?.type === "navigate" && aiResponse.action.path) {
                const path = aiResponse.action.path;
                setTimer(2000, () => {
                    navigate(path);
                    setIsOpen(false);
                });
            }
        } catch (error) {
            console.error("AI Error:", error);
            const errorMsg = "I'm having trouble connecting to my neural network. Please check your connection.";
            setMessage(errorMsg);
            speak(errorMsg);
            setMode("idle");
        }
    };

    const handleVoice = () => {
        if (mode === "listening") {
            recognitionRef.current?.stop();
            setMode("idle");
        } else {
            // Ensure audio context is resumed if browser blocked speech
            if (window.speechSynthesis.paused) window.speechSynthesis.resume();

            setMode("listening");
            if (recognitionRef.current) {
                recognitionRef.current.lang = lang === "en" ? "en-US" : lang === "kn" ? "kn-IN" : "hi-IN";
                recognitionRef.current.start();
            } else {
                alert("Speech recognition not supported in this browser.");
            }
        }
    };

    return (
        <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end gap-4 pointer-events-none">
            {/* Expanded Panel */}
            {isOpen && (
                <div className="pointer-events-auto w-[360px] rounded-3xl bg-card border border-border bg-opacity-90 backdrop-blur-xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
                    <div className="p-5 border-b border-border bg-accent/20 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                            <span className="text-xs font-bold text-foreground">IntellEdge AI Companion</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={toggleLang}
                                className="flex items-center gap-1 rounded-lg bg-secondary px-2 py-1 text-[10px] font-bold text-foreground hover:bg-accent transition-colors"
                            >
                                <Languages className="h-3 w-3" />
                                {lang === "en" ? "ENG" : lang === "kn" ? "KAN" : "HIN"}
                            </button>
                            <button
                                onClick={toggleQuietMode}
                                title="Quiet Mode: Stop AI Intelligence"
                                className="flex items-center gap-1 rounded-lg bg-destructive/10 px-2 py-1 text-[10px] font-bold text-destructive hover:bg-destructive hover:text-white transition-colors"
                            >
                                <MicOff className="h-3 w-3" />
                                STOP
                            </button>
                            <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground">
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                    <div className="p-6">
                        <div className="mb-6">
                            <p className="text-sm font-medium text-foreground leading-relaxed animate-in fade-in slide-in-from-left-2">
                                {message || currentContent.processing}
                            </p>
                        </div>

                        {/* Visual Waveform (Simulated) */}
                        {mode === "processing" && (
                            <div className="mb-6 flex flex-col items-center justify-center gap-2">
                                <Loader2 className="h-8 w-8 text-primary animate-spin" />
                                <span className="text-[10px] text-muted-foreground animate-pulse">Analyzing Neural Core...</span>
                            </div>
                        )}
                        {(mode === "listening" || mode === "speaking") && (
                            <div className="mb-6 flex items-center justify-center gap-1 h-8">
                                {[...Array(12)].map((_, i) => (
                                    <div
                                        key={i}
                                        className={`w-1 rounded-full animate-bounce ${mode === "listening" ? "bg-red-500" : "bg-primary"}`}
                                        style={{
                                            height: `${Math.random() * 100 + 20}%`,
                                            animationDuration: `${Math.random() * 0.5 + 0.5}s`,
                                            animationDelay: `${i * 0.05}s`
                                        }}
                                    />
                                ))}
                            </div>
                        )}

                        {/* Quick Actions */}
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                onClick={() => processVoiceCommand("Optimize my week based on my attendance and subjects")}
                                className="flex items-center gap-2 rounded-xl border border-border bg-accent/50 p-2.5 text-left transition-all hover:bg-accent"
                            >
                                <Calendar className="h-3.5 w-3.5 text-primary" />
                                <span className="text-[10px] font-bold text-foreground">Optimize Week</span>
                            </button>
                            <button
                                onClick={() => processVoiceCommand("Am I ready for my next exams? Analyze my records.")}
                                className="flex items-center gap-2 rounded-xl border border-border bg-accent/50 p-2.5 text-left transition-all hover:bg-accent"
                            >
                                <Target className="h-3.5 w-3.5 text-primary" />
                                <span className="text-[10px] font-bold text-foreground">Am I Ready?</span>
                            </button>
                        </div>
                    </div>

                    <div className="bg-accent/10 p-4 flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl gradient-primary text-primary-foreground">
                            <Volume2 className="h-5 w-5" />
                        </div>
                        <p className="text-[10px] text-muted-foreground italic">
                            "Speaking in {lang === "en" ? "English" : lang === "kn" ? "ಕನ್ನಡ" : "हिंदी"}... Use voice commands to execute actions."
                        </p>
                    </div>
                </div>
            )}

            {/* Floating Orb */}
            <div className="pointer-events-auto relative group">
                {/* Glow Effects */}
                <div className={`absolute inset-0 -z-10 rounded-full blur-2xl opacity-40 transition-all duration-500 scale-150 ${mode === "listening" ? "bg-red-500 animate-pulse" :
                    mode === "processing" ? "bg-yellow-500 animate-spin-slow" :
                        isQuietMode ? "bg-muted" : "bg-primary group-hover:opacity-60"
                    }`} />

                {isQuietMode && (
                    <div className="absolute -top-12 right-0 bg-destructive text-white text-[8px] font-black px-2 py-1 rounded-lg uppercase whitespace-nowrap animate-in fade-in slide-in-from-bottom-2">
                        System Quiet
                    </div>
                )}

                <button
                    onClick={isQuietMode ? toggleQuietMode : toggleOrb}
                    className={`relative flex h-16 w-16 items-center justify-center rounded-full shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 ${mode === "listening" ? "bg-red-600" :
                        mode === "processing" ? "bg-yellow-500" :
                            isQuietMode ? "bg-muted" : "gradient-primary"
                        }`}
                >
                    {isQuietMode ? (
                        <MicOff className="h-7 w-7 text-muted-foreground" />
                    ) : mode === "listening" ? (
                        <Mic className="h-7 w-7 text-white" />
                    ) : mode === "processing" ? (
                        <Sparkles className="h-7 w-7 text-white" />
                    ) : (
                        <div className="relative">
                            <Bot className="h-7 w-7 text-white" />
                            <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-success border-2 border-primary animate-pulse" />
                        </div>
                    )}
                </button>

                {/* Voice Trigger Label */}
                {!isOpen && (
                    <div className="absolute right-20 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-card px-3 py-1.5 rounded-xl border border-border shadow-xl whitespace-nowrap">
                        <p className="text-[10px] font-bold text-foreground flex items-center gap-2">
                            <Mic className="h-3 w-3 text-primary" />
                            {isQuietMode ? "Quiet Mode Active" : "Say 'Hey IntellEdge'"}
                        </p>
                    </div>
                )}
            </div>

            {/* Inline Interaction button (Optional when open) */}
            {isOpen && mode !== "processing" && (
                <button
                    onClick={handleVoice}
                    className="pointer-events-auto flex h-14 w-14 items-center justify-center rounded-full bg-secondary text-foreground shadow-lg hover:bg-accent transition-colors animate-in zoom-in"
                >
                    {mode === "listening" ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
                </button>
            )}
        </div>
    );
}
