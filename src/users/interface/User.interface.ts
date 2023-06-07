import { UserEvent } from 'src/events/interface/UserEvent.interface';

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  username?: string;
  gender?: Gender;
  phone_no?: number;
  avatar?: string;
  country?: string;
  city?: string;
  events: UserEvent[];
  is_verified: boolean;
  refresh_token?: string;
}
