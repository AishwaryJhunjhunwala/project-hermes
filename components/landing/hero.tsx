'use client';

import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';

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

export function LandingHero() {
  const scrollToAbout = () => {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="max-w-6xl"
    >
      <motion.div variants={fadeInUp} className="flex items-center gap-4 mb-8">
        <div className="w-12 h-[2px] bg-gray-900" />
        <span className="text-sm font-bold tracking-widest uppercase">Entrepreneurship Cell</span>
      </motion.div>

      <motion.h1
        variants={fadeInUp}
        className="text-6xl md:text-8xl lg:text-[7rem] leading-[0.9] font-bold tracking-tight text-gray-950 mb-8"
      >
        E-CELL
        <br />
        <span className="text-transparent [-webkit-text-stroke:2px_black] md:[-webkit-text-stroke:3px_black] tracking-wide">
          NIT ROURKELA
        </span>
      </motion.h1>

      <motion.p
        variants={fadeInUp}
        className="text-xl md:text-2xl text-gray-700 max-w-2xl leading-relaxed font-medium"
      >
        Turn your dreams into reality. Join our community and bring your ideas to life.
      </motion.p>

      <motion.div variants={fadeInUp} className="mt-12">
        <button
          onClick={scrollToAbout}
          className="inline-flex items-center gap-2 text-lg font-bold border-b border-black pb-0.5 hover:opacity-70 transition-opacity cursor-pointer z-20 relative"
          aria-label="Learn more about E-Cell"
        >
          Learn More <ArrowUpRight className="w-5 h-5" />
        </button>
      </motion.div>
    </motion.div>
  );
}
