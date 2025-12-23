'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Props {
  search: string;
  year: number | null;
  memberType: 'all' | 'EXECUTIVE' | 'CORE';
  onSearchChange: (v: string) => void;
  onYearChange: (y: number | null) => void;
  onMemberTypeChange: (t: 'all' | 'EXECUTIVE' | 'CORE') => void;
}

export function MembersTableFilters({
  search,
  year,
  memberType,
  onSearchChange,
  onYearChange,
  onMemberTypeChange,
}: Props) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
      <div className="flex gap-2 w-full sm:w-auto">
        <div className="w-full">
          <Label className="sr-only">Search</Label>
          <Input
            placeholder="Search by name"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      <div className="flex gap-2 items-center">
        <div>
          <Label className="sr-only">Year</Label>
          <Input
            placeholder="Year (e.g., 2025)"
            value={year ?? ''}
            onChange={(e) => onYearChange(e.target.value ? Number(e.target.value) : null)}
          />
        </div>

        <div className="w-40">
          <Label className="sr-only">Type</Label>
          <Select
            value={memberType}
            onValueChange={(v: 'all' | 'EXECUTIVE' | 'CORE') => onMemberTypeChange(v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Member type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="EXECUTIVE">EXECUTIVE</SelectItem>
              <SelectItem value="CORE">CORE</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
