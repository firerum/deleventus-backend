import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDateString,
  IsDate,
} from 'class-validator';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  readonly category: string;

  @IsString()
  @IsNotEmpty()
  readonly venue: string;

  @IsDateString()
  @IsNotEmpty()
  readonly date_of_event: string;

  @IsString()
  @IsNotEmpty()
  readonly description: string;

  @IsString()
  @IsOptional()
  readonly visibility: string;
}
