import { IsString, IsNotEmpty, IsNumber, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {
  Category,
  TicketType,
  Visibilty,
} from '../interface/UserEvent.interface';

export class CreateEventDto {
  @ApiProperty({ type: String, description: 'name' })
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({
    enum: Category,
    description: 'category',
    default: Category.WEDDING,
  })
  @IsEnum(Category)
  @IsNotEmpty()
  readonly category: Category;

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

  @ApiProperty({ type: Number, description: 'ticket quantity' })
  @IsNumber()
  readonly ticket_quantity: number;

  @ApiProperty({
    enum: TicketType,
    description: 'ticket type',
    default: TicketType.FREE,
  })
  @IsEnum(TicketType)
  @IsNotEmpty()
  readonly ticket_type: TicketType;

  @ApiProperty({
    enum: Visibilty,
    description: 'visibility',
    default: Visibilty.PUBLIC,
  })
  @IsEnum(Visibilty)
  @IsNotEmpty()
  readonly visibility: Visibilty;
}
