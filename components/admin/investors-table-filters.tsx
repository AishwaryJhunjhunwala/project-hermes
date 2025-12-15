'use client';

import { useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search } from 'lucide-react';
import type { ApplicationStatus } from '@/types/investor';

interface InvestorsTableFiltersProps {
  search: string;
  onSearchChange: (search: string) => void;
  status: ApplicationStatus | 'all';
  onStatusChange: (status: ApplicationStatus | 'all') => void;
}

export function InvestorsTableFilters({
  search,
  onSearchChange,
  status,
  onStatusChange,
}: InvestorsTableFiltersProps) {
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  const debouncedSearch = (value: string) => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    debounceTimer.current = setTimeout(() => {
      onSearchChange(value);
    }, 300);
  };

  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  return (
    <div className="flex gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by investor name, city, or state..."
          defaultValue={search}
          onChange={(e) => debouncedSearch(e.target.value)}
          className="pl-9"
        />
      </div>
      <Select value={status} onValueChange={onStatusChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          <SelectItem value="approved">Approved</SelectItem>
          <SelectItem value="rejected">Rejected</SelectItem>
          <SelectItem value="banned">Banned</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
