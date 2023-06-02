import { Comment } from 'src/comments/interface/comment.interface';

export enum Visibilty {
  public,
  private,
}

export enum Category {
  wedding,
  birthday,
  other,
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
  updated_at?: string;
  owner_id?: string;
}
