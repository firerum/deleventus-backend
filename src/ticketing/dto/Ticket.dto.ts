import { IsString, IsNotEmpty, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TicketDto {
  @ApiProperty({ type: String, default: 'johndoe@gmail.com' })
  @IsNotEmpty()
  @IsEmail()
  readonly attendee_email: string;

  @ApiProperty({ type: String, default: 'john' })
  @IsNotEmpty()
  @IsString()
  readonly attendee_first_name: string;

  @ApiProperty({ type: String, default: 'doe' })
  @IsNotEmpty()
  @IsString()
  readonly attendee_last_name: string;

  @ApiProperty({ type: String, default: '09032578935' })
  @IsNotEmpty()
  @IsString()
  readonly attendee_phone_no: string;
}
