import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { Mic, MicOff, MessageSquare, X, Languages, Sparkles, TrendingUp, AlertTriangle, Calendar, Target, Volume2, Bot } from "lucide-react";

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
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Translations / Localized Content
    const content = {
        en: {
            greeting: `Hello, ${firstName}.`,
            briefing: "Your neural dashboard is synchronized. Systems report 100% operational status.",
            atRisk: "Your academic parameters are within safe limits. Maintain current performance.",
            placement: "New institutional placements are being verified for the 2026 drive.",
            processing: "Syncing with IntelliEdge Neural Core..."
        },
        kn: {
            greeting: `ನಮಸ್ಕಾರ, ${firstName}.`,
            briefing: "ನಿಮ್ಮ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ ಲೈವ್ ಆಗಿದೆ. ಎಲ್ಲಾ ವ್ಯವಸ್ಥೆಗಳು ಸರಿಯಾಗಿ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತಿವೆ.",
            atRisk: "ನಿಮ್ಮ ಶೈಕ್ಷಣಿಕ ಪ್ರಗತಿ ಉತ್ತಮವಾಗಿದೆ. ಇದೇ ರೀತಿ ಮುಂದುವರಿಸಿ.",
            placement: "2026ರ ಹೊಸ ಉದ್ಯೋಗಾವಕಾಶಗಳನ್ನು ಪರಿಶೀಲಿಸಲಾಗುತ್ತಿದೆ.",
            processing: "ಎಐ ಕೋರ್‌ನೊಂದಿಗೆ ಸಂಪರ್ಕಿಸಲಾಗುತ್ತಿದೆ..."
        },
        hi: {
            greeting: `नमस्ते, ${firstName}.`,
            briefing: "आपका डैशबोर्ड सक्रिय है। सभी प्रणालियां सुचारू रूप से कार्य कर रही हैं।",
            atRisk: "आपकी शैक्षणिक प्रगति अच्छी है। इसे बनाए रखें।",
            placement: "2026 के नए प्लेसमेंट अवसरों की जाँच की जा रही है।",
            processing: "एआई कोर के साथ सिंक हो रहा है..."
        }
    };

    const currentContent = content[lang];

    const toggleLang = () => {
        const nextLang = lang === "en" ? "kn" : lang === "kn" ? "hi" : "en";
        setLang(nextLang);

        // Speak confirmation in new language
        const confirmations = {
            en: "Language changed to English.",
            kn: "ಭಾಷೆಯನ್ನು ಕನ್ನಡಕ್ಕೆ ಬದಲಾಯಿಸಲಾಗಿದೆ.",
            hi: "भाषा बदलकर हिंदी कर दी गई है।"
        };
        speak(confirmations[nextLang]);
    };

    // Proactive Briefing on Dashboard or Login
    useEffect(() => {
        if (location.pathname === "/" && mode === "idle") {
            setTimer(3000, () => {
                setMode("briefing");
                setIsOpen(true);
                const fullMsg = currentContent.greeting + " " + currentContent.briefing;
                setMessage(fullMsg);
                speak(fullMsg);
            });
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
            const welcomes = {
                en: `Hello ${firstName}, I am your university AI. How can I help you?`,
                kn: `ನಮಸ್ಕಾರ ${firstName}, ನಾನು ನಿಮ್ಮ ವಿಶ್ವವಿದ್ಯಾಲಯದ ಎಐ. ನಾನು ದಯವಿಟ್ಟು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಲಿ?`,
                hi: `नमस्ते ${firstName}, मैं आपकी यूनिवर्सिटी एआई हूँ। मैं आपकी क्या मदद कर सकता हूँ?`
            };
            const fullWelcome = welcomes[lang];
            setMessage(fullWelcome);
            speak(fullWelcome);
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

            recognitionRef.current.onresult = (event: any) => {
                const transcript = event.results[0][0].transcript;
                processVoiceCommand(transcript);
            };

            recognitionRef.current.onend = () => {
                if (mode === "listening") setMode("idle");
            };

            recognitionRef.current.onerror = () => {
                setMode("idle");
            };
        }
    }, [lang, mode]);

    const speak = (text: string) => {
        if (isQuietMode) return;
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang === "en" ? "en-US" : lang === "kn" ? "kn-IN" : "hi-IN";
        utterance.rate = 0.9;
        utterance.pitch = 1;
        utterance.onstart = () => setMode("speaking");
        utterance.onend = () => setMode("idle");
        window.speechSynthesis.speak(utterance);
    };

    const processVoiceCommand = (text: string) => {
        setMode("processing");
        const lower = text.toLowerCase();

        setTimer(1200, () => {
            let response = "";
            if (lang === "kn") {
                if (lower.includes("ಹಾಜರಾತಿ") || lower.includes("ಅಟೆಂಡೆನ್ಸ್")) response = currentContent.atRisk;
                else if (lower.includes("ಪ್ಲೇಸ್ಮೆಂಟ್") || lower.includes("ಕೆಲಸ")) response = currentContent.placement;
                else if (lower.includes("ಹಲೋ") || lower.includes("ನಮಸ್ಕಾರ")) response = "ನಮಸ್ಕಾರ! ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ಕೇಳಿ.";
                else response = "ಕ್ಷಮಿಸಿ, ಈ ವಿಷಯದ ಬಗ್ಗೆ ನನಗೆ ಮಾಹಿತಿ ಇಲ್ಲ. ದಯವಿಟ್ಟು ಹಾಜರಾತಿ ಅಥವಾ ಪ್ಲೇಸ್ಮೆಂಟ್ ಬಗ್ಗೆ ಕೇಳಿ.";
            } else if (lang === "hi") {
                if (lower.includes("उपस्थिति") || lower.includes("अटेंडेंस")) response = currentContent.atRisk;
                else if (lower.includes("प्लेसमेंट") || lower.includes("नौकरी")) response = currentContent.placement;
                else if (lower.includes("नमस्ते") || lower.includes("हेलो")) response = "नमस्ते! मैं आपकी क्या सहायता कर सकता हूँ?";
                else response = "क्षमा करें, मुझे इस बारे में जानकारी नहीं है। कृपया उपस्थिति या प्लेसमेंट के बारे में पूछें।";
            } else {
                if (lower.includes("attendance") || lower.includes("low")) response = currentContent.atRisk;
                else if (lower.includes("placement") || lower.includes("job") || lower.includes("hiring")) response = currentContent.placement;
                else if (lower.includes("cgpa") || lower.includes("marks") || lower.includes("grade")) response = `Your current CGPA is projected at 7.8. Stay focused on your upcoming internal exams.`;
                else if (lower.includes("assignment") || lower.includes("tasks")) response = currentContent.briefing;
                else response = "I'm your IntellEdge assistant. I can help with your academics, attendance records, and placement opportunities.";
            }

            setMessage(response);
            speak(response);
        });
    };

    const handleVoice = () => {
        if (mode === "listening") {
            recognitionRef.current?.stop();
            setMode("idle");
        } else {
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
                        {(mode === "listening" || mode === "speaking") && (
                            <div className="mb-6 flex items-center justify-center gap-1 h-8">
                                {[...Array(12)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="w-1 bg-primary rounded-full animate-bounce"
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
                            <button className="flex items-center gap-2 rounded-xl border border-border bg-accent/50 p-2.5 text-left transition-all hover:bg-accent">
                                <Calendar className="h-3.5 w-3.5 text-primary" />
                                <span className="text-[10px] font-bold text-foreground">Optimize Week</span>
                            </button>
                            <button className="flex items-center gap-2 rounded-xl border border-border bg-accent/50 p-2.5 text-left transition-all hover:bg-accent">
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
                            "Speaking in {lang === "en" ? "English" : "Kannada"}... Use voice commands to execute actions."
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
