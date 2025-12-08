// FORCE UPDATE V2 - FINAL FIX
import { GoogleGenerativeAI, ChatSession, SchemaType } from "@google/generative-ai";

// --- CONFIGURATION ---
const IS_PRODUCTION = true; 

const WEBHOOK_TEST = "https://n8n.spacetact.co.za/webhook-test/lead-capture";
const WEBHOOK_PROD = "https://n8n.spacetact.co.za/webhook/lead-capture";

const N8N_WEBHOOK_URL = IS_PRODUCTION ? WEBHOOK_PROD : WEBHOOK_TEST;

// Check which Variable you are actually using in .env (VITE_GOOGLE_API_KEY vs VITE_GEMINI_API_KEY)
// This code checks both to be safe.
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_GOOGLE_API_KEY;

const SYSTEM_INSTRUCTION = `
You are Spacetact AI, an intelligent automation assistant.

Your goal is to be helpful, professional, and drive users to:
1. Explore services (Tool: show_services)
2. Capture their lead details (Tool: capture_lead)
3. Book a meeting (Tool: open_calendar)

CRITICAL PROTOCOL:
- **MANDATORY**: You MUST capture the user's Name, Email, Business Name, and Phone Number using the 'capture_lead' tool BEFORE you allow them to book a meeting.
- If a user asks to book a meeting (or clicks a "Book" button) and you do not have their details, you MUST ASK for them first.
- DO NOT call 'open_calendar' until 'capture_lead' has been successfully called.
- After 'capture_lead' is called, the system will handle the calendar opening automatically. You do not need to call 'open_calendar' immediately after.
- Infer the 'interest' parameter for 'capture_lead' based on context (e.g. "ROI Calculator", "Chatbots", "General").
- If you cannot call a tool, just say: "I can help with that. To get started, please tell me your name, email, and business name."
- ABSOLUTELY FORBIDDEN: Do not say "System overload".
- ABSOLUTELY FORBIDDEN: Do not ask the user to email "automations@spacetact.co.za" manually.
`;

// Tool Definitions
const tools = [
  {
    functionDeclarations: [
      {
        name: "show_services",
        description: "Show services carousel.",
      },
      {
        name: "capture_lead",
        description: "Save user contact details to CRM.",
        parameters: {
          type: SchemaType.OBJECT,
          properties: {
            name: { type: SchemaType.STRING },
            email: { type: SchemaType.STRING },
            business: { type: SchemaType.STRING },
            phone: { type: SchemaType.STRING },
            pain_points: { type: SchemaType.STRING },
            interest: { type: SchemaType.STRING }
          },
          required: ["name", "email", "business"]
        }
      },
      {
        name: "open_calendar",
        description: "Open booking calendar. Only use AFTER capture_lead.",
      }
    ],
  },
];

let chatSession: ChatSession | null = null;
let currentUserData: { name?: string; email?: string } = {};

const getClient = () => {
  if (!API_KEY) {
    console.error("CRITICAL: API_KEY is missing. Check Coolify Environment Variables (VITE_GEMINI_API_KEY).");
    return null;
  }
  return new GoogleGenerativeAI(API_KEY);
};

export const initializeChat = async () => {
  const ai = getClient();
  if (!ai) return;

  try {
    // --- CRITICAL FIX ---
    // Use "gemini-1.5-flash" (The evergreen alias).
    // Do NOT use "-002" or "-latest" as they can 404 on the free tier.
    const model = ai.getGenerativeModel({
      model: 'gemini-1.5-flash-001', 
      systemInstruction: SYSTEM_INSTRUCTION,
      tools: tools, 
    });
  
    chatSession = model.startChat({
      history: [],
      // Optional: Safety settings can be added here if needed
    });
    
    console.log("Gemini Chat Initialized");
  } catch (err) {
    console.error("Failed to initialize Gemini:", err);
  }
};

export interface GeminiResponse {
  text: string;
  action?: 'SHOW_CAROUSEL' | 'OPEN_CALENDAR';
  userData?: { name?: string; email?: string };
}

// Helper to send data reliably
const sendDataToN8N = (data: any) => {
  console.log("🚀 SENDING PAYLOAD TO N8N:", N8N_WEBHOOK_URL, data);
  
  fetch(N8N_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    keepalive: true,
  }).catch(error => {
    console.error("❌ N8N Network Error:", error);
  });
};

export const sendMessageToGemini = async (message: string): Promise<GeminiResponse> => {
  const ai = getClient();
  if (!ai) return { text: "Config Error: API Key missing. Please check Coolify settings." };

  // Ensure session exists
  if (!chatSession) {
    await initializeChat();
  }

  try {
    if (!chatSession) throw new Error("Session init failed");

    // 1. Send Message
    const result = await chatSession.sendMessage(message);
    const response = await result.response;
    
    // 2. INTERCEPT TOOL CALLS
    const functionCalls = response.functionCalls();
    
    // Check for Tool Calls
    if (functionCalls && functionCalls.length > 0) {
      const toolCall = functionCalls[0];
      const args = toolCall.args as any;

      console.log("⚡ Intercepting Tool:", toolCall.name);

      if (toolCall.name === 'show_services') {
        chatSession = null; // Reset to prevent context loop
        return {
          text: "Here are the automation services we provide:",
          action: 'SHOW_CAROUSEL'
        };
      }

      if (toolCall.name === 'capture_lead') {
        // SANITIZE DATA
        const cleanPhone = args.phone ? args.phone.replace(/\s/g, '') : "NotProvided";

        const safeData = {
          name: args.name || "User",
          email: args.email || "no-email@provided.com",
          business: args.business || "Not Provided",
          phone: cleanPhone,
          pain_points: args.pain_points || "General Inquiry",
          interest: args.interest || "Discovery Call",
          source: 'spacetact_chat',
          timestamp: new Date().toISOString()
        };

        currentUserData = { name: safeData.name, email: safeData.email };

        // SEND DATA (Fire and Forget)
        sendDataToN8N(safeData);

        chatSession = null; // Reset
        
        return {
            text: `Thanks ${safeData.name}. I've saved your details. Opening the calendar now to finalize your booking.`,
            action: 'OPEN_CALENDAR',
            userData: currentUserData
        };
      }

      if (toolCall.name === 'open_calendar') {
        chatSession = null; // Reset
        return {
            text: "Opening the calendar now. Please choose a slot.",
            action: 'OPEN_CALENDAR',
            userData: currentUserData
        };
      }
    }

    // 3. TEXT RESPONSE HANDLING
    let responseText = response.text() || "";

    // Hallucination Guard
    if (responseText.includes("System overload") || responseText.includes("email us directly")) {
      console.warn("Blocked 'System Overload' Hallucination");
      if (message.toLowerCase().includes("book") || message.toLowerCase().includes("call")) {
          chatSession = null;
          return {
              text: "I can help with that. First, could you provide your name and email?", 
              userData: currentUserData
          };
      }
      chatSession = null;
      return { text: "I can help with that. Could you clarify the details?" };
    }

    return { text: responseText };

  } catch (error: any) {
    console.error("Gemini Error:", error);

    // Specific Error Handling for 404s or Overloads
    if (error.message?.includes("404") || error.message?.includes("not found")) {
       return { text: "I'm currently updating my knowledge base. Please try refreshing the page." };
    }
    
    // Silent fail recovery
    chatSession = null;
    return { text: "I'm connecting to the automation engine. Please try saying that again." };
  }
};
