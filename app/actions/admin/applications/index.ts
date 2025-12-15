'use server';

import { db } from '@/lib/db';
import { startups, investors } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function getPendingApplications() {
  try {
    // Get pending startup applications
    const pendingStartups = await db.query.startups.findMany({
      where: eq(startups.applicationStatus, 'pending'),
      with: {
        user: {
          columns: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
      orderBy: (startups, { desc }) => [desc(startups.createdAt)],
    });

    // Get pending investor applications
    const pendingInvestors = await db.query.investors.findMany({
      where: eq(investors.applicationStatus, 'pending'),
      with: {
        user: {
          columns: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
      orderBy: (investors, { desc }) => [desc(investors.createdAt)],
    });

    return {
      success: true,
      startups: pendingStartups,
      investors: pendingInvestors,
    };
  } catch (error) {
    console.error('Error fetching pending applications:', error);
    return {
      success: false,
      error: 'Failed to fetch pending applications',
      startups: [],
      investors: [],
    };
  }
}
