import { requireAdmin } from '@/lib/auth/role-guards';
import { db } from '@/lib/db';
// import { SignOutButton } from '@/components/SignOutButton';

async function getStats() {
  const allUsers = await db.query.users.findMany({
    with: {
      roles: true,
      startups: true,
      investor: true,
    },
  });

  const recentUsers = await db.query.users.findMany({
    orderBy: (users, { desc }) => [desc(users.createdAt)],
    limit: 5,
  });

  const recentStartups = await db.query.startups.findMany({
    orderBy: (startups, { desc }) => [desc(startups.createdAt)],
    limit: 5,
    with: {
      user: true,
    },
  });

  return {
    totalUsers: allUsers.length,
    totalStartups: allUsers.reduce(
      (acc: number, user: { startups: unknown[] }) => acc + user.startups.length,
      0
    ),
    totalInvestors: allUsers.filter((user: { investor: unknown }) => user.investor).length,
    recentUsers,
    recentStartups,
  };
}

export default async function AdminDashboard() {
  await requireAdmin();
  const stats = await getStats();

  return (
    <div className="min-h-screen bg-white">
      {/* Header
      <header className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Dashboard Overview</h1>
            <p className="text-sm text-gray-500">Welcome back, Administrator.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-gray-900">{session.user.name}</p>
              <p className="text-xs text-gray-500">{session.user.email}</p>
            </div>
            <SignOutButton />
          </div>
        </div>
      </header> */}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Welcome Banner */}
        <div className="bg-linear-to-br from-blue-600 to-indigo-600 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-br from-gray-900 to-black z-0" />
          <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-gray-800 opacity-20 blur-3xl" />
          <div className="absolute -left-24 -bottom-24 h-64 w-64 rounded-full bg-blue-900 opacity-20 blur-3xl" />

          <div className="relative z-10 max-w-2xl">
            <h2 className="text-3xl font-bold mb-4">Ecell NITRKL Administration</h2>
            <p className="text-gray-300 text-lg mb-6 leading-relaxed">
              You have full access to manage users, verified startups, investors, and ecosystem
              events. Check the recent activity below.
            </p>
            <div className="flex gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-sm font-medium backdrop-blur-sm border border-white/10">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                System Active
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-sm font-medium backdrop-blur-sm border border-white/10">
                🛡️ Admin Role
              </span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="group bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-200">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-green-100 text-green-700">
                Total
              </span>
            </div>
            <h3 className="text-gray-500 text-sm font-medium">Total Registered Users</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2 tracking-tight">
              {stats.totalUsers}
            </p>
          </div>

          <div className="group bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-200">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-lg bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700">
                Active
              </span>
            </div>
            <h3 className="text-gray-500 text-sm font-medium">Verified Startups</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2 tracking-tight">
              {stats.totalStartups}
            </p>
          </div>

          <div className="group bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-200">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-lg bg-orange-50 text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-700">
                Stable
              </span>
            </div>
            <h3 className="text-gray-500 text-sm font-medium">Onboarded Investors</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2 tracking-tight">
              {stats.totalInvestors}
            </p>
          </div>
        </div>

        {/* Dynamic Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Registrations */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
              <h3 className="font-bold text-gray-900 text-lg">Recent User Registrations</h3>
            </div>
            <div className="divide-y divide-gray-100">
              {stats.recentUsers.length === 0 ? (
                <div className="p-8 text-center text-gray-500">No users found.</div>
              ) : (
                stats.recentUsers.map((user) => (
                  <div
                    key={user.id}
                    className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold border border-gray-200">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 font-medium whitespace-nowrap">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Startups */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
              <h3 className="font-bold text-gray-900 text-lg">Recent Startups</h3>
            </div>
            <div className="divide-y divide-gray-100">
              {stats.recentStartups.length === 0 ? (
                <div className="p-8 text-center text-gray-500">No startups found.</div>
              ) : (
                stats.recentStartups.map((startup) => (
                  <div
                    key={startup.id}
                    className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex flex-col gap-1">
                      <p className="text-sm font-bold text-gray-900">{startup.startupName}</p>
                      <p className="text-xs text-gray-500 font-medium">
                        {startup.user?.name ? `Founder: ${startup.user.name}` : 'Unknown Founder'}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700">
                        {startup.businessStage.replace('_', ' ').toUpperCase()}
                      </span>
                      <p className="text-xs text-gray-400">
                        {new Date(startup.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
