import { IsString, IsEnum, IsOptional, IsDate } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Category, Visibilty } from '../interface/UserEvent.interface';

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

  @ApiPropertyOptional({ type: String, description: 'city' })
  @IsString()
  readonly city: string;

  @ApiPropertyOptional({ type: String, description: 'country' })
  @IsString()
  readonly country: string;

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
