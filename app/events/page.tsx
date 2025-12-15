import Link from 'next/link';
import { getAllPublicEvents } from '@/app/actions/public/events';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Video, ArrowLeft } from 'lucide-react';

export default async function EventsPage() {
  const { upcomingEvents, pastEvents } = await getAllPublicEvents();

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 to-white">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-slate-900">
            Project Hermes
          </Link>
          <div className="flex gap-6 items-center">
            <Link href="/startups" className="text-slate-700 hover:text-slate-900 font-medium">
              Startups
            </Link>
            <Link href="/events" className="text-slate-700 hover:text-slate-900 font-medium">
              Events
            </Link>
            <Link href="/contact" className="text-slate-700 hover:text-slate-900 font-medium">
              Contact
            </Link>
            <Link href="/auth/signin">
              <Button variant="outline">Sign In</Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="gap-2 mb-4">
              <ArrowLeft className="h-4 w-4" /> Back to Home
            </Button>
          </Link>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Events</h1>
          <p className="text-lg text-slate-600">
            Join our community events, workshops, and networking sessions
          </p>
        </div>

        {/* Upcoming Events */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">Upcoming Events</h2>
          {upcomingEvents.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-slate-600">No upcoming events at the moment. Check back soon!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map((event) => (
                <Card key={event.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="default" className="bg-green-600">
                        Upcoming
                      </Badge>
                      <Badge variant="outline">
                        {event.mode === 'online' ? (
                          <span className="flex items-center gap-1">
                            <Video className="h-3 w-3" /> Online
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" /> Offline
                          </span>
                        )}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl">{event.name}</CardTitle>
                    <CardDescription className="line-clamp-2">{event.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm text-slate-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(event.date)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{event.time}</span>
                      </div>
                      {event.mode === 'offline' && event.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span className="line-clamp-1">{event.location}</span>
                        </div>
                      )}
                      {event.mode === 'online' && event.link && (
                        <div className="flex items-center gap-2">
                          <Video className="h-4 w-4" />
                          <a
                            href={event.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline line-clamp-1"
                          >
                            Join Online
                          </a>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Past Events */}
        <section>
          <h2 className="text-3xl font-bold text-slate-900 mb-6">Past Events</h2>
          {pastEvents.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-slate-600">No past events to display.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastEvents.map((event) => (
                <Card key={event.id} className="opacity-90">
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="secondary">Past Event</Badge>
                      <Badge variant="outline">
                        {event.mode === 'online' ? (
                          <span className="flex items-center gap-1">
                            <Video className="h-3 w-3" /> Online
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" /> Offline
                          </span>
                        )}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl">{event.name}</CardTitle>
                    <CardDescription className="line-clamp-2">{event.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm text-slate-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(event.date)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{event.time}</span>
                      </div>
                      {event.mode === 'offline' && event.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span className="line-clamp-1">{event.location}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Footer */}
      <footer className="border-t mt-16 py-8 bg-slate-50">
        <div className="container mx-auto px-4 text-center text-slate-600">
          <p>&copy; 2025 Project Hermes. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
