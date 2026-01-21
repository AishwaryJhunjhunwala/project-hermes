import { auth } from '@/lib/auth';
import { getUserInvestor, getApprovedInvestors } from '@/app/actions/investors';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Briefcase, MapPin, Users, Globe } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default async function UserInvestorsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/auth/signin');
  }

  const [userInvestorResult, approvedInvestorsResult] = await Promise.all([
    getUserInvestor(Number(session.user.id)),
    getApprovedInvestors(),
  ]);

  const userInvestor = userInvestorResult.success ? userInvestorResult.investor : null;
  const approvedInvestors = approvedInvestorsResult.success
    ? approvedInvestorsResult.investors
    : [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-500 hover:bg-green-600';
      case 'rejected':
        return 'bg-red-500 hover:bg-red-600';
      case 'banned':
        return 'bg-gray-900 hover:bg-gray-800';
      default:
        return 'bg-yellow-500 hover:bg-yellow-600';
    }
  };

  return (
    <div className="space-y-8 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Investors</h1>
          <p className="text-muted-foreground mt-2">
            View your investor status and connect with other investors.
          </p>
        </div>
        {!userInvestor && (
          <Button
            asChild
            className="bg-black hover:bg-gray-800 text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-2 border-white transition-all active:shadow-none active:translate-x-[4px] active:translate-y-[4px]"
          >
            <Link href="/dashboard/user/apply-investor">
              <Briefcase className="mr-2 h-4 w-4" />
              Apply as Investor
            </Link>
          </Button>
        )}
      </div>

      {/* My Investor Profile Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Briefcase className="h-6 w-6" />
          My Investor Profile
        </h2>
        {!userInvestor ? (
          <Card className="bg-gray-50 border-2 border-dashed border-gray-200">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <Briefcase className="h-12 w-12 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900">Not registered as an investor</h3>
              <p className="text-gray-500 mb-4">
                Interested in funding the next big thing? Apply to become an investor.
              </p>
              <Link href="/dashboard/user/apply-investor">
                <Button variant="outline">Apply Now</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <Card className="overflow-hidden border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <CardHeader className="bg-yellow-100 border-b-2 border-black pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{userInvestor.investorName}</CardTitle>
                  <CardDescription className="capitalize">
                    {userInvestor.investorType.replace('_', ' ')} Investor
                  </CardDescription>
                </div>
                <Badge
                  className={`${getStatusColor(userInvestor.applicationStatus)} text-white border border-black`}
                >
                  {userInvestor.applicationStatus.toUpperCase()}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-4 w-4 mr-2" />
                  {userInvestor.city}, {userInvestor.country}
                </div>
                <div className="flex items-center text-gray-600">
                  <Users className="h-4 w-4 mr-2" />
                  Mentorship Available: {userInvestor.availableForMentorship ? 'Yes' : 'No'}
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold mb-1">Industry Preferences:</p>
                <div className="flex flex-wrap gap-2">
                  {userInvestor.industryPreferences.map((pref) => (
                    <Badge key={pref} variant="outline" className="bg-white">
                      {pref}
                    </Badge>
                  ))}
                </div>
              </div>

              {userInvestor.applicationStatus === 'rejected' && userInvestor.rejectionReason && (
                <div className="bg-red-50 p-3 rounded-md border border-red-200 text-sm text-red-800 mt-2">
                  <span className="font-semibold">Rejection Reason:</span>{' '}
                  {userInvestor.rejectionReason}
                  <div className="mt-2">
                    <Link href="/dashboard/user/apply-investor">
                      <Button variant="link" className="p-0 h-auto text-red-800 underline">
                        Update Application
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </section>

      <Separator className="my-8" />

      {/* Explore Investors Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Globe className="h-6 w-6" />
          Explore Investors
        </h2>
        {approvedInvestors.length === 0 ? (
          <div className="text-center py-12 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
            No approved investors to display yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {approvedInvestors.map((investor) => (
              <Card
                key={investor.id}
                className="overflow-hidden border border-gray-200 hover:border-black hover:shadow-md transition-all"
              >
                <CardHeader className="bg-gray-50 border-b pb-4">
                  <CardTitle className="truncate">{investor.investorName}</CardTitle>
                  <CardDescription className="capitalize">
                    {investor.investorType.replace('_', ' ')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-4 space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {investor.industryPreferences.slice(0, 3).map((pref) => (
                      <Badge key={pref} variant="secondary" className="text-xs">
                        {pref}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex justify-between items-center pt-2 text-sm text-gray-500">
                    <span className="flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      {investor.city}
                    </span>
                    <span>{investor.availableForMentorship ? 'Mentors' : 'Invests'}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
