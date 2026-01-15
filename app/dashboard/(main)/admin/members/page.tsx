import { MembersManagement } from '@/components/admin/members-management';
import { requireAdmin } from '@/lib/auth/role-guards';

export default async function AdminMembersPage() {
  await requireAdmin();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Member Management</h1>
        <p className="text-gray-500">Manage team members and roles.</p>
      </div>
      <MembersManagement />
    </div>
  );
}
