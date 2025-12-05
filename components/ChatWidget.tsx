import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Minus, Trash2, Bot, User, Mic, MicOff, Loader2, Calendar, X } from 'lucide-react';
import { Message } from '../types';
import ChatCarousel from './ChatCarousel';

interface ChatWidgetProps {
  isOpen: boolean;
  onMinimize: () => void;
  onEndSession: () => void;
  messages: Message[];
  isTyping: boolean;
  onSendMessage: (text: string) => void;
  showCalendar?: boolean;
  userData?: { name?: string; email?: string };
  onCloseCalendar?: () => void;
}

interface IWindow extends Window {
  webkitSpeechRecognition: any;
  SpeechRecognition: any;
}

// --- CONFIGURATION ---
// 1. Enter your self-hosted Cal domain here (e.g. "https://cal.yourdomain.com")
// 2. Enter the username and event slug (e.g. "spacetact/discovery")
const CAL_DOMAIN = "https://cal.spacetact.co.za"; 
const CAL_EVENT_SLUG = "kwanele/discovery-call"; 

const ChatWidget: React.FC<ChatWidgetProps> = ({ 
  isOpen, 
  onMinimize, 
  onEndSession,
  messages,
  isTyping,
  onSendMessage,
  showCalendar,
  userData,
  onCloseCalendar
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, isOpen, showCalendar]);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    onSendMessage(inputValue);
    setInputValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const startListening = () => {
    const { webkitSpeechRecognition, SpeechRecognition } = window as unknown as IWindow;
    const SpeechRecognitionConstructor = SpeechRecognition || webkitSpeechRecognition;

    if (!SpeechRecognitionConstructor) {
      alert("Voice input is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognitionConstructor();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0])
        .map((result) => result.transcript)
        .join('');
      setInputValue(transcript);
    };
    
    recognition.start();
    recognitionRef.current = recognition;
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  // Construct Cal URL with pre-filled data
  const getCalUrl = () => {
    // Base URL structure: https://cal.domain.com/user/event?embed=true
    let url = `${CAL_DOMAIN}/${CAL_EVENT_SLUG}?embed=true`;
    
    // Inject User Data to auto-fill fields
    if (userData?.name) url += `&name=${encodeURIComponent(userData.name)}`;
    if (userData?.email) url += `&email=${encodeURIComponent(userData.email)}`;
    
    // Dark mode support (optional, can be removed if you prefer light)
    // url += "&theme=light"; 
    
    return url;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 bg-white/90 backdrop-blur-xl flex flex-col font-sans"
        >
          {/* Header */}
          <div className="w-full border-b border-gray-200 bg-white shadow-sm flex-shrink-0">
            <div className="max-w-5xl mx-auto px-6 h-20 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-brand-primary animate-pulse"></div>
                <h3 className="font-bold text-lg tracking-tight text-gray-900">
                  SPACETACT<span className="text-gray-400 font-medium">_AI</span>
                </h3>
              </div>
              
              <div className="flex items-center gap-2">
                <button 
                  onClick={onMinimize}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-gray-900"
                >
                  <Minus className="w-5 h-5" />
                </button>
                <button 
                  onClick={onEndSession}
                  className="p-2 hover:bg-red-50 rounded-full transition-colors text-gray-400 hover:text-red-500"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Main Content Area: Split View if Calendar is Open */}
          <div className="flex-1 overflow-hidden relative flex flex-col md:flex-row max-w-7xl mx-auto w-full">
            
            {/* Chat Area */}
            <div className={`flex-1 flex flex-col h-full transition-all duration-500 ${showCalendar ? 'md:w-1/2 border-r border-gray-200' : 'w-full'}`}>
              <div className="flex-1 overflow-y-auto relative scrollbar-hide bg-gray-50">
                <div className="max-w-3xl mx-auto p-6 md:p-12 space-y-8">
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex gap-6 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                    >
                      <div className={`w-10 h-10 flex items-center justify-center flex-shrink-0 rounded-full shadow-sm ${
                        msg.role === 'user' 
                          ? 'bg-gray-900 text-white' 
                          : 'bg-white border border-gray-200 text-brand-primary'
                      }`}>
                        {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                      </div>

                      <div className={`flex flex-col gap-2 max-w-[85%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                        <div className={`text-lg md:text-xl font-medium leading-relaxed tracking-tight p-6 rounded-2xl shadow-sm ${
                          msg.role === 'user' 
                            ? 'bg-brand-primary text-white rounded-tr-sm' 
                            : 'bg-white border border-gray-200 text-gray-800 rounded-tl-sm'
                        }`}>
                          {msg.role === 'model' && (
                            <div className="prose prose-p:text-gray-800 max-w-none">
                              <p className="whitespace-pre-wrap">{msg.text}</p>
                            </div>
                          )}
                          {msg.role === 'user' && <p>{msg.text}</p>}
                          
                          {msg.type === 'carousel' && msg.carouselItems && (
                            <div className="mt-6 w-full max-w-full overflow-hidden">
                              <ChatCarousel items={msg.carouselItems} onSelect={(prompt) => onSendMessage(prompt)} />
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {isTyping && (
                    <div className="flex gap-6">
                      <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-gray-200 text-brand-primary">
                        <Bot className="w-5 h-5" />
                      </div>
                      <div className="flex items-center gap-1 h-10 bg-white px-4 rounded-full border border-gray-200 shadow-sm">
                        <div className="w-2 h-2 bg-brand-primary rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-brand-primary rounded-full animate-bounce delay-75"></div>
                        <div className="w-2 h-2 bg-brand-primary rounded-full animate-bounce delay-150"></div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} className="h-4" />
                </div>
              </div>

              {/* Input Area */}
              <div className="bg-white border-t border-gray-200 p-6 md:p-8 shadow-[0_-5px_20px_rgba(0,0,0,0.03)] flex-shrink-0">
                <div className="max-w-3xl mx-auto">
                  <div className={`relative flex items-center gap-4 border-b-2 transition-all ${isListening ? 'border-red-500' : 'border-gray-200 focus-within:border-brand-primary'}`}>
                    <button
                      onClick={toggleListening}
                      className={`p-2 transition-all ${isListening ? 'text-red-500' : 'text-gray-400 hover:text-brand-primary'}`}
                    >
                      {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                    </button>
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder={isListening ? "Listening..." : "Type command..."}
                      disabled={isTyping}
                      className="flex-1 bg-transparent border-none px-2 py-4 focus:ring-0 text-xl text-gray-900 placeholder-gray-400 font-medium tracking-tight"
                      autoFocus
                    />
                    <button
                      onClick={handleSend}
                      disabled={!inputValue.trim() || isTyping}
                      className="p-3 text-brand-primary hover:text-brand-dark transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      {isTyping ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Calendar Embed Area */}
            <AnimatePresence>
              {showCalendar && (
                <motion.div 
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "100%" }}
                  exit={{ opacity: 0, width: 0 }}
                  className="hidden md:flex flex-col bg-white border-l border-gray-200 relative h-full"
                >
                  <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
                     <div className="flex items-center gap-2 text-brand-primary font-bold">
                       <Calendar className="w-5 h-5" />
                       <span>Discovery Call Booking</span>
                     </div>
                     <button onClick={onCloseCalendar} className="p-2 hover:bg-gray-200 rounded-full text-gray-500">
                       <X className="w-5 h-5" />
                     </button>
                  </div>
                  <div className="flex-1 w-full h-full bg-white relative">
                     {/* Loader to show while Cal loads */}
                     <div className="absolute inset-0 flex items-center justify-center bg-gray-50 -z-10">
                        <Loader2 className="w-8 h-8 animate-spin text-gray-300" />
                     </div>
                     <iframe 
                       key={userData?.email}
                       src={getCalUrl()}
                       className="w-full h-full border-none"
                       title="Book Spacetact Discovery Call"
                     />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

             {/* Mobile Calendar Modal (Overlay) */}
             <AnimatePresence>
              {showCalendar && (
                <motion.div 
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "100%" }}
                  className="md:hidden absolute inset-0 z-50 bg-white flex flex-col"
                >
                   <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
                     <span className="font-bold text-gray-900">Book Call</span>
                     <button onClick={onCloseCalendar} className="p-2 bg-gray-200 rounded-full">
                       <X className="w-5 h-5" />
                     </button>
                  </div>
                  <iframe 
                     src={getCalUrl()}
                     className="w-full h-full border-none"
                     title="Book Spacetact Discovery Call"
                   />
                </motion.div>
              )}
             </AnimatePresence>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChatWidget;