import React from 'react';
import { motion } from 'framer-motion';
import { Database, Mail, MessageSquare, CheckCircle, FileText, Clock, TrendingUp, ShieldCheck } from 'lucide-react';

const WorkflowCaseStudySection: React.FC = () => {
  return (
    <section className="py-40 px-6 bg-white text-black relative overflow-hidden border-t border-white/10">
      <div className="max-w-[1400px] mx-auto flex flex-col-reverse lg:flex-row items-center gap-24">
        
        {/* Desktop Visual (Left) */}
        <div className="flex-1 w-full relative group perspective-1000">
          <motion.div
            initial={{ rotateX: 10, opacity: 0, y: 50 }}
            whileInView={{ rotateX: 0, opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative bg-gray-100 rounded-xl p-2 shadow-2xl border border-gray-200 w-full aspect-video transform transition-transform duration-500 hover:scale-[1.02]"
          >
            {/* Screen */}
            <div className="w-full h-full bg-white rounded-lg overflow-hidden relative flex flex-col shadow-inner">
              {/* Window Header */}
              <div className="h-10 bg-gray-50 border-b border-gray-200 flex items-center px-4 gap-2">
                <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                <div className="w-3 h-3 rounded-full bg-gray-300"></div>
              </div>

              {/* Canvas Area */}
              <div className="flex-1 bg-white relative p-12 overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:24px_24px]"></div>

                {/* Workflow Nodes */}
                <div className="relative z-10 flex items-center justify-between h-full w-full max-w-2xl mx-auto">
                  
                  <WorkflowNode 
                    icon={<Mail className="w-5 h-5 text-white" />} 
                    title="Lead Capture" 
                    color="bg-black" 
                    delay={0.5} 
                  />

                  <Connection delay={1.5} />

                  <WorkflowNode 
                    icon={<FileText className="w-5 h-5 text-white" />} 
                    title="Data Extraction" 
                    color="bg-black" 
                    delay={2.5} 
                    processing
                  />

                  <Connection delay={3.5} />

                  <WorkflowNode 
                    icon={<Database className="w-5 h-5 text-white" />} 
                    title="CRM Update" 
                    color="bg-black" 
                    delay={4.5} 
                  />

                  <Connection delay={5.5} />

                  <WorkflowNode 
                    icon={<MessageSquare className="w-5 h-5 text-white" />} 
                    title="Notify Team" 
                    color="bg-black" 
                    delay={6.5} 
                  />

                </div>

                {/* Status Console Overlay */}
                <motion.div 
                   initial={{ opacity: 0, y: 20 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   transition={{ delay: 7.5 }}
                   className="absolute bottom-6 right-6 bg-black text-white p-4 shadow-xl border border-gray-800"
                >
                  <div className="flex items-center gap-3 text-green-400 text-xs font-mono mb-2 uppercase tracking-widest font-bold">
                    <CheckCircle className="w-3 h-3" />
                    <span>Success</span>
                  </div>
                  <div className="text-gray-400 text-[10px] font-mono tracking-wide">
                    EXECUTION TIME: 0.42S
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Text Content (Right) */}
        <div className="flex-1 lg:pl-12">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-black mb-8">
              <span className="text-[10px] tracking-[0.2em] uppercase text-black font-bold">Case Study: Real Estate</span>
            </div>
            
            <h2 className="text-5xl md:text-6xl font-bold text-black mb-8 leading-[0.9] tracking-tighter">
              FROM CHAOS TO <br />
              <span className="text-gray-400">
                AUTOPILOT
              </span>
            </h2>
            
            <p className="text-lg text-gray-600 mb-12 leading-relaxed font-medium">
              We replaced 15 hours of manual data entry with a single, silent workflow. Zero errors. Instant updates.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
              <StatCard 
                icon={<Clock className="w-5 h-5 text-black" />}
                value="15 Hrs"
                label="Saved Weekly"
              />
              <StatCard 
                icon={<TrendingUp className="w-5 h-5 text-black" />}
                value="+40%"
                label="Lead Response"
              />
              <StatCard 
                icon={<ShieldCheck className="w-5 h-5 text-black" />}
                value="100%"
                label="Accuracy"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const WorkflowNode: React.FC<{ icon: React.ReactNode, title: string, color: string, delay: number, processing?: boolean }> = ({ icon, title, color, delay, processing }) => {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay, type: "spring", stiffness: 260, damping: 20 }}
      className="relative flex flex-col items-center gap-3 z-10"
    >
      <div className={`w-14 h-14 rounded-full ${color} flex items-center justify-center shadow-2xl relative`}>
        {icon}
        {processing && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
        )}
      </div>
      <div className="bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-wider border border-gray-200 shadow-sm whitespace-nowrap">
        {title}
      </div>
    </motion.div>
  );
};

const Connection: React.FC<{ delay: number }> = ({ delay }) => {
  return (
    <div className="flex-1 h-[1px] bg-gray-200 mx-4 relative overflow-hidden">
      <motion.div
        initial={{ x: '-100%' }}
        whileInView={{ x: '100%' }}
        viewport={{ once: true }}
        transition={{ delay: delay + 0.5, duration: 0.8, ease: "linear", repeat: Infinity, repeatDelay: 4 }}
        className="absolute top-0 left-0 w-1/2 h-full bg-black"
      ></motion.div>
    </div>
  );
};

const StatCard: React.FC<{ icon: React.ReactNode, value: string, label: string }> = ({ icon, value, label }) => {
  return (
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-black tracking-tight">{value}</p>
        <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-bold">{label}</p>
      </div>
    </div>
  );
};

export default WorkflowCaseStudySection;