import { requireInvestor } from '@/lib/auth/role-guards';
import { db } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { users } from '@/lib/db/schema';
import { SignOutButton } from '@/components/SignOutButton';

async function getInvestorData(userId: number) {
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
    with: {
      investor: true,
    },
  });

  const allStartups = await db.query.startups.findMany({
    with: {
      user: true,
    },
  });

  return {
    investor: user?.investor,
    startups: allStartups,
  };
}

export default async function InvestorDashboard() {
  const session = await requireInvestor();
  const data = await getInvestorData(session.user.id);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Investor Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{session.user.email}</span>
            <SignOutButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800 font-medium">
              💼 Investor Access - Browse and connect with startups
            </p>
            <p className="text-sm text-green-600 mt-1">Roles: {session.user.roles.join(', ')}</p>
          </div>
        </div>

        {/* Investor Profile */}
        {data.investor ? (
          <div className="bg-white p-6 rounded-lg shadow mb-8">
            <h2 className="text-xl font-semibold mb-4">Your Investor Profile</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Investor Name</p>
                <p className="font-medium">{data.investor.investorName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Type</p>
                <p className="font-medium capitalize">{data.investor.investorType}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Location</p>
                <p className="font-medium">
                  {data.investor.city}, {data.investor.state}, {data.investor.country}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Stage Preference</p>
                <p className="font-medium capitalize">
                  {data.investor.stagePreference.replace('_', ' ')}
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-600">Industry Preferences</p>
                <p className="font-medium">{data.investor.industryPreferences.join(', ')}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-600">Available for Mentorship</p>
                <p className="font-medium">{data.investor.availableForMentorship ? 'Yes' : 'No'}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
            <p className="text-yellow-800 font-medium">Complete your investor profile</p>
            <button className="mt-2 px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700">
              Create Profile
            </button>
          </div>
        )}

        {/* Browse Startups */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Browse Startups ({data.startups.length})</h2>
          <div className="space-y-4">
            {data.startups.length > 0 ? (
              data.startups.map(
                (startup: {
                  id: number;
                  startupName: string;
                  founderName: string;
                  businessStage: string;
                  fundingStatus: string;
                  industrySectors: string[];
                  teamSize: number;
                }) => (
                  <div key={startup.id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg">{startup.startupName}</h3>
                        <p className="text-sm text-gray-600">Founder: {startup.founderName}</p>
                        <p className="text-sm text-gray-600 mt-1">
                          Stage: {startup.businessStage.replace('_', ' ')} | Funding:{' '}
                          {startup.fundingStatus.replace('_', ' ')}
                        </p>
                        <p className="text-sm text-gray-600">
                          Industries: {startup.industrySectors.join(', ')}
                        </p>
                        <p className="text-sm text-gray-600">Team Size: {startup.teamSize}</p>
                      </div>
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                        Connect
                      </button>
                    </div>
                  </div>
                )
              )
            ) : (
              <p className="text-gray-600">No startups found</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
