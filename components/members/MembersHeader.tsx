'use client';
import { motion } from 'motion/react';

export default function MembersHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="text-center max-w-5xl mx-auto mb-10 sm:mb-12"
    >
      <h1 className="text-4xl sm:text-5xl xl:text-6xl font-bold tracking-tight">
        Our <span className="text-blue-600">Club Members</span>
      </h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="
          mt-5
          text-gray-600
          text-base
          sm:text-lg
          xl:text-xl
          leading-relaxed
          font-medium
        "
      >
        Meet the people who have shaped our community — leading teams, building systems, and growing
        the club year after year.
      </motion.p>
    </motion.div>
  );
}
