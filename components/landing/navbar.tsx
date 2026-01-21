'use client';

import Link from 'next/link';
import { motion, useScroll, useMotionValueEvent } from 'motion/react';
import { useState } from 'react';

export function LandingNavbar() {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const previous = lastScrollY;
    setLastScrollY(latest);

    // Handle background transparency/glass effect
    if (latest > 50) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }

    // Handle show/hide logic
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  return (
    <motion.nav
      variants={{
        visible: { y: 0 },
        hidden: { y: '-100%' },
      }}
      animate={hidden ? 'hidden' : 'visible'}
      transition={{ duration: 0.35, ease: 'easeInOut' }}
      className={`fixed top-0 left-0 w-full z-50 transition-colors duration-300 ${
        scrolled ? 'bg-white/60 backdrop-blur-md border-b border-black/5' : 'bg-transparent'
      }`}
    >
      <div className="flex items-center justify-between px-8 py-6 md:px-12 mx-auto">
        <Link href={`/`}>
          <div className="flex items-center gap-4">
            <div className="w-8 h-12 bg-black rounded-r-full" />
            <span className="font-medium text-sm tracking-wide text-gray-900 hidden sm:block">
              / hello@ecell.nitrkl.ac.in
            </span>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-12">
          <div className="flex gap-8 text-sm font-medium text-gray-900">
            {['Startups', 'Events', 'Sessions', 'Members', 'Contact Us'].map((item) => (
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
      </div>
    </motion.nav>
  );
}
