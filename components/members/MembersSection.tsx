import type { Member } from '@/types/member';
import MemberCard from './MembersCard';

export default function MembersSection({ title, members }: { title: string; members: Member[] }) {
  if (!members.length) return null;

  return (
    <section className="mb-28">
      <div className="flex items-center gap-4 mb-10">
        <div className="p-2 bg-black rounded-lg">
          <div className="w-4 h-4 rounded-full bg-white border-2 border-black" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
      </div>

      <div className="flex justify-center">
        <div
          className="
            grid
            grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
            gap-8
            w-full
          "
        >
          {members.map((m: Member) => (
            <div key={m.id} className="w-full">
              <MemberCard member={m} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
