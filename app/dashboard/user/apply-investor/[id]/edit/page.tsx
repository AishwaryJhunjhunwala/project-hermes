import { redirect } from 'next/navigation';
import { getInvestorById } from '@/app/actions/investors';
import { InvestorEditForm } from '@/components/investors/edit-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditInvestorApplicationPage({ params }: PageProps) {
  const { id } = await params;

  // TODO: Get the logged-in user ID from authentication
  // For now, using a placeholder
  const userId = 1; // Replace with actual authentication

  const result = await getInvestorById(parseInt(id), userId);

  if (!result.success || !result.investor) {
    redirect('/dashboard/user/apply-investor');
  }

  const investor = result.investor;

  // Allow editing if status is pending or rejected (for reapplication)
  if (investor.applicationStatus !== 'pending' && investor.applicationStatus !== 'rejected') {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You can only edit your application while it is pending review or after rejection.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const isReapplying = investor.applicationStatus === 'rejected';

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">
          {isReapplying ? 'Reapply as Investor' : 'Edit Investor Application'}
        </h1>
        <p className="text-muted-foreground">
          {isReapplying
            ? 'Update your information and resubmit your application'
            : 'Update your application details before it is reviewed'}
        </p>
      </div>

      {isReapplying && investor.rejectionReason && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Previous rejection reason:</strong> {investor.rejectionReason}
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>{isReapplying ? 'Update and Resubmit' : 'Update Application'}</CardTitle>
          <CardDescription>
            {isReapplying
              ? 'Your application will be resubmitted for review with status changed to pending.'
              : 'Make changes to your investor application. Your application will remain in pending status.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <InvestorEditForm userId={userId} investor={investor} isReapplying={isReapplying} />
        </CardContent>
      </Card>
    </div>
  );
}
