'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { createEvent, updateEvent } from '@/app/actions/admin/events';
import type { Event, EventFormData, EventMode } from '@/types/event';

interface EventFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event: Event | null;
  onSuccess: () => void;
}

export function EventFormDialog({ open, onOpenChange, event, onSuccess }: EventFormDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getInitialFormData = (): EventFormData => {
    if (event) {
      return {
        name: event.name,
        description: event.description,
        date: event.date,
        time: event.time,
        mode: event.mode,
        location: event.location || '',
        link: event.link || '',
      };
    }
    return {
      name: '',
      description: '',
      date: '',
      time: '',
      mode: 'offline',
      location: '',
      link: '',
    };
  };

  const [formData, setFormData] = useState<EventFormData>(getInitialFormData());

  useEffect(() => {
    if (open) {
      setFormData(getInitialFormData());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, event]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('Event name is required');
      return;
    }

    if (!formData.description.trim()) {
      toast.error('Description is required');
      return;
    }

    if (!formData.date) {
      toast.error('Date is required');
      return;
    }

    if (!formData.time) {
      toast.error('Time is required');
      return;
    }

    if (formData.mode === 'offline' && !formData.location?.trim()) {
      toast.error('Location is required for offline events');
      return;
    }

    if (formData.mode === 'online' && !formData.link?.trim()) {
      toast.error('Link is required for online events');
      return;
    }

    setIsSubmitting(true);

    const result = event ? await updateEvent(event.id, formData) : await createEvent(formData);

    setIsSubmitting(false);

    if (result.success) {
      toast.success(event ? 'Event updated successfully' : 'Event created successfully');
      onSuccess();
    } else {
      toast.error(result.error || 'Failed to save event');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{event ? 'Edit Event' : 'Create New Event'}</DialogTitle>
          <DialogDescription>
            {event ? 'Update event details' : 'Fill in the details to create a new event'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Event Name *</Label>
            <Input
              id="name"
              placeholder="e.g., Startup Pitch Night"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Describe the event..."
              value={formData.description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={4}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">Time *</Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="mode">Event Mode *</Label>
            <Select
              value={formData.mode}
              onValueChange={(value: EventMode) => setFormData({ ...formData, mode: value })}
            >
              <SelectTrigger id="mode">
                <SelectValue placeholder="Select event mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="offline">Offline</SelectItem>
                <SelectItem value="online">Online</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.mode === 'offline' ? (
            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                placeholder="e.g., Conference Hall, Building A"
                value={formData.location || ''}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="link">Event Link *</Label>
              <Input
                id="link"
                type="url"
                placeholder="https://meet.google.com/..."
                value={formData.link || ''}
                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
              />
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : event ? 'Update Event' : 'Create Event'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
