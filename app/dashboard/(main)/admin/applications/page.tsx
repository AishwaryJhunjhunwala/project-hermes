import { ApplicationsManagement } from '@/components/admin/applications-management';
import { requireAdmin } from '@/lib/auth/role-guards';

export default async function AdminApplicationsPage() {
  await requireAdmin();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Application Management</h1>
        <p className="text-gray-500">Review and process startup/investor applications.</p>
      </div>
      <ApplicationsManagement />
    </div>
  );
}
