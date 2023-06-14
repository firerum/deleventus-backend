export enum Status {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
}

export enum AttendanceType {
  VIRTUAL = 'virtual',
  PHYSICAL = 'physical',
}

export interface Attendee {
  id: string;
  user_id: string;
  event_id: string;
  status: Status;
  attendance_type: AttendanceType;
}
