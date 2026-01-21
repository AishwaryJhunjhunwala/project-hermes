'use client';
import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import { FaGithub, FaLinkedinIn, FaXTwitter } from 'react-icons/fa6';
import type { Member } from '@/types/member';

export default function MemberCard({ member }: { member: Member }) {
  const subtitle = member.memberType === 'EXECUTIVE' ? member.designation : member.role;

  const isExternalImage =
    typeof member.imageUrl === 'string' && /^https?:\/\//i.test(member.imageUrl);

  const [externalImgSrc, setExternalImgSrc] = useState<string | undefined>(() =>
    isExternalImage ? member.imageUrl : undefined
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      whileHover={{ y: -8 }}
      className="group bg-white rounded-3xl shadow-[0_2px_10px_-2px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] transition-all duration-300 overflow-hidden w-full border border-gray-100"
    >
      {/* IMAGE */}
      <div className="relative overflow-hidden aspect-4/5">
        {isExternalImage ? (
          <Image
            src={externalImgSrc || '/placeholder.jpg'}
            alt={member.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            unoptimized
            onError={() => setExternalImgSrc('/placeholder.jpg')}
          />
        ) : (
          <Image
            src={member.imageUrl || '/placeholder.jpg'}
            alt={member.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        )}

        {/* Social Overlay on Hover */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
          <div className="flex gap-3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            {member.linkedinUrl && (
              <SocialIcon href={member.linkedinUrl}>
                <FaLinkedinIn />
              </SocialIcon>
            )}
            {member.githubUrl && (
              <SocialIcon href={member.githubUrl}>
                <FaGithub />
              </SocialIcon>
            )}
            {member.twitterUrl && (
              <SocialIcon href={member.twitterUrl}>
                <FaXTwitter />
              </SocialIcon>
            )}
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-5 text-center bg-white relative z-10">
        <h3 className="text-lg font-bold tracking-tight text-gray-900 group-hover:text-blue-600 transition-colors">
          {member.name}
        </h3>

        {subtitle && <p className="mt-1 text-sm font-medium text-gray-500">{subtitle}</p>}
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
      className="flex items-center justify-center w-10 h-10 rounded-full bg-white text-black hover:bg-black hover:text-white transition-all duration-300 shadow-lg"
    >
      {children}
    </a>
  );
}
