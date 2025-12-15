'use server';

import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function banUser(userId: number) {
  try {
    await db.update(users).set({ isBanned: true }).where(eq(users.id, userId));

    revalidatePath('/dashboard/admin');
    return { success: true };
  } catch (error) {
    console.error('Error banning user:', error);
    return { success: false, error: 'Failed to ban user' };
  }
}

export async function unbanUser(userId: number) {
  try {
    await db.update(users).set({ isBanned: false }).where(eq(users.id, userId));

    revalidatePath('/dashboard/admin');
    return { success: true };
  } catch (error) {
    console.error('Error unbanning user:', error);
    return { success: false, error: 'Failed to unban user' };
  }
}
