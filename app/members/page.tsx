import { getMembers, getAvailableYears } from '@/app/actions/members';
import MembersHeader from '@/components/members/MembersHeader';
import MembersSection from '@/components/members/MembersSection';
import YearFilter from '@/components/members/YearFilters';

type MembersPageProps = { searchParams?: { year?: string } };

export default async function MembersPage({ searchParams = {} }: MembersPageProps) {
  const year = searchParams?.year ? Number(searchParams.year) : null;

  const members = await getMembers(year);
  const years = await getAvailableYears();

  const executives = members.filter((m) => m.memberType === 'EXECUTIVE');
  const core = members.filter((m) => m.memberType === 'CORE');

  return (
    <div className="px-6 py-16 max-w-7xl mx-auto">
      <MembersHeader />
      <YearFilter years={years} />
      <MembersSection title="Executive Body" members={executives} />
      <MembersSection title="Core Members" members={core} />
    </div>
  );
}
