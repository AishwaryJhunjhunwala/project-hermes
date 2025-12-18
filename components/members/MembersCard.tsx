'use client';
import Image from 'next/image';
import { motion } from 'motion/react';
import { FaGithub, FaLinkedinIn, FaXTwitter } from 'react-icons/fa6';
import type { Member } from '@/types/member';

export default function MemberCard({ member }: { member: Member }) {
  const subtitle = member.memberType === 'EXECUTIVE' ? member.designation : member.role;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.45,
        ease: 'easeOut',
      }}
      whileHover={{
        y: -4,
        transition: { duration: 0.2, ease: 'easeOut' },
      }}
      className="
        bg-white
        rounded-3xl
        shadow-sm
        hover:shadow-xl
        transition-all
        overflow-hidden
        w-full
      "
    >
      {/* IMAGE */}
      <div className="relative">
        {/* normalize src: allow absolute URLs or ensure leading slash for local images */}
        {(() => {
          const resolveSrc = (url?: string | null) => {
            if (!url) return '/placeholder.jpg';
            const t = url.trim();
            if (/^https?:\/\//i.test(t)) return t;
            return t.startsWith('/') ? t : '/' + t;
          };
          return (
            <Image
              src={resolveSrc(member.imageUrl)}
              alt={member.name}
              width={1200}
              height={400}
              className="h-60 w-full object-cover"
            />
          );
        })()}

        {/* soft bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-linear-to-t from-white to-transparent" />
      </div>

      {/* CONTENT */}
      <div className="px-6 pb-6 text-center">
        <h3 className="text-lg xl:text-xl font-semibold tracking-tight">{member.name}</h3>

        {subtitle && <p className="mt-1 text-sm xl:text-base text-gray-500">{subtitle}</p>}

        {/* icons */}
        <div className="flex justify-center gap-5 mt-5">
          {/* LinkedIn ALWAYS visible */}
          <SocialIcon href={member.linkedinUrl || 'https://linkedin.com'}>
            <FaLinkedinIn />
          </SocialIcon>

          <SocialIcon href={member.githubUrl || 'https://github.com'}>
            <FaGithub />
          </SocialIcon>

          <SocialIcon href={member.twitterUrl || 'https://twitter.com'}>
            <FaXTwitter />
          </SocialIcon>
        </div>
      </div>
    </motion.div>
  );
}

function SocialIcon({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="
        flex items-center justify-center
        w-11 h-11
        rounded-full
        bg-gray-50
        text-gray-600
        hover:bg-blue-50
        hover:text-blue-600
        transition
      "
    >
      {children}
    </a>
  );
}
