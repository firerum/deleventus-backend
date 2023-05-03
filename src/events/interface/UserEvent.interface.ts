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
  updated_at?: string;
  user_id?: string;
}
