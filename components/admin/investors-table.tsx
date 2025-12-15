'use client';

import { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import {
  getAllInvestorApplications,
  approveInvestorApplication,
  rejectInvestorApplication,
  banInvestorApplication,
} from '@/app/actions/admin/investors';
import type { Investor, ApplicationStatus } from '@/types/investor';

interface InvestorsTableProps {
  page: number;
  pageSize: number;
  search?: string;
  status?: ApplicationStatus;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  excludePending?: boolean;
}

interface ActionState {
  type: 'reject' | 'ban' | null;
  investorId: number | null;
  reason: string;
}

export function InvestorsTable({
  page,
  pageSize,
  search,
  status,
  onPageChange,
  excludePending = false,
}: InvestorsTableProps) {
  const [investors, setInvestors] = useState<Investor[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [actionState, setActionState] = useState<ActionState>({
    type: null,
    investorId: null,
    reason: '',
  });

  useEffect(() => {
    const fetchInvestors = async () => {
      setIsLoading(true);
      const result = await getAllInvestorApplications({
        page,
        pageSize,
        search,
        status,
        excludePending,
      });

      if (result.success) {
        setInvestors(result.investors || []);
        setTotal(result.totalCount || 0);
      } else {
        toast.error('Failed to load investors');
      }
      setIsLoading(false);
    };

    fetchInvestors();
  }, [page, pageSize, search, status, excludePending]);

  const fetchInvestors = async () => {
    setIsLoading(true);
    const result = await getAllInvestorApplications({
      page,
      pageSize,
      search,
      status,
      excludePending,
    });

    if (result.success) {
      setInvestors(result.investors || []);
      setTotal(result.totalCount || 0);
    } else {
      toast.error('Failed to load investors');
    }
    setIsLoading(false);
  };

  const handleApprove = async (investorId: number) => {
    const result = await approveInvestorApplication(investorId);
    if (result.success) {
      toast.success('Investor application approved');
      fetchInvestors();
    } else {
      toast.error(result.error || 'Failed to approve investor');
    }
  };

  const handleRejectOrBan = async () => {
    if (!actionState.investorId || !actionState.type) return;

    if (!actionState.reason.trim()) {
      toast.error('Please provide a reason');
      return;
    }

    const action =
      actionState.type === 'reject' ? rejectInvestorApplication : banInvestorApplication;
    const result = await action(actionState.investorId, actionState.reason);

    if (result.success) {
      toast.success(
        `Investor application ${actionState.type === 'reject' ? 'rejected' : 'banned'}`
      );
      fetchInvestors();
      setActionState({ type: null, investorId: null, reason: '' });
    } else {
      toast.error(result.error || `Failed to ${actionState.type} investor`);
    }
  };

  const getStatusColor = (status: ApplicationStatus) => {
    switch (status) {
      case 'approved':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'rejected':
      case 'banned':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const formatStage = (stage: string) => {
    return stage
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const totalPages = Math.ceil(total / pageSize);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Investor Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Stage Preference</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {investors.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  No investors found
                </TableCell>
              </TableRow>
            ) : (
              investors.map((investor) => (
                <TableRow key={investor.id}>
                  <TableCell className="font-medium">{investor.investorName}</TableCell>
                  <TableCell className="capitalize">
                    {investor.investorType.replace('_', ' ')}
                  </TableCell>
                  <TableCell>{formatStage(investor.stagePreference)}</TableCell>
                  <TableCell>
                    {investor.city}, {investor.state}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(investor.applicationStatus)}>
                      {investor.applicationStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {investor.applicationStatus !== 'approved' && (
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => handleApprove(investor.id)}
                        >
                          Approve
                        </Button>
                      )}
                      {investor.applicationStatus !== 'rejected' && (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() =>
                            setActionState({ type: 'reject', investorId: investor.id, reason: '' })
                          }
                        >
                          Reject
                        </Button>
                      )}
                      {investor.applicationStatus !== 'banned' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            setActionState({ type: 'ban', investorId: investor.id, reason: '' })
                          }
                        >
                          Ban
                        </Button>
                      )}
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
          Showing {investors.length} of {total} investors
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
          >
            Previous
          </Button>
          <div className="text-sm">
            Page {page} of {totalPages || 1}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
          >
            Next
          </Button>
        </div>
      </div>

      <AlertDialog
        open={actionState.type !== null}
        onOpenChange={(open) =>
          !open && setActionState({ type: null, investorId: null, reason: '' })
        }
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {actionState.type === 'reject' ? 'Reject' : 'Ban'} Investor Application
            </AlertDialogTitle>
            <AlertDialogDescription>
              Please provide a reason for {actionState.type === 'reject' ? 'rejecting' : 'banning'}{' '}
              this investor application.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-2">
            <Label htmlFor="reason">Reason</Label>
            <Textarea
              id="reason"
              placeholder={`Reason for ${actionState.type === 'reject' ? 'rejection' : 'ban'}...`}
              value={actionState.reason}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setActionState({ ...actionState, reason: e.target.value })
              }
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleRejectOrBan}>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
