import { Message so your UI renders perfectly.

```typescript
import { ServiceItem } from '../types';
import { Bot, Calculator, Bar, ServiceItem } from '../types';

// --- CONFIGURATION ---
// This matches the Webhook URL we will create in n8n in Step 2
const WEBHOOK_URL = "https://n8n.spacetChart3, Zap } from 'lucide-react'; // Import your icons here

// --- CONFIGURATION ---
//act.co.za/webhook/chat-message";

// --- STATIC DATA: Service Carousel Items ---
// You will create this URL in the next step in n8n
const WEBHOOK_URL = "https://n8n We keep these here so the UI renders them instantly when n8n says "Show Services"
const SERVICE_ITEMS.spacetact.co.za/webhook/chat-message"; 

// --- STATIC DATA (Because we: ServiceItem[] = [
  {
    id: 'roi',
    title: 'ROI Calculator', can't send Icons over JSON) ---
const SERVICES_DATA: ServiceItem[] = [
  {
    id: 'roi',
    title: 'ROI Calculator',
    description: 'Calculate your potential automation savings.',
    icon: React.createElement(Calculator, { className: "w-6 h-6" }), // Create Element wrapper
    prompt: 'I want to calculate my ROI.'
  },
  {
    id: 'chatbots',
    title: 'AI Chatbots',
    description: 'Custom LLM agents for customer support.',
    icon: React.createElement(Bot, { className: "w-6 h-6" }),
    prompt: 'Tell me about AI Chatbots.'
  },
  {
    id: 'funnels',
    title: 'Lead Funnels',
    description: 'Automated CRM capturing and workflows.',
    icon: React
    description: 'Calculate your automation savings potential.',
    icon: 'Calculator', // String reference to your icon component
    prompt: 'I want to use the ROI Calculator'
  },
  {
    id: 'chatbots',
    title: 'AI Chatbots',
    description: '24/7 Customer support agents.',
    icon.createElement(BarChart3, { className: "w-6 h-6" }),
    prompt: 'How do Lead Funnels work?'
  }
];

// --- SESSION MANAGEMENT ---
const getSessionId =: 'Bot',
    prompt: 'Tell me more about AI Chatbots'
  },
  {
    id: 'funnels',
    title: 'Lead Funnels',
    description: 'Automated CRM (): string => {
  let sessionId = localStorage.getItem("spacetact_session_id");
  if (!sessionId) {
    sessionId = `user_${Date.now()}_${Math.random().toString(36).substr capture systems.',
    icon: 'Filter',
    prompt: 'How do lead funnels work?'
  }
];

// --- TYPES ---
export interface GeminiResponse {
  text: string;
  action?: 'SHOW_CAROUSEL' | 'OPEN_CALENDAR';
  userData?: { name?: string; email?: string };(2, 9)}`;
    localStorage.setItem("spacetact_session_id", sessionId);
  }
  return sessionId;
};

export const clearSession = () => {
  localStorage.removeItem("spacetact
  carouselItems?: ServiceItem[];
}

// --- SESSION MANAGEMENT ---
const getSessionId = (): string => {
  let sessionId = localStorage.getItem("spacetact_session_id");
  if (!sessionId) {
    sessionId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem("spacetact_session_id", sessionId);
  }
  return_session_id");
};

// --- API INTERFACE ---
export interface N8NResponse {
  text: sessionId;
};

// --- API FUNCTION ---
export const sendMessageToGemini = async (message: string, context string;
  type?: 'text' | 'carousel';
  carouselItems?: ServiceItem[];
  action?: 'OPEN_CALENDAR';
  userData?: { name?: string; email?: string };
}

export const sendMessageToGemini = async (message: string, contextData?: any): Promise<N8NResponse> => {
  const sessionId?: any): Promise<GeminiResponse> => {
  const sessionId = getSessionId();

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: message, = getSessionId();

  try {
    const response = await fetch(WEBHOOK_URL, {

        sessionId: sessionId,
        // If we are passing ROI results, send them in a separate field
        context: context || {} 
      }),
    });

    if (!response.ok) throw new Error("n8n Connection      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: message,
        sessionId: sessionId,
        context: contextData Failed");

    const data = await response.json();

    // Logic to attach UI elements based on n8 || {} // Pass ROI data here if available
      }),
    });

    if (!response.ok) throw new Error("Brain Offline");

    const data = await response.json();

    // --- RESPONSE MAPPING ---
n action
    let carouselItems: ServiceItem[] | undefined = undefined;
    
    if (data.action === 'SHOW_CAROUSEL') {
      carouselItems = SERVICE_ITEMS;
    }

    return {
      text: data.text,
      action: data.action,
      userData: data.userData    // 1. Check if n8n requested the Carousel
    let carouselItems = undefined;
    let type:,
      carouselItems: carouselItems
    };

  } catch (error) {
    console.error 'text' | 'carousel' = 'text';

    if (data.action === 'SHOW_CAROUSEL') {
      type = 'carousel';
      carouselItems = SERVICES_DATA; // Attach local data with("AI Error:", error);
    return { 
      text: "I am currently updating my logic engine. Please try again in a moment.",
      // Fallback: If error, you might want to show calendar anyway?
      // Icons
    }

    // 2. Return formatted object to ChatWidget
    return {
      text: data. action: 'OPEN_CALENDAR' 
    };
  }
};
