'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Mail, MapPin, Phone, Send } from 'lucide-react';
import { LandingBackground } from '@/components/landing/background';

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

export default function ContactPage() {
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
            <span className="text-sm font-bold tracking-widest uppercase">Support</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-black mb-6">
            Contact Us
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl leading-relaxed">
            Have questions? We&apos;d love to hear from you. Fill out the form below or reach out
            via our social channels.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Contact Form */}
          <motion.div variants={fadeInUp} className="order-2 lg:order-1">
            <div className="bg-white rounded-3xl p-8 md:p-10 shadow-[0_2px_10px_-2px_rgba(0,0,0,0.05)] border border-gray-100 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Send us a message</h2>
                <p className="text-gray-500">
                  Fill out the form below and we&apos;ll get back to you as soon as possible.
                </p>
              </div>

              <form className="space-y-6 relative z-10">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-semibold text-gray-700">
                      Name
                    </Label>
                    <Input
                      id="name"
                      placeholder="Your full name"
                      required
                      className="h-12 bg-gray-50 border-gray-200 focus:bg-white focus:border-black focus:ring-black/5 rounded-xl transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      required
                      className="h-12 bg-gray-50 border-gray-200 focus:bg-white focus:border-black focus:ring-black/5 rounded-xl transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject" className="text-sm font-semibold text-gray-700">
                    Subject
                  </Label>
                  <Input
                    id="subject"
                    placeholder="What is this regarding?"
                    required
                    className="h-12 bg-gray-50 border-gray-200 focus:bg-white focus:border-black focus:ring-black/5 rounded-xl transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-sm font-semibold text-gray-700">
                    Message
                  </Label>
                  <Textarea
                    id="message"
                    placeholder="Tell us more about your inquiry..."
                    rows={6}
                    required
                    className="bg-gray-50 border-gray-200 focus:bg-white focus:border-black focus:ring-black/5 rounded-xl transition-all resize-none p-4"
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full h-12 bg-black text-white hover:bg-gray-800 rounded-xl gap-2 font-medium text-base group/btn"
                >
                  Send Message
                  <Send className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </form>
            </div>
          </motion.div>

          {/* Contact Information */}
          <motion.div variants={fadeInUp} className="order-1 lg:order-2 space-y-8">
            <div className="space-y-6">
              <div className="flex items-start gap-6 p-6 bg-white/60 backdrop-blur-md rounded-3xl border border-white/50 hover:bg-white hover:shadow-lg transition-all duration-300 group">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-gray-100 group-hover:scale-110 transition-transform duration-300">
                  <Mail className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">Email</h3>
                  <p className="text-gray-600 mb-2">Our friendly team is here to help.</p>
                  <a
                    href="mailto:contact@projecthermes.com"
                    className="text-black font-semibold hover:text-blue-600 transition-colors"
                  >
                    contact@projecthermes.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-6 p-6 bg-white/60 backdrop-blur-md rounded-3xl border border-white/50 hover:bg-white hover:shadow-lg transition-all duration-300 group">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-gray-100 group-hover:scale-110 transition-transform duration-300">
                  <Phone className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">Phone</h3>
                  <p className="text-gray-600 mb-2">Mon-Fri from 9am to 6pm EST.</p>
                  <a
                    href="tel:+15551234567"
                    className="text-black font-semibold hover:text-emerald-600 transition-colors"
                  >
                    +1 (555) 123-4567
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-6 p-6 bg-white/60 backdrop-blur-md rounded-3xl border border-white/50 hover:bg-white hover:shadow-lg transition-all duration-300 group">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-gray-100 group-hover:scale-110 transition-transform duration-300">
                  <MapPin className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">Office</h3>
                  <p className="text-gray-600 mb-2">Come say hello at our office HQ.</p>
                  <p className="text-black font-semibold leading-relaxed">
                    123 Innovation Drive
                    <br />
                    Tech Hub, TH 12345
                  </p>
                </div>
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-linear-to-br from-blue-600 to-purple-600 text-white relative overflow-hidden shadow-xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-3">Looking to join?</h3>
                <p className="text-blue-50 mb-6 max-w-sm">
                  Whether you&apos;re a startup or an investor, we&apos;d love to have you in our
                  community.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link href="/auth/signup" className="flex-1">
                    <Button className="w-full bg-white text-black hover:bg-blue-50 border-0 h-11 rounded-xl font-semibold">
                      Sign Up Now
                    </Button>
                  </Link>
                  <Link href="/startups" className="flex-1">
                    <Button
                      variant="outline"
                      className="w-full bg-transparent border-white/30 text-white hover:bg-white/10 hover:text-white h-11 rounded-xl font-semibold backdrop-blur-sm"
                    >
                      Browse Startups
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
