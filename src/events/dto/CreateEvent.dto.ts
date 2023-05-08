import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDateString,
  IsDate,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEventDto {
  @ApiProperty({ type: String, description: 'name' })
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({ type: String, description: 'category', default: 'wedding' })
  @IsString()
  @IsNotEmpty()
  readonly category: string;

  @ApiProperty({ type: String, description: 'venue' })
  @IsString()
  @IsNotEmpty()
  readonly venue: string;

  @ApiProperty({
    type: String,
    description: 'date_of_event',
    default: Date.now(),
  })
  @IsString()
  @IsNotEmpty()
  readonly date_of_event: string;

  @ApiProperty({ type: String, description: 'description' })
  @IsString()
  @IsNotEmpty()
  readonly description: string;

  @ApiProperty({ type: String, description: 'visibility', default: 'public' })
  @IsString()
  @IsOptional()
  readonly visibility: string;
}
