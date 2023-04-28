export enum Gender {
  male,
  female,
  other,
}

export interface User {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  password: string;
  gender?: Gender;
  phone_no?: number;
  avatar?: string;
  country?: string;
}
