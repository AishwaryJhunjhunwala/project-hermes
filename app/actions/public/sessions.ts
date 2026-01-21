'use server';

import { db } from '@/lib/db';
import { sessions } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';

export async function getAllSessions() {
  try {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0]; // Format: YYYY-MM-DD

    const allSessions = await db.query.sessions.findMany({
      orderBy: [desc(sessions.date), desc(sessions.startTime)],
    });

    // Categorize sessions
    const upcomingSessions = allSessions.filter((session) => session.date >= todayStr);
    const pastSessions = allSessions.filter((session) => session.date < todayStr);

    return {
      success: true,
      upcomingSessions,
      pastSessions,
    };
  } catch (error) {
    console.error('Error fetching sessions:', error);
    return {
      success: false,
      error: 'Failed to fetch sessions',
      upcomingSessions: [],
      pastSessions: [],
    };
  }
}
