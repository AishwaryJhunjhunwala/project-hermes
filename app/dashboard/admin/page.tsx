import { requireAdmin } from '@/lib/auth/role-guards';
import { db } from '@/lib/db';
import { SignOutButton } from '@/components/SignOutButton';
import { UsersManagement } from '@/components/admin/users-management';

async function getStats() {
  const allUsers = await db.query.users.findMany({
    with: {
      roles: true,
      startups: true,
      investor: true,
    },
  });

  return {
    totalUsers: allUsers.length,
    totalStartups: allUsers.reduce(
      (acc: number, user: { startups: unknown[] }) => acc + user.startups.length,
      0
    ),
    totalInvestors: allUsers.filter((user: { investor: unknown }) => user.investor).length,
  };
}

export default async function AdminDashboard() {
  const session = await requireAdmin();
  const stats = await getStats();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{session.user.email}</span>
            <SignOutButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800 font-medium">
              🔐 Admin Access - You have full administrative privileges
            </p>
            <p className="text-sm text-blue-600 mt-1">Roles: {session.user.roles.join(', ')}</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm font-medium">Total Users</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalUsers}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm font-medium">Total Startups</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalStartups}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm font-medium">Total Investors</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalInvestors}</p>
          </div>
        </div>

        {/* User Management */}
        <UsersManagement />
      </main>
    </div>
  );
}
