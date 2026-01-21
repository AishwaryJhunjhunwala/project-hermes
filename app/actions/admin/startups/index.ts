'use server';

import { db } from '@/lib/db';
import { startups, userRoles } from '@/lib/db/schema';
import { eq, count, ilike, or, and } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import type { ApplicationStatus } from '@/types/startup';

export interface GetStartupsParams {
  page?: number;
  pageSize?: number;
  search?: string;
  statusFilter?: ApplicationStatus | 'all';
  excludePending?: boolean; // New parameter to exclude pending applications
}

export async function getAllStartupApplications(params: GetStartupsParams = {}) {
  const {
    page = 1,
    pageSize = 10,
    search = '',
    statusFilter = 'all',
    excludePending = false,
  } = params;

  const offset = (page - 1) * pageSize;

  try {
    // Build where conditions
    const conditions = [];

    // Search filter
    if (search) {
      conditions.push(
        or(
          ilike(startups.startupName, `%${search}%`),
          ilike(startups.founderName, `%${search}%`),
          ilike(startups.contactEmail, `%${search}%`)
        )
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      conditions.push(eq(startups.applicationStatus, statusFilter));
    } else if (excludePending) {
      // Exclude pending applications when excludePending is true
      conditions.push(
        or(
          eq(startups.applicationStatus, 'approved'),
          eq(startups.applicationStatus, 'rejected'),
          eq(startups.applicationStatus, 'banned')
        )
      );
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // Get total count
    const [{ value: totalCount }] = await db
      .select({ value: count() })
      .from(startups)
      .where(whereClause);

    // Get paginated startups with user info
    const allStartups = await db.query.startups.findMany({
      where: whereClause,
      with: {
        user: {
          columns: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
      limit: pageSize,
      offset: offset,
      orderBy: (startups, { desc }) => [desc(startups.createdAt)],
    });

    const totalPages = Math.ceil(totalCount / pageSize);

    return {
      success: true,
      startups: allStartups,
      totalCount,
      totalPages,
      currentPage: page,
    };
  } catch (error) {
    console.error('Error fetching startup applications:', error);
    return {
      success: false,
      error: 'Failed to fetch applications',
      startups: [],
      totalCount: 0,
      totalPages: 0,
      currentPage: page,
    };
  }
}

export async function approveStartupApplication(startupId: number) {
  try {
    const [updated] = await db
      .update(startups)
      .set({
        applicationStatus: 'approved',
        rejectionReason: null,
        updatedAt: new Date(),
      })
      .where(eq(startups.id, startupId))
      .returning();

    // Assign startup role to user
    await db.insert(userRoles).values({
      userId: updated.userId,
      role: 'startup',
    });

    revalidatePath('/dashboard/admin');
    revalidatePath('/dashboard/user');

    return { success: true, startup: updated };
  } catch (error) {
    console.error('Error approving startup:', error);
    return { success: false, error: 'Failed to approve application' };
  }
}

export async function rejectStartupApplication(startupId: number, reason: string) {
  try {
    const [updated] = await db
      .update(startups)
      .set({
        applicationStatus: 'rejected',
        rejectionReason: reason,
        updatedAt: new Date(),
      })
      .where(eq(startups.id, startupId))
      .returning();

    revalidatePath('/dashboard/admin');
    revalidatePath('/dashboard/user');

    return { success: true, startup: updated };
  } catch (error) {
    console.error('Error rejecting startup:', error);
    return { success: false, error: 'Failed to reject application' };
  }
}

export async function banStartupApplication(startupId: number, reason: string) {
  try {
    const [updated] = await db
      .update(startups)
      .set({
        applicationStatus: 'banned',
        rejectionReason: reason,
        updatedAt: new Date(),
      })
      .where(eq(startups.id, startupId))
      .returning();

    revalidatePath('/dashboard/admin');
    revalidatePath('/dashboard/user');

    return { success: true, startup: updated };
  } catch (error) {
    console.error('Error banning startup:', error);
    return { success: false, error: 'Failed to ban application' };
  }
}
