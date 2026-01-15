'use client';

import Link from 'next/link';
import { motion } from 'motion/react';

export function LandingNavbar() {
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="relative z-50 flex items-center justify-between px-8 py-8 md:px-12"
    >
      <div className="flex items-center gap-4">
        <div className="w-8 h-16 bg-black rounded-r-full" />
        <span className="font-medium text-sm tracking-wide text-gray-900">
          / hello@ecell.nitrkl.ac.in
        </span>
      </div>

      <div className="hidden md:flex items-center gap-12">
        <div className="flex gap-8 text-sm font-medium text-gray-900">
          {['Startups', 'Events', 'Members', 'Sessions', 'Contact Us'].map((item) => (
            <Link
              key={item}
              href={`/${item.toLowerCase().replace(' ', '-')}`}
              className="hover:opacity-60 transition-opacity relative group"
            >
              {item}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-black transition-all group-hover:w-full" />
            </Link>
          ))}
        </div>
        <Link href="/auth/signup">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-black text-white px-8 py-3 text-sm font-medium flex items-center gap-2 hover:bg-gray-900 transition-colors rounded-full"
          >
            Join Us
            <span className="w-8 h-px bg-white/50 ml-2" />
          </motion.button>
        </Link>
      </div>
    </motion.nav>
  );
}
