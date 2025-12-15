'use client';

import { useState, useEffect } from 'react';
import { getAllEvents, deleteEvent } from '@/app/actions/admin/events';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import {
  RefreshCw,
  Plus,
  Pencil,
  Trash2,
  Calendar,
  Clock,
  MapPin,
  Link as LinkIcon,
} from 'lucide-react';
import type { Event } from '@/types/event';
import { EventFormDialog } from '@/components/admin/event-form-dialog';

export function EventsManagement() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      const result = await getAllEvents();

      if (result.success) {
        setEvents(result.events as Event[]);
      } else {
        toast.error('Failed to load events');
      }
      setIsLoading(false);
    };

    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setIsLoading(true);
    const result = await getAllEvents();

    if (result.success) {
      setEvents(result.events as Event[]);
    } else {
      toast.error('Failed to load events');
    }
    setIsLoading(false);
  };

  const handleDelete = async () => {
    if (!selectedEventId) return;

    const result = await deleteEvent(selectedEventId);

    if (result.success) {
      toast.success('Event deleted successfully');
      fetchEvents();
      setDeleteDialogOpen(false);
      setSelectedEventId(null);
    } else {
      toast.error(result.error || 'Failed to delete event');
    }
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setFormDialogOpen(true);
  };

  const handleAddNew = () => {
    setEditingEvent(null);
    setFormDialogOpen(true);
  };

  const handleFormSuccess = () => {
    setFormDialogOpen(false);
    setEditingEvent(null);
    fetchEvents();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Events Management</h2>
          <p className="text-muted-foreground">Create and manage platform events</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={fetchEvents} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={handleAddNew} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Event
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Event Name</TableHead>
              <TableHead>Date & Time</TableHead>
              <TableHead>Mode</TableHead>
              <TableHead>Location/Link</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  No events found. Create your first event!
                </TableCell>
              </TableRow>
            ) : (
              events.map((event) => (
                <TableRow key={event.id}>
                  <TableCell className="font-medium">{event.name}</TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="h-3 w-3" />
                        {formatDate(event.date)}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {event.time}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={event.mode === 'online' ? 'default' : 'secondary'}>
                      {event.mode.charAt(0).toUpperCase() + event.mode.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {event.mode === 'offline' ? (
                      <div className="flex items-start gap-1">
                        <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                        <span className="text-sm">{event.location}</span>
                      </div>
                    ) : (
                      <div className="flex items-start gap-1">
                        <LinkIcon className="h-4 w-4 mt-0.5 shrink-0" />
                        <a
                          href={event.link || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline truncate max-w-[200px]"
                        >
                          {event.link}
                        </a>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <p className="text-sm line-clamp-2 max-w-[300px]">{event.description}</p>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(event)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          setSelectedEventId(event.id);
                          setDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Event</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this event? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Event Form Dialog */}
      <EventFormDialog
        open={formDialogOpen}
        onOpenChange={setFormDialogOpen}
        event={editingEvent}
        onSuccess={handleFormSuccess}
      />
    </div>
  );
}
