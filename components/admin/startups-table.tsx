'use client';

import * as React from 'react';
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  approveStartupApplication,
  rejectStartupApplication,
  banStartupApplication,
} from '@/app/actions/admin/startups';
import { toast } from 'sonner';
import { MoreHorizontal, CheckCircle, X, Ban } from 'lucide-react';
import type { Startup } from '@/types/startup';

interface StartupWithUser extends Startup {
  user?: {
    id: number;
    email: string;
    name: string;
  };
}

interface StartupsTableProps {
  data: StartupWithUser[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

export function StartupsTable({
  data,
  totalCount,
  currentPage,
  totalPages,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: StartupsTableProps) {
  const [actionDialogOpen, setActionDialogOpen] = React.useState(false);
  const [selectedStartup, setSelectedStartup] = React.useState<StartupWithUser | null>(null);
  const [actionType, setActionType] = React.useState<'approve' | 'reject' | 'ban'>('approve');
  const [reason, setReason] = React.useState('');

  const handleAction = async () => {
    if (!selectedStartup) return;

    let result;
    if (actionType === 'approve') {
      result = await approveStartupApplication(selectedStartup.id);
    } else if (actionType === 'reject') {
      if (!reason.trim()) {
        toast.error('Please provide a rejection reason');
        return;
      }
      result = await rejectStartupApplication(selectedStartup.id, reason);
    } else {
      if (!reason.trim()) {
        toast.error('Please provide a reason for banning');
        return;
      }
      result = await banStartupApplication(selectedStartup.id, reason);
    }

    if (result.success) {
      toast.success(
        `Application ${actionType === 'approve' ? 'approved' : actionType === 'reject' ? 'rejected' : 'banned'} successfully`
      );
    } else {
      toast.error(result.error || 'Failed to perform action');
    }

    setActionDialogOpen(false);
    setSelectedStartup(null);
    setReason('');
  };

  const columns: ColumnDef<StartupWithUser>[] = [
    {
      accessorKey: 'startupName',
      header: 'Startup Name',
    },
    {
      accessorKey: 'founderName',
      header: 'Founder',
    },
    {
      accessorKey: 'user.email',
      header: 'User Email',
      cell: ({ row }) => row.original.user?.email || 'N/A',
    },
    {
      accessorKey: 'businessStage',
      header: 'Stage',
      cell: ({ row }) => (
        <span className="capitalize">{row.original.businessStage.replace('_', ' ')}</span>
      ),
    },
    {
      accessorKey: 'applicationStatus',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.original.applicationStatus;
        return (
          <Badge
            variant={
              status === 'approved' ? 'default' : status === 'pending' ? 'secondary' : 'destructive'
            }
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'createdAt',
      header: 'Applied On',
      cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const startup = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {startup.applicationStatus === 'pending' && (
                <>
                  <DropdownMenuItem
                    onClick={() => {
                      setSelectedStartup(startup);
                      setActionType('approve');
                      setActionDialogOpen(true);
                    }}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Approve
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setSelectedStartup(startup);
                      setActionType('reject');
                      setActionDialogOpen(true);
                    }}
                  >
                    <X className="mr-2 h-4 w-4" />
                    Reject
                  </DropdownMenuItem>
                </>
              )}
              {startup.applicationStatus !== 'banned' && (
                <DropdownMenuItem
                  onClick={() => {
                    setSelectedStartup(startup);
                    setActionType('ban');
                    setActionDialogOpen(true);
                  }}
                >
                  <Ban className="mr-2 h-4 w-4" />
                  Ban
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: totalPages,
  });

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No startup applications found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between px-2 py-4">
        <div className="text-sm text-muted-foreground">
          Showing {(currentPage - 1) * pageSize + 1} to{' '}
          {Math.min(currentPage * pageSize, totalCount)} of {totalCount} applications
        </div>
        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Rows per page</p>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="h-8 w-[70px] rounded-md border border-input bg-background"
            >
              {[10, 20, 50, 100].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <div className="text-sm font-medium">
              Page {currentPage} of {totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      <AlertDialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {actionType === 'approve' ? 'Approve' : actionType === 'reject' ? 'Reject' : 'Ban'}{' '}
              Application
            </AlertDialogTitle>
            <AlertDialogDescription>
              {actionType === 'approve'
                ? `Are you sure you want to approve ${selectedStartup?.startupName}? The startup will be approved and visible on the platform.`
                : actionType === 'reject'
                  ? `Rejecting ${selectedStartup?.startupName}. Please provide a reason for rejection.`
                  : `Banning ${selectedStartup?.startupName}. Please provide a reason for banning.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          {actionType !== 'approve' && (
            <div className="px-6 pb-2">
              <Label htmlFor="reason">Reason</Label>
              <Input
                id="reason"
                placeholder="Enter reason..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="mt-2"
              />
            </div>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setReason('')}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleAction}>
              {actionType === 'approve' ? 'Approve' : actionType === 'reject' ? 'Reject' : 'Ban'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
