import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";
const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

export interface AIResponse {
    message: string;
    action?: {
        type: "navigate" | "none";
        path?: string;
    };
    language: "en" | "kn" | "hi";
}

const SYSTEM_PROMPT = `
You are "IntellEdge AI", a highly advanced university assistant for IntelliEdge University. 
Your goal is to assist students with their academic records, attendance, placements, and navigation within the platform.

### Capabilities:
1. **Attendance Tracking**: Help students understand their attendance status.
2. **Academic Performance**: Discuss CGPA, marks, and subjects.
3. **Placements**: Provide information on upcoming hiring drives and job opportunities.
4. **Navigation**: Help users find pages like Dashboard, Projects, Analytics, Profile, and Academic Vault.
5. **Multi-language**: You support English, Kannada, and Hindi. Always reply in the language the user is speaking in, unless asked to switch.

### Platform Navigation Paths:
- Dashboard: /dashboard
- Projects/Project Vault: /projects
- Analytics/Growth: /analytics
- Profile/Account: /profile
- Academic Vault/Subjects: /academic-vault
- Placement Hub: /placements (if available)

### Response Format:
You MUST respond in a valid JSON format with the following structure:
{
  "message": "The text you will say to the user",
  "action": {
    "type": "navigate" or "none",
    "path": "/target-path" (optional)
  },
  "language": "en" or "kn" or "hi"
}

Keep messages concise, professional, and helpful. Use the student's context provided in the prompt.
If you don't have enough info about something specific, politely tell them.
`;

// ─────────────────────────────────────────────────────────────
// LOCAL INTELLIGENCE ENGINE (Offline / Fallback)
// ─────────────────────────────────────────────────────────────

interface IntentMatch {
    keywords: string[];
    response: Record<"en" | "kn" | "hi", string>;
    action?: { type: "navigate" | "none"; path?: string };
}

const INTENT_MAP: IntentMatch[] = [
    // ── Greetings ──
    {
        keywords: ["hello", "hi", "hey", "good morning", "good afternoon", "good evening", "ನಮಸ್ಕಾರ", "ಹಲೋ", "ಹಾಯ್", "नमस्ते", "हेलो", "नमस्कार"],
        response: {
            en: "Hello! I'm your IntellEdge AI assistant. I can help you with attendance, placements, academics, navigation, and more. What would you like to know?",
            kn: "ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ IntellEdge AI ಸಹಾಯಕ. ಹಾಜರಾತಿ, ಪ್ಲೇಸ್ಮೆಂಟ್, ಶೈಕ್ಷಣಿಕ ವಿಷಯಗಳು, ನ್ಯಾವಿಗೇಶನ್ ಮತ್ತು ಹೆಚ್ಚಿನ ವಿಷಯಗಳಲ್ಲಿ ನಾನು ನಿಮಗೆ ಸಹಾಯ ಮಾಡಬಲ್ಲೆ. ನಿಮಗೆ ಏನು ತಿಳಿಯಬೇಕು?",
            hi: "नमस्ते! मैं आपका IntellEdge AI सहायक हूँ। मैं उपस्थिति, प्लेसमेंट, शिक्षा, नेविगेशन और बहुत कुछ में आपकी मदद कर सकता हूँ। आप क्या जानना चाहेंगे?"
        }
    },
    // ── Attendance ──
    {
        keywords: ["attendance", "absent", "present", "low attendance", "ಹಾಜರಾತಿ", "ಅಟೆಂಡೆನ್ಸ್", "उपस्थिति", "अटेंडेंस", "हाजिरी"],
        response: {
            en: "Your attendance is being tracked across all subjects. To maintain eligibility, ensure you stay above 75%. I recommend checking your academic vault for detailed subject-wise attendance.",
            kn: "ನಿಮ್ಮ ಹಾಜರಾತಿಯನ್ನು ಎಲ್ಲಾ ವಿಷಯಗಳಲ್ಲಿ ಟ್ರ್ಯಾಕ್ ಮಾಡಲಾಗುತ್ತಿದೆ. ಅರ್ಹತೆಯನ್ನು ಕಾಯ್ದುಕೊಳ್ಳಲು, 75% ಮೇಲೆ ಇರುವಂತೆ ನೋಡಿಕೊಳ್ಳಿ. ವಿಷಯವಾರು ವಿವರಗಳಿಗೆ ಅಕಾಡೆಮಿಕ್ ವಾಲ್ಟ್ ನೋಡಿ.",
            hi: "आपकी उपस्थिति सभी विषयों में ट्रैक की जा रही है। पात्रता बनाए रखने के लिए, 75% से ऊपर रहें। विषयवार विवरण के लिए एकेडमिक वॉल्ट देखें।"
        }
    },
    // ── Placements ──
    {
        keywords: ["placement", "job", "hiring", "internship", "company", "recruit", "ಪ್ಲೇಸ್ಮೆಂಟ್", "ಕೆಲಸ", "ನೌಕರಿ", "ಉದ್ಯೋಗ", "प्लेसमेंट", "नौकरी", "भर्ती", "इंटर्नशिप"],
        response: {
            en: "The 2026 placement drive is in progress. Companies are actively hiring. Visit the Placement Hub for the latest job openings, interview schedules, and hiring calendars.",
            kn: "2026ರ ಪ್ಲೇಸ್ಮೆಂಟ್ ಡ್ರೈವ್ ಪ್ರಗತಿಯಲ್ಲಿದೆ. ಕಂಪನಿಗಳು ಸಕ್ರಿಯವಾಗಿ ನೇಮಕಾತಿ ನಡೆಸುತ್ತಿವೆ. ಉದ್ಯೋಗಾವಕಾಶಗಳು ಮತ್ತು ಸಂದರ್ಶನ ವೇಳಾಪಟ್ಟಿಗಾಗಿ ಪ್ಲೇಸ್ಮೆಂಟ್ ಹಬ್ ಭೇಟಿ ಮಾಡಿ.",
            hi: "2026 प्लेसमेंट ड्राइव चल रहा है। कंपनियां सक्रिय रूप से भर्ती कर रही हैं। नौकरी के अवसरों और इंटरव्यू शेड्यूल के लिए प्लेसमेंट हब देखें।"
        },
        action: { type: "navigate", path: "/placements" }
    },
    // ── Projects ──
    {
        keywords: ["project", "repo", "github", "code", "ಪ್ರಾಜೆಕ್ಟ್", "ಪ್ರೊಜೆಕ್ಟ್", "ಕೋಡ್", "प्रोजेक्ट", "कोड"],
        response: {
            en: "Opening your Project Vault. Here you can manage all your projects, track contributions, and view your coding activity.",
            kn: "ನಿಮ್ಮ ಪ್ರಾಜೆಕ್ಟ್ ವಾಲ್ಟ್ ತೆರೆಯಲಾಗುತ್ತಿದೆ. ಇಲ್ಲಿ ನಿಮ್ಮ ಎಲ್ಲಾ ಪ್ರಾಜೆಕ್ಟ್‌ಗಳನ್ನು ನಿರ್ವಹಿಸಿ, ಕೊಡುಗೆಗಳನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ.",
            hi: "आपकी प्रोजेक्ट वॉल्ट खोली जा रहा है। यहाँ अपने सभी प्रोजेक्ट्स प्रबंधित करें और कोडिंग गतिविधि देखें।"
        },
        action: { type: "navigate", path: "/projects" }
    },
    // ── Analytics / Reports ──
    {
        keywords: ["analytics", "growth", "report", "progress", "performance", "ವರದಿ", "ಅನಾಲಿಟಿಕ್ಸ್", "ಪ್ರಗತಿ", "रिपोर्ट", "एनालिटिक्स", "प्रगति"],
        response: {
            en: "Navigating to Growth Analytics. Track your academic performance, skill development, and overall growth trajectory.",
            kn: "ಬೆಳವಣಿಗೆ ಅನಾಲಿಟಿಕ್ಸ್‌ಗೆ ನ್ಯಾವಿಗೇಟ್ ಆಗುತ್ತಿದೆ. ನಿಮ್ಮ ಶೈಕ್ಷಣಿಕ ಪ್ರದರ್ಶನ ಮತ್ತು ಕೌಶಲ್ಯ ಅಭಿವೃದ್ಧಿಯನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ.",
            hi: "ग्रोथ एनालिटिक्स पर जा रहे हैं। अपनी शैक्षणिक प्रगति और कौशल विकास को ट्रैक करें।"
        },
        action: { type: "navigate", path: "/analytics" }
    },
    // ── Profile ──
    {
        keywords: ["profile", "account", "my info", "settings", "edit profile", "ಪ್ರೊಫೈಲ್", "ನನ್ನ ಮಾಹಿತಿ", "प्रोफाइल", "खाता", "मेरी जानकारी"],
        response: {
            en: "Opening your intelligence profile. You can review and update your personal information here.",
            kn: "ನಿಮ್ಮ ಪ್ರೊಫೈಲ್ ತೆರೆಯಲಾಗುತ್ತಿದೆ. ನಿಮ್ಮ ವೈಯಕ್ತಿಕ ಮಾಹಿತಿಯನ್ನು ಇಲ್ಲಿ ಪರಿಶೀಲಿಸಿ ಮತ್ತು ನವೀಕರಿಸಿ.",
            hi: "आपकी प्रोफ़ाइल खोली जा रही है। यहाँ अपनी व्यक्तिगत जानकारी देखें और अपडेट करें।"
        },
        action: { type: "navigate", path: "/profile" }
    },
    // ── Dashboard ──
    {
        keywords: ["dashboard", "home", "main", "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್", "ಮುಖ್ಯ", "डैशबोर्ड", "होम", "मुख्य"],
        response: {
            en: "Returning to main dashboard. Your command center for all academic operations.",
            kn: "ಮುಖ್ಯ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌ಗೆ ಹಿಂತಿರುಗಲಾಗುತ್ತಿದೆ. ನಿಮ್ಮ ಎಲ್ಲಾ ಶೈಕ್ಷಣಿಕ ಕಾರ್ಯಾಚರಣೆಗಳ ಕಮಾಂಡ್ ಕೇಂದ್ರ.",
            hi: "मुख्य डैशबोर्ड पर वापस जा रहे हैं। यह आपकी सभी शैक्षणिक गतिविधियों का कमांड सेंटर है।"
        },
        action: { type: "navigate", path: "/dashboard" }
    },
    // ── CGPA / Marks ──
    {
        keywords: ["cgpa", "marks", "grade", "gpa", "score", "exam", "result", "ಸಿಜಿಪಿಎ", "ಅಂಕಗಳು", "ಪರೀಕ್ಷೆ", "सीजीपीए", "अंक", "परीक्षा", "नतीजा"],
        response: {
            en: "Your academic scores are tracked in your profile and academic vault. Keep your focus consistent to maintain a strong CGPA. Visit the Academic Vault for subject-wise breakdowns.",
            kn: "ನಿಮ್ಮ ಶೈಕ್ಷಣಿಕ ಅಂಕಗಳನ್ನು ಪ್ರೊಫೈಲ್ ಮತ್ತು ಅಕಾಡೆಮಿಕ್ ವಾಲ್ಟ್‌ನಲ್ಲಿ ಟ್ರ್ಯಾಕ್ ಮಾಡಲಾಗಿದೆ. ಉತ್ತಮ CGPA ಕಾಯ್ದುಕೊಳ್ಳಲು ಸ್ಥಿರವಾಗಿ ಅಧ್ಯಯನ ಮಾಡಿ.",
            hi: "आपके शैक्षणिक अंक प्रोफ़ाइल और अकादमिक वॉल्ट में ट्रैक किए जाते हैं। अच्छा CGPA बनाए रखने के लिए निरंतर प्रयास करें।"
        }
    },
    // ── Academic Vault ──
    {
        keywords: ["academic", "vault", "subject", "syllabus", "course", "ಅಕಾಡೆಮಿಕ್", "ವಾಲ್ಟ್", "ವಿಷಯ", "पाठ्यक्रम", "विषय", "अकादमिक"],
        response: {
            en: "Opening your Academic Vault. Here you can view all subjects, attendance breakdowns, and academic resources.",
            kn: "ನಿಮ್ಮ ಅಕಾಡೆಮಿಕ್ ವಾಲ್ಟ್ ತೆರೆಯಲಾಗುತ್ತಿದೆ. ಇಲ್ಲಿ ಎಲ್ಲಾ ವಿಷಯಗಳು ಮತ್ತು ಹಾಜರಾತಿ ವಿವರಗಳನ್ನು ನೋಡಿ.",
            hi: "आपका अकादमिक वॉल्ट खोला जा रहा है। यहाँ सभी विषयों और उपस्थिति विवरण देखें।"
        },
        action: { type: "navigate", path: "/academics" }
    },
    // ── Calendar ──
    {
        keywords: ["calendar", "schedule", "event", "ಕ್ಯಾಲೆಂಡರ್", "ವೇಳಾಪಟ್ಟಿ", "कैलेंडर", "शेड्यूल"],
        response: {
            en: "Opening your calendar. View upcoming events, deadlines, and class schedules.",
            kn: "ನಿಮ್ಮ ಕ್ಯಾಲೆಂಡರ್ ತೆರೆಯಲಾಗುತ್ತಿದೆ. ಮುಂಬರುವ ಕಾರ್ಯಕ್ರಮಗಳು ಮತ್ತು ಗಡುವುಗಳನ್ನು ನೋಡಿ.",
            hi: "आपका कैलेंडर खोला जा रहा है। आगामी कार्यक्रम और डेडलाइन देखें।"
        },
        action: { type: "navigate", path: "/calendar" }
    },
    // ── Resume / ATS ──
    {
        keywords: ["resume", "ats", "cv", "ರೆಸ್ಯೂಮೆ", "ಎಟಿಎಸ್", "रिज्यूमे", "बायोडाटा"],
        response: {
            en: "Opening the ATS Resume Checker. Upload your resume to get an AI-powered analysis and see how well it matches industry standards.",
            kn: "ATS ರೆಸ್ಯೂಮೆ ಚೆಕರ್ ತೆರೆಯಲಾಗುತ್ತಿದೆ. ನಿಮ್ಮ ರೆಸ್ಯೂಮೆಯನ್ನು AI ವಿಶ್ಲೇಷಣೆಗಾಗಿ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ.",
            hi: "ATS रिज्यूमे चेकर खोला जा रहा है। AI विश्लेषण के लिए अपना रिज्यूमे अपलोड करें।"
        },
        action: { type: "navigate", path: "/resume-checker" }
    },
    // ── Language Switching ──
    {
        keywords: ["english", "switch to english", "ಇಂಗ್ಲಿಷ್", "अंग्रेजी"],
        response: {
            en: "Language switched to English. How can I assist you?",
            kn: "ಭಾಷೆಯನ್ನು ಇಂಗ್ಲಿಷ್‌ಗೆ ಬದಲಾಯಿಸಲಾಗಿದೆ.",
            hi: "भाषा अंग्रेजी में बदल दी गई है।"
        }
    },
    {
        keywords: ["kannada", "ಕನ್ನಡ", "ಕನ್ನಡಕ್ಕೆ"],
        response: {
            en: "Language switched to Kannada.",
            kn: "ಭಾಷೆಯನ್ನು ಕನ್ನಡಕ್ಕೆ ಬದಲಾಯಿಸಲಾಗಿದೆ. ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಲಿ?",
            hi: "भाषा कन्नड़ में बदल दी गई है।"
        }
    },
    {
        keywords: ["hindi", "ಹಿಂದಿ", "हिंदी", "हिन्दी"],
        response: {
            en: "Language switched to Hindi.",
            kn: "ಭಾಷೆಯನ್ನು ಹಿಂದಿಗೆ ಬದಲಾಯಿಸಲಾಗಿದೆ.",
            hi: "भाषा हिंदी में बदल दी गई है। मैं आपकी क्या सहायता कर सकता हूँ?"
        }
    },
    // ── Help / Capabilities ──
    {
        keywords: ["help", "what can you do", "capabilities", "features", "ಸಹಾಯ", "ನೀವು ಏನು ಮಾಡಬಲ್ಲಿರಿ", "मदद", "क्या कर सकते हो"],
        response: {
            en: "I can help you with: ✅ Checking attendance & academic records, ✅ Navigating to Dashboard, Projects, Analytics, Profile, ✅ Placement information & hiring updates, ✅ Resume ATS checking, ✅ Calendar & scheduling, ✅ Speaking in English, Kannada, or Hindi. Just ask!",
            kn: "ನಾನು ನಿಮಗೆ ಸಹಾಯ ಮಾಡಬಲ್ಲೆ: ✅ ಹಾಜರಾತಿ ಮತ್ತು ಶೈಕ್ಷಣಿಕ ದಾಖಲೆಗಳು, ✅ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್, ಪ್ರಾಜೆಕ್ಟ್, ಅನಾಲಿಟಿಕ್ಸ್‌ಗೆ ನ್ಯಾವಿಗೇಟ್, ✅ ಪ್ಲೇಸ್ಮೆಂಟ್ ಮಾಹಿತಿ, ✅ ರೆಸ್ಯೂಮೆ ATS ಪರಿಶೀಲನೆ, ✅ ಇಂಗ್ಲಿಷ್, ಕನ್ನಡ ಅಥವಾ ಹಿಂದಿಯಲ್ಲಿ ಸಂವಹನ.",
            hi: "मैं आपकी मदद कर सकता हूँ: ✅ उपस्थिति और शैक्षणिक रिकॉर्ड, ✅ डैशबोर्ड, प्रोजेक्ट, एनालिटिक्स नेविगेशन, ✅ प्लेसमेंट जानकारी, ✅ रिज्यूमे ATS जाँच, ✅ अंग्रेजी, कन्नड़ या हिंदी में बातचीत।"
        }
    },
    // ── Thank you ──
    {
        keywords: ["thank", "thanks", "ಧನ್ಯವಾದ", "धन्यवाद", "शुक्रिया"],
        response: {
            en: "You're welcome! I'm always here to help. Feel free to ask anything anytime.",
            kn: "ನಿಮಗೆ ಸ್ವಾಗತ! ನಾನು ಯಾವಾಗಲೂ ಸಹಾಯ ಮಾಡಲು ಇಲ್ಲಿದ್ದೇನೆ.",
            hi: "आपका स्वागत है! मैं हमेशा मदद के लिए यहाँ हूँ।"
        }
    },
    // ── Who are you? ──
    {
        keywords: ["who are you", "your name", "what are you", "ನೀವು ಯಾರು", "तुम कौन हो", "आप कौन हो"],
        response: {
            en: "I am IntellEdge AI, your intelligent university companion. I'm powered by advanced neural networks to help you navigate academics, placements, and more.",
            kn: "ನಾನು IntellEdge AI, ನಿಮ್ಮ ಬುದ್ಧಿವಂತ ವಿಶ್ವವಿದ್ಯಾಲಯ ಸಹಾಯಕ. ಶೈಕ್ಷಣಿಕ, ಪ್ಲೇಸ್ಮೆಂಟ್ ಮತ್ತು ಹೆಚ್ಚಿನ ವಿಷಯಗಳಲ್ಲಿ ನಿಮಗೆ ಸಹಾಯ ಮಾಡಲು ನಾನು ಅಡ್ವಾನ್ಸ್ಡ್ ನ್ಯೂರಲ್ ನೆಟ್‌ವರ್ಕ್‌ಗಳಿಂದ ಚಾಲಿತ.",
            hi: "मैं IntellEdge AI हूँ, आपका बुद्धिमान विश्वविद्यालय सहायक। शिक्षा, प्लेसमेंट और बहुत कुछ में आपकी मदद करने के लिए मैं उन्नत न्यूरल नेटवर्क से संचालित हूँ।"
        }
    },
    // ── Optimize Week ──
    {
        keywords: ["optimize", "week", "plan my week", "schedule plan", "ವಾರ ಯೋಜನೆ", "सप्ताह की योजना"],
        response: {
            en: "Here's my recommendation to optimize your week: 📌 Monday-Wednesday: Focus on core subjects and complete pending assignments. 📌 Thursday: Review your project milestones and push code updates. 📌 Friday: Attend placement prep sessions and update your resume. 📌 Weekend: Revise weekly material and work on skill development. Stay consistent!",
            kn: "ನಿಮ್ಮ ವಾರವನ್ನು ಸುಧಾರಿಸಲು ನನ್ನ ಶಿಫಾರಸು: 📌 ಸೋಮ-ಬುಧ: ಮುಖ್ಯ ವಿಷಯಗಳಲ್ಲಿ ಗಮನ ಕೇಂದ್ರೀಕರಿಸಿ. 📌 ಗುರುವಾರ: ಪ್ರಾಜೆಕ್ಟ್ ಮೈಲ್‌ಸ್ಟೋನ್‌ಗಳನ್ನು ಪರಿಶೀಲಿಸಿ. 📌 ಶುಕ್ರವಾರ: ಪ್ಲೇಸ್ಮೆಂಟ್ ತಯಾರಿ. 📌 ವಾರಾಂತ್ಯ: ಪುನರ್ ಅವಲೋಕನ ಮತ್ತು ಕೌಶಲ್ಯ ಅಭಿವೃದ್ಧಿ.",
            hi: "आपके सप्ताह को बेहतर बनाने के लिए: 📌 सोम-बुध: मुख्य विषयों पर ध्यान दें। 📌 गुरुवार: प्रोजेक्ट माइलस्टोन की समीक्षा करें। 📌 शुक्रवार: प्लेसमेंट तैयारी। 📌 सप्ताहांत: रिवीजन और कौशल विकास।"
        }
    },
    // ── Am I Ready? ──
    {
        keywords: ["ready", "exam ready", "prepared", "ತಯಾರು", "ಸಿದ್ಧ", "तैयार", "परीक्षा तैयारी"],
        response: {
            en: "Based on your current academic trajectory: 📊 Ensure all assignments are submitted. 📊 Maintain consistent attendance above 75%. 📊 Review past exam papers for key subjects. 📊 Focus on weak areas identified in your analytics. You're on track — keep pushing!",
            kn: "ನಿಮ್ಮ ಪ್ರಸ್ತುತ ಶೈಕ್ಷಣಿಕ ಹಾದಿಯ ಆಧಾರದ ಮೇಲೆ: 📊 ಎಲ್ಲಾ ಅಸೈನ್‌ಮೆಂಟ್‌ಗಳನ್ನು ಸಲ್ಲಿಸಿ. 📊 75%ಕ್ಕಿಂತ ಹೆಚ್ಚಿನ ಹಾಜರಾತಿ ಕಾಪಾಡಿ. 📊 ಹಳೆಯ ಪರೀಕ್ಷಾ ಪ್ರಶ್ನೆಪತ್ರಿಕೆಗಳನ್ನು ಪರಿಶೀಲಿಸಿ. ನೀವು ಸರಿಯಾದ ಹಾದಿಯಲ್ಲಿ ಇದ್ದೀರಿ!",
            hi: "आपकी वर्तमान शैक्षणिक स्थिति के आधार पर: 📊 सभी असाइनमेंट जमा करें। 📊 75% से ऊपर उपस्थिति बनाए रखें। 📊 पिछले परीक्षा पत्रों की समीक्षा करें। 📊 कमजोर क्षेत्रों पर ध्यान दें। आप सही रास्ते पर हैं!"
        }
    },
    // ── CGPA / Predict ──
    {
        keywords: ["cgpa", "predict", "gpa", "forecast", "ಸಿಜಿಪಿಎ", "ಊಹಿಸಿ", "सीजीपीए", "भविष्यवाणी"],
        response: {
            en: "📊 CGPA Prediction Analysis: Based on your current academic trajectory, here's my projection: ✅ Maintain consistency in all subjects to secure 8.0+. ✅ Focus on high-credit subjects for maximum CGPA impact. ✅ Lab and practical components often contribute significantly. ✅ Project scores and internals can boost your overall grade. Keep up the momentum!",
            kn: "📊 CGPA ಊಹೆ ವಿಶ್ಲೇಷಣೆ: ನಿಮ್ಮ ಪ್ರಸ್ತುತ ಶೈಕ್ಷಣಿಕ ಹಾದಿಯ ಆಧಾರದ ಮೇಲೆ: ✅ 8.0+ ಸಾಧಿಸಲು ಎಲ್ಲಾ ವಿಷಯಗಳಲ್ಲಿ ಸ್ಥಿರತೆ ಕಾಪಾಡಿ. ✅ ಹೆಚ್ಚಿನ ಕ್ರೆಡಿಟ್ ವಿಷಯಗಳ ಮೇಲೆ ಗಮನ ಕೇಂದ್ರೀಕರಿಸಿ. ✅ ಲ್ಯಾಬ್ ಮತ್ತು ಪ್ರಾಕ್ಟಿಕಲ್ ಅಂಶಗಳು ಮಹತ್ವದ ಕೊಡುಗೆ ನೀಡುತ್ತವೆ.",
            hi: "📊 CGPA भविष्यवाणी विश्लेषण: आपकी वर्तमान शैक्षणिक दिशा के आधार पर: ✅ 8.0+ के लिए सभी विषयों में निरंतरता बनाए रखें। ✅ अधिक क्रेडिट वाले विषयों पर ध्यान दें। ✅ लैब और प्रैक्टिकल अंक महत्वपूर्ण योगदान देते हैं। गति बनाए रखें!"
        }
    },
    // ── Skill Gap ──
    {
        keywords: ["skill", "gap", "learn", "improve", "ಕೌಶಲ್ಯ", "ಕಲಿ", "सीखना", "कौशल", "सुधार"],
        response: {
            en: "🧠 Skill Gap Analysis: Based on industry trends for 2026 placements: ✅ Data Structures & Algorithms — Essential for all product companies. ✅ System Design — Required for SDE-2 level roles. ✅ Cloud Computing (AWS/Azure) — Growing demand across all sectors. ✅ Full Stack Development — React, Node.js remain in high demand. ✅ Machine Learning Basics — Competitive advantage for analytics roles. I recommend starting with DSA practice on LeetCode.",
            kn: "🧠 ಕೌಶಲ್ಯ ವಿಶ್ಲೇಷಣೆ: 2026 ಪ್ಲೇಸ್ಮೆಂಟ್‌ಗಾಗಿ ಉದ್ಯಮದ ಪ್ರವೃತ್ತಿಗಳ ಆಧಾರದ ಮೇಲೆ: ✅ DSA — ಎಲ್ಲಾ ಪ್ರಾಡಕ್ಟ್ ಕಂಪನಿಗಳಿಗೆ ಅಗತ್ಯ. ✅ ಸಿಸ್ಟಮ್ ಡಿಸೈನ್ — SDE-2 ಹಂತಕ್ಕೆ ಅಗತ್ಯ. ✅ ಕ್ಲೌಡ್ ಕಂಪ್ಯೂಟಿಂಗ್. ✅ ಫುಲ್ ಸ್ಟ್ಯಾಕ್ ಡೆವಲಪ್ಮೆಂಟ್. ✅ ML ಮೂಲಭೂತ ಅಂಶಗಳು. LeetCode ನಲ್ಲಿ DSA ಅಭ್ಯಾಸ ಪ್ರಾರಂಭಿಸಿ.",
            hi: "🧠 कौशल विश्लेषण: 2026 प्लेसमेंट के लिए: ✅ DSA — सभी प्रोडक्ट कंपनियों के लिए जरूरी। ✅ सिस्टम डिजाइन — SDE-2 स्तर के लिए। ✅ क्लाउड कंप्यूटिंग (AWS/Azure)। ✅ फुल स्टैक डेवलपमेंट। ✅ ML बेसिक्स। मैं LeetCode पर DSA प्रैक्टिस से शुरू करने की सलाह देता हूँ।"
        }
    },
    // ── Email Draft ──
    {
        keywords: ["email", "draft", "professor", "faculty", "write", "compose", "ಇಮೇಲ್", "ಬರೆ", "ईमेल", "लिखना", "ड्राफ्ट"],
        response: {
            en: "📧 Here's a professional email template:\n\nSubject: Request for Additional Academic Support\n\nRespected Professor,\n\nI hope this email finds you well. I am writing to request an appointment to discuss additional learning support for the current semester.\n\nI have been actively working to improve my academic performance and would appreciate your guidance on areas where I can strengthen my understanding.\n\nI am available at your convenience and would be grateful for any time you can spare.\n\nThank you for your continued support.\n\nWarm regards,\n[Your Name]\n[Roll Number]",
            kn: "📧 ಇಲ್ಲಿ ವೃತ್ತಿಪರ ಇಮೇಲ್ ಟೆಂಪ್ಲೇಟ್:\n\nವಿಷಯ: ಹೆಚ್ಚುವರಿ ಶೈಕ್ಷಣಿಕ ಸಹಾಯಕ್ಕಾಗಿ ವಿನಂತಿ\n\nಗೌರವಾನ್ವಿತ ಪ್ರಾಧ್ಯಾಪಕರೇ,\n\nಈ ಸೆಮಿಸ್ಟರ್‌ನ ಶೈಕ್ಷಣಿಕ ಪ್ರಗತಿಯನ್ನು ಚರ್ಚಿಸಲು ಭೇಟಿಯ ಸಮಯವನ್ನು ವಿನಂತಿಸುತ್ತಿದ್ದೇನೆ. ನಿಮ್ಮ ಮಾರ್ಗದರ್ಶನ ಬಹಳ ಮೌಲ್ಯಯುತವಾಗಿರುತ್ತದೆ.\n\nಧನ್ಯವಾದಗಳು,\n[ನಿಮ್ಮ ಹೆಸರು]",
            hi: "📧 यहाँ एक पेशेवर ईमेल टेम्पलेट:\n\nविषय: अतिरिक्त शैक्षणिक सहायता के लिए अनुरोध\n\nआदरणीय प्रोफेसर,\n\nमैं इस सेमेस्टर में अपनी शैक्षणिक प्रगति पर चर्चा करने के लिए एक अपॉइंटमेंट का अनुरोध करना चाहता हूँ। आपका मार्गदर्शन बहुत मूल्यवान होगा।\n\nधन्यवाद,\n[आपका नाम]"
        }
    },
    // ── Company Readiness (Microsoft, Google, Amazon) ──
    {
        keywords: ["microsoft", "google", "amazon", "company match", "am i ready", "match score", "ಕಂಪನಿ", "ಸಿದ್ಧತೆ", "कंपनी", "मैच"],
        response: {
            en: "🏢 Company Readiness Assessment:\n\n📊 Neural Match Score: Based on your profile analysis —\n\n✅ Strengths: Active project portfolio, institutional standing, and academic consistency.\n✅ Areas to Improve: System Design depth, competitive programming rating, and cloud certifications.\n\n📌 Recommended Actions:\n1. Complete at least 200 DSA problems on LeetCode/Codeforces.\n2. Build 2 system design case studies.\n3. Obtain at least one cloud certification (AWS/Azure).\n4. Practice mock interviews weekly.\n\nYour match score will significantly improve with these optimizations!",
            kn: "🏢 ಕಂಪನಿ ಸಿದ್ಧತೆ ಮೌಲ್ಯಮಾಪನ:\n\n✅ ಶಕ್ತಿಗಳು: ಸಕ್ರಿಯ ಪ್ರಾಜೆಕ್ಟ್ ಪೋರ್ಟ್‌ಫೋಲಿಯೋ ಮತ್ತು ಶೈಕ್ಷಣಿಕ ಸ್ಥಿರತೆ.\n✅ ಸುಧಾರಿಸಬೇಕಾದ ಕ್ಷೇತ್ರಗಳು: ಸಿಸ್ಟಮ್ ಡಿಸೈನ್, DSA, ಕ್ಲೌಡ್ ಸರ್ಟಿಫಿಕೇಶನ್.\n\n📌 ಶಿಫಾರಸು: LeetCode ನಲ್ಲಿ 200 ಸಮಸ್ಯೆಗಳು, ಮಾಕ್ ಇಂಟರ್‌ವ್ಯೂ ಅಭ್ಯಾಸ, ಕ್ಲೌಡ್ ಸರ್ಟಿಫಿಕೇಶನ್ ಪಡೆಯಿರಿ.",
            hi: "🏢 कंपनी तैयारी मूल्यांकन:\n\n✅ ताकतें: सक्रिय प्रोजेक्ट पोर्टफोलियो और शैक्षणिक निरंतरता.\n✅ सुधार क्षेत्र: सिस्टम डिजाइन, DSA, क्लाउड सर्टिफिकेशन.\n\n📌 सिफारिश: LeetCode पर 200 समस्याएं, मॉक इंटरव्यू, क्लाउड सर्टिफिकेशन प्राप्त करें।"
        }
    },
    // ── Study Tips ──
    {
        keywords: ["study", "tips", "how to study", "exam preparation", "ಓದು", "ಪರೀಕ್ಷೆ ತಯಾರಿ", "पढ़ाई", "टिप्स", "कैसे पढ़ें"],
        response: {
            en: "📚 Smart Study Tips for Peak Performance:\n\n1. 🕐 Pomodoro Technique: Study 25 mins, rest 5 mins, repeat.\n2. 📝 Active Recall: Test yourself instead of re-reading notes.\n3. 📅 Spaced Repetition: Review material at increasing intervals.\n4. 🧬 Concept Mapping: Visualize relationships between topics.\n5. 👥 Teaching Method: Explain concepts to peers to solidify understanding.\n6. 😴 Sleep: Get 7-8 hours — memory consolidation happens during sleep.\n7. 🏃 Exercise: 30 mins daily improves cognitive function by 20%.",
            kn: "📚 ಉತ್ತಮ ಅಧ್ಯಯನ ಸಲಹೆಗಳು:\n\n1. 🕐 ಪೊಮೊಡೊರೊ: 25 ನಿಮಿಷ ಓದಿ, 5 ನಿಮಿಷ ವಿಶ್ರಾಂತಿ.\n2. 📝 ಸಕ್ರಿಯ ಸ್ಮರಣೆ: ಮರು-ಓದುವ ಬದಲು ನಿಮ್ಮನ್ನು ಪರೀಕ್ಷಿಸಿ.\n3. 📅 ಅಂತರ ಪುನರಾವರ್ತನೆ: ಹೆಚ್ಚುತ್ತಿರುವ ಅಂತರಗಳಲ್ಲಿ ಪರಿಶೀಲಿಸಿ.\n4. 😴 ನಿದ್ರೆ: 7-8 ಗಂಟೆ ನಿದ್ರೆ ಅಗತ್ಯ.\n5. 🏃 ವ್ಯಾಯಾಮ: ದಿನಕ್ಕೆ 30 ನಿಮಿಷ ಮಾನಸಿಕ ಕಾರ್ಯಕ್ಷಮತೆ ಸುಧಾರಿಸುತ್ತದೆ.",
            hi: "📚 स्मार्ट स्टडी टिप्स:\n\n1. 🕐 पोमोडोरो: 25 मिनट पढ़ें, 5 मिनट आराम।\n2. 📝 एक्टिव रिकॉल: दोबारा पढ़ने की बजाय खुद को टेस्ट करें।\n3. 📅 स्पेस्ड रिपीटिशन: बढ़ते अंतराल पर रिवीजन।\n4. 😴 नींद: 7-8 घंटे जरूरी।\n5. 🏃 व्यायाम: 30 मिनट दैनिक।"
        }
    },
    // ── Good Bye ──
    {
        keywords: ["bye", "goodbye", "see you", "later", "ಮತ್ತೆ ಸಿಗೋಣ", "ಬೈ", "अलविदा", "बाय", "फिर मिलेंगे"],
        response: {
            en: "Goodbye! Remember, I'm always here whenever you need help. Keep working hard, and success will follow. See you soon! 👋",
            kn: "ಮತ್ತೆ ಸಿಗೋಣ! ನೆನಪಿಡಿ, ಯಾವಾಗಲೂ ನಾನು ಸಹಾಯ ಮಾಡಲು ಇಲ್ಲಿದ್ದೇನೆ. ಕಷ್ಟಪಟ್ಟು ಕೆಲಸ ಮಾಡಿ ಮತ್ತು ಯಶಸ್ಸು ನಿಮ್ಮನ್ನು ಹಿಂಬಾಲಿಸುತ್ತದೆ. 👋",
            hi: "अलविदा! याद रखें, जब भी आपको मदद चाहिए मैं यहाँ हूँ। कड़ी मेहनत करें, सफलता जरूर मिलेगी। जल्द मिलते हैं! 👋"
        }
    },
    // ── Stress / Mental Health ──
    {
        keywords: ["stress", "anxiety", "worried", "tension", "ಆತಂಕ", "ಒತ್ತಡ", "तनाव", "चिंता", "परेशान"],
        response: {
            en: "💚 I understand academic pressure can be overwhelming. Here's what I recommend:\n\n1. 🧘 Take a 10-minute break and practice deep breathing.\n2. 📋 Break large tasks into smaller, manageable steps.\n3. 🤝 Talk to a friend, mentor, or the campus counselor.\n4. 📵 Limit social media during study hours.\n5. 🎯 Focus on what you CAN control, not what you can't.\n\nRemember, your mental health matters more than any grade. You've got this!",
            kn: "💚 ಶೈಕ್ಷಣಿಕ ಒತ್ತಡ ಕಷ್ಟಕರವಾಗಬಹುದು ಎಂದು ನಾನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳುತ್ತೇನೆ:\n\n1. 🧘 10 ನಿಮಿಷ ವಿಶ್ರಾಂತಿ ತೆಗೆದುಕೊಳ್ಳಿ.\n2. 📋 ದೊಡ್ಡ ಕಾರ್ಯಗಳನ್ನು ಚಿಕ್ಕ ಹಂತಗಳಾಗಿ ವಿಭಜಿಸಿ.\n3. 🤝 ಸ್ನೇಹಿತ ಅಥವಾ ಕ್ಯಾಂಪಸ್ ಕೌನ್ಸೆಲರ್ ಜೊತೆ ಮಾತನಾಡಿ.\n\nನಿಮ್ಮ ಮಾನಸಿಕ ಆರೋಗ್ಯ ಯಾವುದೇ ಗ್ರೇಡ್‌ಗಿಂತ ಮುಖ್ಯ!",
            hi: "💚 मैं समझता हूँ कि परीक्षा का तनाव भारी हो सकता है:\n\n1. 🧘 10 मिनट का ब्रेक लें और गहरी साँस लें।\n2. 📋 बड़े कार्यों को छोटे चरणों में बाँटें।\n3. 🤝 किसी दोस्त या कैंपस काउंसलर से बात करें।\n\nयाद रखें, आपका मानसिक स्वास्थ्य किसी भी ग्रेड से ज्यादा महत्वपूर्ण है!"
        }
    }
];

function getLocalResponse(query: string, context: any, currentLang: "en" | "kn" | "hi"): AIResponse {
    const lower = query.toLowerCase();
    const studentName = context?.student?.name?.split(" ")[0] || context?.studentName || "";

    // Auto-detect language from query for smarter responses
    const hasKannada = /[\u0C80-\u0CFF]/.test(query);
    const hasHindi = /[\u0900-\u097F]/.test(query);
    const detectedLang = hasKannada ? "kn" : hasHindi ? "hi" : currentLang;

    for (const intent of INTENT_MAP) {
        for (const keyword of intent.keywords) {
            if (lower.includes(keyword.toLowerCase())) {
                let msg = intent.response[detectedLang];

                // Personalize greetings with student name
                if (studentName && (intent.keywords.includes("hello") || intent.keywords.includes("hi"))) {
                    const greetings: Record<string, string> = {
                        en: `Hello ${studentName}! `,
                        kn: `ನಮಸ್ಕಾರ ${studentName}! `,
                        hi: `नमस्ते ${studentName}! `
                    };
                    msg = greetings[detectedLang] + msg.split("!").slice(1).join("!").trim();
                }

                // Add context-specific data for CGPA queries
                if (intent.keywords.includes("cgpa") && context?.record?.score) {
                    const addendum: Record<string, string> = {
                        en: `\n\nYour current CGPA is ${context.record.score}. `,
                        kn: `\n\nನಿಮ್ಮ ಪ್ರಸ್ತುತ CGPA ${context.record.score}. `,
                        hi: `\n\nआपका वर्तमान CGPA ${context.record.score} है। `
                    };
                    msg += addendum[detectedLang];
                }

                // Add context for attendance queries
                if (intent.keywords.includes("attendance") && context?.record?.attendance) {
                    const addendum: Record<string, string> = {
                        en: `\n\nYour current attendance is ${context.record.attendance}%.`,
                        kn: `\n\nನಿಮ್ಮ ಪ್ರಸ್ತುತ ಹಾಜರಾತಿ ${context.record.attendance}%.`,
                        hi: `\n\nआपकी वर्तमान उपस्थिति ${context.record.attendance}% है।`
                    };
                    msg += addendum[detectedLang];
                }

                return {
                    message: msg,
                    action: intent.action || { type: "none" },
                    language: detectedLang
                };
            }
        }
    }

    // Smart default fallback response
    const defaults: Record<"en" | "kn" | "hi", string> = {
        en: studentName
            ? `${studentName}, I can help you with: attendance tracking, CGPA prediction, placement preparation, project management, skill analysis, study tips, and more. What would you like to know?`
            : "I can help you with attendance, placements, projects, analytics, skill gap analysis, study tips, resume checking, and more. Try asking about any of these topics!",
        kn: studentName
            ? `${studentName}, ನಾನು ನಿಮಗೆ ಸಹಾಯ ಮಾಡಬಲ್ಲೆ: ಹಾಜರಾತಿ, CGPA ಊಹೆ, ಪ್ಲೇಸ್ಮೆಂಟ್ ತಯಾರಿ, ಪ್ರಾಜೆಕ್ಟ್, ಕೌಶಲ್ಯ ವಿಶ್ಲೇಷಣೆ, ಅಧ್ಯಯನ ಸಲಹೆಗಳು. ಏನು ತಿಳಿಯಬೇಕು?`
            : "ಹಾಜರಾತಿ, ಪ್ಲೇಸ್ಮೆಂಟ್, ಪ್ರಾಜೆಕ್ಟ್, ಅನಾಲಿಟಿಕ್ಸ್, ಕೌಶಲ್ಯ ವಿಶ್ಲೇಷಣೆ ಮುಂತಾದ ವಿಷಯಗಳಲ್ಲಿ ನಾನು ನಿಮಗೆ ಸಹಾಯ ಮಾಡಬಲ್ಲೆ. ಯಾವುದೇ ವಿಷಯದ ಬಗ್ಗೆ ಕೇಳಿ!",
        hi: studentName
            ? `${studentName}, मैं आपकी मदद कर सकता हूँ: उपस्थिति, CGPA भविष्यवाणी, प्लेसमेंट तैयारी, प्रोजेक्ट, कौशल विश्लेषण, पढ़ाई के टिप्स। क्या जानना चाहेंगे?`
            : "मैं उपस्थिति, प्लेसमेंट, प्रोजेक्ट, एनालिटिक्स, कौशल विश्लेषण, पढ़ाई के टिप्स और बहुत कुछ में मदद कर सकता हूँ। इन विषयों के बारे में पूछें!"
    };

    return {
        message: defaults[detectedLang],
        action: { type: "none" },
        language: detectedLang
    };
}

// ─────────────────────────────────────────────────────────────
// MAIN API FUNCTION (Gemini first → Local Fallback)
// ─────────────────────────────────────────────────────────────

export async function getAIResponse(
    query: string,
    context: any,
    currentLang: "en" | "kn" | "hi"
): Promise<AIResponse> {
    // If no API key, use the powerful local engine directly
    if (!API_KEY || !genAI) {
        console.info("IntellEdge AI: Running in Local Intelligence Mode.");
        return getLocalResponse(query, context, currentLang);
    }

    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash",
            generationConfig: {
                responseMimeType: "application/json",
            }
        });

        const prompt = `
        User Query: "${query}"
        Current Language: ${currentLang}
        Student Context: ${JSON.stringify(context)}
        
        Generate a response following the system prompt rules.
        `;

        const result = await model.generateContent([SYSTEM_PROMPT, prompt]);
        let responseText = result.response.text();

        // Clean markdown code blocks if present
        responseText = responseText.replace(/```json\n?|```/g, "").trim();

        try {
            return JSON.parse(responseText) as AIResponse;
        } catch (parseError) {
            console.warn("Gemini JSON parse failed, using local fallback:", responseText);
            return getLocalResponse(query, context, currentLang);
        }
    } catch (error: any) {
        console.warn("Gemini API error, switching to local intelligence:", error.message);
        // Seamlessly fall back to local intelligence
        return getLocalResponse(query, context, currentLang);
    }
}
