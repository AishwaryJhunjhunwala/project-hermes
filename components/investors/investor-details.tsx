'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import Link from 'next/link';
import type { Investor } from '@/types/investor';

interface InvestorDetailsProps {
  investor: Investor;
}

export function InvestorDetails({ investor }: InvestorDetailsProps) {
  const getStatusColor = (status: string) => {
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

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{investor.investorName}</CardTitle>
          <Badge variant={getStatusColor(investor.applicationStatus)}>
            {investor.applicationStatus.charAt(0).toUpperCase() +
              investor.applicationStatus.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {investor.rejectionReason && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Reason for {investor.applicationStatus}:</strong>
                <br />
                {investor.rejectionReason}
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Investor Type</p>
              <p className="font-medium capitalize">{investor.investorType.replace('_', ' ')}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Stage Preference</p>
              <p className="font-medium">{formatStage(investor.stagePreference)}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Location</p>
              <p className="font-medium">
                {investor.city}, {investor.state}, {investor.country}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Phone</p>
              <p className="font-medium">{investor.phone}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Mentorship</p>
              <p className="font-medium">
                {investor.availableForMentorship ? 'Available' : 'Not Available'}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Applied On</p>
              <p className="font-medium">{new Date(investor.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-2">Industry Preferences</p>
            <div className="flex flex-wrap gap-2">
              {investor.industryPreferences.map((industry) => (
                <Badge key={industry} variant="outline">
                  {industry}
                </Badge>
              ))}
            </div>
          </div>

          {investor.socialHandle && (
            <div>
              <p className="text-sm text-muted-foreground">Social Handle</p>
              <p className="font-medium">{investor.socialHandle}</p>
            </div>
          )}

          {investor.pastInvestmentSummary && (
            <div>
              <p className="text-sm text-muted-foreground">Past Investment Summary</p>
              <p className="font-medium">{investor.pastInvestmentSummary}</p>
            </div>
          )}

          {investor.applicationStatus === 'pending' && (
            <div className="flex gap-2 mt-4">
              <Button asChild variant="outline">
                <Link href={`/dashboard/user/apply-investor/${investor.id}/edit`}>
                  Edit Application
                </Link>
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
