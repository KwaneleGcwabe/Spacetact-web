import React from 'react';
import { motion } from 'framer-motion';
import { ServiceItem } from '../types';
import { ArrowRight } from 'lucide-react';

interface ChatCarouselProps {
  items: ServiceItem[];
  onSelect: (prompt: string) => void;
}

const ChatCarousel: React.FC<ChatCarouselProps> = ({ items, onSelect }) => {
  return (
    <div className="w-full overflow-x-auto pb-4 pt-2 -mx-4 px-4 scrollbar-hide flex gap-4 snap-x snap-mandatory">
      {items.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1, duration: 0.4 }}
          className="snap-center shrink-0 w-72 bg-white border border-gray-200 rounded-xl hover:border-brand-primary/50 hover:shadow-lg transition-all duration-300 cursor-pointer group"
          onClick={() => onSelect(item.prompt)}
        >
          <div className="p-6 flex flex-col h-full">
            <div className="mb-4 text-brand-primary bg-brand-bg w-12 h-12 flex items-center justify-center rounded-lg">
              {item.icon}
            </div>
            
            <h4 className="font-bold text-lg mb-2 text-gray-900 tracking-tight">
              {item.title}
            </h4>
            
            <p className="text-sm text-gray-500 leading-relaxed mb-6 font-medium">
              {item.description}
            </p>
            
            <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 group-hover:text-brand-primary transition-colors">Select</span>
              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-brand-primary transition-colors" />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default ChatCarousel;