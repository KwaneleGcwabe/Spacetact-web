import React from 'react';
import { motion } from 'framer-motion';
import { Building2, Gavel, HeartPulse, Truck, Megaphone, Briefcase } from 'lucide-react';

const TrustedBy: React.FC = () => {
  const brands = [
    { name: 'Nexus Realty', icon: Building2 },
    { name: 'Apex Legal', icon: Gavel },
    { name: 'Vitality Health', icon: HeartPulse },
    { name: 'Quantum Logistics', icon: Truck },
    { name: 'Echo Marketing', icon: Megaphone },
    { name: 'Summit Corp', icon: Briefcase },
  ];

  return (
    <section className="py-12 border-t border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <p className="text-xs md:text-sm font-bold text-gray-400 tracking-[0.2em] uppercase mb-8 md:mb-12">
          Trusted by Innovative Businesses
        </p>
        
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 lg:gap-24">
          {brands.map((brand, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.05, filter: 'grayscale(0%)', opacity: 1 }}
              className="flex items-center gap-2 group cursor-default grayscale opacity-50 transition-all duration-300"
            >
              <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-black group-hover:text-white transition-colors">
                <brand.icon className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <span className="font-display font-bold text-gray-700 text-sm md:text-lg group-hover:text-black transition-colors">
                {brand.name}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustedBy;