import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { StartupForm } from '@/components/dashboard/forms/startup-form';
import { isStartup } from '@/lib/auth/role-utils';
import { getUserStartups } from '@/app/actions/startups';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Clock, Rocket } from 'lucide-react';

export default async function RegisterStartupPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/auth/signin');
  }

  // 1. Check if already a startup founder
  if (isStartup(session.user.roles)) {
    return (
      <div className="py-12 max-w-2xl mx-auto">
        <Card className="border-2 border-black shadow-[8px_8px_0px_0px_rgba(168,85,247,1)] rounded-xl bg-white overflow-hidden">
          <CardHeader className="bg-purple-100 border-b-2 border-black py-8 text-center">
            <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <Rocket className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-3xl font-black uppercase">You have a Startup</CardTitle>
            <CardDescription className="text-gray-900 font-medium text-lg mt-2">
              You already have access to the startup dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8 text-center">
            <Link href="/dashboard/startup">
              <Button className="w-full bg-black text-white hover:bg-gray-800 border-2 border-black h-12 text-lg font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] transition-all rounded-xl">
                Go to Startup Dashboard
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 2. Check for pending applications
  const { startups } = await getUserStartups(session.user.id);
  const pendingStartup = startups?.find((s) => s.applicationStatus === 'pending');

  if (pendingStartup) {
    return (
      <div className="py-12 max-w-2xl mx-auto">
        <Card className="border-2 border-black shadow-[8px_8px_0px_0px_rgba(234,179,8,1)] rounded-xl bg-white overflow-hidden">
          <CardHeader className="bg-yellow-100 border-b-2 border-black py-8 text-center">
            <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <Clock className="w-8 h-8 text-black" />
            </div>
            <CardTitle className="text-3xl font-black uppercase">Application Pending</CardTitle>
            <CardDescription className="text-gray-900 font-medium text-lg mt-2">
              Your application for{' '}
              <span className="font-bold">&quot;{pendingStartup.startupName}&quot;</span> is under
              review.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
              <p className="text-gray-600">
                We are reviewing your details. You will be notified once a decision is made.
              </p>
              <div className="mt-6 pt-6 border-t border-gray-200">
                <Link href="/dashboard/user">
                  <Button
                    variant="outline"
                    className="border-2 border-black text-black font-bold hover:bg-gray-100"
                  >
                    Back to Dashboard
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 3. Show Form
  return (
    <div className="py-8">
      <div className="mb-4 text-center">
        <h1 className="text-4xl font-black tracking-tight text-gray-900 uppercase">
          Register Startup
        </h1>
        <p className="text-gray-500 mt-2 font-medium">Share your venture with the world.</p>
      </div>
      <StartupForm userId={session.user.id} />
    </div>
  );
}
