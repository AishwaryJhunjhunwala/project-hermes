'use server';

import { db } from '@/lib/db';
import { userRoles } from '@/lib/db/schema';
import { and, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import type { Role } from '@/types/auth';

export async function assignRole(userId: number, role: Role) {
  try {
    // Check if user already has this role
    const existingRole = await db.query.userRoles.findFirst({
      where: and(eq(userRoles.userId, userId), eq(userRoles.role, role)),
    });

    if (existingRole) {
      return { success: false, error: 'User already has this role' };
    }

    await db.insert(userRoles).values({
      userId,
      role,
    });

    revalidatePath('/dashboard/admin');
    return { success: true };
  } catch (error) {
    console.error('Error assigning role:', error);
    return { success: false, error: 'Failed to assign role' };
  }
}

export async function removeRole(userId: number, role: Role) {
  try {
    await db.delete(userRoles).where(and(eq(userRoles.userId, userId), eq(userRoles.role, role)));

    revalidatePath('/dashboard/admin');
    return { success: true };
  } catch (error) {
    console.error('Error removing role:', error);
    return { success: false, error: 'Failed to remove role' };
  }
}
