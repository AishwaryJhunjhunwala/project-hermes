import { requireStartup } from '@/lib/auth/role-guards';
import { db } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { users } from '@/lib/db/schema';
import { SignOutButton } from '@/components/SignOutButton';

async function getStartupData(userId: number) {
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
    with: {
      startups: true,
    },
  });

  const allInvestors = await db.query.investors.findMany({
    with: {
      user: true,
    },
  });

  return {
    startups: user?.startups || [],
    investors: allInvestors,
  };
}

export default async function StartupDashboard() {
  const session = await requireStartup();
  const data = await getStartupData(session.user.id);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Startup Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{session.user.email}</span>
            <SignOutButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <p className="text-purple-800 font-medium">
              🚀 Startup Access - Manage your startups and connect with investors
            </p>
            <p className="text-sm text-purple-600 mt-1">Roles: {session.user.roles.join(', ')}</p>
          </div>
        </div>

        {/* Your Startups */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Your Startups ({data.startups.length})</h2>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Add New Startup
            </button>
          </div>
          <div className="space-y-4">
            {data.startups.length > 0 ? (
              data.startups.map(
                (startup: {
                  id: number;
                  startupName: string;
                  founderName: string;
                  businessStage: string;
                  fundingStatus: string;
                  teamSize: number;
                  city: string;
                  country: string;
                  industrySectors: string[];
                }) => (
                  <div key={startup.id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{startup.startupName}</h3>
                        <p className="text-sm text-gray-600">Founder: {startup.founderName}</p>
                        <div className="mt-2 grid grid-cols-2 gap-2">
                          <div>
                            <p className="text-xs text-gray-500">Business Stage</p>
                            <p className="text-sm font-medium capitalize">
                              {startup.businessStage.replace('_', ' ')}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Funding Status</p>
                            <p className="text-sm font-medium capitalize">
                              {startup.fundingStatus.replace('_', ' ')}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Team Size</p>
                            <p className="text-sm font-medium">{startup.teamSize}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Location</p>
                            <p className="text-sm font-medium">
                              {startup.city}, {startup.country}
                            </p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mt-2">
                          Industries: {startup.industrySectors.join(', ')}
                        </p>
                      </div>
                      <button className="ml-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
                        Edit
                      </button>
                    </div>
                  </div>
                )
              )
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">You haven&apos;t created any startups yet</p>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  Create Your First Startup
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Browse Investors */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Browse Investors ({data.investors.length})</h2>
          <div className="space-y-4">
            {data.investors.length > 0 ? (
              data.investors.map(
                (investor: {
                  id: number;
                  investorName: string;
                  investorType: string;
                  stagePreference: string;
                  city: string;
                  country: string;
                  industryPreferences: string[];
                  availableForMentorship: boolean;
                }) => (
                  <div key={investor.id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg">{investor.investorName}</h3>
                        <p className="text-sm text-gray-600 capitalize">
                          {investor.investorType} | Stage:{' '}
                          {investor.stagePreference.replace('_', ' ')}
                        </p>
                        <p className="text-sm text-gray-600">
                          Location: {investor.city}, {investor.country}
                        </p>
                        <p className="text-sm text-gray-600">
                          Industries: {investor.industryPreferences.join(', ')}
                        </p>
                        {investor.availableForMentorship && (
                          <span className="inline-block mt-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                            Available for Mentorship
                          </span>
                        )}
                      </div>
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                        Connect
                      </button>
                    </div>
                  </div>
                )
              )
            ) : (
              <p className="text-gray-600">No investors found</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
