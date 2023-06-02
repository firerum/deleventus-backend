import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthDto {
  @ApiProperty({
    type: String,
    description: 'email',
    default: 'johndoe@gmail.com',
  })
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty({ type: String, description: 'Password', default: '123456' })
  @IsString()
  @IsNotEmpty()
  readonly password: string;
}
