export enum Gender {
  male,
  female,
  other,
}

export interface User {
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
}
