import { IsString, IsEnum, IsEmail, IsOptional } from 'class-validator';
import { Gender } from '../interface/User.interface';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiPropertyOptional({ type: String, description: 'first_name' })
  @IsString()
  @IsOptional()
  readonly first_name?: string;

  @ApiPropertyOptional({ type: String, description: 'last_name' })
  @IsString()
  @IsOptional()
  readonly last_name?: string;

  @ApiPropertyOptional({ type: String, description: 'email_name' })
  @IsEmail()
  @IsOptional()
  readonly email?: string;

  @ApiPropertyOptional({ type: String, description: 'password' })
  @IsString()
  @IsOptional()
  readonly password?: string;

  @ApiPropertyOptional({ type: String, description: 'username' })
  @IsString()
  @IsOptional()
  readonly username?: string;

  @ApiPropertyOptional({ enum: Gender, description: 'first_name' })
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

  @ApiPropertyOptional({ type: String, description: 'city' })
  @IsString()
  @IsOptional()
  readonly city?: string;
}
