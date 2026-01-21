'use server';

import { db } from '@/lib/db';
import { members } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function getExecutiveMembers() {
  try {
    const executives = await db
      .select()
      .from(members)
      .where(eq(members.memberType, 'EXECUTIVE'))
      .orderBy(members.createdAt);

    return {
      success: true,
      data: executives,
    };
  } catch (error) {
    console.error('Error fetching executive members:', error);
    return {
      success: false,
      error: 'Failed to fetch executive members',
    };
  }
}
