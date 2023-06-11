import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class PasswordResetDto {
  @ApiProperty({
    type: String,
    description: 'password',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
