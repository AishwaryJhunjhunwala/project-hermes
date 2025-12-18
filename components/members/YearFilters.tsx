'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import clsx from 'clsx';

export default function YearFilter({ years }: { years: number[] }) {
  const router = useRouter();
  const params = useSearchParams();
  const activeYear = params.get('year');

  return (
    <div className="flex gap-4 justify-center mb-14 flex-wrap">
      <FilterButton active={!activeYear} onClick={() => router.push('/members')}>
        All
      </FilterButton>

      {years.map((year) => (
        <FilterButton
          key={year}
          active={activeYear === String(year)}
          onClick={() => router.push(`/members?year=${year}`)}
        >
          {year}
        </FilterButton>
      ))}
    </div>
  );
}

function FilterButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        `
        px-7 py-3
        rounded-full
        border
        text-sm sm:text-base
        font-medium
        transition-ease
        cursor-pointer
        `,
        active
          ? 'border-blue-600 text-blue-600 bg-blue-50'
          : 'border-gray-300 text-gray-600 hover:border-blue-400 hover:text-blue-500'
      )}
    >
      {children}
    </button>
  );
}
