import { getAllPublicEvents } from '@/app/actions/public/events';
import EventsContent from './events-content';

export const metadata = {
  title: 'Events & Workshops | Community',
  description: 'Join our community events, workshops, and networking sessions to learn and grow.',
};

export default async function EventsPage() {
  const { upcomingEvents = [], pastEvents = [] } = await getAllPublicEvents();

  return <EventsContent upcomingEvents={upcomingEvents} pastEvents={pastEvents} />;
}
