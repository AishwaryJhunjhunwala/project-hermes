'use client';

import * as React from 'react';
import {
  AppWindow,
  Briefcase,
  LayoutDashboard,
  Users,
  Building2,
  Calendar,
  LogOut,
  Rocket,
} from 'lucide-react';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar';
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import { Separator } from '@/components/ui/separator';

export function AppSidebar({
  user,
  ...props
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}: React.ComponentProps<typeof Sidebar> & { user: any }) {
  const pathname = usePathname();

  // Define menus for each role
  const menus = {
    admin: [
      {
        title: 'Core Management',
        items: [
          { title: 'Users', url: '/dashboard/admin/users', icon: Users },
          { title: 'Startups', url: '/dashboard/admin/startups', icon: Building2 },
          { title: 'Investors', url: '/dashboard/admin/investors', icon: Briefcase },
          { title: 'Applications', url: '/dashboard/admin/applications', icon: AppWindow },
        ],
      },
      {
        title: 'Site Management',
        items: [
          { title: 'Events', url: '/dashboard/admin/events', icon: Calendar },
          { title: 'Members', url: '/dashboard/admin/members', icon: Users },
        ],
      },
    ],
    investor: [
      {
        title: 'Overview',
        items: [{ title: 'Dashboard', url: '/dashboard/investor', icon: LayoutDashboard }],
      },
      {
        title: 'Deal Flow',
        items: [
          { title: 'Browse Startups', url: '/dashboard/investor/startups', icon: Building2 },
          { title: 'My Portfolio', url: '/dashboard/investor/portfolio', icon: Briefcase },
        ],
      },
    ],
    startup: [
      {
        title: 'Overview',
        items: [{ title: 'Dashboard', url: '/dashboard/startup', icon: LayoutDashboard }],
      },
      {
        title: 'My Startup',
        items: [
          { title: 'Profile', url: '/dashboard/startup/profile', icon: Building2 },
          { title: 'Documents', url: '/dashboard/startup/documents', icon: AppWindow },
        ],
      },
    ],
    user: [
      {
        title: 'Overview',
        items: [{ title: 'Dashboard', url: '/dashboard/user', icon: LayoutDashboard }],
      },
      {
        title: 'Explore',
        items: [
          { title: 'Startups', url: '/dashboard/user/startups', icon: Building2 },
          { title: 'Investors', url: '/dashboard/user/investors', icon: Briefcase },
          { title: 'Events', url: '/dashboard/user/events', icon: Calendar },
        ],
      },
      {
        title: 'Join',
        items: [
          { title: 'Apply as Investor', url: '/dashboard/user/apply-investor', icon: Briefcase },
          { title: 'Register Startup', url: '/dashboard/user/register-startup', icon: Rocket },
        ],
      },
    ],
  };

  // Determine which menu to show based on current URL path
  // This is better than session role because a user might be viewing a specific dashboard
  const getActiveMenu = () => {
    if (pathname?.startsWith('/dashboard/admin')) return menus.admin;
    if (pathname?.startsWith('/dashboard/investor')) return menus.investor;
    if (pathname?.startsWith('/dashboard/startup')) return menus.startup;
    return menus.user;
  };

  const activeMenu = getActiveMenu();

  return (
    <Sidebar collapsible="icon" className="border-r border-gray-200 bg-white" {...props}>
      <SidebarHeader className="bg-white border-b border-gray-100 p-4">
        <Link href="/" className="flex items-center gap-3 font-bold text-xl text-black">
          <div className="bg-black text-white w-8 h-8 rounded-lg flex items-center justify-center shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="leading-none text-lg">Ecell</span>
            <span className="text-[10px] uppercase tracking-wider text-gray-500 font-medium">
              NITRKL
            </span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent className="bg-white px-2">
        {activeMenu.map((group) => (
          <SidebarGroup key={group.title} className="mt-3">
            <SidebarGroupLabel className="text-xs font-bold text-gray-400 uppercase tracking-wider px-3 mb-1">
              {group.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.url}
                      className="group/button relative overflow-hidden text-gray-600 hover:text-blue-700 hover:bg-blue-50 data-[active=true]:bg-blue-600 data-[active=true]:text-white data-[active=true]:shadow-md data-[active=true]:shadow-blue-100 font-medium px-3 py-2.5 rounded-xl transition-all duration-200"
                    >
                      <Link href={item.url} className="flex items-center gap-3">
                        <item.icon className="w-5 h-5 transition-transform group-hover/button:scale-110 group-data-[active=true]/button:text-white" />
                        <span>{item.title}</span>
                        {/* Active Indicator Strip (Optional, maybe too much, let's keep it simple first) */}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="bg-white border-t border-gray-100 p-4 space-y-4">
        {/* User Profile */}
        <div className="flex items-center gap-3 px-2">
          <Avatar className="h-9 w-9 rounded-lg border border-gray-200">
            <AvatarImage src={user?.image || ''} alt={user?.name || ''} />
            <AvatarFallback className="rounded-lg bg-blue-50 text-blue-600 font-semibold">
              {user?.name?.slice(0, 2).toUpperCase() || 'CN'}
            </AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
            <span className="truncate font-semibold text-gray-900">{user?.name}</span>
            <span className="truncate text-xs text-gray-500">{user?.email}</span>
          </div>
        </div>

        {/* Logout Button - Moved out of dropdown as requested */}
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => signOut()}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 group-data-[collapsible=icon]:justify-center"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium group-data-[collapsible=icon]:hidden">Log out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
