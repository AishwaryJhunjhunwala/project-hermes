'use client';

import { useState, useEffect } from 'react';
import { StartupsTable } from './startups-table';
import { StartupsTableFilters } from './startups-table-filters';
import { getAllStartupApplications } from '@/app/actions/admin/startups';
import { useDebounce } from '@/hooks/use-debounce';
import { Skeleton } from '@/components/ui/skeleton';
import type { ApplicationStatus, Startup } from '@/types/startup';

interface StartupWithUser extends Startup {
  user?: {
    id: number;
    email: string;
    name: string;
  };
}

export function StartupsManagement() {
  const [startups, setStartups] = useState<StartupWithUser[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    const fetchStartups = async () => {
      setIsLoading(true);
      const result = await getAllStartupApplications({
        page: currentPage,
        pageSize,
        search: debouncedSearch,
        statusFilter: status as ApplicationStatus | 'all',
        excludePending: true, // Exclude pending applications from Manage Startups tab
      });

      if (result.success) {
        setStartups(result.startups);
        setTotalCount(result.totalCount);
        setTotalPages(result.totalPages);
        setCurrentPage(result.currentPage);
      }
      setIsLoading(false);
    };

    void fetchStartups();
  }, [currentPage, pageSize, debouncedSearch, status]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleStatusChange = (value: string) => {
    setStatus(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Startup Applications</h2>
        <p className="text-sm text-gray-600">
          Review and manage startup applications submitted by users
        </p>
      </div>

      <StartupsTableFilters
        search={search}
        status={status}
        onSearchChange={handleSearchChange}
        onStatusChange={handleStatusChange}
      />

      {isLoading ? (
        <div className="space-y-4 mt-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      ) : (
        <StartupsTable
          data={startups}
          totalCount={totalCount}
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      )}
    </div>
  );
}
