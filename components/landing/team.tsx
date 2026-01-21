'use client';

import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Linkedin, Twitter, Github, Users, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { getExecutiveMembers } from '@/app/actions/public/team';

interface Member {
  id: number;
  name: string;
  designation: string | null; // Allow null as per schema but logically should be present for executives
  imageUrl: string;
  linkedinUrl: string | null;
  githubUrl: string | null;
  twitterUrl: string | null;
}

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: 'easeOut' },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export function LandingTeam() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await getExecutiveMembers();
        if (res.success && res.data) {
          setMembers(res.data as Member[]);
        }
      } catch (error) {
        console.error('Failed to fetch team', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  return (
    <section className="py-24 relative z-10 border-t border-black/10">
      <motion.div
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: '-100px' }}
        className="w-full"
      >
        <motion.div variants={fadeInUp} className="flex items-center gap-4 mb-8">
          <div className="w-12 h-[2px] bg-gray-900" />
          <span className="text-sm font-bold tracking-widest uppercase">Our Team</span>
        </motion.div>

        <motion.div
          variants={fadeInUp}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8"
        >
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-950">
            Meet The Executives
          </h2>
          <Link
            href="/members"
            className="hidden md:inline-flex items-center gap-2 text-lg font-bold border-b border-black pb-0.5 hover:opacity-70 transition-opacity"
          >
            Meet Our Team <ArrowUpRight className="w-5 h-5" />
          </Link>
        </motion.div>

        {/* Grid Container */}
        <div className="max-w-7xl mx-auto px-8 md:px-12">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-[350px] bg-gray-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : members.length === 0 ? (
            <div className="w-full flex justify-center items-center py-12">
              <div className="w-full md:w-2/3 lg:w-1/2 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Team Coming Soon</h3>
                <p className="text-gray-500 max-w-sm mx-auto">
                  We are currently finalizing our executive team. Check back soon for updates!
                </p>
              </div>
            </div>
          ) : (
            <motion.div
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8"
            >
              {members.map((member) => (
                <motion.div
                  key={member.id}
                  variants={fadeInUp}
                  className="group relative bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="h-[300px] w-full relative bg-gray-100 overflow-hidden">
                    {member.imageUrl ? (
                      <Image
                        src={member.imageUrl}
                        alt={member.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No Image
                      </div>
                    )}

                    {/* Social Overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      {member.linkedinUrl && (
                        <a
                          href={member.linkedinUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-white rounded-full hover:bg-blue-600 hover:text-white transition-colors"
                        >
                          <Linkedin className="w-5 h-5" />
                        </a>
                      )}
                      {member.githubUrl && (
                        <a
                          href={member.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-white rounded-full hover:bg-gray-800 hover:text-white transition-colors"
                        >
                          <Github className="w-5 h-5" />
                        </a>
                      )}
                      {member.twitterUrl && (
                        <a
                          href={member.twitterUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-white rounded-full hover:bg-sky-500 hover:text-white transition-colors"
                        >
                          <Twitter className="w-5 h-5" />
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                    <p className="text-primary font-medium text-sm">{member.designation}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </motion.div>
    </section>
  );
}
