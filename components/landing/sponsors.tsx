'use client';

import { motion } from 'motion/react';
import Marquee from 'react-fast-marquee';
import { Building2, Globe, Cpu, Cloud, Zap, Shield, Database, Code } from 'lucide-react';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: 'easeOut' },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const sponsors = [
  { name: 'TechCorp', icon: Building2 },
  { name: 'GlobalSystems', icon: Globe },
  { name: 'FutureChips', icon: Cpu },
  { name: 'CloudScale', icon: Cloud },
  { name: 'ZapEnergy', icon: Zap },
  { name: 'SecureNet', icon: Shield },
  { name: 'DataFlow', icon: Database },
  { name: 'CodeCraft', icon: Code },
];

export function LandingSponsors() {
  return (
    <section className="py-24 relative z-10 border-t border-black/10">
      <motion.div
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: '-100px' }}
        className="w-full"
      >
        <motion.div variants={fadeInUp} className="flex items-center gap-4 mb-8">
          <div className="w-12 h-[2px] bg-gray-900" />
          <span className="text-sm font-bold tracking-widest uppercase">Support</span>
        </motion.div>

        <motion.div
          variants={fadeInUp}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-950">
            Our Past Sponsors
          </h2>
        </motion.div>

        {/* Marquee Container */}
        <motion.div variants={fadeInUp} className="relative py-8 w-full">
          <Marquee gradient={false} speed={40} autoFill className="py-4 overflow-hidden">
            {sponsors.map((sponsor, index) => (
              <div
                key={index}
                className="flex items-center gap-3 mx-8 md:mx-16 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300 cursor-default group"
              >
                <div className="p-3 bg-gray-100 rounded-lg group-hover:bg-white group-hover:shadow-md transition-all duration-300">
                  <sponsor.icon className="w-8 h-8 text-gray-900" />
                </div>
                <span className="text-xl font-bold text-gray-800 tracking-tight">
                  {sponsor.name}
                </span>
              </div>
            ))}
          </Marquee>
        </motion.div>
      </motion.div>
    </section>
  );
}
