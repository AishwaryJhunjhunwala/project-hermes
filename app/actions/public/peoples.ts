'use server';

import { db } from '@/lib/db';
import { investors, speakers } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';

export async function getFeaturedSpeakers() {
  try {
    const featuredSpeakers = await db
      .select()
      .from(speakers)
      .orderBy(desc(speakers.createdAt))
      .limit(10);
    return { success: true, data: featuredSpeakers };
  } catch (error) {
    console.error('Error fetching speakers:', error);
    return { success: false, error: 'Failed to fetch speakers' };
  }
}

export async function getFeaturedInvestors() {
  try {
    const featuredInvestors = await db
      .select()
      .from(investors)
      .orderBy(desc(investors.createdAt))
      .limit(10);

    // Map to a common structure if needed or just return as is
    // Investors table has distinct fields, but for a carousel we likely need
    // Name, Image (if exists, or placeholder), Company (investorType?), Designation (Investor)

    return { success: true, data: featuredInvestors };
  } catch (error) {
    console.error('Error fetching investors:', error);
    return { success: false, error: 'Failed to fetch investors' };
  }
}
