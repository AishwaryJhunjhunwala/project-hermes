'use server';

import { db } from '@/lib/db';
import { events } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import type { EventFormData } from '@/types/event';

export async function getAllEvents() {
  try {
    const allEvents = await db.query.events.findMany({
      orderBy: [desc(events.date), desc(events.time)],
    });

    return {
      success: true,
      events: allEvents,
    };
  } catch (error) {
    console.error('Error fetching events:', error);
    return {
      success: false,
      error: 'Failed to fetch events',
      events: [],
    };
  }
}

export async function getEventById(eventId: number) {
  try {
    const event = await db.query.events.findFirst({
      where: eq(events.id, eventId),
    });

    if (!event) {
      return {
        success: false,
        error: 'Event not found',
      };
    }

    return {
      success: true,
      event,
    };
  } catch (error) {
    console.error('Error fetching event:', error);
    return {
      success: false,
      error: 'Failed to fetch event',
    };
  }
}

export async function createEvent(data: EventFormData) {
  try {
    // Validate that location is provided for offline events
    if (data.mode === 'offline' && !data.location?.trim()) {
      return {
        success: false,
        error: 'Location is required for offline events',
      };
    }

    // Validate that link is provided for online events
    if (data.mode === 'online' && !data.link?.trim()) {
      return {
        success: false,
        error: 'Link is required for online events',
      };
    }

    const [newEvent] = await db
      .insert(events)
      .values({
        name: data.name,
        description: data.description,
        date: data.date,
        time: data.time,
        mode: data.mode,
        location: data.mode === 'offline' ? data.location : null,
        link: data.mode === 'online' ? data.link : null,
        updatedAt: new Date(),
      })
      .returning();

    revalidatePath('/dashboard/admin');

    return {
      success: true,
      event: newEvent,
    };
  } catch (error) {
    console.error('Error creating event:', error);
    return {
      success: false,
      error: 'Failed to create event',
    };
  }
}

export async function updateEvent(eventId: number, data: EventFormData) {
  try {
    // Validate that location is provided for offline events
    if (data.mode === 'offline' && !data.location?.trim()) {
      return {
        success: false,
        error: 'Location is required for offline events',
      };
    }

    // Validate that link is provided for online events
    if (data.mode === 'online' && !data.link?.trim()) {
      return {
        success: false,
        error: 'Link is required for online events',
      };
    }

    const [updatedEvent] = await db
      .update(events)
      .set({
        name: data.name,
        description: data.description,
        date: data.date,
        time: data.time,
        mode: data.mode,
        location: data.mode === 'offline' ? data.location : null,
        link: data.mode === 'online' ? data.link : null,
        updatedAt: new Date(),
      })
      .where(eq(events.id, eventId))
      .returning();

    if (!updatedEvent) {
      return {
        success: false,
        error: 'Event not found',
      };
    }

    revalidatePath('/dashboard/admin');

    return {
      success: true,
      event: updatedEvent,
    };
  } catch (error) {
    console.error('Error updating event:', error);
    return {
      success: false,
      error: 'Failed to update event',
    };
  }
}

export async function deleteEvent(eventId: number) {
  try {
    await db.delete(events).where(eq(events.id, eventId));

    revalidatePath('/dashboard/admin');

    return {
      success: true,
    };
  } catch (error) {
    console.error('Error deleting event:', error);
    return {
      success: false,
      error: 'Failed to delete event',
    };
  }
}
