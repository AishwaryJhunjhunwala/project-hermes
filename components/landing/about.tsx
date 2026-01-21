'use client';

import { motion } from 'motion/react';

export function LandingAbout() {
  return (
    <motion.section
      id="about"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="py-24 border-t border-black/10"
    >
      <div className="max-w-4xl">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-[2px] bg-gray-900" />
          <span className="text-sm font-bold tracking-widest uppercase">About Us</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 leading-tight">
          Fostering innovation, incubation, and entrepreneurship among students.
        </h2>
        <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
          Entrepreneurship Cell, NIT Rourkela, established in 2007 under the Technical Society of
          SAC, aims to foster innovation, incubation, and entrepreneurship among students. It
          promotes entrepreneurial traits and supports budding entrepreneurs in achieving their
          goals. Key initiatives include the National Entrepreneurship Summit, Arthayan, and
          year-round weekend activities. These events encourage an entrepreneurial culture and
          assist students in pursuing their ventures. ECell strives to nurture talents and empower
          future entrepreneurs.
        </p>
      </div>
    </motion.section>
  );
}
