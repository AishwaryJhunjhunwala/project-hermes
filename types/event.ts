export type EventMode = 'online' | 'offline';

export interface EventFormData {
  name: string;
  description: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  mode: EventMode;
  location: string | null;
  link: string | null;
}

export interface Event extends EventFormData {
  id: number;
  createdAt: Date;
  updatedAt: Date;
}
