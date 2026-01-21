'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, Video, ArrowLeft, ArrowUpRight, MonitorPlay } from 'lucide-react';
import { LandingBackground } from '@/components/landing/background';

// Define Session Type locally or import if available
type Session = {
  id: number;
  name: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  mode: 'online' | 'offline';
  link: string | null;
};

export default function SessionsContent({
  upcomingSessions,
  pastSessions,
}: {
  upcomingSessions: Session[];
  pastSessions: Session[];
}) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

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

  return (
    <div className="min-h-screen bg-transparent relative overflow-hidden font-sans selection:bg-black selection:text-white">
      <LandingBackground />

      <motion.div
        className="container mx-auto px-4 md:px-8 py-12 pt-32 relative z-10 max-w-7xl"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        {/* Header */}
        <motion.div variants={fadeInUp} className="mb-12">
          <Link href="/">
            <Button variant="ghost" className="gap-2 mb-6 hover:bg-black/5 rounded-full px-4 -ml-4">
              <ArrowLeft className="h-4 w-4" /> Back to Home
            </Button>
          </Link>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-[2px] bg-black" />
            <span className="text-sm font-bold tracking-widest uppercase">Learning</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-black mb-6">
            Learning Sessions
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl leading-relaxed">
            Deep dive into technical topics with our expert-led sessions and hands-on workshops.
          </p>
        </motion.div>

        {/* Upcoming Sessions */}
        <section className="mb-24">
          <motion.div variants={fadeInUp} className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-black rounded-lg">
              <MonitorPlay className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Upcoming Sessions</h2>
          </motion.div>

          {upcomingSessions.length === 0 ? (
            <motion.div variants={fadeInUp}>
              <div className="bg-white/40 backdrop-blur-md border border-white/50 rounded-3xl p-16 text-center">
                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-6 transform -rotate-3">
                  <MonitorPlay className="h-8 w-8 text-gray-300" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No upcoming sessions</h3>
                <p className="text-gray-500 max-w-sm mx-auto">
                  We don&apos;t have any upcoming sessions scheduled at the moment. Stay tuned!
                </p>
              </div>
            </motion.div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {upcomingSessions.map((session) => (
                <motion.div
                  key={session.id}
                  variants={fadeInUp}
                  whileHover={{ y: -8 }}
                  className="h-full"
                >
                  <div className="group h-full bg-white rounded-3xl p-1 shadow-[0_2px_10px_-2px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] transition-all duration-500 border border-gray-100">
                    <div className="bg-gray-50/50 rounded-[20px] p-8 h-full flex flex-col relative overflow-hidden group-hover:bg-white transition-colors duration-500">
                      {/* Badge & Type */}
                      <div className="flex justify-between items-start mb-6">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
                          Upcoming
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-white border border-gray-200 text-gray-700">
                          {session.mode === 'online' ? (
                            <Video className="h-3 w-3" />
                          ) : (
                            <MapPin className="h-3 w-3" />
                          )}
                          {session.mode === 'online' ? 'Online' : 'Offline'}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="flex-1 mb-8">
                        <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                          {session.name}
                        </h3>

                        <div className="space-y-3">
                          <div className="flex items-center gap-3 text-sm font-medium text-gray-700">
                            <div className="p-1.5 bg-white rounded-md shadow-sm">
                              <Calendar className="h-3.5 w-3.5" />
                            </div>
                            {formatDate(session.date)}
                          </div>
                          <div className="flex items-center gap-3 text-sm font-medium text-gray-700">
                            <div className="p-1.5 bg-white rounded-md shadow-sm">
                              <Clock className="h-3.5 w-3.5" />
                            </div>
                            {session.startTime} - {session.endTime}
                          </div>
                          {session.location && (
                            <div className="flex items-center gap-3 text-sm font-medium text-gray-700">
                              <div className="p-1.5 bg-white rounded-md shadow-sm">
                                <MapPin className="h-3.5 w-3.5" />
                              </div>
                              {session.location}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Footer Action */}
                      <div className="pt-6 border-t border-gray-200/60 mt-auto">
                        {session.mode === 'online' && session.link ? (
                          <a
                            href={session.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-between w-full p-3 rounded-xl bg-black text-white font-medium hover:bg-gray-800 transition-all group/btn"
                          >
                            <span>Join Session</span>
                            <ArrowUpRight className="h-4 w-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                          </a>
                        ) : (
                          <div className="inline-flex items-center justify-between w-full p-3 rounded-xl bg-white border border-gray-200 text-gray-400 font-medium cursor-not-allowed">
                            <span>Registration Closed</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </section>

        {/* Past Sessions */}
        <section>
          <motion.div variants={fadeInUp} className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Clock className="h-5 w-5 text-gray-500" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Past Sessions</h2>
          </motion.div>

          {pastSessions.length === 0 ? (
            <motion.div variants={fadeInUp}>
              <div className="bg-white/40 backdrop-blur-md border border-white/50 rounded-3xl p-12 text-center">
                <p className="text-gray-500">No past sessions to display.</p>
              </div>
            </motion.div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {pastSessions.map((session) => (
                <motion.div
                  key={session.id}
                  variants={fadeInUp}
                  className="h-full opacity-80 hover:opacity-100 transition-opacity"
                >
                  <div className="h-full bg-white/60 rounded-3xl p-1 border border-black/5">
                    <div className="bg-white/50 rounded-[20px] p-6 h-full flex flex-col">
                      {/* Header */}
                      <div className="flex justify-between items-start mb-4">
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded uppercase tracking-wider">
                          Past
                        </span>
                        <span className="text-xs font-medium text-gray-500 flex items-center gap-1">
                          {session.mode === 'online' ? (
                            <Video className="h-3 w-3" />
                          ) : (
                            <MapPin className="h-3 w-3" />
                          )}
                          {session.mode === 'online' ? 'Online' : 'Offline'}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-gray-800 mb-2">{session.name}</h3>

                      <div className="mt-auto space-y-2 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3.5 w-3.5" /> {formatDate(session.date)}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </section>
      </motion.div>
    </div>
  );
}
