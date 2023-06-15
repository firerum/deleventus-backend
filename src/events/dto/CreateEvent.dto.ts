import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Category, Visibilty } from '../interface/UserEvent.interface';

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

  @ApiProperty({
    enum: Visibilty,
    description: 'visibility',
    default: Visibilty.PUBLIC,
  })
  @IsEnum(Visibilty)
  @IsNotEmpty()
  readonly visibility: Visibilty;
}
