'use client';

import { useState } from 'react';
import { InvestorsTable } from './investors-table';
import { InvestorsTableFilters } from './investors-table-filters';
import type { ApplicationStatus } from '@/types/investor';

export function InvestorsManagement() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<ApplicationStatus | 'all'>('all');

  return (
    <div className="space-y-4">
      <InvestorsTableFilters
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={setStatus}
      />
      <InvestorsTable
        page={page}
        pageSize={pageSize}
        search={search}
        status={status === 'all' ? undefined : status}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        excludePending={true}
      />
    </div>
  );
}
