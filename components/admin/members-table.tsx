'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { deleteMember, getAllMembers } from '@/app/actions/admin/members';
import { Member } from '@/types/member';
import { MemberFormDialog } from './member-form-dialog';

interface Props {
  data: Member[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  onRefresh?: () => Promise<void>;
}

export function MembersTable({
  data,
  totalCount,
  currentPage,
  totalPages,
  pageSize,
  onPageChange,
  onRefresh,
}: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const members = data || [];
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [openForm, setOpenForm] = useState(false);

  // When an action changes the data, ask parent to refresh. Fallback to local fetch if no onRefresh provided.
  const refresh = async () => {
    if (onRefresh) {
      setIsLoading(true);
      await onRefresh();
      setIsLoading(false);
    } else {
      setIsLoading(true);
      await getAllMembers({ page: currentPage, pageSize });
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this member?')) return;
    setIsLoading(true);
    const res = await deleteMember(id);
    setIsLoading(false);
    if (res.success) {
      toast.success('Member deleted');
      await refresh();
    } else {
      toast.error(res.error || 'Failed to delete member');
    }
  };

  const openCreate = () => {
    setSelectedMember(null);
    setOpenForm(true);
  };

  const openEdit = (member: Member) => {
    setSelectedMember(member);
    setOpenForm(true);
  };

  const handleSuccess = async () => {
    setOpenForm(false);
    await refresh();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {members.length} of {totalCount} members
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={openCreate} disabled={isLoading}>
            Add New Member
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Year</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Designation / Role</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  No members found
                </TableCell>
              </TableRow>
            ) : (
              members.map((m) => (
                <TableRow key={m.id}>
                  <TableCell className="font-medium">{m.name}</TableCell>
                  <TableCell>{m.year}</TableCell>
                  <TableCell>{m.memberType}</TableCell>
                  <TableCell>{m.memberType === 'EXECUTIVE' ? m.designation : m.role}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => openEdit(m)}
                        disabled={isLoading}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(m.id)}
                        disabled={isLoading}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Page {currentPage} of {totalPages || 1}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
          >
            Next
          </Button>
        </div>
      </div>

      <MemberFormDialog
        open={openForm}
        onOpenChange={setOpenForm}
        member={selectedMember}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
