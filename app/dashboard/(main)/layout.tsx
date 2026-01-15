import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/dashboard/app-sidebar';
import { auth } from '@/lib/auth';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-white">
        <AppSidebar user={session?.user} />
        <main className="flex-1 w-full bg-gray-50/50">
          <div className="p-4 flex items-center gap-4 border-b border-gray-200 bg-white sticky top-0 z-10">
            <SidebarTrigger />
            <div className="flex-1 h-8" />
          </div>
          <div className="p-6">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
}
