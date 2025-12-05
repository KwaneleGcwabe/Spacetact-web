import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Check, ArrowRight, Play, MessageSquare, Mic, 
  Database, Workflow, Zap, Globe, Menu, X, Smartphone, 
  BarChart3, Users, Mail, Layers, ShieldCheck, CheckCircle2,
  FileText, Search, Loader2, Phone, Sparkles
} from 'lucide-react';
import Logo from './components/Logo';
import ChatWidget from './components/ChatWidget';
import ROICalculator from './components/ROICalculator';
import { Message, CalculatorResults } from './types';
import { sendMessageToGemini } from './services/geminiService';

// --- Animations ---
const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

// --- Main App Component ---
function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // --- Spacetact State Logic ---
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  
  // New State for Calendar Integration
  const [showCalendar, setShowCalendar] = useState(false);
  const [userData, setUserData] = useState<{name?: string, email?: string}>({});

  const [messages, setMessages] = useState<Message[]>([
    { id: 1, role: 'model', text: "Hello! I'm Spacetact AI. I can help you automate your business workflows, capture leads, and calculate your ROI. How can I assist you today?" }
  ]);

  // --- Handlers ---
  const openChat = (initialMessage?: string) => {
    setIsChatOpen(true);
    if (initialMessage) {
      handleSendMessage(initialMessage);
    }
  };

  const handleSendMessage = async (text: string) => {
    // Add user message
    const userMsg: Message = { id: Date.now(), role: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    // Call Gemini
    const response = await sendMessageToGemini(text);

    setIsTyping(false);
    
    // Add model response
    const modelMsg: Message = { 
      id: Date.now() + 1, 
      role: 'model', 
      text: response.text 
    };
    
    // Handle Special Actions
    if (response.action === 'SHOW_CAROUSEL') {
       modelMsg.type = 'carousel';
       modelMsg.carouselItems = [
         { id: '1', title: 'AI Chatbots', description: '24/7 Lead capture & support', icon: <MessageSquare />, prompt: 'Tell me more about AI Chatbots' },
         { id: '2', title: 'Voice Reception', description: 'Human-like phone answering', icon: <Mic />, prompt: 'How does the Voice Receptionist work?' },
         { id: '3', title: 'Workflows', description: 'N8N Automation for tasks', icon: <Workflow />, prompt: 'Explain automated workflows' },
         { id: '4', title: 'WhatsApp RAG', description: 'Knowledge base on WhatsApp', icon: <Smartphone />, prompt: 'What is WhatsApp RAG?' },
       ];
    } else if (response.action === 'OPEN_CALENDAR') {
       // Open the calendar embed and pass captured data
       setShowCalendar(true);
       if (response.userData) {
         setUserData(response.userData);
       }
    }

    setMessages(prev => [...prev, modelMsg]);
  };

  const handleBookDiscovery = (results: CalculatorResults) => {
    setIsCalculatorOpen(false);
    setIsChatOpen(true);
    handleSendMessage(`I just calculated my ROI. I could save ${new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' }).format(results.annualSavings)} annually! I'd like to book a Free Discovery Call.`);
  };

  return (
    <div className="min-h-screen bg-white font-sans text-text-main overflow-x-hidden selection:bg-brand-primary selection:text-white">
      
      {/* --- Components --- */}
      <ChatWidget 
        isOpen={isChatOpen}
        onMinimize={() => setIsChatOpen(false)}
        onEndSession={() => {
          setIsChatOpen(false);
          setShowCalendar(false);
          setMessages([{ id: Date.now(), role: 'model', text: "Session reset. How can I help you automate today?" }]);
        }}
        messages={messages}
        isTyping={isTyping}
        onSendMessage={handleSendMessage}
        showCalendar={showCalendar}
        userData={userData}
        onCloseCalendar={() => setShowCalendar(false)}
      />

      {isCalculatorOpen && (
        <ROICalculator 
          onClose={() => setIsCalculatorOpen(false)}
          onBookDiscovery={handleBookDiscovery}
        />
      )}

      {/* --- Part 2: Navigation Bar --- */}
      <nav className="fixed top-0 left-0 w-full z-40 bg-white/80 backdrop-blur-md border-b border-surface-border h-[72px]">
        <div className="max-w-[1400px] mx-auto px-6 h-full flex items-center justify-between">
          <Logo />
          
          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {['Services', 'Results', 'About', 'Contact'].map((link) => (
              <button 
                key={link} 
                onClick={() => openChat(`Tell me about your ${link}.`)}
                className="text-[15px] font-medium text-text-body hover:text-text-heading transition-colors duration-200"
              >
                {link}
              </button>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:block">
            <button 
              onClick={() => openChat("I want to book a discovery call.")}
              className="bg-brand-primary text-white px-7 py-3 rounded-lg text-[15px] font-semibold hover:bg-brand-dark transition-all shadow-button hover:translate-y-[-1px]"
            >
              Book Discovery Call
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 text-text-heading"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-[72px] left-0 w-full bg-white border-b border-surface-border p-6 flex flex-col gap-4 shadow-lg">
             {['Services', 'Results', 'About', 'Contact'].map((link) => (
              <button 
                key={link} 
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  openChat(`Tell me about ${link}`);
                }}
                className="text-lg font-medium text-text-body py-2 text-left"
              >
                {link}
              </button>
            ))}
            <button 
              onClick={() => {
                setIsMobileMenuOpen(false);
                openChat("I want to book a discovery call.");
              }}
              className="bg-brand-primary text-white px-6 py-3 rounded-lg text-lg font-semibold w-full mt-4"
            >
              Book Discovery Call
            </button>
          </div>
        )}
      </nav>

      {/* --- Part 3: Hero Section --- */}
      <section className="pt-[140px] pb-[100px] px-6 max-w-[1200px] mx-auto flex flex-col items-center text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="w-full flex flex-col items-center"
        >
          {/* Badge */}
          <motion.div variants={fadeIn} className="bg-brand-bg text-brand-primary px-4 py-1.5 rounded-full text-sm font-semibold mb-8 inline-flex items-center gap-2">
            <Zap className="w-4 h-4 fill-brand-primary" />
            <span>AI Automation Agency</span>
          </motion.div>

          {/* Headline */}
          <motion.h1 variants={fadeIn} className="text-4xl md:text-6xl lg:text-[80px] font-bold text-text-heading leading-[1.1] tracking-tight max-w-[1000px] mb-6">
            Save Time & Money. <br />
            <span className="text-brand-primary inline-block animate-heartbeat">Get Better Value.</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p variants={fadeIn} className="text-xl md:text-3xl font-medium text-text-heading/80 leading-[1.5] max-w-[800px] mb-12">
            We build custom AI agents and workflows for your business. Automate mundane tasks, capture leads 24/7, and scale your operations without hiring more staff.
          </motion.p>

          {/* Buttons - Illuminated */}
          <motion.div variants={fadeIn} className="flex flex-col sm:flex-row items-center gap-6 w-full justify-center">
            
            {/* ROI Button - Glass Glow */}
            <button 
              onClick={() => setIsCalculatorOpen(true)}
              className="group relative px-9 py-5 rounded-[12px] text-[18px] font-bold overflow-hidden transition-all duration-300 w-full sm:w-auto"
            >
              <div className="absolute inset-0 bg-white border-[2px] border-brand-primary/30 group-hover:border-brand-primary shadow-glow group-hover:shadow-strong-glow rounded-[12px] transition-all"></div>
              <div className="absolute inset-0 bg-brand-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative flex items-center justify-center gap-3 text-brand-primary group-hover:text-brand-dark">
                <BarChart3 className="w-6 h-6" />
                <span>Calculate ROI For Free</span>
              </div>
            </button>

            {/* Discovery Button - Shimmering */}
            <button 
              onClick={() => openChat("I want to book a discovery call.")}
              className="relative overflow-hidden bg-brand-primary text-white px-10 py-5 rounded-[12px] text-[18px] font-bold shadow-strong-glow hover:scale-[1.02] hover:shadow-[0_0_50px_rgba(139,92,246,0.6)] transition-all duration-300 w-full sm:w-auto group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 -translate-x-full group-hover:animate-shimmer" />
              <div className="relative flex items-center justify-center gap-3">
                <Phone className="w-6 h-6 fill-white" />
                <span>Book Discovery Call</span>
              </div>
            </button>
          </motion.div>

          {/* Hero Mockup - Expanded & Interactive */}
          <motion.div 
            variants={fadeIn}
            className="mt-20 w-full max-w-[1200px] bg-white border border-surface-border rounded-2xl shadow-hero p-2 md:p-3 hover:-translate-y-2 transition-transform duration-700 cursor-pointer group"
            onClick={() => openChat("I'm interested in the workflow I saw in the hero image.")}
          >
            {/* Mockup Internal UI */}
            <div className="bg-surface-card rounded-xl border border-surface-border overflow-hidden flex flex-col md:flex-row min-h-[500px] relative">
              
              {/* Sidebar */}
              <div className="w-full md:w-72 border-b md:border-b-0 md:border-r border-surface-border bg-white p-6 flex flex-col gap-6 z-20">
                 <div className="h-10 w-40 bg-gray-100 rounded-lg mb-4 animate-pulse"></div>
                 <div className="space-y-3">
                   {[1,2,3,4,5].map(i => (
                     <div key={i} className={`flex items-center gap-4 p-3 rounded-lg transition-colors ${i === 1 ? 'bg-brand-bg border border-brand-primary/20' : 'hover:bg-gray-50'}`}>
                        <div className={`w-5 h-5 rounded-md ${i === 1 ? 'bg-brand-primary' : 'bg-gray-200'}`}></div>
                        <div className={`h-3 rounded w-32 ${i === 1 ? 'bg-brand-primary/20' : 'bg-gray-100'}`}></div>
                     </div>
                   ))}
                 </div>

                 {/* System Status */}
                 <div className="mt-auto bg-green-50 p-4 rounded-xl border border-green-100">
                    <div className="flex items-center gap-2 text-green-700 font-bold text-xs uppercase tracking-wider mb-2">
                       <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                       System Healthy
                    </div>
                    <div className="h-2 w-full bg-green-200 rounded-full overflow-hidden">
                       <motion.div 
                         className="h-full bg-green-500"
                         animate={{ width: ["40%", "70%", "50%", "90%"] }}
                         transition={{ duration: 3, repeat: Infinity }}
                       />
                    </div>
                 </div>
              </div>
              
              {/* Main Canvas */}
              <div className="flex-1 p-8 bg-gray-50/50 relative overflow-hidden flex flex-col">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:32px_32px] opacity-40"></div>
                
                <div className="relative z-10 flex-1 flex flex-col">
                  {/* Top Bar */}
                  <div className="flex justify-between items-center mb-16">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-brand-primary shadow-sm">
                         <Workflow className="w-6 h-6" />
                       </div>
                       <div>
                         <div className="h-5 w-48 bg-gray-900/10 rounded mb-2"></div>
                         <div className="h-3 w-32 bg-gray-900/5 rounded"></div>
                       </div>
                    </div>
                    <div className="flex gap-2">
                       <div className="h-10 w-10 bg-white rounded-lg border border-gray-200 shadow-sm flex items-center justify-center"><Search className="w-4 h-4 text-gray-400"/></div>
                       <div className="h-10 w-32 bg-brand-primary text-white rounded-lg shadow-button flex items-center justify-center text-sm font-bold">Deploy Agent</div>
                    </div>
                  </div>

                  {/* Flow Diagram - Expanded */}
                  <div className="relative flex-1 w-full flex items-center justify-center gap-4 md:gap-12">
                     
                     {/* Input Node */}
                     <motion.div 
                       initial={{ x: -20, opacity: 0 }}
                       whileInView={{ x: 0, opacity: 1 }}
                       transition={{ delay: 0.2 }}
                       className="bg-white p-5 rounded-2xl border border-surface-border shadow-lg flex flex-col items-center gap-3 w-40 z-10 relative group-hover:scale-105 transition-transform"
                     >
                        <div className="absolute -top-3 -right-3 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full animate-bounce">NEW</div>
                        <Mail className="w-8 h-8 text-gray-400" />
                        <div className="text-xs font-bold text-gray-500">INBOUND LEAD</div>
                        <div className="h-2 w-20 bg-gray-100 rounded"></div>
                     </motion.div>

                     {/* Connector 1 */}
                     <div className="w-12 md:w-24 h-[3px] bg-gray-200 relative overflow-hidden rounded-full">
                       <motion.div 
                         className="absolute top-0 left-0 h-full w-1/2 bg-brand-primary"
                         animate={{ x: ["-100%", "200%"] }}
                         transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                       />
                     </div>

                     {/* Central AI Node - Pulsing & Floating */}
                     <motion.div 
                       animate={{ y: [0, -10, 0] }}
                       transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                       className="relative"
                     >
                       <div className="absolute inset-0 bg-brand-primary/20 blur-xl rounded-full animate-pulse"></div>
                       <div className="bg-white p-6 rounded-3xl border-2 border-brand-primary shadow-2xl flex flex-col items-center gap-3 w-48 z-20 relative">
                          <Zap className="w-10 h-10 text-brand-primary fill-brand-bg" />
                          <div className="text-sm font-bold text-brand-primary tracking-widest">AI AGENT</div>
                          <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                             <motion.div className="bg-brand-primary h-full" animate={{ width: ["0%", "100%"] }} transition={{ duration: 2, repeat: Infinity }} />
                          </div>
                          <div className="text-[10px] text-gray-400 font-mono">Processing Data...</div>
                       </div>
                       
                       {/* Floating Badges */}
                       <motion.div 
                         animate={{ opacity: [0, 1, 0], y: [-10, -30] }}
                         transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                         className="absolute -top-8 -right-8 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold shadow-sm flex items-center gap-1"
                       >
                         <CheckCircle2 className="w-3 h-3" /> Extracted
                       </motion.div>
                     </motion.div>

                     {/* Connector 2 */}
                     <div className="w-12 md:w-24 h-[3px] bg-gray-200 relative overflow-hidden rounded-full">
                       <motion.div 
                         className="absolute top-0 left-0 h-full w-1/2 bg-brand-primary"
                         animate={{ x: ["-100%", "200%"] }}
                         transition={{ duration: 1, delay: 0.5, repeat: Infinity, ease: "linear" }}
                       />
                     </div>

                     {/* Output Node */}
                     <motion.div 
                       initial={{ x: 20, opacity: 0 }}
                       whileInView={{ x: 0, opacity: 1 }}
                       transition={{ delay: 0.4 }}
                       className="bg-white p-5 rounded-2xl border border-surface-border shadow-lg flex flex-col items-center gap-3 w-40 z-10 group-hover:scale-105 transition-transform"
                     >
                        <Database className="w-8 h-8 text-gray-400" />
                        <div className="text-xs font-bold text-gray-500">CRM SYNC</div>
                        <div className="h-2 w-20 bg-gray-100 rounded"></div>
                     </motion.div>
                  </div>

                  {/* Live Log Panel */}
                  <div className="mt-8 bg-black/90 rounded-xl p-4 font-mono text-xs text-green-400 h-32 overflow-hidden relative shadow-2xl border border-gray-800">
                     <div className="absolute top-2 right-2 flex gap-1">
                        <div className="w-2 h-2 rounded-full bg-red-500"></div>
                        <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                     </div>
                     <div className="opacity-50 text-[10px] mb-2 border-b border-gray-700 pb-1">LIVE LOGS</div>
                     <div className="space-y-1">
                        <motion.div animate={{ opacity: [0.5, 1] }} transition={{ duration: 0.5 }}>[10:42:01] Inbound email received from @acme.com</motion.div>
                        <motion.div animate={{ opacity: [0.5, 1] }} transition={{ delay: 0.5, duration: 0.5 }}>[10:42:02] AI extracting intent: "Sales Inquiry"</motion.div>
                        <motion.div animate={{ opacity: [0.5, 1] }} transition={{ delay: 1.0, duration: 0.5 }}>[10:42:03] CRM Contact Created (ID: #99281)</motion.div>
                        <motion.div animate={{ opacity: [0.5, 1] }} transition={{ delay: 1.5, duration: 0.5 }}>[10:42:03] Slack Notification sent to #sales</motion.div>
                        <motion.div 
                           initial={{ opacity: 0 }}
                           animate={{ opacity: 1 }} 
                           transition={{ delay: 2.0, duration: 0.5 }}
                           className="text-white font-bold"
                        >
                           [10:42:04] Workflow Completed Successfully ✓
                        </motion.div>
                     </div>
                  </div>
                  
                  {/* Interactive Click Hint */}
                  <div className="absolute bottom-6 right-6 bg-white/90 backdrop-blur border border-surface-border px-4 py-2 rounded-full shadow-lg text-sm font-bold text-brand-primary flex items-center gap-2 animate-bounce cursor-pointer hover:bg-brand-primary hover:text-white transition-colors">
                    <Sparkles className="w-4 h-4" />
                    Click to Automate
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* --- Part 4: Features/Services Sections --- */}
      
      {/* Feature 1: Workflow Automation */}
      <FeatureSection 
        badge="WORKFLOW AUTOMATION"
        title="Handle Unlimited Customer Inbound Without Scaling Headcount"
        description="Our intelligent N8N workflow engine automatically categorizes, prioritizes, and processes inbound requests from email, forms, and chat. We route complex issues to humans while AI handles the routine 80%."
        bullets={[
          "Auto-categorize emails and support tickets",
          "Extract key data points automatically",
          "Trigger webhooks across your existing stack"
        ]}
        align="left"
        MockupComponent={WorkflowMockup}
        onAction={() => openChat("Tell me more about Workflow Automation.")}
      />

      {/* Feature 2: AI Chatbots & Voice Reception */}
      <FeatureSection 
        badge="AI CHATBOTS & VOICE"
        title="Provide Support 24/7—On Demand, to Increase CSAT"
        description="We deploy human-like voice agents and intelligent chatbots that understand context, sentiment, and intent. Reduce wait times to zero and solve problems instantly, day or night."
        bullets={[
          "Natural language voice synthesis",
          "Instant context switching between topics",
          "Seamless handoff to human agents"
        ]}
        align="right"
        MockupComponent={ChatMockup}
        onAction={() => openChat("I want to demo the AI Chatbot.")}
      />

      {/* Feature 3: WhatsApp RAG */}
      <FeatureSection 
        badge="WHATSAPP RAG AUTOMATION"
        title="Deliver Personal Messages to Drive Revenue"
        description="Connect your knowledge base to WhatsApp. We build systems that allow customers to query your products, check order status, and receive personalized recommendations directly in their favorite chat app."
        bullets={[
          "RAG-powered accurate answers",
          "Broadcast personalized offers",
          "Automated follow-ups and nurturing"
        ]}
        align="left"
        MockupComponent={WhatsAppMockup}
        onAction={() => openChat("How does WhatsApp Automation work?")}
      />

      {/* Feature 4: Data Capture */}
      <FeatureSection 
        badge="DATA CAPTURE & INTEGRATION"
        title="Automate Processes to Reduce Workload for Your Teams"
        description="Eliminate manual data entry. Spacetact extracts structured data from unstructured documents, calls, and chats, pushing it directly into your CRM or ERP system with 99% accuracy."
        bullets={[
          "Document OCR and analysis",
          "Real-time CRM syncing",
          "Custom validation rules"
        ]}
        align="right"
        MockupComponent={DataMockup}
        onAction={() => openChat("Explain Data Capture features.")}
      />

      {/* --- Part 5: Process Section --- */}
      <section className="py-[100px] bg-surface-card">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-sm font-bold text-brand-primary tracking-wider uppercase mb-3 block">OUR PROCESS</span>
            <h2 className="text-3xl md:text-5xl font-bold text-text-heading mb-4">How We Work With You</h2>
            <p className="text-xl text-text-muted">A completely done-for-you service approach</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 cursor-pointer" onClick={() => openChat("Walk me through the setup process.")}>
            <ProcessCard 
              number="01"
              title="Discovery & Strategy"
              description="We start with a deep-dive audit of your current operations to identify high-impact bottlenecks and calculate potential ROI."
            />
            <ProcessCard 
              number="02"
              title="Custom Development"
              description="Our engineers build your custom AI agents and N8N workflows, integrating them securely with your existing software stack."
            />
            <ProcessCard 
              number="03"
              title="Launch & Optimize"
              description="We deploy your automation solution, provide team training, and continuously refine the AI for maximum performance."
            />
          </div>
        </div>
      </section>

      {/* --- Part 6: Testimonials --- */}
      <section className="py-[100px] bg-white">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-sm font-bold text-brand-primary tracking-wider uppercase mb-3 block">SUCCESS STORIES</span>
            <h2 className="text-3xl md:text-5xl font-bold text-text-heading mb-4">Companies Love Our AI Automation</h2>
            <p className="text-xl text-text-muted">Driving efficiency for forward-thinking teams</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <TestimonialCard 
              quote="Spacetact transformed our customer support. We reduced response times by 90% and our team can finally focus on complex issues. It's a game changer."
              author="Sarah Jenkins"
              role="Head of Ops, TechFlow"
            />
            <TestimonialCard 
              quote="The WhatsApp automation alone doubled our lead qualification rate. The RAG implementation is incredibly accurate—it knows our products better than new hires."
              author="Michael Chen"
              role="Director of Sales, GrowthCo"
            />
            <TestimonialCard 
              quote="Setting up the voice receptionist took minutes. It handles 500+ calls a day flawlessly. The ROI was immediate and significant."
              author="Elena Rodriguez"
              role="CEO, DentalPlus Clinics"
            />
          </div>
        </div>
      </section>

      {/* --- Part 7: Final CTA --- */}
      <section className="py-[100px] bg-cta-gradient text-white text-center px-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-[1000px] mx-auto"
        >
          <h2 className="text-4xl md:text-[52px] font-bold mb-6">Scale Your Business Without Scaling Headcount</h2>
          <p className="text-xl text-white/90 max-w-[600px] mx-auto mb-10">
            Join hundreds of businesses automating their growth with Spacetact today.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button 
              onClick={() => openChat("I want to book a discovery call.")}
              className="bg-white text-brand-primary px-11 py-5 rounded-[10px] text-lg font-bold shadow-lg hover:bg-gray-50 hover:scale-105 transition-all duration-200 flex items-center justify-center gap-3"
            >
              <Phone className="w-5 h-5" />
              Book Discovery Call
            </button>
            <button 
              onClick={() => setIsCalculatorOpen(true)}
              className="bg-brand-dark/20 backdrop-blur-sm border-2 border-white/20 text-white px-11 py-5 rounded-[10px] text-lg font-bold hover:bg-white/10 hover:scale-105 transition-all duration-200 flex items-center justify-center gap-3"
            >
              <BarChart3 className="w-5 h-5" />
              Calculate ROI
            </button>
          </div>
        </motion.div>
      </section>

      {/* --- Part 8: Footer --- */}
      <footer className="bg-[#0A0A0A] text-white pt-[80px] pb-[40px] px-6 border-t border-[#262626]">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            {/* Brand Col */}
            <div className="space-y-4">
              <span className="text-xl font-bold">Spacetact</span>
              <p className="text-text-light text-sm leading-relaxed">
                Empowering businesses with intelligent automation solutions for a scalable future.
              </p>
              <div className="flex gap-4">
                {/* Social Placeholders */}
                <div className="w-6 h-6 bg-gray-700 rounded-full hover:bg-brand-primary transition-colors cursor-pointer"></div>
                <div className="w-6 h-6 bg-gray-700 rounded-full hover:bg-brand-primary transition-colors cursor-pointer"></div>
                <div className="w-6 h-6 bg-gray-700 rounded-full hover:bg-brand-primary transition-colors cursor-pointer"></div>
              </div>
            </div>

            {/* Links Cols */}
            <FooterColumn title="Services" links={['AI Chatbots', 'Voice Reception', 'Workflow Automation', 'WhatsApp RAG']} onLinkClick={(l: string) => openChat(`Tell me about ${l}`)} />
            <FooterColumn title="Resources" links={['ROI Calculator', 'Case Studies', 'Blog', 'Security']} onLinkClick={(l: string) => l === 'ROI Calculator' ? setIsCalculatorOpen(true) : openChat(`Do you have resources on ${l}?`)} />
            <FooterColumn title="Company" links={['About Us', 'Contact', 'Privacy Policy', 'Terms of Service']} onLinkClick={(l: string) => openChat(`Tell me about ${l}`)} />
          </div>

          <div className="pt-8 border-t border-[#262626] text-center text-sm text-[#737373]">
            © 2025 Spacetact. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

// --- Sub-Components ---

const FeatureSection = ({ badge, title, description, bullets, align, MockupComponent, onAction }: any) => {
  return (
    <section className="py-[100px] px-6 overflow-hidden">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-[60px] items-center">
        {/* Content Column */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeIn}
          className={`flex flex-col justify-center ${align === 'right' ? 'lg:order-2' : 'lg:order-1'}`}
        >
          <span className="text-sm font-bold text-brand-primary uppercase tracking-wider mb-3">{badge}</span>
          <h2 className="text-3xl md:text-[42px] font-bold text-text-heading leading-[1.2] mb-5">{title}</h2>
          <p className="text-lg text-text-muted leading-[1.7] mb-8">{description}</p>
          <ul className="space-y-4 mb-10">
            {bullets.map((item: string, i: number) => (
              <li key={i} className="flex items-start gap-3 text-[17px] font-medium text-text-body">
                <CheckCircle2 className="w-6 h-6 text-brand-primary shrink-0 fill-brand-bg" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <button 
            onClick={onAction}
            className="self-start text-brand-primary font-bold flex items-center gap-2 hover:gap-3 transition-all"
          >
            Learn more <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>

        {/* Visual Column */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className={`w-full ${align === 'right' ? 'lg:order-1' : 'lg:order-2'}`}
        >
          <div className="bg-white border border-surface-border rounded-xl p-5 shadow-card hover:-translate-y-1 transition-transform duration-300 cursor-pointer" onClick={onAction}>
            <MockupComponent />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const ProcessCard = ({ number, title, description }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
    className="bg-white border border-surface-border rounded-2xl p-10 shadow-soft hover:shadow-card hover:-translate-y-1 transition-all duration-300"
  >
    <div className="w-16 h-16 rounded-full bg-brand-bg flex items-center justify-center text-2xl font-bold text-brand-primary mb-6">
      {number}
    </div>
    <h3 className="text-2xl font-bold text-text-heading mb-3">{title}</h3>
    <p className="text-[16px] text-text-muted leading-relaxed">{description}</p>
  </motion.div>
);

const TestimonialCard = ({ quote, author, role }: any) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.95 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
    className="bg-white border-[2px] border-surface-border rounded-xl p-8 min-h-[280px] flex flex-col justify-between hover:border-brand-primary/30 transition-colors"
  >
    <div>
      <div className="text-brand-primary mb-4">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" className="opacity-20">
          <path d="M14.017 21L14.017 18C14.017 16.0547 15.1963 14.5457 16.7118 13.9111C16.294 13.8447 15.8208 13.8052 15.2891 13.8052C13.435 13.8052 12.017 14.7709 12.017 16.4863L12.017 21H7.01699L7.01699 15.4863C7.01699 11.2335 9.94056 8 13.6231 8L14.7758 8L14.7758 11.3965C13.9056 11.724 13.1205 12.3965 12.8256 13.3364C13.4475 13.0645 14.084 13.0488 14.5826 13.0488C16.8222 13.0488 19.017 14.673 19.017 17.5516C19.017 19.5376 17.3734 21 15.5458 21L14.017 21ZM6.01699 21L6.01699 18C6.01699 16.0547 7.19632 14.5457 8.7118 13.9111C8.29399 13.8447 7.82078 13.8052 7.28911 13.8052C5.435 13.8052 4.01699 14.7709 4.01699 16.4863L4.01699 21H-0.983008L-0.983008 15.4863C-0.983008 11.2335 1.94056 8 5.62312 8L6.77581 8L6.77581 11.3965C5.90558 11.724 5.12051 12.3965 4.82559 13.3364C5.44747 13.0645 6.084 13.0488 6.58262 13.0488C8.82223 13.0488 11.017 14.673 11.017 17.5516C11.017 19.5376 9.37342 21 7.54581 21L6.01699 21Z" />
        </svg>
      </div>
      <p className="text-[17px] text-text-body italic leading-[1.7] mb-6">"{quote}"</p>
    </div>
    <div className="flex items-center gap-4 border-t border-gray-100 pt-6">
      <div className="w-12 h-12 rounded-full bg-gray-200"></div>
      <div>
        <div className="text-[16px] font-bold text-text-heading">{author}</div>
        <div className="text-[14px] text-text-muted">{role}</div>
      </div>
    </div>
  </motion.div>
);

const FooterColumn = ({ title, links, onLinkClick }: any) => (
  <div>
    <h4 className="text-white font-bold uppercase text-sm mb-6">{title}</h4>
    <ul className="space-y-3">
      {links.map((link: string) => (
        <li key={link}>
          <button 
            onClick={() => onLinkClick(link)}
            className="text-text-light text-[15px] hover:text-white transition-colors duration-200 text-left"
          >
            {link}
          </button>
        </li>
      ))}
    </ul>
  </div>
);

// --- Animated Mockups ---

const WorkflowMockup = () => {
  return (
    <div className="w-full bg-gray-50 rounded-xl border border-gray-200 p-6 min-h-[340px] flex flex-col gap-6 select-none overflow-hidden relative">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:24px_24px] opacity-40"></div>
      
      {/* Node 1: Inbound */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="relative z-10 bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex items-center gap-3 w-fit"
      >
        <div className="bg-blue-100 p-2 rounded-md text-blue-600"><Mail className="w-5 h-5" /></div>
        <div>
          <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">Trigger</div>
          <div className="font-semibold text-gray-800">New Lead Email</div>
        </div>
      </motion.div>

      {/* Path 1 */}
      <div className="relative h-8 w-[2px] bg-gray-300 ml-8">
        <motion.div 
          animate={{ height: ["0%", "100%", "100%"] }}
          transition={{ duration: 2, repeat: Infinity, times: [0, 0.4, 1], repeatDelay: 1 }}
          className="absolute top-0 left-0 w-full bg-brand-primary"
        />
      </div>

      {/* Node 2: AI Processing (Pulsing) */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        className="relative z-10 bg-white p-1 rounded-xl border border-brand-primary shadow-[0_0_30px_rgba(139,92,246,0.2)] w-fit"
      >
        <div className="bg-brand-bg p-4 rounded-lg flex items-center gap-4">
           <div className="bg-brand-primary p-2 rounded-md text-white animate-pulse"><Workflow className="w-5 h-5" /></div>
           <div>
             <div className="text-xs text-brand-dark font-bold uppercase tracking-wider">AI Processor</div>
             <motion.div 
               animate={{ opacity: [0.5, 1, 0.5] }} 
               transition={{ duration: 2, repeat: Infinity }}
               className="font-bold text-brand-primary"
             >
               Analyzing Intent...
             </motion.div>
           </div>
        </div>
      </motion.div>

      {/* Split Paths */}
      <div className="relative h-8 w-[2px] bg-gray-300 ml-8">
         <motion.div 
          animate={{ height: ["0%", "100%"] }}
          transition={{ duration: 1, delay: 1, repeat: Infinity, repeatDelay: 2 }}
          className="absolute top-0 left-0 w-full bg-brand-primary"
        />
      </div>
      
      {/* Branching */}
      <div className="grid grid-cols-2 gap-4 ml-2 relative z-10">
         <motion.div 
           initial={{ opacity: 0, x: -20 }}
           whileInView={{ opacity: 1, x: 0 }}
           transition={{ delay: 1.5 }}
           className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm flex items-center gap-2"
         >
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-sm font-medium">Update CRM</span>
         </motion.div>
         <motion.div 
           initial={{ opacity: 0, x: 20 }}
           whileInView={{ opacity: 1, x: 0 }}
           transition={{ delay: 1.7 }}
           className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm flex items-center gap-2"
         >
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-sm font-medium">Notify Slack</span>
         </motion.div>
      </div>
    </div>
  );
};

const ChatMockup = () => (
  <div className="w-full bg-white rounded-lg border border-gray-200 overflow-hidden flex flex-col min-h-[340px] select-none shadow-sm relative">
    <div className="bg-gray-50 border-b border-gray-200 p-4 flex items-center gap-3">
      <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
      <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
      <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
    </div>
    
    <div className="p-6 space-y-6 flex-1 bg-white">
      {/* User Message */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex gap-3"
      >
        <div className="w-8 h-8 rounded-full bg-gray-200 shrink-0 flex items-center justify-center font-bold text-gray-500 text-xs">JD</div>
        <div className="bg-gray-100 p-4 rounded-2xl rounded-tl-none text-sm text-gray-700 shadow-sm max-w-[85%]">
          Hi, I'm having trouble with my invoice #402.
        </div>
      </motion.div>

      {/* Typing Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1, display: "none" }}
        transition={{ delay: 1, duration: 1.5 }}
        className="flex gap-3 flex-row-reverse"
      >
         <div className="w-8 h-8 rounded-full bg-brand-primary shrink-0"></div>
         <div className="bg-brand-bg p-4 rounded-2xl rounded-tr-none flex gap-1 items-center">
            <div className="w-1.5 h-1.5 bg-brand-primary rounded-full animate-bounce"></div>
            <div className="w-1.5 h-1.5 bg-brand-primary rounded-full animate-bounce delay-75"></div>
            <div className="w-1.5 h-1.5 bg-brand-primary rounded-full animate-bounce delay-150"></div>
         </div>
      </motion.div>

      {/* AI Reply */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.5 }}
        className="flex gap-3 flex-row-reverse"
      >
        <div className="w-8 h-8 rounded-full bg-brand-primary shrink-0 flex items-center justify-center text-white text-xs shadow-lg shadow-purple-200">AI</div>
        <div className="bg-brand-bg p-4 rounded-2xl rounded-tr-none text-sm text-brand-dark shadow-sm max-w-[85%] border border-brand-primary/10">
          I can help with that. I've located invoice #402. <br/><br/>It appears the payment is pending. Would you like a payment link?
        </div>
      </motion.div>

      {/* User Reply */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 4 }}
        className="flex gap-3"
      >
        <div className="w-8 h-8 rounded-full bg-gray-200 shrink-0 flex items-center justify-center font-bold text-gray-500 text-xs">JD</div>
        <div className="bg-gray-100 p-4 rounded-2xl rounded-tl-none text-sm text-gray-700 shadow-sm">
          Yes, please send it over.
        </div>
      </motion.div>
    </div>
  </div>
);

const WhatsAppMockup = () => (
  <div className="w-full bg-[#E5DDD5] rounded-lg border border-gray-200 min-h-[340px] p-4 flex flex-col gap-4 relative overflow-hidden select-none shadow-sm">
    <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px'}}></div>
    
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-white p-3 rounded-lg shadow-sm self-start max-w-[70%] text-sm relative z-10"
    >
      Do you have the Enterprise plan in stock?
      <span className="text-[10px] text-gray-400 block text-right mt-1">10:42 AM</span>
    </motion.div>
    
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1 }}
      className="self-end max-w-[70%] flex items-center gap-2 mb-2"
    >
       <span className="text-xs text-gray-500 bg-white/50 px-2 py-1 rounded-full flex items-center gap-1">
         <Loader2 className="w-3 h-3 animate-spin" />
         Checking database...
       </span>
    </motion.div>

    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ delay: 2.5 }}
      className="bg-[#DCF8C6] p-3 rounded-lg shadow-sm self-end max-w-[80%] text-sm relative z-10"
    >
      Yes! The Enterprise plan is available immediately. It includes unlimited workflows and 24/7 support.
      <span className="text-[10px] text-gray-500 block text-right mt-1">10:42 AM <Check className="w-3 h-3 inline text-blue-500" /></span>
    </motion.div>
    
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ delay: 4 }}
      className="bg-white p-3 rounded-lg shadow-sm self-start max-w-[70%] text-sm relative z-10"
    >
      Great, can I get a quote?
      <span className="text-[10px] text-gray-400 block text-right mt-1">10:43 AM</span>
    </motion.div>

     <motion.div 
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ delay: 5.5 }}
      className="bg-[#DCF8C6] p-3 rounded-lg shadow-sm self-end max-w-[80%] text-sm relative z-10"
    >
      I've generated a quote for you based on your company size. Click below to view.
      <motion.div 
        whileHover={{ scale: 1.02 }}
        className="mt-2 bg-white/50 p-2 rounded text-xs text-blue-600 underline cursor-pointer flex items-center gap-2"
      >
        <FileText className="w-4 h-4" /> Quote_Enterprise_Q3.pdf
      </motion.div>
      <span className="text-[10px] text-gray-500 block text-right mt-1">10:43 AM <Check className="w-3 h-3 inline text-blue-500" /></span>
    </motion.div>
  </div>
);

const DataMockup = () => (
  <div className="w-full bg-white rounded-lg border border-gray-200 flex flex-col min-h-[340px] overflow-hidden select-none shadow-sm relative">
    <div className="border-b border-gray-200 bg-gray-50 p-4 flex justify-between items-center">
      <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">Data Extraction Log</div>
      <div className="flex gap-2">
         <div className="w-2 h-2 rounded-full bg-gray-300"></div>
         <div className="w-2 h-2 rounded-full bg-gray-300"></div>
      </div>
    </div>
    
    {/* Scanning Effect */}
    <motion.div 
      initial={{ top: 0 }}
      animate={{ top: "100%" }}
      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      className="absolute left-0 w-full h-[2px] bg-green-400 shadow-[0_0_15px_rgba(74,222,128,0.5)] z-20 pointer-events-none"
    />

    <div className="p-0 overflow-x-auto relative">
      <table className="w-full text-sm text-left">
        <thead className="bg-gray-50 text-gray-500 border-b border-gray-200">
          <tr>
            <th className="p-4 font-medium text-xs uppercase">Source</th>
            <th className="p-4 font-medium text-xs uppercase">Data Point</th>
            <th className="p-4 font-medium text-xs uppercase">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {[
            { src: 'PDF Invoice', val: '$4,500', color: 'red' },
            { src: 'Call Log', val: 'Sentiment: Positive', color: 'blue' },
            { src: 'Email', val: 'Lead: John Doe', color: 'yellow' },
            { src: 'Form', val: 'Ticket #992', color: 'purple' }
          ].map((row, i) => (
            <motion.tr 
              key={i}
              initial={{ backgroundColor: "transparent" }}
              whileInView={{ backgroundColor: ["transparent", "rgba(220, 252, 231, 0.5)", "transparent"] }}
              transition={{ delay: i * 0.8, duration: 0.5 }}
            >
              <td className="p-4">
                 <div className="flex items-center gap-2">
                    <span className={`p-1 bg-${row.color}-50 text-${row.color}-600 rounded border border-${row.color}-100`}>
                      <div className={`w-2 h-2 bg-${row.color}-500 rounded-full`}></div>
                    </span> 
                    {row.src}
                 </div>
              </td>
              <td className="p-4 font-mono text-gray-600 font-medium">{row.val}</td>
              <td className="p-4">
                <motion.span 
                  initial={{ opacity: 0.5, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.8 }}
                  className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-bold border border-green-200 flex items-center gap-1 w-fit"
                >
                  <Check className="w-3 h-3" /> Synced
                </motion.span>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
    <div className="mt-auto bg-gray-50 p-4 border-t border-gray-200 flex justify-between items-center text-xs text-gray-500">
       <div className="flex items-center gap-2">
         <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
         Live Sync Active
       </div>
       <span className="text-brand-primary font-bold cursor-pointer hover:underline">View full logs →</span>
    </div>
  </div>
);

export default App;