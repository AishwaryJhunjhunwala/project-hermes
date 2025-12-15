'use server';

import { db } from '@/lib/db';
import { startups } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import type { StartupFormData } from '@/types/startup';

export async function submitStartupApplication(userId: number, data: StartupFormData) {
  try {
    const [startup] = await db
      .insert(startups)
      .values({
        userId,
        ...data,
        applicationStatus: 'pending',
      })
      .returning();

    revalidatePath('/dashboard/user');
    revalidatePath('/dashboard/admin');

    return { success: true, startup };
  } catch (error) {
    console.error('Error submitting startup application:', error);
    return { success: false, error: 'Failed to submit application' };
  }
}

export async function updateStartupApplication(
  startupId: number,
  userId: number,
  data: StartupFormData
) {
  try {
    // Only allow editing if status is pending
    const [existing] = await db
      .select()
      .from(startups)
      .where(and(eq(startups.id, startupId), eq(startups.userId, userId)));

    if (!existing) {
      return { success: false, error: 'Startup not found' };
    }

    if (existing.applicationStatus !== 'pending') {
      return { success: false, error: 'Can only edit pending applications' };
    }

    const [updated] = await db
      .update(startups)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(startups.id, startupId))
      .returning();

    revalidatePath('/dashboard/user');
    revalidatePath('/dashboard/admin');

    return { success: true, startup: updated };
  } catch (error) {
    console.error('Error updating startup application:', error);
    return { success: false, error: 'Failed to update application' };
  }
}

export async function getUserStartups(userId: number) {
  try {
    const userStartups = await db.query.startups.findMany({
      where: eq(startups.userId, userId),
      orderBy: (startups, { desc }) => [desc(startups.createdAt)],
    });

    return { success: true, startups: userStartups };
  } catch (error) {
    console.error('Error fetching user startups:', error);
    return { success: false, error: 'Failed to fetch startups', startups: [] };
  }
}

export async function getStartupById(startupId: number, userId: number) {
  try {
    const startup = await db.query.startups.findFirst({
      where: and(eq(startups.id, startupId), eq(startups.userId, userId)),
    });

    if (!startup) {
      return { success: false, error: 'Startup not found' };
    }

    return { success: true, startup };
  } catch (error) {
    console.error('Error fetching startup:', error);
    return { success: false, error: 'Failed to fetch startup' };
  }
}
