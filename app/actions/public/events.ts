'use server';

import { db } from '@/lib/db';
import { events } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';

export async function getUpcomingEvents() {
  try {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0]; // Format: YYYY-MM-DD

    const allEvents = await db.query.events.findMany({
      orderBy: [desc(events.date), desc(events.time)],
    });

    // Filter upcoming events (date >= today)
    const upcomingEvents = allEvents.filter((event) => event.date >= todayStr);

    return {
      success: true,
      events: upcomingEvents,
    };
  } catch (error) {
    console.error('Error fetching upcoming events:', error);
    return {
      success: false,
      error: 'Failed to fetch upcoming events',
      events: [],
    };
  }
}

export async function getPastEvents() {
  try {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0]; // Format: YYYY-MM-DD

    const allEvents = await db.query.events.findMany({
      orderBy: [desc(events.date), desc(events.time)],
    });

    // Filter past events (date < today)
    const pastEvents = allEvents.filter((event) => event.date < todayStr);

    return {
      success: true,
      events: pastEvents,
    };
  } catch (error) {
    console.error('Error fetching past events:', error);
    return {
      success: false,
      error: 'Failed to fetch past events',
      events: [],
    };
  }
}

export async function getAllPublicEvents() {
  try {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0]; // Format: YYYY-MM-DD

    const allEvents = await db.query.events.findMany({
      orderBy: [desc(events.date), desc(events.time)],
    });

    // Categorize events
    const upcomingEvents = allEvents.filter((event) => event.date >= todayStr);
    const pastEvents = allEvents.filter((event) => event.date < todayStr);

    return {
      success: true,
      upcomingEvents,
      pastEvents,
    };
  } catch (error) {
    console.error('Error fetching events:', error);
    return {
      success: false,
      error: 'Failed to fetch events',
      upcomingEvents: [],
      pastEvents: [],
    };
  }
}
