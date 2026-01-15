import { InvestorsManagement } from '@/components/admin/investors-management';
import { requireAdmin } from '@/lib/auth/role-guards';

export default async function AdminInvestorsPage() {
  await requireAdmin();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Investor Management</h1>
        <p className="text-gray-500">Manage investor profiles and verification.</p>
      </div>
      <InvestorsManagement />
    </div>
  );
}
