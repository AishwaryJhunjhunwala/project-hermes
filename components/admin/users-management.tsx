'use client';

import { useEffect, useState } from 'react';
import { UsersTable } from './users-table';
import { UsersTableFilters } from './users-table-filters';
import { getAllUsers, type GetUsersResponse } from '@/app/actions/admin';
import { useDebounce } from '@/hooks/use-debounce';
import { Skeleton } from '@/components/ui/skeleton';

export function UsersManagement() {
  const [data, setData] = useState<GetUsersResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    async function fetchUsers() {
      setIsLoading(true);
      const result = await getAllUsers({
        page,
        pageSize,
        search: debouncedSearch,
        statusFilter: status as 'banned' | 'active' | 'all',
      });
      setData(result);
      setIsLoading(false);
    }

    void fetchUsers();
  }, [page, pageSize, debouncedSearch, status]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleStatusChange = (value: string) => {
    setStatus(value);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setPage(1);
  };

  if (isLoading || !data) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <UsersTableFilters
        search={search}
        status={status}
        onSearchChange={handleSearchChange}
        onStatusChange={handleStatusChange}
      />

      <UsersTable
        data={data.users}
        totalCount={data.totalCount}
        currentPage={data.currentPage}
        totalPages={data.totalPages}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />
    </div>
  );
}
