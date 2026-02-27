import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
    const navigate = useNavigate();
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
        // Trigger on Dashboard or Landing
        if ((location.pathname === "/" || location.pathname === "/dashboard") && mode === "idle") {
            const teacherRecords = JSON.parse(localStorage.getItem("teacher_student_records") || "[]");
            const myRecord = teacherRecords.find((r: any) => r.name === studentData.name);

            let statusDetail = currentContent.briefing;
            if (myRecord) {
                const att = parseInt(myRecord.attendance);
                if (att < 75) statusDetail = "System Alert: Your attendance dropped to " + att + "%. Please contact faculty.";
                else if (att > 90) statusDetail = "Exceptional status verified. Attendance is a perfect " + att + "%.";
            }

            setTimer(3000, () => {
                setMode("briefing");
                setIsOpen(true);
                const fullMsg = currentContent.greeting + " " + statusDetail;
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

    const processVoiceCommand = (text: string) => {
        setMode("processing");
        const lower = text.toLowerCase();
        const navigateTo = (path: string) => {
            navigate(path);
            setIsOpen(false);
        };

        setTimer(1200, () => {
            let response = "";

            // Language switching via voice
            if (lower.includes("english") || lower.includes("ಇಂಗ್ಲಿಷ್") || lower.includes("अंग्रेजी")) {
                setLang("en");
                response = "Switched to English.";
            } else if (lower.includes("kannada") || lower.includes("ಕನ್ನಡ") || lower.includes("ಕನ್ನಡಕ್ಕೆ")) {
                setLang("kn");
                response = "ಕನ್ನಡಕ್ಕೆ ಬದಲಾಯಿಸಲಾಗಿದೆ.";
            } else if (lower.includes("hindi") || lower.includes("ಹಿಂದಿ") || lower.includes("हिंदी")) {
                setLang("hi");
                response = "हिंदी में बदल दिया गया है।";
            }

            if (response) {
                setMessage(response);
                speak(response);
                return;
            }

            if (lang === "kn") {
                if (lower.includes("ಹಾಜರಾತಿ") || lower.includes("ಅಟೆಂಡೆನ್ಸ್")) response = currentContent.atRisk;
                else if (lower.includes("ಪ್ಲೇಸ್ಮೆಂಟ್") || lower.includes("ಕೆಲಸ") || lower.includes("ನೌಕರಿ")) response = currentContent.placement;
                else if (lower.includes("ಪ್ರಾಜೆಕ್ಟ್") || lower.includes("ಪ್ರೊಜೆಕ್ಟ್")) {
                    response = "ನಿಮ್ಮ ಪ್ರಾಜೆಕ್ಟ್ ಪುಟಕ್ಕೆ ಕರೆದೊಯ್ಯುತ್ತಿದ್ದೇನೆ.";
                    navigateTo("/projects");
                } else if (lower.includes("ವರದಿ") || lower.includes("ಅನಾಲಿಟಿಕ್ಸ್")) {
                    response = "ನಿಮ್ಮ ಪ್ರಗತಿಯ ವರದಿಯನ್ನು ತೋರಿಸುತ್ತಿದ್ದೇನೆ.";
                    navigateTo("/analytics");
                } else if (lower.includes("ಪ್ರೊಫೈಲ್") || lower.includes("ನನ್ನ ಮಾಹಿತಿ")) {
                    response = "ನಿಮ್ಮ ಪ್ರೊಫೈಲ್ ಪುಟ ಇಲ್ಲಿದೆ.";
                    navigateTo("/profile");
                } else if (lower.includes("ಹಲೋ") || lower.includes("ನಮಸ್ಕಾರ")) response = "ನಮಸ್ಕಾರ! ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಲಿ?";
                else response = "ಕ್ಷಮಿಸಿ, ಅರ್ಥವಾಗಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಹಾಜರಾತಿ, ಪ್ಲೇಸ್ಮೆಂಟ್ ಅಥವಾ ಪ್ರಾಜೆಕ್ಟ್ ಬಗ್ಗೆ ಕೇಳಿ.";
            } else if (lang === "hi") {
                if (lower.includes("उपस्थिति") || lower.includes("अटेंडेंस")) response = currentContent.atRisk;
                else if (lower.includes("प्लेसमेंट") || lower.includes("नौकरी")) response = currentContent.placement;
                else if (lower.includes("प्रोजेक्ट")) {
                    response = "मैं आपको प्रोजेक्ट पेज पर ले जा रहा हूँ।";
                    navigateTo("/projects");
                } else if (lower.includes("रिपोर्ट") || lower.includes("एनालिटिक्स")) {
                    response = "आपकी प्रगति रिपोर्ट यहाँ है।";
                    navigateTo("/analytics");
                } else if (lower.includes("प्रोफाइल")) {
                    response = "आपकी प्रोफाइल खोली जा रही है।";
                    navigateTo("/profile");
                } else if (lower.includes("नमस्ते") || lower.includes("हेलो")) response = "नमस्ते! मैं आपकी क्या सहायता कर सकता हूँ?";
                else response = "क्षमा करें, मुझे समझ नहीं आया। कृपया उपस्थिति, प्लेसमेंट या प्रोजेक्ट के बारे में पूछें।";
            } else {
                if (lower.includes("attendance") || lower.includes("low")) response = currentContent.atRisk;
                else if (lower.includes("placement") || lower.includes("job") || lower.includes("hiring")) response = currentContent.placement;
                else if (lower.includes("project") || lower.includes("repo")) {
                    response = "Opening your project vault.";
                    navigateTo("/projects");
                } else if (lower.includes("analytics") || lower.includes("growth") || lower.includes("report")) {
                    response = "Synchronizing with your growth analytics.";
                    navigateTo("/analytics");
                } else if (lower.includes("profile") || lower.includes("account") || lower.includes("edit")) {
                    response = "Accessing your intelligence profile.";
                    navigateTo("/profile");
                } else if (lower.includes("dashboard") || lower.includes("home")) {
                    response = "Returning to main dashboard.";
                    navigateTo("/dashboard");
                } else if (lower.includes("cgpa") || lower.includes("marks")) response = `Your current CGPA is projected at 7.8. Stay focused.`;
                else response = "I can navigate to projects, analytics, profile, or tell you about attendance and placements.";
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
