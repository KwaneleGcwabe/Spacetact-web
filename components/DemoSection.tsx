import React from 'react';
import { motion } from 'framer-motion';
import { Bot, Send, Wifi, Battery, Signal } from 'lucide-react';

const DemoSection: React.FC = () => {
  const chatSequence = [
    { id: 1, role: 'user', text: "Do you have availability for a consultation next Tuesday?", delay: 0.5 },
    { id: 2, role: 'model', text: "Yes! I have slots open at 10:00 AM and 2:00 PM. Which works best for you?", delay: 2.5 },
    { id: 3, role: 'user', text: "Let's do 2:00 PM.", delay: 4.5 },
    { id: 4, role: 'model', text: "Perfect. I've booked you for Tuesday at 2:00 PM and synced it to your Google Calendar. 🗓️", delay: 6.5 },
    { id: 5, role: 'model', text: "Anything else I can help with?", delay: 8.5 },
  ];

  return (
    <section className="py-40 px-6 relative overflow-hidden bg-black perspective-1000">
      <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row items-center justify-between gap-32 relative z-10">
        
        {/* Text Content */}
        <div className="flex-1 text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 border border-white/20 rounded-full mb-8">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-[10px] tracking-[0.2em] uppercase text-white font-bold">Live Simulation</span>
            </div>
            
            <h2 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-[0.9] tracking-tighter">
              BEYOND SIMPLE <br />
              <span className="text-gray-500">
                TEXT RESPONSES
              </span>
            </h2>
            
            <p className="text-xl text-gray-400 mb-12 leading-relaxed max-w-xl mx-auto lg:mx-0 font-medium tracking-tight">
              See how Spacetact AI handles complex scheduling, qualifies leads, and integrates directly with your business tools—all in real-time, 24/7.
            </p>

            <div className="flex flex-col sm:flex-row gap-12 justify-center lg:justify-start">
              <div className="pl-6 border-l border-white/20">
                <p className="font-bold text-white text-3xl tracking-tighter">24/7</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] mt-1 font-bold">Always On</p>
              </div>
              <div className="pl-6 border-l border-white/20">
                <p className="font-bold text-white text-3xl tracking-tighter">0ms</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] mt-1 font-bold">Latency</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* 3D Phone Visual */}
        <div className="flex-1 relative w-full flex justify-center perspective-[2500px]">
          <motion.div
            initial={{ rotateY: -20, rotateX: 10, opacity: 0 }}
            whileInView={{ rotateY: -15, rotateX: 5, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            animate={{ 
               y: [0, -15, 0],
               rotateY: [-15, -10, -15] 
            }}
            //@ts-ignore
            transition={{ 
               y: { repeat: Infinity, duration: 6, ease: "easeInOut" },
               rotateY: { repeat: Infinity, duration: 8, ease: "easeInOut" }
            }}
            style={{ transformStyle: "preserve-3d" }}
            className="relative w-[320px] h-[650px] bg-[#050505] rounded-[48px] shadow-2xl border-[6px] border-[#1a1a1a] ring-1 ring-white/10"
          >
            {/* 3D Thickness */}
            <div className="absolute inset-0 rounded-[48px] border-l-[6px] border-r-[6px] border-white/5 pointer-events-none transform translate-z-1"></div>
            
            {/* Screen Content */}
            <div className="w-full h-full bg-black rounded-[42px] overflow-hidden flex flex-col relative">
              
              {/* Status Bar */}
              <div className="h-14 px-8 flex items-end justify-between pb-3 text-[10px] font-bold text-white">
                <span>9:41</span>
                <div className="flex gap-1.5">
                  <Signal className="w-3 h-3" />
                  <Wifi className="w-3 h-3" />
                  <Battery className="w-3 h-3" />
                </div>
              </div>

              {/* Header */}
              <div className="px-6 py-4 flex items-center gap-4 z-10 border-b border-white/10 bg-black/80 backdrop-blur-md">
                <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center">
                   <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm tracking-wide">Spacetact AI</h4>
                  <p className="text-[10px] text-green-500 font-bold uppercase tracking-wider flex items-center gap-1">
                    Online
                  </p>
                </div>
              </div>

              {/* Chat Area */}
              <div className="flex-1 p-6 space-y-6 flex flex-col justify-end pb-24 relative">
                 <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>

                 {chatSequence.map((msg) => (
                   <Bubble key={msg.id} msg={msg} />
                 ))}
              </div>

              {/* Input Area */}
              <div className="absolute bottom-0 w-full p-6 bg-black/80 backdrop-blur-md border-t border-white/10">
                <div className="flex items-center gap-3 bg-white/10 border border-white/5 rounded-full px-5 py-4">
                  <div className="w-full h-3 bg-white/10 rounded animate-pulse"></div>
                  <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center shrink-0">
                    <Send className="w-3 h-3" />
                  </div>
                </div>
                <div className="h-1 w-1/3 bg-white/20 mx-auto mt-6 rounded-full"></div>
              </div>

            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const Bubble: React.FC<{ msg: any }> = ({ msg }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: msg.delay, duration: 0.4 }}
      className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'} relative z-10`}
    >
      <div 
        className={`max-w-[85%] p-4 text-sm font-medium leading-relaxed backdrop-blur-sm ${
          msg.role === 'user' 
            ? 'bg-white text-black rounded-2xl rounded-br-sm' 
            : 'bg-white/10 text-gray-200 border border-white/10 rounded-2xl rounded-bl-sm'
        }`}
      >
        {msg.text}
      </div>
    </motion.div>
  );
};

export default DemoSection;