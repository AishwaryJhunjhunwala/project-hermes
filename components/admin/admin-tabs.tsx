'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UsersManagement } from './users-management';
import { StartupsManagement } from './startups-management';
import { InvestorsManagement } from './investors-management';
import { ApplicationsManagement } from './applications-management';
import { EventsManagement } from './events-management';
import { MembersManagement } from './members-management';
import {
  Users,
  Rocket,
  TrendingUp,
  FileText,
  CalendarDays,
  Users as MembersIcon,
} from 'lucide-react';

export function AdminTabs() {
  return (
    <Tabs defaultValue="users" className="w-full">
      <TabsList className="grid w-full grid-cols-5 mb-8">
        <TabsTrigger value="users" className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          <span className="hidden sm:inline">Manage Users</span>
          <span className="sm:hidden">Users</span>
        </TabsTrigger>
        <TabsTrigger value="startups" className="flex items-center gap-2">
          <Rocket className="h-4 w-4" />
          <span className="hidden sm:inline">Manage Startups</span>
          <span className="sm:hidden">Startups</span>
        </TabsTrigger>
        <TabsTrigger value="investors" className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          <span className="hidden sm:inline">Manage Investors</span>
          <span className="sm:hidden">Investors</span>
        </TabsTrigger>
        <TabsTrigger value="applications" className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          <span className="hidden sm:inline">Applications</span>
          <span className="sm:hidden">Apps</span>
        </TabsTrigger>
        <TabsTrigger value="events" className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4" />
          <span className="hidden sm:inline">Events</span>
          <span className="sm:hidden">Events</span>
        </TabsTrigger>
        <TabsTrigger value="members" className="flex items-center gap-2">
          <MembersIcon className="h-4 w-4" />
          <span className="hidden sm:inline">Manage Members</span>
          <span className="sm:hidden">Members</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="users" className="mt-0">
        <UsersManagement />
      </TabsContent>

      <TabsContent value="startups" className="mt-0">
        <StartupsManagement />
      </TabsContent>

      <TabsContent value="investors" className="mt-0">
        <InvestorsManagement />
      </TabsContent>

      <TabsContent value="applications" className="mt-0">
        <ApplicationsManagement />
      </TabsContent>

      <TabsContent value="events" className="mt-0">
        <EventsManagement />
      </TabsContent>

      <TabsContent value="members" className="mt-0">
        <MembersManagement />
      </TabsContent>
    </Tabs>
  );
}
