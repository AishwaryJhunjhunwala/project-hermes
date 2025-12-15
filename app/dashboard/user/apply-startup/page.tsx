import { requireUser } from '@/lib/auth/role-guards';
import { getUserStartups } from '@/app/actions/startups';
import { StartupApplicationForm } from '@/components/startups/application-form';
import { StartupsList } from '@/components/startups/startups-list';

export default async function ApplyStartupPage() {
  const session = await requireUser();

  const { startups } = await getUserStartups(Number(session.user.id));

  // Check if user already has a pending or approved application
  const hasPendingOrApproved = startups.some(
    (s) => s.applicationStatus === 'pending' || s.applicationStatus === 'approved'
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Startup Application</h1>
          <p className="text-sm text-gray-600 mt-1">
            Apply to register your startup with E-Cell NIT Rourkela
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Existing Applications */}
        {startups.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Your Applications</h2>
            <StartupsList startups={startups} />
          </div>
        )}

        {/* Application Form */}
        {!hasPendingOrApproved ? (
          <div>
            <h2 className="text-lg font-semibold mb-4">
              {startups.length > 0 ? 'Submit New Application' : 'Submit Your Application'}
            </h2>
            <StartupApplicationForm userId={Number(session.user.id)} />
          </div>
        ) : (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800">
              You have a pending or approved application. You can submit a new application once your
              current application is processed.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
