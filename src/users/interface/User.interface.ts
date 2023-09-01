import { UserEvent } from 'src/events/interface/UserEvent.interface';

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  'NON-BINARY' = 'non-binary',
  TRANSGENDER = 'transgender',
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
  access_token: string;
  refresh_token?: string;
}
