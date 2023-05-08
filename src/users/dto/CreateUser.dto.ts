import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsOptional,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ type: String, description: 'first_name' })
  @IsString()
  @IsNotEmpty()
  readonly first_name: string;

  @ApiProperty({ type: String, description: 'last_name' })
  @IsString()
  @IsNotEmpty()
  readonly last_name: string;

  @ApiProperty({ type: String, description: 'email' })
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty({ type: String, description: 'password' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  readonly password: string;

  @ApiPropertyOptional({ type: String, description: 'username' })
  @IsString()
  @IsOptional()
  readonly username?: string;

  @ApiPropertyOptional({ type: String, description: 'gender' })
  @IsString()
  @IsOptional()
  readonly gender?: string;

  @ApiPropertyOptional({ type: String, description: 'phone_no' })
  @IsString()
  @IsOptional()
  readonly phone_no?: string;

  @ApiPropertyOptional({ type: String, description: 'avatar' })
  @IsString()
  @IsOptional()
  readonly avatar?: string;

  @ApiPropertyOptional({ type: String, description: 'country' })
  @IsString()
  @IsOptional()
  readonly country?: string;
}
