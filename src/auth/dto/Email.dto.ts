import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EmailDto {
  @ApiProperty({
    type: String,
    description: 'email',
    default: 'johndoe@gmail.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
