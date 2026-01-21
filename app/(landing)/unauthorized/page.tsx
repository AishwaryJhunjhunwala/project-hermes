import Link from 'next/link';
import { auth } from '@/lib/auth';

export default async function UnauthorizedPage() {
  const session = await auth();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">
            You don&apos;t have permission to access this page. This area is restricted to users
            with specific roles.
          </p>

          {session?.user && (
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <p className="text-sm text-gray-600">Current user: {session.user.email}</p>
              <p className="text-sm text-gray-600">Your roles: {session.user.roles.join(', ')}</p>
            </div>
          )}

          <div className="space-y-3">
            <Link
              href="/dashboard"
              className="block w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Go to Dashboard
            </Link>
            <Link
              href="/"
              className="block w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            >
              Go to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
