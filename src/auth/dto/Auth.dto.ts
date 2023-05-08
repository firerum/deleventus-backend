import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthDto {
  @ApiProperty({ type: String, description: 'email' })
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty({ type: String, description: 'Password' })
  @IsString()
  @IsNotEmpty()
  readonly password: string;
}
