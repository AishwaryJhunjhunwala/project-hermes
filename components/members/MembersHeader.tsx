'use client';
import { motion } from 'motion/react';

export default function MembersHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="text-left max-w-5xl mx-auto mb-16"
    >
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-[2px] bg-black" />
        <span className="text-sm font-bold tracking-widest uppercase">Team</span>
      </div>
      <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-black mb-6">
        Meet our{' '}
        <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-purple-600">
          Team
        </span>
      </h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="
          text-gray-600
          text-xl
          leading-relaxed
          max-w-2xl
        "
      >
        Meet the people who have shaped our community — leading teams, building systems, and growing
        the club year after year.
      </motion.p>
    </motion.div>
  );
}
