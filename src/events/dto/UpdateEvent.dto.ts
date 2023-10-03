import {
  IsString,
  IsEnum,
  IsOptional,
  IsDate,
  IsNumber,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  Category,
  Visibilty,
  TicketType,
} from '../interface/UserEvent.interface';

export class UpdateEventDto {
  @ApiPropertyOptional({ type: String, description: 'name' })
  @IsString()
  @IsOptional()
  readonly name?: string;

  @ApiPropertyOptional({
    enum: Category,
    description: 'category',
    default: Category.WEDDING,
  })
  @IsEnum(Category)
  @IsOptional()
  readonly category?: Category;

  @ApiPropertyOptional({ type: String, description: 'venue' })
  @IsString()
  @IsOptional()
  readonly venue?: string;

  @ApiPropertyOptional({
    type: String,
    description: 'date_of_event',
    default: Date.now(),
  })
  @IsString()
  @IsOptional()
  readonly date_of_event?: string;

  @ApiPropertyOptional({ type: String, description: 'description' })
  @IsString()
  @IsOptional()
  readonly description?: string;

  @ApiPropertyOptional({ type: Number, description: 'ticket quantity' })
  @IsNumber()
  @IsOptional()
  readonly ticket_quantity: number;

  @ApiPropertyOptional({
    enum: TicketType,
    description: 'ticket type',
    default: TicketType.FREE,
  })
  @IsEnum(TicketType)
  @IsOptional()
  readonly ticket_type: TicketType;

  @ApiPropertyOptional({
    enum: Visibilty,
    description: 'visibility',
    default: Visibilty.PUBLIC,
  })
  @IsEnum(Visibilty)
  @IsOptional()
  readonly visibility: Visibilty;

  @IsDate()
  @IsOptional()
  updated_at: string;
}
