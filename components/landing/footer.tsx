'use client';

import { motion } from 'motion/react';
import Link from 'next/link';
import { Twitter, Github, Linkedin, Instagram, Globe } from 'lucide-react';

const legalLinks = [
  { name: 'Privacy Policy', href: '/privacy' },
  { name: 'Terms of Service', href: '/terms' },
  { name: 'Code of Conduct', href: '/code-of-conduct' },
];

const socialLinks = [
  { icon: Twitter, href: 'https://twitter.com/ecellnitr', label: 'Twitter' },
  { icon: Github, href: 'https://github.com/ecellnitr', label: 'GitHub' },
  { icon: Linkedin, href: 'https://linkedin.com/company/ecellnitr', label: 'LinkedIn' },
  { icon: Instagram, href: 'https://instagram.com/ecellnitr', label: 'Instagram' },
  { icon: Globe, href: 'https://ecell.nitrkl.ac.in', label: 'Website' },
];

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: 'easeOut' },
};

export function LandingFooter() {
  return (
    <footer className="relative z-10 pt-24 pb-12 border-t border-black/5 bg-white">
      <motion.div
        className="mx-auto px-8 md:px-12"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: '-100px' }}
        variants={fadeInUp}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 lg:gap-8 mb-20">
          {/* Brand & Socials - Left Column (2 cols wide) */}
          <div className="lg:col-span-2 flex flex-col gap-6 pr-8">
            <Link href="/" className="flex items-center gap-3 w-fit group">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center group-hover:bg-blue-700 transition-colors">
                <span className="text-white font-bold text-lg">E</span>
              </div>
              <span className="font-bold text-xl tracking-tight text-gray-900">E-Cell NITR</span>
            </Link>
            <p className="text-gray-500 max-w-sm leading-relaxed text-sm font-medium">
              Fostering entrepreneurship and innovation at NIT Rourkela. Creating a platform for
              student startups and visionaries.
            </p>

            <div className="flex items-center gap-4 mt-1">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-black transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>

            {/* System Status */}
            <div className="mt-4 flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded-full w-fit bg-white">
              <div className="relative flex h-2 w-2">
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </div>
              <span className="text-xs font-medium text-gray-600">All systems operational</span>
            </div>
          </div>

          {/* Links Columns (1 col each) */}
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <h4 className="font-bold text-gray-900 text-sm">Product</h4>
              <ul className="flex flex-col gap-3">
                <li>
                  <Link
                    href="/startups"
                    className="text-gray-500 hover:text-blue-600 transition-colors text-sm font-medium"
                  >
                    Startups
                  </Link>
                </li>
                <li>
                  <Link
                    href="/events"
                    className="text-gray-500 hover:text-blue-600 transition-colors text-sm font-medium"
                  >
                    Events{' '}
                    <span className="ml-1 px-1.5 py-0.5 bg-green-100 text-green-700 text-[10px] rounded-full font-bold">
                      New
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/members"
                    className="text-gray-500 hover:text-blue-600 transition-colors text-sm font-medium"
                  >
                    Members
                  </Link>
                </li>
                <li>
                  <Link
                    href="/sessions"
                    className="text-gray-500 hover:text-blue-600 transition-colors text-sm font-medium"
                  >
                    Sessions
                  </Link>
                </li>
              </ul>
            </div>

            <div className="flex flex-col gap-4">
              <h4 className="font-bold text-gray-900 text-sm">Explore</h4>
              <ul className="flex flex-col gap-3">
                <li>
                  <Link
                    href="#"
                    className="text-gray-500 hover:text-blue-600 transition-colors text-sm font-medium"
                  >
                    My feed
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-500 hover:text-blue-600 transition-colors text-sm font-medium"
                  >
                    Case studies
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <h4 className="font-bold text-gray-900 text-sm">Company</h4>
              <ul className="flex flex-col gap-3">
                <li>
                  <Link
                    href="/about"
                    className="text-gray-500 hover:text-blue-600 transition-colors text-sm font-medium"
                  >
                    About E-Cell
                  </Link>
                </li>
                <li>
                  <Link
                    href="/careers"
                    className="text-gray-500 hover:text-blue-600 transition-colors text-sm font-medium"
                  >
                    Careers
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-500 hover:text-blue-600 transition-colors text-sm font-medium"
                  >
                    Logos and media
                  </Link>
                </li>
              </ul>
            </div>
            <div className="flex flex-col gap-4">
              <h4 className="font-bold text-gray-900 text-sm">Blogs</h4>
              <ul className="flex flex-col gap-3">
                <li>
                  <Link
                    href="#"
                    className="text-gray-500 hover:text-blue-600 transition-colors text-sm font-medium"
                  >
                    Official Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-500 hover:text-blue-600 transition-colors text-sm font-medium"
                  >
                    Engineering Blog
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <h4 className="font-bold text-gray-900 text-sm">Partner with us</h4>
              <ul className="flex flex-col gap-3">
                <li>
                  <Link
                    href="#"
                    className="text-gray-500 hover:text-blue-600 transition-colors text-sm font-medium"
                  >
                    Host a Hackathon
                  </Link>
                </li>
              </ul>
            </div>
            <div className="flex flex-col gap-4">
              <h4 className="font-bold text-gray-900 text-sm">Support</h4>
              <ul className="flex flex-col gap-3">
                <li>
                  <Link
                    href="#"
                    className="text-gray-500 hover:text-blue-600 transition-colors text-sm font-medium"
                  >
                    Support docs
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact-us"
                    className="text-gray-500 hover:text-blue-600 transition-colors text-sm font-medium"
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-500 hover:text-blue-600 transition-colors text-sm font-medium"
                  >
                    Join discord
                  </Link>
                </li>
              </ul>
            </div>
            <div className="flex flex-col gap-4">
              <h4 className="font-bold text-gray-900 text-sm">Comparisons</h4>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-gray-500 text-sm font-medium">
            &copy; {new Date().getFullYear()} E-Cell NIT Rourkela.
          </p>

          <div className="flex items-center gap-8">
            {legalLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-gray-500 hover:text-black transition-colors text-sm font-bold"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </motion.div>
    </footer>
  );
}
