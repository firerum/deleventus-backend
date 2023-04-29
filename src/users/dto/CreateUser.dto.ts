import { Gender } from 'src/interfaces/User.interface';

export class CreateUserDto {
  readonly first_name: string;
  readonly last_name: string;
  readonly email: string;
  readonly password: string;
  readonly username: string;
  readonly confirm_password: string;
  readonly gender?: Gender;
  readonly phone_no?: number;
  readonly avatar?: string;
  readonly country?: string;
}
