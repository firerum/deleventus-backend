import { Comment } from 'src/comments/interface/comment.interface';
import { Attendee } from 'src/attendees/interface/Attendee.interface';

export enum Visibilty {
  PUBLIC = 'public',
  PRIVATE = 'private',
}

export enum Category {
  WEDDING = 'wedding',
  BIRTHDAY = 'birthday',
  CONVOCATION = 'convocation',
  OTHERS = 'others',
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
  updated_at?: string;
  owner_id?: string;
}
