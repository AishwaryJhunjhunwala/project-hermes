import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Building2, Briefcase, Calendar } from 'lucide-react';
import Link from 'next/link';

export default async function UserDashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/auth/signin');
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">User Dashboard</h1>
        <p className="text-gray-500">Welcome back, {session.user.name}. Explore the ecosystem.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
              <Building2 className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-gray-900">Startups</h3>
          </div>
          <p className="text-sm text-gray-500 mb-4">
            Discover innovative startups and their founders.
          </p>
          <Link
            href="/dashboard/user/startups"
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            Browse Startups &rarr;
          </Link>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
              <Briefcase className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-gray-900">Investors</h3>
          </div>
          <p className="text-sm text-gray-500 mb-4">
            Connect with investors looking for the next big thing.
          </p>
          <Link
            href="/dashboard/user/investors"
            className="text-sm font-medium text-purple-600 hover:text-purple-700"
          >
            View Investors &rarr;
          </Link>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-orange-50 text-orange-600 rounded-lg">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-gray-900">Events</h3>
          </div>
          <p className="text-sm text-gray-500 mb-4">
            Participate in upcoming ecosystem events and workshops.
          </p>
          <Link
            href="/dashboard/user/events"
            className="text-sm font-medium text-orange-600 hover:text-orange-700"
          >
            See Events &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
