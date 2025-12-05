import React, { useRef } from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { ServiceItem } from "../types";

const ROTATION_RANGE = 20; // Degrees
const HALF_ROTATION_RANGE = ROTATION_RANGE / 2;

interface Service3DCardProps {
  service: ServiceItem;
  onClick: (prompt: string) => void;
  index: number;
}

const Service3DCard: React.FC<Service3DCardProps> = ({ service, onClick, index }) => {
  const ref = useRef<HTMLDivElement | null>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth out the mouse movement
  const xSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const ySpring = useSpring(y, { stiffness: 300, damping: 30 });

  const transform = useMotionTemplate`rotateX(${xSpring}deg) rotateY(${ySpring}deg)`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseX = (e.clientX - rect.left) * ROTATION_RANGE;
    const mouseY = (e.clientY - rect.top) * ROTATION_RANGE;

    const rX = (mouseY / height - HALF_ROTATION_RANGE) * -1;
    const rY = mouseX / width - HALF_ROTATION_RANGE;

    x.set(rX);
    y.set(rY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      onClick={() => onClick(service.prompt)}
      style={{
        transformStyle: "preserve-3d",
        transform,
      }}
      className="relative h-[500px] w-full rounded-xl bg-zinc-900/50 cursor-pointer group perspective-1000 border border-white/5 hover:border-violet-500/50 transition-colors duration-500"
    >
      {/* Dynamic Spotlight/Sheen */}
      <div 
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0"
        style={{
          background: "radial-gradient(circle at center, rgba(139, 92, 246, 0.15) 0%, transparent 70%)"
        }}
      />

      <div
        style={{
          transform: "translateZ(50px)",
          transformStyle: "preserve-3d",
        }}
        className="absolute inset-4 md:inset-8 flex flex-col justify-between"
      >
        {/* Top Section */}
        <div className="flex justify-between items-start">
           <div 
             className="w-16 h-16 rounded-2xl bg-black/50 border border-white/10 flex items-center justify-center text-white group-hover:text-violet-400 group-hover:border-violet-500/50 transition-all duration-300 shadow-2xl"
             style={{ transform: "translateZ(20px)" }}
           >
             {service.icon}
           </div>
           
           <div 
             className="p-3 rounded-full border border-white/10 bg-black/20 text-gray-500 group-hover:text-white group-hover:border-white/30 transition-all"
             style={{ transform: "translateZ(10px)" }}
           >
             <ArrowRight className="w-5 h-5 -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
           </div>
        </div>

        {/* Bottom Section */}
        <div>
          <h3 
            className="text-3xl font-bold text-white mb-4 tracking-tighter"
            style={{ transform: "translateZ(30px)" }}
          >
            {service.title}
          </h3>
          <p 
            className="text-gray-400 leading-relaxed font-medium"
            style={{ transform: "translateZ(20px)" }}
          >
            {service.description}
          </p>
        </div>

        {/* Decorative Grid Lines */}
        <div className="absolute inset-0 border border-white/5 rounded-lg pointer-events-none" style={{ transform: "translateZ(10px)" }}></div>
      </div>
      
      {/* Reflection Effect */}
      <div 
        className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-overlay"
        style={{ transform: "translateZ(1px)" }}
      ></div>
    </motion.div>
  );
};

export default Service3DCard;
