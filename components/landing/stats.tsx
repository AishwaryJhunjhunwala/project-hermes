'use client';

import { motion } from 'motion/react';

export function LandingStats() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
      className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mt-20 pb-12 border-t border-black/5 pt-12"
    >
      {[
        { value: '8,000+', label: 'STUDENTS', sub: '' },
        { value: '50+', label: 'SPEAKERS', sub: '' },
        { value: '150+', label: 'STARTUPS', sub: '' },
        { value: '100+', label: 'INVESTORS', sub: '' },
      ].map((stat, index) => (
        <motion.div key={index} whileHover={{ y: -5 }} className="space-y-2 group cursor-default">
          <h3 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter text-gray-900 group-hover:text-transparent group-hover:[-webkit-text-stroke:1px_black] transition-all duration-300">
            {stat.value}
          </h3>
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-widest uppercase text-gray-900">
              {stat.label}
            </span>
            {stat.sub && (
              <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                {stat.sub}
              </span>
            )}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
