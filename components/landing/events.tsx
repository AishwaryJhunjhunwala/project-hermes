'use client';

import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, Clock, MapPin, ArrowUpRight, Link as LinkIcon } from 'lucide-react';
import Link from 'next/link';
import { getLatestEvents } from '@/app/actions/public/events';

interface Event {
  id: number;
  name: string;
  description: string;
  date: string;
  time: string;
  mode: 'online' | 'offline';
  location: string | null;
  link: string | null;
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

export function LandingEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const result = await getLatestEvents();
        if (result.success && result.events) {
          // Cast the result to Event[] as the DB type might slightly differ in strictness (e.g. string vs specific enum)
          // but for display purposes it's fine.
          setEvents(result.events as unknown as Event[]);
        }
      } catch (error) {
        console.error('Failed to fetch events', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
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
          <span className="text-sm font-bold tracking-widest uppercase">Latest Events</span>
        </motion.div>

        <motion.div variants={fadeInUp} className="flex justify-between items-end mb-8">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-950">
            Upcoming & Recent Events
          </h2>
          <Link
            href="/events"
            className="hidden md:inline-flex items-center gap-2 text-lg font-bold border-b border-black pb-0.5 hover:opacity-70 transition-opacity"
          >
            View All Events <ArrowUpRight className="w-5 h-5" />
          </Link>
        </motion.div>

        {/* Carousel Container */}
        <motion.div
          variants={fadeInUp}
          className="flex gap-6 overflow-x-auto pb-8 -mx-8 px-8 md:mx-0 md:px-0 snap-x hide-scroll"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {loading ? (
            // Loading Skeletons
            Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="min-w-[300px] md:min-w-[400px] h-[300px] bg-gray-100 rounded-xl animate-pulse"
              />
            ))
          ) : events.length === 0 ? (
            // Empty State
            <div className="w-full flex justify-center items-center py-12 md:px-0 min-w-full">
              <div className="w-full md:w-2/3 lg:w-1/2 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Calendar className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">No Upcoming Events</h3>
                <p className="text-gray-500 max-w-sm mx-auto">
                  We&apos;re currently planning something exciting! Check back soon or follow us on
                  social media for updates.
                </p>
              </div>
            </div>
          ) : (
            events.map((event) => (
              <div
                key={event.id}
                className="group relative min-w-[300px] md:min-w-[380px] bg-white border border-gray-200 rounded-xl p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 snap-start flex flex-col justify-between h-auto min-h-[320px]"
              >
                <div>
                  <div className="flex items-center gap-3 text-sm font-medium text-gray-500 mb-6">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      {event.date}
                    </span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full" />
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      {event.time}
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-4 line-clamp-2 leading-tight">
                    {event.name}
                  </h3>

                  <p className="text-gray-600 line-clamp-3 mb-6 leading-relaxed">
                    {event.description}
                  </p>
                </div>

                <div className="pt-6 border-t border-gray-100 flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                    {event.mode === 'offline' ? (
                      <>
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <span className="truncate max-w-[150px]">{event.location || 'TBA'}</span>
                      </>
                    ) : (
                      <>
                        <LinkIcon className="w-4 h-4 text-gray-500" />
                        <span>Online</span>
                      </>
                    )}
                  </div>

                  {/* Link overlay for entire card or button? Using button style for clarity */}
                  {(event.link || event.location) && (
                    <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity -mr-2">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  )}
                </div>
                {/* Make entire card clickable if link exists */}
                {event.mode === 'online' && event.link && (
                  <a
                    href={event.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute inset-0 z-10"
                    aria-label={`Go to event ${event.name}`}
                  />
                )}
              </div>
            ))
          )}
        </motion.div>

        <div className="mt-8 md:hidden flex justify-center">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 text-lg font-bold border-b border-black pb-0.5"
          >
            View All Events <ArrowUpRight className="w-5 h-5" />
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
