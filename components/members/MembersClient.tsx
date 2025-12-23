'use client';

import { useMemo, useState } from 'react';
import MembersHeader from './MembersHeader';
import MembersSection from './MembersSection';
import MemberFilters from './MemberFilters';
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
    <div className="px-6 py-20 max-w-7xl mx-auto">
      <MembersHeader />

      <MemberFilters years={years} onChange={setActiveYear} />

      <MembersSection title="Executive Body" members={executives} />
      <MembersSection title="Core Members" members={core} />
    </div>
  );
}
