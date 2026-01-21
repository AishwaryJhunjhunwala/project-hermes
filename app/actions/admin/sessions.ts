'use server';

import { db } from '@/lib/db';
import { sessions } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

// Type definitions matching the schema
export type SessionInput = {
  name: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  location: string;
  mode: 'online' | 'offline';
  link?: string;
};

export async function createSession(data: SessionInput) {
  try {
    await db.insert(sessions).values({
      name: data.name,
      date: data.date,
      startTime: data.startTime,
      endTime: data.endTime,
      location: data.location,
      mode: data.mode,
      link: data.link,
    });

    revalidatePath('/sessions');
    revalidatePath('/dashboard/admin/sessions'); // Assuming admin dashboard path

    return { success: true, message: 'Session created successfully' };
  } catch (error) {
    console.error('Error creating session:', error);
    return { success: false, error: 'Failed to create session' };
  }
}

export async function updateSession(id: number, data: SessionInput) {
  try {
    await db
      .update(sessions)
      .set({
        name: data.name,
        date: data.date,
        startTime: data.startTime,
        endTime: data.endTime,
        location: data.location,
        mode: data.mode,
        link: data.link,
        updatedAt: new Date(),
      })
      .where(eq(sessions.id, id));

    revalidatePath('/sessions');
    revalidatePath('/dashboard/admin/sessions');

    return { success: true, message: 'Session updated successfully' };
  } catch (error) {
    console.error('Error updating session:', error);
    return { success: false, error: 'Failed to update session' };
  }
}

export async function deleteSession(id: number) {
  try {
    await db.delete(sessions).where(eq(sessions.id, id));

    revalidatePath('/sessions');
    revalidatePath('/dashboard/admin/sessions');

    return { success: true, message: 'Session deleted successfully' };
  } catch (error) {
    console.error('Error deleting session:', error);
    return { success: false, error: 'Failed to delete session' };
  }
}
