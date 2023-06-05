export enum Status {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
}

export interface Attendee {
  id: string;
  user_id: string;
  event_id: string;
  status: Status;
}
