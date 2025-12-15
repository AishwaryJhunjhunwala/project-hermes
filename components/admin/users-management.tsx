'use client';

import { useEffect, useState } from 'react';
import { UsersTable } from './users-table';
import { UsersTableFilters } from './users-table-filters';
import { getAllUsers, type GetUsersResponse } from '@/app/actions/admin';
import { useTableParams } from '@/hooks/use-table-params';
import { useDebounce } from '@/hooks/use-debounce';
import { Skeleton } from '@/components/ui/skeleton';

export function UsersManagement() {
  const { page, pageSize, search, status, updateParams, isPending } = useTableParams();
  const [data, setData] = useState<GetUsersResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
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

    fetchUsers();
  }, [page, pageSize, debouncedSearch, status]);

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
        onSearchChange={(value) => updateParams({ search: value, page: 1 })}
        onStatusChange={(value) => updateParams({ status: value, page: 1 })}
      />

      {isPending ? (
        <Skeleton className="h-64 w-full" />
      ) : (
        <UsersTable
          data={data.users}
          totalCount={data.totalCount}
          currentPage={data.currentPage}
          totalPages={data.totalPages}
          pageSize={pageSize}
          onPageChange={(page) => updateParams({ page })}
          onPageSizeChange={(pageSize) => updateParams({ pageSize, page: 1 })}
        />
      )}
    </div>
  );
}
