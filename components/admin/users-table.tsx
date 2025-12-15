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
import { UserWithRoles } from '@/app/actions/admin/users';
import { banUser, unbanUser, assignRole, removeRole } from '@/app/actions/admin';
import type { Role } from '@/types/auth';
import { toast } from 'sonner';
import { MoreHorizontal, Ban, CheckCircle, UserPlus, UserMinus } from 'lucide-react';

interface UsersTableProps {
  data: UserWithRoles[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

// Suppress React Compiler optimization for this component due to TanStack Table's API
export function UsersTable({
  data,
  totalCount,
  currentPage,
  totalPages,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: UsersTableProps) {
  const [banDialogOpen, setBanDialogOpen] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState<UserWithRoles | null>(null);
  const [actionType, setActionType] = React.useState<'ban' | 'unban'>('ban');

  const handleBanAction = async () => {
    if (!selectedUser) return;

    const result =
      actionType === 'ban' ? await banUser(selectedUser.id) : await unbanUser(selectedUser.id);

    if (result.success) {
      toast.success(
        actionType === 'ban' ? 'User banned successfully' : 'User unbanned successfully'
      );
    } else {
      toast.error(result.error || 'Failed to perform action');
    }

    setBanDialogOpen(false);
    setSelectedUser(null);
  };

  const handleAssignRole = async (userId: number, role: Role) => {
    const result = await assignRole(userId, role);

    if (result.success) {
      toast.success(`Role "${role}" assigned successfully`);
    } else {
      toast.error(result.error || 'Failed to assign role');
    }
  };

  const handleRemoveRole = async (userId: number, role: Role) => {
    const result = await removeRole(userId, role);

    if (result.success) {
      toast.success(`Role "${role}" removed successfully`);
    } else {
      toast.error(result.error || 'Failed to remove role');
    }
  };

  const columns: ColumnDef<UserWithRoles>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
    },
    {
      accessorKey: 'email',
      header: 'Email',
    },
    {
      accessorKey: 'roles',
      header: 'Roles',
      cell: ({ row }) => {
        const roles = row.original.roles;
        return (
          <div className="flex flex-wrap gap-1">
            {roles.map((userRole) => (
              <Badge key={userRole.id} variant="secondary" className="capitalize">
                {userRole.role.replace('_', ' ')}
              </Badge>
            ))}
          </div>
        );
      },
    },
    {
      accessorKey: 'isBanned',
      header: 'Status',
      cell: ({ row }) => {
        const isBanned = row.original.isBanned;
        return (
          <Badge variant={isBanned ? 'destructive' : 'default'}>
            {isBanned ? 'Banned' : 'Active'}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'createdAt',
      header: 'Joined',
      cell: ({ row }) => {
        return new Date(row.original.createdAt).toLocaleDateString();
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const user = row.original;
        const userRoles = user.roles.map((r) => r.role);
        const availableRoles: Role[] = ['admin', 'investor', 'startup', 'normal_user'];
        const rolesToAssign = availableRoles.filter((role) => !userRoles.includes(role));

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {user.isBanned ? (
                <DropdownMenuItem
                  onClick={() => {
                    setSelectedUser(user);
                    setActionType('unban');
                    setBanDialogOpen(true);
                  }}
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Unban User
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  onClick={() => {
                    setSelectedUser(user);
                    setActionType('ban');
                    setBanDialogOpen(true);
                  }}
                >
                  <Ban className="mr-2 h-4 w-4" />
                  Ban User
                </DropdownMenuItem>
              )}

              {rolesToAssign.length > 0 && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Assign Role
                    </DropdownMenuItem>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent side="left">
                    {rolesToAssign.map((role) => (
                      <DropdownMenuItem key={role} onClick={() => handleAssignRole(user.id, role)}>
                        {role.replace('_', ' ').charAt(0).toUpperCase() +
                          role.replace('_', ' ').slice(1)}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              {user.roles.length > 0 && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                      <UserMinus className="mr-2 h-4 w-4" />
                      Remove Role
                    </DropdownMenuItem>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent side="left">
                    {user.roles.map((userRole) => (
                      <DropdownMenuItem
                        key={userRole.id}
                        onClick={() => handleRemoveRole(user.id, userRole.role)}
                      >
                        {userRole.role.replace('_', ' ').charAt(0).toUpperCase() +
                          userRole.role.replace('_', ' ').slice(1)}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
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
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
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
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between px-2 py-4">
        <div className="text-sm text-muted-foreground">
          Showing {(currentPage - 1) * pageSize + 1} to{' '}
          {Math.min(currentPage * pageSize, totalCount)} of {totalCount} users
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

      <AlertDialog open={banDialogOpen} onOpenChange={setBanDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{actionType === 'ban' ? 'Ban User' : 'Unban User'}</AlertDialogTitle>
            <AlertDialogDescription>
              {actionType === 'ban'
                ? `Are you sure you want to ban ${selectedUser?.name}? They will not be able to sign in.`
                : `Are you sure you want to unban ${selectedUser?.name}? They will be able to sign in again.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleBanAction}>
              {actionType === 'ban' ? 'Ban' : 'Unban'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
