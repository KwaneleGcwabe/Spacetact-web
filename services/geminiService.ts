import { GoogleGenAI, Chat, Type } from "@google/genai";

// --- CONFIGURATION ---
// TOGGLE THIS TO TRUE WHEN GOING LIVE
const IS_PRODUCTION = true; 

const WEBHOOK_TEST = "https://n8n.spacetact.co.za/webhook-test/lead-capture";
const WEBHOOK_PROD = "https://n8n.spacetact.co.za/webhook/lead-capture";

const N8N_WEBHOOK_URL = IS_PRODUCTION ? WEBHOOK_PROD : WEBHOOK_TEST;

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
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            email: { type: Type.STRING },
            business: { type: Type.STRING },
            phone: { type: Type.STRING },
            pain_points: { type: Type.STRING },
            interest: { type: Type.STRING }
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

let chatSession: Chat | null = null;
let currentUserData: { name?: string; email?: string } = {};

const getClient = () => {
  const key = process.env.API_KEY;
  
  if (!key) {
    console.error("API_KEY is missing. Ensure API_KEY is set in your environment variables.");
    return null;
  }
  return new GoogleGenAI({ apiKey: key });
};

export const initializeChat = async () => {
  const ai = getClient();
  if (!ai) return;

  chatSession = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.6, 
        tools: tools, 
    },
  });
};

export interface GeminiResponse {
  text: string;
  action?: 'SHOW_CAROUSEL' | 'OPEN_CALENDAR';
  userData?: { name?: string; email?: string };
}

// Helper to send data reliably
const sendDataToN8N = (data: any) => {
  console.log("🚀 SENDING PAYLOAD TO N8N:", N8N_WEBHOOK_URL, data);
  
  // Use keepalive to ensure request completes even if session resets
  // Fire and forget - do not await
  // REMOVED 'no-cors' to ensure Content-Type header is sent correctly
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
  if (!ai) return { text: "Config Error: API Key missing." };

  if (!chatSession) {
    await initializeChat();
  }

  try {
    if (!chatSession) throw new Error("Session init failed");

    // 1. Send Message (Corrected Syntax for SDK)
    const result = await chatSession.sendMessage({
      message: message, 
    });

    // 2. INTERCEPT TOOL CALLS (Client-Side Logic)
    const candidates = result.candidates;
    const modelPart = candidates?.[0]?.content?.parts?.[0];
    
    // Check for Tool Calls
    if (modelPart && modelPart.functionCall) {
      const toolCall = modelPart.functionCall;
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
        // Remove spaces from phone to satisfy validation
        const cleanPhone = args.phone ? args.phone.replace(/\s/g, '') : "NotProvided";

        const safeData = {
          name: args.name || "User",
          email: args.email || "no-email@provided.com",
          business: args.business || "Not Provided",
          phone: cleanPhone,
          pain_points: args.pain_points || "General Inquiry",
          interest: args.interest || "Discovery Call",
          // REMOVED lead_status: "NEW" - Let HubSpot assign default status to avoid validation errors
          source: 'spacetact_chat',
          timestamp: new Date().toISOString()
        };

        currentUserData = { name: safeData.name, email: safeData.email };

        // SEND DATA (Fire and Forget)
        sendDataToN8N(safeData);

        chatSession = null; // Reset
        
        // AUTO-OPEN CALENDAR AFTER CAPTURE
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

    // 3. TEXT RESPONSE SCRUBBER (Fail-Safe)
    let responseText = result.text || "";

    // If the model hallucinates the error message, BLOCK IT and return success/neutral
    if (responseText.includes("System overload") || responseText.includes("email us directly")) {
      console.warn("Blocked 'System Overload' Hallucination");
      // If the user mentioned "book" or "call", assume they want the calendar
      if (message.toLowerCase().includes("book") || message.toLowerCase().includes("call")) {
          chatSession = null;
          return {
              text: "I can help with that. First, could you provide your name and email?", // Ask for details first
              action: undefined,
              userData: currentUserData
          };
      }
      // Otherwise just reset
      chatSession = null;
      return { text: "I can help with that. Could you clarify the details?" };
    }

    return { text: responseText };

  } catch (error) {
    console.error("Gemini Critical Error:", error);
    chatSession = null; // Hard reset
    return { text: "I encountered a connection glitch. Could you say that again?" };
  }
};