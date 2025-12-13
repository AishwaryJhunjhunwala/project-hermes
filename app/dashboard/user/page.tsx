import { requireUser } from '@/lib/auth/role-guards';
import { SignOutButton } from '@/components/SignOutButton';

export default async function UserDashboard() {
  const session = await requireUser();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">User Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{session.user.email}</span>
            <SignOutButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
            <p className="text-indigo-800 font-medium">
              👤 User Access - Explore startups and investors
            </p>
            <p className="text-sm text-indigo-600 mt-1">Roles: {session.user.roles.join(', ')}</p>
          </div>
        </div>

        {/* Welcome Section */}
        <div className="bg-white p-8 rounded-lg shadow text-center mb-8">
          <h2 className="text-2xl font-bold mb-4">Welcome, {session.user.name}!</h2>
          <p className="text-gray-600 mb-6">
            You&apos;re currently viewing the platform as a normal user. Upgrade your account to
            access more features.
          </p>
        </div>

        {/* Upgrade Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-center">
              <div className="text-4xl mb-4">💼</div>
              <h3 className="text-xl font-semibold mb-2">Become an Investor</h3>
              <p className="text-gray-600 mb-4">
                Connect with promising startups and explore investment opportunities
              </p>
              <button className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                Apply as Investor
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-center">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-xl font-semibold mb-2">Register Your Startup</h3>
              <p className="text-gray-600 mb-4">
                Showcase your startup and connect with potential investors
              </p>
              <button className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700">
                Register Startup
              </button>
            </div>
          </div>
        </div>

        {/* Browse Section */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Browse Platform</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <h3 className="font-medium">Explore Startups</h3>
              <p className="text-sm text-gray-600">
                Discover innovative startups from various industries
              </p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <h3 className="font-medium">Find Investors</h3>
              <p className="text-sm text-gray-600">
                Browse investor profiles and their preferences
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
