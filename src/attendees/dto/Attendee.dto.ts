import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsDate,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Status } from '../interface/Attendee.interface';

export class CreateAttendeeDto {
  @ApiProperty({ enum: Status, description: 'status' })
  @IsEnum(Status)
  readonly status: Status;
}
