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
        px-6 py-3
        rounded-xl
        border
        text-sm font-semibold
        transition-all duration-300
        cursor-pointer
        shadow-sm
        ${
          active
            ? 'border-black bg-black text-white hover:bg-gray-800'
            : 'border-white/50 bg-white/50 backdrop-blur-md text-gray-600 hover:bg-white hover:text-black hover:border-gray-200'
        }
      `}
    >
      {label}
    </button>
  );
}
