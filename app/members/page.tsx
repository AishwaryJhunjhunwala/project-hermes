import { getMembers, getAvailableYears } from '@/app/actions/members';
import MembersClient from '@/components/members/MembersClient';

export default async function MembersPage() {
  const members = await getMembers();
  const years = await getAvailableYears();

  return <MembersClient members={members} years={years} />;
}
