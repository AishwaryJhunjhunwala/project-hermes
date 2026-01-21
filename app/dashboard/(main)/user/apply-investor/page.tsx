import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { InvestorForm } from '@/components/dashboard/forms/investor-form';
import { isInvestor } from '@/lib/auth/role-utils';
import { getUserInvestor } from '@/app/actions/investors';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AlertCircle, CheckCircle2, Clock } from 'lucide-react';

export default async function ApplyInvestorPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/auth/signin');
  }

  // 1. Check if already an investor
  if (isInvestor(session.user.roles)) {
    return (
      <div className="py-12 max-w-2xl mx-auto">
        <Card className="border-2 border-black shadow-[8px_8px_0px_0px_rgba(34,197,94,1)] rounded-xl bg-white overflow-hidden">
          <CardHeader className="bg-green-100 border-b-2 border-black py-8 text-center">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <CheckCircle2 className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-3xl font-black uppercase">You are an Investor</CardTitle>
            <CardDescription className="text-gray-900 font-medium text-lg mt-2">
              You already have access to the investor dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8 text-center">
            <Button
              asChild
              className="w-full bg-black text-white hover:bg-gray-800 border-2 border-black h-12 text-lg font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] transition-all rounded-xl"
            >
              <Link href="/dashboard/investor">Go to Investor Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 2. Check for existing application
  const { investor } = await getUserInvestor(session.user.id);

  if (investor) {
    if (investor.applicationStatus === 'pending') {
      return (
        <div className="py-12 max-w-2xl mx-auto">
          <Card className="border-2 border-black shadow-[8px_8px_0px_0px_rgba(234,179,8,1)] rounded-xl bg-white overflow-hidden">
            <CardHeader className="bg-yellow-100 border-b-2 border-black py-8 text-center">
              <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <Clock className="w-8 h-8 text-black" />
              </div>
              <CardTitle className="text-3xl font-black uppercase">Application Pending</CardTitle>
              <CardDescription className="text-gray-900 font-medium text-lg mt-2">
                Your application is currently under review.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
                <p className="text-gray-600">
                  We are reviewing your application details. You will be notified once a decision is
                  made.
                </p>
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <Button
                    asChild
                    variant="outline"
                    className="border-2 border-black text-black font-bold hover:bg-gray-100"
                  >
                    <Link href="/dashboard/user">Back to Dashboard</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    if (investor.applicationStatus === 'rejected') {
      // If rejected, allow re-applying (show form), but maybe show a warning?
      // For now, let's show the form but with an alert.
      // Or maybe show the rejection status and a "Reapply" button that toggles the form?
      // Let's render a wrapper around the form.
      return (
        <div className="py-8">
          <div className="max-w-2xl mx-auto mb-8">
            <div className="bg-red-100 border-2 border-black shadow-[6px_6px_0px_0px_rgba(239,68,68,1)] rounded-xl p-6 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mb-3 border-2 border-black">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-black uppercase text-red-900">Application Rejected</h3>
              {investor.rejectionReason && (
                <p className="mt-2 text-red-800 font-medium">Reason: {investor.rejectionReason}</p>
              )}
              <p className="mt-4 text-sm text-red-700">
                You can update your details below to re-apply.
              </p>
            </div>
          </div>
          <InvestorForm userId={session.user.id} />
        </div>
      );
    }
  }

  // 3. Default: Show Form
  return (
    <div className="py-8">
      <div className="mb-4 text-center">
        <h1 className="text-4xl font-black tracking-tight text-gray-900 uppercase">
          Investor Application
        </h1>
        <p className="text-gray-500 mt-2 font-medium">Complete your profile to start investing.</p>
      </div>
      <InvestorForm userId={session.user.id} />
    </div>
  );
}
