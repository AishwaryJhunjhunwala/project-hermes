'use client';

import { useState, useEffect } from 'react';
import { getPendingApplications } from '@/app/actions/admin/applications';
import { approveStartupApplication, rejectStartupApplication } from '@/app/actions/admin/startups';
import {
  approveInvestorApplication,
  rejectInvestorApplication,
} from '@/app/actions/admin/investors';
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
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { RefreshCw, Eye } from 'lucide-react';

interface StartupApplication {
  id: number;
  startupName: string;
  founderName: string;
  phone: string;
  contactPhone: string;
  contactEmail: string;
  city: string;
  state: string;
  country: string;
  industrySectors: string[];
  businessStage: string;
  fundingStatus: string;
  teamSize: number;
  websiteUrl: string | null;
  socialHandle: string | null;
  pitchDeckUrl: string | null;
  createdAt: Date;
  user: {
    email: string;
    name: string;
  };
}

interface InvestorApplication {
  id: number;
  investorName: string;
  phone: string;
  city: string;
  state: string;
  country: string;
  investorType: string;
  stagePreference: string;
  industryPreferences: string[];
  socialHandle: string | null;
  pastInvestmentSummary: string | null;
  availableForMentorship: boolean;
  createdAt: Date;
  user: {
    email: string;
    name: string;
  };
}

interface ViewDialogState {
  open: boolean;
  type: 'startup' | 'investor' | null;
  data: StartupApplication | InvestorApplication | null;
}

interface ActionDialogState {
  open: boolean;
  type: 'approve' | 'reject';
  applicationId: number | null;
  applicationType: 'startup' | 'investor' | null;
  reason: string;
}

export function ApplicationsManagement() {
  const [startups, setStartups] = useState<StartupApplication[]>([]);
  const [investors, setInvestors] = useState<InvestorApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [viewDialog, setViewDialog] = useState<ViewDialogState>({
    open: false,
    type: null,
    data: null,
  });

  const [actionDialog, setActionDialog] = useState<ActionDialogState>({
    open: false,
    type: 'approve',
    applicationId: null,
    applicationType: null,
    reason: '',
  });

  useEffect(() => {
    const fetchApplications = async () => {
      setIsLoading(true);
      const result = await getPendingApplications();

      if (result.success) {
        setStartups(result.startups as StartupApplication[]);
        setInvestors(result.investors as InvestorApplication[]);
      } else {
        toast.error('Failed to load applications');
      }
      setIsLoading(false);
    };

    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setIsLoading(true);
    const result = await getPendingApplications();

    if (result.success) {
      setStartups(result.startups as StartupApplication[]);
      setInvestors(result.investors as InvestorApplication[]);
    } else {
      toast.error('Failed to load applications');
    }
    setIsLoading(false);
  };

  const handleView = (
    type: 'startup' | 'investor',
    data: StartupApplication | InvestorApplication
  ) => {
    setViewDialog({ open: true, type, data });
  };

  const handleAction = async () => {
    if (!actionDialog.applicationId || !actionDialog.applicationType) return;

    if (actionDialog.type === 'reject' && !actionDialog.reason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }

    let result;
    if (actionDialog.applicationType === 'startup') {
      result =
        actionDialog.type === 'approve'
          ? await approveStartupApplication(actionDialog.applicationId)
          : await rejectStartupApplication(actionDialog.applicationId, actionDialog.reason);
    } else {
      result =
        actionDialog.type === 'approve'
          ? await approveInvestorApplication(actionDialog.applicationId)
          : await rejectInvestorApplication(actionDialog.applicationId, actionDialog.reason);
    }

    if (result.success) {
      toast.success(`Application ${actionDialog.type}d successfully`);
      fetchApplications();
      setActionDialog({
        open: false,
        type: 'approve',
        applicationId: null,
        applicationType: null,
        reason: '',
      });
    } else {
      toast.error(result.error || 'Failed to perform action');
    }
  };

  const formatStage = (stage: string) => {
    if (!stage) return 'Unknown';
    return stage
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Pending Applications</h2>
          <p className="text-muted-foreground">Review and manage pending applications</p>
        </div>
        <Button onClick={fetchApplications} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Startup Applications Table */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Startup Applications ({startups.length})</h3>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Startup Name</TableHead>
                <TableHead>Founder</TableHead>
                <TableHead>Industry</TableHead>
                <TableHead>Stage</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Applied On</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {startups.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    No pending startup applications
                  </TableCell>
                </TableRow>
              ) : (
                startups.map((startup) => (
                  <TableRow key={startup.id}>
                    <TableCell className="font-medium">{startup.startupName}</TableCell>
                    <TableCell>{startup.founderName}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {startup.industrySectors.map((sector) => (
                          <Badge key={sector} variant="outline" className="text-xs">
                            {sector}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>{formatStage(startup.businessStage)}</TableCell>
                    <TableCell>
                      {startup.city}, {startup.state}
                    </TableCell>
                    <TableCell>{new Date(startup.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleView('startup', startup)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() =>
                            setActionDialog({
                              open: true,
                              type: 'approve',
                              applicationId: startup.id,
                              applicationType: 'startup',
                              reason: '',
                            })
                          }
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() =>
                            setActionDialog({
                              open: true,
                              type: 'reject',
                              applicationId: startup.id,
                              applicationType: 'startup',
                              reason: '',
                            })
                          }
                        >
                          Reject
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Investor Applications Table */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Investor Applications ({investors.length})</h3>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Investor Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Stage Preference</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Applied On</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {investors.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    No pending investor applications
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
                    <TableCell>{new Date(investor.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleView('investor', investor)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() =>
                            setActionDialog({
                              open: true,
                              type: 'approve',
                              applicationId: investor.id,
                              applicationType: 'investor',
                              reason: '',
                            })
                          }
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() =>
                            setActionDialog({
                              open: true,
                              type: 'reject',
                              applicationId: investor.id,
                              applicationType: 'investor',
                              reason: '',
                            })
                          }
                        >
                          Reject
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* View Details Dialog */}
      <Dialog
        open={viewDialog.open}
        onOpenChange={(open) => !open && setViewDialog({ open: false, type: null, data: null })}
      >
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {viewDialog.type === 'startup' ? 'Startup' : 'Investor'} Application Details
            </DialogTitle>
            <DialogDescription>Complete information submitted by the applicant</DialogDescription>
          </DialogHeader>

          {viewDialog.type === 'startup' && viewDialog.data && (
            <div className="space-y-4">
              {(() => {
                const startup = viewDialog.data as StartupApplication;
                return (
                  <>
                    <h4 className="text-lg font-semibold mb-2">Basic Info</h4>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div>
                        <Label className="text-muted-foreground">Startup Name</Label>
                        <p className="font-medium">{startup.startupName}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Founder Name</Label>
                        <p className="font-medium">{startup.founderName}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Registered Email</Label>
                        <p className="font-medium">{startup.user.email}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Team Size</Label>
                        <p className="font-medium">{startup.teamSize}</p>
                      </div>
                    </div>

                    <h4 className="text-lg font-semibold mb-2">Contact Details</h4>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div>
                        <Label className="text-muted-foreground">Business Email</Label>
                        <p className="font-medium">{startup.contactEmail}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Business Phone</Label>
                        <p className="font-medium">{startup.contactPhone}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Personal Phone</Label>
                        <p className="font-medium">{startup.phone}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Location</Label>
                        <p className="font-medium">
                          {startup.city}, {startup.state}, {startup.country}
                        </p>
                      </div>
                    </div>

                    <h4 className="text-lg font-semibold mb-2">Business Details</h4>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div>
                        <Label className="text-muted-foreground">Stage</Label>
                        <p className="font-medium">{formatStage(startup.businessStage)}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Funding Status</Label>
                        <p className="font-medium capitalize">
                          {startup.fundingStatus.replace('_', ' ')}
                        </p>
                      </div>
                      <div className="col-span-2">
                        <Label className="text-muted-foreground">Industry Sectors</Label>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {startup.industrySectors.map((s) => (
                            <Badge key={s} variant="secondary">
                              {s}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <h4 className="text-lg font-semibold mb-2">Resources</h4>
                    <div className="space-y-3">
                      {startup.websiteUrl && (
                        <div>
                          <Label className="text-muted-foreground block">Website</Label>
                          <a
                            href={startup.websiteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {startup.websiteUrl}
                          </a>
                        </div>
                      )}
                      {startup.socialHandle && (
                        <div>
                          <Label className="text-muted-foreground block">Social Handle</Label>
                          <a
                            href={startup.socialHandle}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {startup.socialHandle}
                          </a>
                        </div>
                      )}
                      {startup.pitchDeckUrl && (
                        <div>
                          <Label className="text-muted-foreground block">Pitch Deck</Label>
                          <a
                            href={startup.pitchDeckUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {startup.pitchDeckUrl}
                          </a>
                        </div>
                      )}
                    </div>
                  </>
                );
              })()}
            </div>
          )}

          {viewDialog.type === 'investor' && viewDialog.data && (
            <div className="space-y-4">
              {(() => {
                const investor = viewDialog.data as InvestorApplication;
                return (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-muted-foreground">Investor Name</Label>
                        <p className="font-medium">{investor.investorName}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Phone</Label>
                        <p className="font-medium">{investor.phone}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Investor Type</Label>
                        <p className="font-medium capitalize">
                          {investor.investorType.replace('_', ' ')}
                        </p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Stage Preference</Label>
                        <p className="font-medium">{formatStage(investor.stagePreference)}</p>
                      </div>
                      <div className="col-span-2">
                        <Label className="text-muted-foreground">Location</Label>
                        <p className="font-medium">
                          {investor.city}, {investor.state}, {investor.country}
                        </p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Available for Mentorship</Label>
                        <p className="font-medium">
                          {investor.availableForMentorship ? 'Yes' : 'No'}
                        </p>
                      </div>
                      {investor.socialHandle && (
                        <div>
                          <Label className="text-muted-foreground">Social Handle</Label>
                          <p className="font-medium">{investor.socialHandle}</p>
                        </div>
                      )}
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Industry Preferences</Label>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {investor.industryPreferences.map((industry) => (
                          <Badge key={industry} variant="outline">
                            {industry}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    {investor.pastInvestmentSummary && (
                      <div>
                        <Label className="text-muted-foreground">Past Investment Summary</Label>
                        <p className="font-medium mt-1">{investor.pastInvestmentSummary}</p>
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setViewDialog({ open: false, type: null, data: null })}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Action Dialog (Approve/Reject) */}
      <Dialog
        open={actionDialog.open}
        onOpenChange={(open) =>
          !open &&
          setActionDialog({
            open: false,
            type: 'approve',
            applicationId: null,
            applicationType: null,
            reason: '',
          })
        }
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionDialog.type === 'approve' ? 'Approve' : 'Reject'} Application
            </DialogTitle>
            <DialogDescription>
              {actionDialog.type === 'approve'
                ? 'Are you sure you want to approve this application?'
                : 'Please provide a reason for rejecting this application.'}
            </DialogDescription>
          </DialogHeader>

          {actionDialog.type === 'reject' && (
            <div className="space-y-2">
              <Label htmlFor="reject-reason">Rejection Reason</Label>
              <Textarea
                id="reject-reason"
                placeholder="Reason for rejection..."
                value={actionDialog.reason}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setActionDialog({ ...actionDialog, reason: e.target.value })
                }
              />
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() =>
                setActionDialog({
                  open: false,
                  type: 'approve',
                  applicationId: null,
                  applicationType: null,
                  reason: '',
                })
              }
            >
              Cancel
            </Button>
            <Button
              variant={actionDialog.type === 'approve' ? 'default' : 'destructive'}
              onClick={handleAction}
            >
              {actionDialog.type === 'approve' ? 'Approve' : 'Reject'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
