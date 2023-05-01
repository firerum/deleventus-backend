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
  name: string;
  category: Category;
  venue: string;
  date_of_event: string;
  description: string;
  visibility: Visibilty;
  updated_at?: string;
  user_email?: string;
}
