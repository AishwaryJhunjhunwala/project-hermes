import type { Member } from '@/types/member';
import MemberCard from './MembersCard';

export default function MembersSection({ title, members }: { title: string; members: Member[] }) {
  if (!members.length) return null;

  return (
    <section className="mb-28">
      <div className="flex items-center gap-6 mb-14">
        <div className="flex-1 h-px bg-gray-300" />
        <h2 className="text-2xl sm:text-4xl font-semibold text-blue-600">{title}</h2>
        <div className="flex-1 h-px bg-gray-300" />
      </div>

      <div className="flex justify-center">
        <div
          className="
            grid
            gap-8
            grid-cols-[repeat(auto-fit,260px)]
            w-fit
            max-w-full
          "
        >
          {members.map((m: Member) => (
            <div key={m.id} className="w-full max-w-[320px]">
              <MemberCard member={m} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
