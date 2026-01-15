import { EventsManagement } from '@/components/admin/events-management';
import { requireAdmin } from '@/lib/auth/role-guards';

export default async function AdminEventsPage() {
  await requireAdmin();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Events Management</h1>
        <p className="text-gray-500">Create and manage ecosystem events.</p>
      </div>
      <EventsManagement />
    </div>
  );
}
