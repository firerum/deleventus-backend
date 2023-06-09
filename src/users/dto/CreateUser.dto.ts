import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsOptional,
  MinLength,
  IsEnum,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Gender } from '../interface/User.interface';

export class CreateUserDto {
  @ApiProperty({ type: String, description: 'first_name', default: 'John' })
  @IsString()
  @IsNotEmpty()
  readonly first_name: string;

  @ApiProperty({ type: String, description: 'last_name', default: 'Doe' })
  @IsString()
  @IsNotEmpty()
  readonly last_name: string;

  @ApiProperty({
    type: String,
    description: 'email',
    default: 'johndoe@gmail.com',
  })
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty({ type: String, description: 'password', default: '123456' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  readonly password: string;

  @ApiPropertyOptional({ type: String, description: 'username' })
  @IsString()
  @IsOptional()
  readonly username?: string;

  @ApiPropertyOptional({ enum: Gender, description: 'gender' })
  @IsEnum(Gender)
  @IsOptional()
  readonly gender?: Gender;

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
