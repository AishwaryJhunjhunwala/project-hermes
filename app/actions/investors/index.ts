'use server';

import { db } from '@/lib/db';
import { investors, users } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import type { InvestorFormData } from '@/types/investor';

export async function submitInvestorApplication(userId: number, data: InvestorFormData) {
  try {
    // Verify user exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!existingUser) {
      return {
        success: false,
        error: 'User account not found. Please try signing out and signing in again.',
      };
    }

    const [newInvestor] = await db
      .insert(investors)
      .values({
        userId,
        ...data,
        applicationStatus: 'pending',
      })
      .returning();

    revalidatePath('/dashboard/user');
    revalidatePath('/dashboard/user/apply-investor');

    return {
      success: true,
      investor: newInvestor,
    };
  } catch (error) {
    console.error('Error submitting investor application:', error);
    return {
      success: false,
      error: 'Failed to submit application',
    };
  }
}

export async function updateInvestorApplication(
  investorId: number,
  userId: number,
  data: InvestorFormData
) {
  try {
    // Check if the investor belongs to the user
    const existingInvestor = await db.query.investors.findFirst({
      where: and(eq(investors.id, investorId), eq(investors.userId, userId)),
    });

    if (!existingInvestor) {
      return {
        success: false,
        error: 'Investor application not found',
      };
    }

    // Allow editing if pending or rejected (for reapplication)
    if (
      existingInvestor.applicationStatus !== 'pending' &&
      existingInvestor.applicationStatus !== 'rejected'
    ) {
      return {
        success: false,
        error: 'Can only edit pending or rejected applications',
      };
    }

    // If reapplying (was rejected), reset to pending and clear rejection reason
    const isReapplying = existingInvestor.applicationStatus === 'rejected';

    const [updatedInvestor] = await db
      .update(investors)
      .set({
        ...data,
        ...(isReapplying && {
          applicationStatus: 'pending',
          rejectionReason: null,
        }),
        updatedAt: new Date(),
      })
      .where(eq(investors.id, investorId))
      .returning();

    revalidatePath('/dashboard/user');
    revalidatePath('/dashboard/user/apply-investor');
    revalidatePath('/dashboard/admin');

    return {
      success: true,
      investor: updatedInvestor,
    };
  } catch (error) {
    console.error('Error updating investor application:', error);
    return {
      success: false,
      error: 'Failed to update application',
    };
  }
}

export async function getUserInvestor(userId: number) {
  try {
    const investor = await db.query.investors.findFirst({
      where: eq(investors.userId, userId),
    });

    return {
      success: true,
      investor: investor || null,
    };
  } catch (error) {
    console.error('Error fetching investor:', error);
    return {
      success: false,
      error: 'Failed to fetch investor',
      investor: null,
    };
  }
}

export async function getInvestorById(investorId: number, userId: number) {
  try {
    const investor = await db.query.investors.findFirst({
      where: and(eq(investors.id, investorId), eq(investors.userId, userId)),
    });

    if (!investor) {
      return {
        success: false,
        error: 'Investor not found',
        investor: null,
      };
    }

    return {
      success: true,
      investor,
    };
  } catch (error) {
    console.error('Error fetching investor:', error);
    return {
      success: false,
      error: 'Failed to fetch investor',
      investor: null,
    };
  }
}

export async function getApprovedInvestors() {
  try {
    const approvedInvestors = await db.query.investors.findMany({
      where: eq(investors.applicationStatus, 'approved'),
      with: {
        user: {
          columns: {
            name: true,
            email: true,
            id: true,
          },
        },
      },
      orderBy: (investors, { desc }) => [desc(investors.createdAt)],
    });

    return { success: true, investors: approvedInvestors };
  } catch (error) {
    console.error('Error fetching approved investors:', error);
    return { success: false, error: 'Failed to fetch investors', investors: [] };
  }
}
