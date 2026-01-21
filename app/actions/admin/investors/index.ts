'use server';

import { db } from '@/lib/db';
import { investors, userRoles } from '@/lib/db/schema';
import { eq, count, ilike, or, and } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import type { ApplicationStatus } from '@/types/investor';

export interface GetInvestorsParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: ApplicationStatus;
  statusFilter?: ApplicationStatus | 'all';
  excludePending?: boolean;
}

export async function getAllInvestorApplications(params: GetInvestorsParams = {}) {
  const {
    page = 1,
    pageSize = 10,
    search = '',
    status,
    statusFilter = 'all',
    excludePending = false,
  } = params;

  const actualStatusFilter = status || statusFilter;
  const offset = (page - 1) * pageSize;

  try {
    // Build where conditions
    const conditions = [];

    // Search filter
    if (search) {
      conditions.push(
        or(
          ilike(investors.investorName, `%${search}%`),
          ilike(investors.city, `%${search}%`),
          ilike(investors.state, `%${search}%`)
        )
      );
    }

    // Status filter
    if (actualStatusFilter !== 'all') {
      conditions.push(eq(investors.applicationStatus, actualStatusFilter));
    } else if (excludePending) {
      // Exclude pending applications when excludePending is true
      conditions.push(
        or(
          eq(investors.applicationStatus, 'approved'),
          eq(investors.applicationStatus, 'rejected'),
          eq(investors.applicationStatus, 'banned')
        )
      );
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // Get total count
    const [{ value: totalCount }] = await db
      .select({ value: count() })
      .from(investors)
      .where(whereClause);

    // Get paginated investors with user info
    const allInvestors = await db.query.investors.findMany({
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
      orderBy: (investors, { desc }) => [desc(investors.createdAt)],
    });

    const totalPages = Math.ceil(totalCount / pageSize);

    return {
      success: true,
      investors: allInvestors,
      totalCount,
      totalPages,
      currentPage: page,
    };
  } catch (error) {
    console.error('Error fetching investor applications:', error);
    return {
      success: false,
      error: 'Failed to fetch applications',
      investors: [],
      totalCount: 0,
      totalPages: 0,
      currentPage: page,
    };
  }
}

export async function approveInvestorApplication(investorId: number) {
  try {
    const updated = await db
      .update(investors)
      .set({
        applicationStatus: 'approved',
        rejectionReason: null,
        updatedAt: new Date(),
      })
      .where(eq(investors.id, investorId))
      .returning();

    if (updated.length > 0) {
      // Assign investor role to user
      await db.insert(userRoles).values({
        userId: updated[0].userId,
        role: 'investor',
      });
    }

    revalidatePath('/dashboard/admin');
    revalidatePath('/dashboard/user');

    return {
      success: true,
    };
  } catch (error) {
    console.error('Error approving investor:', error);
    return {
      success: false,
      error: 'Failed to approve investor',
    };
  }
}

export async function rejectInvestorApplication(investorId: number, reason: string) {
  try {
    await db
      .update(investors)
      .set({
        applicationStatus: 'rejected',
        rejectionReason: reason,
        updatedAt: new Date(),
      })
      .where(eq(investors.id, investorId));

    revalidatePath('/dashboard/admin');
    revalidatePath('/dashboard/user');

    return {
      success: true,
    };
  } catch (error) {
    console.error('Error rejecting investor:', error);
    return {
      success: false,
      error: 'Failed to reject investor',
    };
  }
}

export async function banInvestorApplication(investorId: number, reason: string) {
  try {
    await db
      .update(investors)
      .set({
        applicationStatus: 'banned',
        rejectionReason: reason,
        updatedAt: new Date(),
      })
      .where(eq(investors.id, investorId));

    revalidatePath('/dashboard/admin');
    revalidatePath('/dashboard/user');

    return {
      success: true,
    };
  } catch (error) {
    console.error('Error banning investor:', error);
    return {
      success: false,
      error: 'Failed to ban investor',
    };
  }
}
