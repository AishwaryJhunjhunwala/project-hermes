import { getUserInvestor } from '@/app/actions/investors';
import { InvestorApplicationForm } from '@/components/investors/application-form';
import { InvestorDetails } from '@/components/investors/investor-details';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default async function ApplyInvestorPage() {
  // TODO: Get the logged-in user ID from authentication
  // For now, using a placeholder
  const userId = 1; // Replace with actual authentication

  const result = await getUserInvestor(userId);

  // If investor application exists
  if (result.success && result.investor) {
    const investor = result.investor;

    // If application is rejected, show reapply option
    if (investor.applicationStatus === 'rejected') {
      return (
        <div className="container mx-auto p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Investor Application - Rejected</h1>
            <p className="text-muted-foreground">Your previous application was rejected</p>
          </div>

          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Application Rejected</AlertTitle>
            <AlertDescription>
              {investor.rejectionReason || 'Your application did not meet our requirements.'}
            </AlertDescription>
          </Alert>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Previous Application Details</h2>
            <InvestorDetails investor={investor} />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Reapply as Investor</CardTitle>
              <CardDescription>
                You can update your information and reapply. Your previous data has been pre-filled
                for your convenience.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href={`/dashboard/user/apply-investor/${investor.id}/edit`}>
                <Button size="lg" className="w-full">
                  Edit and Reapply
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      );
    }

    // If application is banned
    if (investor.applicationStatus === 'banned') {
      return (
        <div className="container mx-auto p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Application Banned</h1>
            <p className="text-muted-foreground">You cannot reapply at this time</p>
          </div>

          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Account Banned</AlertTitle>
            <AlertDescription>
              {investor.rejectionReason || 'Your application has been permanently banned.'}
              <br />
              <br />
              Please contact support if you believe this is an error.
            </AlertDescription>
          </Alert>
        </div>
      );
    }

    // For pending or approved applications, show details
    return (
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Your Investor Application</h1>
          <p className="text-muted-foreground">View your current investor application status</p>
        </div>
        <InvestorDetails investor={investor} />
      </div>
    );
  }

  // Otherwise, show the application form
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Apply as Investor</h1>
        <p className="text-muted-foreground">
          Fill out the application form to join our investor network
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Investor Application Form</CardTitle>
          <CardDescription>
            Please provide accurate information. Your application will be reviewed by our team.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <InvestorApplicationForm userId={userId} />
        </CardContent>
      </Card>
    </div>
  );
}
