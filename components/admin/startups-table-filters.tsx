'use client';

import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface StartupsTableFiltersProps {
  search: string;
  status: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
}

export function StartupsTableFilters({
  search,
  status,
  onSearchChange,
  onStatusChange,
}: StartupsTableFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-4">
      <div className="flex-1">
        <Input
          placeholder="Search by startup name, founder, or email..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="max-w-md"
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
