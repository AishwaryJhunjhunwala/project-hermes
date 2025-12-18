import MemberCard from './MembersCard';
import type { Member } from '@/types/member';

export default function MembersSection({ title, members }: { title: string; members: Member[] }) {
  if (!members.length) return null;

  return (
    <section className="mb-28">
      <h2 className="text-3xl xl:text-4xl font-semibold mb-14 text-center">{title}</h2>

      <div
        className="
          grid 
          grid-cols-1 
          sm:grid-cols-2 
          lg:grid-cols-3 
          xl:grid-cols-4 
          gap-10
          justify-items-center
        "
      >
        {members.map((m) => (
          <div key={m.id} className="w-full max-w-[320px]">
            <MemberCard member={m} />
          </div>
        ))}
      </div>
    </section>
  );
}
