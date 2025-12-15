'use server';

import { db } from '@/lib/db';
import { startups } from '@/lib/db/schema';
import { eq, ilike, or, and } from 'drizzle-orm';
import type { BusinessStage, FundingStatus } from '@/types/startup';

export interface GetApprovedStartupsParams {
  search?: string;
  businessStage?: BusinessStage | 'all';
  fundingStatus?: FundingStatus | 'all';
  industrySector?: string | 'all';
}

export async function getApprovedStartups(params: GetApprovedStartupsParams = {}) {
  const {
    search = '',
    businessStage = 'all',
    fundingStatus = 'all',
    industrySector = 'all',
  } = params;

  try {
    // Build where conditions
    const conditions = [];

    // Only approved startups for public view
    conditions.push(eq(startups.applicationStatus, 'approved'));

    // Search filter
    if (search) {
      conditions.push(
        or(
          ilike(startups.startupName, `%${search}%`),
          ilike(startups.founderName, `%${search}%`),
          ilike(startups.city, `%${search}%`)
        )
      );
    }

    // Business stage filter
    if (businessStage !== 'all') {
      conditions.push(eq(startups.businessStage, businessStage));
    }

    // Funding status filter
    if (fundingStatus !== 'all') {
      conditions.push(eq(startups.fundingStatus, fundingStatus));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // Get all approved startups
    let allStartups = await db.query.startups.findMany({
      where: whereClause,
      orderBy: (startups, { desc }) => [desc(startups.createdAt)],
    });

    // Filter by industry sector if specified (since it's an array field)
    if (industrySector !== 'all') {
      allStartups = allStartups.filter((startup) =>
        startup.industrySectors.includes(industrySector)
      );
    }

    return {
      success: true,
      startups: allStartups,
    };
  } catch (error) {
    console.error('Error fetching approved startups:', error);
    return {
      success: false,
      error: 'Failed to fetch startups',
      startups: [],
    };
  }
}

export async function getStartupById(startupId: number) {
  try {
    const startup = await db.query.startups.findFirst({
      where: and(eq(startups.id, startupId), eq(startups.applicationStatus, 'approved')),
    });

    if (!startup) {
      return {
        success: false,
        error: 'Startup not found',
      };
    }

    return {
      success: true,
      startup,
    };
  } catch (error) {
    console.error('Error fetching startup:', error);
    return {
      success: false,
      error: 'Failed to fetch startup details',
    };
  }
}

// Get unique industry sectors from approved startups
export async function getIndustrySectors() {
  try {
    const approvedStartups = await db.query.startups.findMany({
      where: eq(startups.applicationStatus, 'approved'),
      columns: {
        industrySectors: true,
      },
    });

    const sectorsSet = new Set<string>();
    approvedStartups.forEach((startup) => {
      startup.industrySectors.forEach((sector) => sectorsSet.add(sector));
    });

    const sectors = Array.from(sectorsSet).sort();

    return {
      success: true,
      sectors,
    };
  } catch (error) {
    console.error('Error fetching industry sectors:', error);
    return {
      success: false,
      error: 'Failed to fetch industry sectors',
      sectors: [],
    };
  }
}
