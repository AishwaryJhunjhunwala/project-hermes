import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { isAdmin, isInvestor, isStartup } from '@/lib/auth/role-utils';
import Link from 'next/link';
import type { Role } from '@/types/auth';
import { SignOutButton } from '@/components/SignOutButton';
import { Button } from '@/components/ui/button';

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/auth/signin');
  }

  const userRoles = session.user.roles;
  const hasAdmin = isAdmin(userRoles);
  const hasInvestor = isInvestor(userRoles);
  const hasStartup = isStartup(userRoles);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{session.user.email}</span>
            <SignOutButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Welcome, {session.user.name}!</h2>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800 font-medium">Your Roles</p>
            <div className="flex gap-2 mt-2">
              {userRoles.map((role: Role) => (
                <span
                  key={role}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium capitalize"
                >
                  {role.replace('_', ' ')}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Admin Dashboard */}
          {hasAdmin && (
            <Link href="/dashboard/admin" className="block">
              <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow border-2 border-transparent hover:border-blue-500">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-4xl">🔐</div>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    Admin
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Admin Dashboard</h3>
                <p className="text-gray-600 text-sm">
                  Manage users, startups, investors, and platform settings
                </p>
                <div className="mt-4 text-blue-600 font-medium text-sm flex items-center">
                  Access Dashboard
                  <svg
                    className="w-4 h-4 ml-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </Link>
          )}

          {/* Investor Dashboard */}
          {hasInvestor && (
            <Link href="/dashboard/investor" className="block">
              <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow border-2 border-transparent hover:border-green-500">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-4xl">💼</div>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    Investor
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Investor Dashboard</h3>
                <p className="text-gray-600 text-sm">
                  Browse startups, manage your profile, and connect with founders
                </p>
                <div className="mt-4 text-green-600 font-medium text-sm flex items-center">
                  Access Dashboard
                  <svg
                    className="w-4 h-4 ml-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </Link>
          )}

          {/* Startup Dashboard */}
          {hasStartup && (
            <Link href="/dashboard/startup" className="block">
              <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow border-2 border-transparent hover:border-purple-500">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-4xl">🚀</div>
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                    Startup
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Startup Dashboard</h3>
                <p className="text-gray-600 text-sm">
                  Manage your startups, browse investors, and grow your business
                </p>
                <div className="mt-4 text-purple-600 font-medium text-sm flex items-center">
                  Access Dashboard
                  <svg
                    className="w-4 h-4 ml-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </Link>
          )}

          {/* User Dashboard - Always shown */}
          <Link href="/dashboard/user" className="block">
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow border-2 border-transparent hover:border-indigo-500">
              <div className="flex items-center justify-between mb-4">
                <div className="text-4xl">👤</div>
                <span className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full">
                  User
                </span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">User Dashboard</h3>
              <p className="text-gray-600 text-sm">
                Explore the platform, browse startups and investors
              </p>
              <div className="mt-4 text-indigo-600 font-medium text-sm flex items-center">
                Access Dashboard
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          </Link>
        </div>

        {/* Quick Actions */}
        {!hasAdmin && !hasInvestor && !hasStartup && (
          <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-yellow-900 mb-2">Unlock More Features</h3>
            <p className="text-yellow-800 text-sm mb-4">
              You currently have basic user access. Apply for investor or startup roles to access
              additional features and connect with the community.
            </p>
            <div className="flex gap-3">
              <Link href="/dashboard/user/apply-investor">
                <Button className="bg-green-600 hover:bg-green-700 text-white border-0">
                  Apply as Investor
                </Button>
              </Link>
              <Link href="/dashboard/user/register-startup">
                <Button className="bg-purple-600 hover:bg-purple-700 text-white border-0">
                  Register Startup
                </Button>
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
