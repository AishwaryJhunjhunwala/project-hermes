'use client';

import { useEffect, useState } from 'react';
import { MembersTable } from './members-table';
import { MembersTableFilters } from './members-table-filters';
import { getAllMembers, type GetMembersResponse } from '@/app/actions/admin/members';
import { useDebounce } from '@/hooks/use-debounce';
import { Skeleton } from '@/components/ui/skeleton';

export function MembersManagement() {
  const [data, setData] = useState<GetMembersResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');
  const [year, setYear] = useState<number | null>(null);
  const [memberType, setMemberType] = useState<'all' | 'EXECUTIVE' | 'CORE'>('all');

  const debouncedSearch = useDebounce(search, 300);

  const [fetchTrigger, setFetchTrigger] = useState(0);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      setIsLoading(true);
      try {
        const result = await getAllMembers({
          page,
          pageSize,
          search: debouncedSearch,
          year,
          memberType,
        });
        if (!isMounted) return;
        setData(result);
      } catch (err) {
        console.error('Failed to fetch members', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [page, pageSize, debouncedSearch, year, memberType, fetchTrigger]);

  const fetchMembers = async () => setFetchTrigger((s) => s + 1);

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
      <MembersTableFilters
        search={search}
        year={year}
        memberType={memberType}
        onSearchChange={(v) => {
          setSearch(v);
          setPage(1);
        }}
        onYearChange={(y) => {
          setYear(y);
          setPage(1);
        }}
        onMemberTypeChange={(t) => {
          setMemberType(t);
          setPage(1);
        }}
      />

      <MembersTable
        data={data.members}
        totalCount={data.totalCount}
        currentPage={data.currentPage}
        totalPages={data.totalPages}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        onRefresh={fetchMembers}
      />
    </div>
  );
}
