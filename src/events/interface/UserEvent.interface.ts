import { Comment } from 'src/comments/interface/Comment.interface';
import { Attendee } from 'src/attendees/interface/Attendee.interface';
import { Ticket } from 'src/ticketing/interface/Ticket.interface';

export enum Visibilty {
  PUBLIC = 'public',
  PRIVATE = 'private',
}

export enum Category {
  WEDDING = 'wedding',
  BIRTHDAY = 'birthday',
  CONVOCATION = 'convocation',
  ANNIVERSARY = 'anniversary',
  OTHER = 'other',
}

export enum TicketType {
  FREE = 'free',
  PAID = 'paid',
}

export interface UserEvent {
  id: string;
  name: string;
  category: Category;
  venue: string;
  date_of_event: string;
  description: string;
  visibility: Visibilty;
  avatar: string;
  comments?: Comment[];
  attendees?: Attendee[];
  ticket_quantity: number;
  ticket_type: TicketType;
  tickets?: Ticket[];
  updated_at?: string;
  owner_id?: string;
}
