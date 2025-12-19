'use client';

import { useState } from 'react';

type Props = {
  years: number[];
  onChange: (year: number | 'ALL') => void;
};

export default function MemberFilters({ years, onChange }: Props) {
  const [active, setActive] = useState<number | 'ALL'>('ALL');

  const handleClick = (value: number | 'ALL') => {
    setActive(value);
    onChange(value);
  };

  return (
    <div className="w-full flex justify-center mb-14">
      <div className="flex flex-wrap justify-center gap-3">
        <FilterButton
          label="All Batches"
          active={active === 'ALL'}
          onClick={() => handleClick('ALL')}
        />

        {years.map((year) => (
          <FilterButton
            key={year}
            label={`Batch ${year}`}
            active={active === year}
            onClick={() => handleClick(year)}
          />
        ))}
      </div>
    </div>
  );
}

function FilterButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        px-5 py-2.5
        rounded-lg
        border
        text-sm sm:text-base
        font-medium
        transition ease
        cursor-pointer
        ${
          active
            ? 'border-blue-500 bg-blue-50 text-blue-600'
            : 'border-gray-300 text-gray-600 hover:bg-gray-100'
        }
      `}
    >
      {label}
    </button>
  );
}
