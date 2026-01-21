'use client';

import { LandingBackground } from '@/components/landing/background';
import { LandingHero } from '@/components/landing/hero';
import { LandingStats } from '@/components/landing/stats';
import { LandingEvents } from '@/components/landing/events';
import { LandingPeoples } from '@/components/landing/peoples';
import { LandingSponsors } from '@/components/landing/sponsors';
import { LandingTeam } from '@/components/landing/team';
import { LandingAbout } from '@/components/landing/about';

export default function Home() {
  return (
    <div className="min-h-screen bg-white relative overflow-hidden font-sans">
      <LandingBackground />

      {/* Main Content */}
      <main className="relative z-10 px-8 md:px-12 pt-12 md:pt-24 min-h-[calc(100vh-120px)] flex flex-col justify-between">
        <section className="w-full min-h-screen flex flex-col justify-center">
          <LandingHero />
          <LandingStats />
        </section>
        <LandingAbout />
        <LandingPeoples />

        <LandingEvents />
        <LandingSponsors />
        <LandingTeam />
      </main>
    </div>
  );
}
