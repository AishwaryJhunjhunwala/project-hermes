import { auth } from '@/lib/auth';
import { getUserStartups, getApprovedStartups } from '@/app/actions/startups';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Plus, Rocket, Globe, MapPin, Users } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default async function UserStartupsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/auth/signin');
  }

  const [userStartupsResult, approvedStartupsResult] = await Promise.all([
    getUserStartups(Number(session.user.id)),
    getApprovedStartups(),
  ]);

  const userStartups = userStartupsResult.success ? userStartupsResult.startups : [];
  const approvedStartups = approvedStartupsResult.success ? approvedStartupsResult.startups : [];

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
          <h1 className="text-3xl font-bold tracking-tight">Startups</h1>
          <p className="text-muted-foreground mt-2">
            Manage your startups and explore others in the ecosystem.
          </p>
        </div>
        <Button
          asChild
          className="bg-purple-600 hover:bg-purple-700 text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-2 border-black transition-all active:shadow-none active:translate-x-[4px] active:translate-y-[4px]"
        >
          <Link href="/dashboard/user/register-startup">
            <Plus className="mr-2 h-4 w-4" />
            Register Startup
          </Link>
        </Button>
      </div>

      {/* My Startups Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Rocket className="h-6 w-6" />
          My Startups
        </h2>
        {userStartups.length === 0 ? (
          <Card className="bg-gray-50 border-2 border-dashed border-gray-200">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <Rocket className="h-12 w-12 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900">No startups registered yet</h3>
              <p className="text-gray-500 mb-4">
                Ready to launch your idea? Register your startup today.
              </p>
              <Button asChild variant="outline">
                <Link href="/dashboard/user/register-startup">Register Now</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userStartups.map((startup) => (
              <Card
                key={startup.id}
                className="overflow-hidden border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all"
              >
                <CardHeader className="bg-purple-100 border-b-2 border-black pb-4">
                  <div className="flex justify-between items-start">
                    <CardTitle className="truncate pr-2">{startup.startupName}</CardTitle>
                    <Badge
                      className={`${getStatusColor(startup.applicationStatus)} text-white border border-black`}
                    >
                      {startup.applicationStatus.toUpperCase()}
                    </Badge>
                  </div>
                  <CardDescription className="line-clamp-1">
                    {startup.industrySectors[0]}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-4 space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    {startup.city}, {startup.country}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="h-4 w-4 mr-2" />
                    Only Founder (Example if team size logic needed)
                  </div>
                  {startup.applicationStatus === 'rejected' && startup.rejectionReason && (
                    <div className="bg-red-50 p-3 rounded-md border border-red-200 text-sm text-red-800 mt-2">
                      <span className="font-semibold">Rejection Reason:</span>{' '}
                      {startup.rejectionReason}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      <Separator className="my-8" />

      {/* Explore Startups Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Globe className="h-6 w-6" />
          Explore Ecosystem
        </h2>
        {approvedStartups.length === 0 ? (
          <div className="text-center py-12 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
            No approved startups to display yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {approvedStartups.map((startup) => (
              <Card
                key={startup.id}
                className="overflow-hidden border border-gray-200 hover:border-black hover:shadow-md transition-all"
              >
                <CardHeader className="bg-gray-50 border-b pb-4">
                  <CardTitle className="truncate">{startup.startupName}</CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <span className="truncate">by {startup.user.name}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-4 space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {startup.industrySectors.slice(0, 3).map((sector) => (
                      <Badge key={sector} variant="secondary" className="text-xs">
                        {sector}
                      </Badge>
                    ))}
                  </div>
                  <div className="text-sm text-gray-500 line-clamp-3">
                    {/* Assuming description might be added later, currently mostly metadata */}
                    Stage: {startup.businessStage.replace('_', ' ')}
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-xs text-muted-foreground flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      {startup.city}
                    </span>
                    {startup.websiteUrl && (
                      <a
                        href={startup.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm flex items-center"
                      >
                        Visit <Globe className="h-3 w-3 ml-1" />
                      </a>
                    )}
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
