import { StartupsManagement } from '@/components/admin/startups-management';
import { requireAdmin } from '@/lib/auth/role-guards';

export default async function AdminStartupsPage() {
  await requireAdmin();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Startup Management</h1>
        <p className="text-gray-500">Oversee startup profiles and operations.</p>
      </div>
      <StartupsManagement />
    </div>
  );
}
