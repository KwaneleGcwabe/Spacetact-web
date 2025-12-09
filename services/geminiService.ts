import React from 'react';
import { Bot, Calculator, BarChart3, Workflow, Smartphone, Mic } from 'lucide-react';
import { ServiceItem } from '../types';

// --- CONFIGURATION ---
const WEBHOOK_URL = "https://n8n.spacetact.co.za/webhook/chat-message";

// --- STATIC DATA ---
// We define the carousel items here with their icons
export const SERVICES_DATA: ServiceItem[] = [
  {
    id: 'roi',
    title: 'ROI Calculator',
    description: 'Calculate your automation savings potential.',
    icon: React.createElement(Calculator, { className: "w-6 h-6" }),
    prompt: 'I want to use the ROI Calculator'
  },
  {
    id: 'chatbots',
    title: 'AI Chatbots',
    description: '24/7 Customer support agents.',
    icon: React.createElement(Bot, { className: "w-6 h-6" }),
    prompt: 'Tell me more about AI Chatbots'
  },
  {
    id: 'voice',
    title: 'Voice Reception',
    description: 'Human-like phone answering.',
    icon: React.createElement(Mic, { className: "w-6 h-6" }),
    prompt: 'How does the Voice Receptionist work?'
  },
  {
    id: 'funnels',
    title: 'Lead Funnels',
    description: 'Automated CRM capture systems.',
    icon: React.createElement(BarChart3, { className: "w-6 h-6" }),
    prompt: 'How do lead funnels work?'
  },
  {
    id: 'whatsapp',
    title: 'WhatsApp RAG',
    description: 'Knowledge base on WhatsApp.',
    icon: React.createElement(Smartphone, { className: "w-6 h-6" }),
    prompt: 'What is WhatsApp RAG?'
  },
  {
    id: 'workflow',
    title: 'Workflows',
    description: 'N8N Automation for tasks.',
    icon: React.createElement(Workflow, { className: "w-6 h-6" }),
    prompt: 'Explain automated workflows'
  }
];

// --- TYPES ---
export interface GeminiResponse {
  text: string;
  action?: 'SHOW_CAROUSEL' | 'OPEN_CALENDAR';
  userData?: { name?: string; email?: string };
  type?: 'text' | 'carousel';
  carouselItems?: ServiceItem[];
}

// --- SESSION MANAGEMENT ---
const getSessionId = (): string => {
  let sessionId = localStorage.getItem("spacetact_session_id");
  if (!sessionId) {
    sessionId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem("spacetact_session_id", sessionId);
  }
  return sessionId;
};

export const clearSession = () => {
  localStorage.removeItem("spacetact_session_id");
};

// --- API FUNCTION ---
export const sendMessageToGemini = async (message: string, contextData?: any): Promise<GeminiResponse> => {
  const sessionId = getSessionId();

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: message,
        sessionId: sessionId,
        context: contextData || {} 
      }),
    });

    if (!response.ok) throw new Error("Brain Offline");

    const data = await response.json();

    // --- RESPONSE MAPPING ---
    let carouselItems: ServiceItem[] | undefined = undefined;
    let type: 'text' | 'carousel' = 'text';

    if (data.action === 'SHOW_CAROUSEL') {
      type = 'carousel';
      carouselItems = SERVICES_DATA;
    }

    return {
      text: data.text,
      type: type,
      carouselItems: carouselItems,
      action: data.action === 'OPEN_CALENDAR' ? 'OPEN_CALENDAR' : undefined,
      userData: data.userData
    };

  } catch (error) {
    console.error("AI Error:", error);
    return { 
      text: "I'm connecting to the new automation engine. Please try again in a few seconds." 
    };
  }
};
