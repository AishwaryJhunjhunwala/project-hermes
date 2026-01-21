'use client';

import { motion } from 'motion/react';

export function LandingBackground() {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ duration: 1.5 }}
        className="fixed top-[-20%] left-[-10%] w-[50%] h-[70%] bg-emerald-300/80 rounded-full blur-[120px] pointer-events-none mix-blend-multiply transition-all duration-1000 ease-in-out"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ duration: 1.5, delay: 0.2 }}
        className="fixed top-[20%] right-[-10%] w-[60%] h-[80%] bg-purple-300/80 rounded-full blur-[120px] pointer-events-none mix-blend-multiply transition-all duration-1000 ease-in-out"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 0.4 }}
        className="fixed bottom-[-20%] left-[20%] w-[40%] h-[50%] bg-blue-100/80 rounded-full blur-[100px] pointer-events-none mix-blend-multiply transition-all duration-1000 ease-in-out"
      />
    </>
  );
}
