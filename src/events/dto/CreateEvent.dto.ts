import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  readonly category: string;

  @IsString()
  @IsNotEmpty()
  readonly venue: string;

  @IsString()
  @IsNotEmpty()
  readonly date_of_event: string;

  @IsString()
  @IsNotEmpty()
  readonly description: string;

  @IsString()
  @IsNotEmpty()
  readonly visibility: string;

  @IsEmail()
  @IsNotEmpty()
  readonly user_email: string;
}
