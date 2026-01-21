'use client';

import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Linkedin, Building2, User } from 'lucide-react';
import Image from 'next/image';
import { getFeaturedSpeakers, getFeaturedInvestors } from '@/app/actions/public/peoples';

interface Person {
  id: number;
  name: string;
  designation?: string;
  company?: string; // For speakers
  investorType?: string; // For investors
  imageUrl?: string;
  linkedinUrl?: string | null;
  type: 'Speaker' | 'Investor';
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

export function LandingPeoples() {
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [speakersRes, investorsRes] = await Promise.all([
          getFeaturedSpeakers(),
          getFeaturedInvestors(),
        ]);

        let allPeople: Person[] = [];

        if (speakersRes.success && speakersRes.data) {
          const mappedSpeakers = speakersRes.data.map((s) => ({ ...s, type: 'Speaker' as const }));
          allPeople = [...allPeople, ...(mappedSpeakers as unknown as Person[])];
        }

        if (investorsRes.success && investorsRes.data) {
          const mappedInvestors = investorsRes.data.map((inv) => ({
            ...inv,
            company: inv.investorType,
            designation: 'Investor',
            imageUrl: '',
            type: 'Investor' as const,
          }));
          allPeople = [...allPeople, ...(mappedInvestors as unknown as Person[])];
        }

        setPeople(allPeople);
      } catch (error) {
        console.error('Failed to fetch people', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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
          <span className="text-sm font-bold tracking-widest uppercase">Community</span>
        </motion.div>

        <motion.div
          variants={fadeInUp}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8"
        >
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-950">
            Meet Our Network
          </h2>
        </motion.div>

        {/* Carousel Container */}
        <div className="relative min-h-[400px]">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex gap-6 overflow-x-auto pb-8 -mx-8 px-8 md:mx-0 md:px-0 snap-x hide-scroll"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="min-w-[280px] md:min-w-[320px] h-[400px] bg-gray-100 rounded-xl animate-pulse"
                />
              ))
            ) : people.length === 0 ? (
              <div className="w-full flex justify-center items-center py-12 min-w-full">
                <div className="text-center p-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                  <h4 className="text-xl font-bold text-gray-900 mb-2">Coming Soon</h4>
                  <p className="text-gray-500">We are updating our network list.</p>
                </div>
              </div>
            ) : (
              people.map((person) => (
                <div
                  key={`${person.type}-${person.id}`}
                  className="group relative min-w-[280px] md:min-w-[320px] bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 snap-start"
                >
                  {/* Image Placeholder or Real Image */}
                  <div className="h-[240px] bg-gray-100 relative overflow-hidden">
                    {person.imageUrl ? (
                      <Image
                        src={person.imageUrl}
                        alt={person.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-300">
                        <User className="w-20 h-20" />
                      </div>
                    )}

                    {/* Overlay Content on Hover */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      {person.linkedinUrl && (
                        <a
                          href={person.linkedinUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-3 bg-white rounded-full hover:bg-blue-600 hover:text-white transition-colors"
                        >
                          <Linkedin className="w-5 h-5" />
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="text-xl font-bold text-gray-900">{person.name}</h3>
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-gray-100 px-2 py-1 rounded-sm text-gray-600">
                        {person.type}
                      </span>
                    </div>
                    <p className="text-blue-600 font-medium text-sm mb-4">{person.designation}</p>

                    <div className="flex items-center gap-2 text-gray-500 text-sm border-t border-gray-100 pt-4">
                      <Building2 className="w-4 h-4" />
                      <span className="truncate">{person.company}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
