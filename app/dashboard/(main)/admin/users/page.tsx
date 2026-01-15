import { UsersManagement } from '@/components/admin/users-management';
import { requireAdmin } from '@/lib/auth/role-guards';

export default async function AdminUsersPage() {
  await requireAdmin();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">User Management</h1>
        <p className="text-gray-500">Manage platform users and roles.</p>
      </div>
      <UsersManagement />
    </div>
  );
}
