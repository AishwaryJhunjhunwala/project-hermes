'use client';

import { useMemo, useState } from 'react';
import MembersHeader from './MembersHeader';
import MembersSection from './MembersSection';
import MemberFilters from './MemberFilters';
import { LandingBackground } from '@/components/landing/background';
import type { Member } from '@/types/member';

export default function MembersClient({ members, years }: { members: Member[]; years: number[] }) {
  const [activeYear, setActiveYear] = useState<number | 'ALL'>('ALL');

  const filteredMembers = useMemo(() => {
    if (activeYear === 'ALL') return members;
    return members.filter((m) => m.year === activeYear);
  }, [members, activeYear]);

  const executives = filteredMembers.filter((m) => m.memberType === 'EXECUTIVE');
  const core = filteredMembers.filter((m) => m.memberType === 'CORE');

  return (
    <div className="min-h-screen bg-transparent relative overflow-hidden font-sans selection:bg-black selection:text-white">
      <LandingBackground />
      <div className="px-6 md:px-8 py-20 pt-32 max-w-7xl mx-auto relative z-10">
        <MembersHeader />

        <MemberFilters years={years} onChange={setActiveYear} />

        <MembersSection title="Executive Body" members={executives} />
        <MembersSection title="Core Members" members={core} />
      </div>
    </div>
  );
}
