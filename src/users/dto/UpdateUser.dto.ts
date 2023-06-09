import { IsString, IsEnum, IsEmail, IsOptional } from 'class-validator';
import { Gender } from '../interface/User.interface';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  readonly first_name?: string;

  @IsString()
  @IsOptional()
  readonly last_name?: string;

  @IsEmail()
  @IsOptional()
  readonly email?: string;

  @IsString()
  @IsOptional()
  readonly password?: string;

  @IsString()
  @IsOptional()
  readonly username?: string;

  @IsEnum(Gender)
  @IsOptional()
  readonly gender?: Gender;

  @IsString()
  @IsOptional()
  readonly phone_no?: number;

  @IsString()
  @IsOptional()
  readonly avatar?: string;

  @IsString()
  @IsOptional()
  readonly country?: string;

  @IsString()
  @IsOptional()
  readonly city?: string;
}
