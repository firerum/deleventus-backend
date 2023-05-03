import { IsString, IsNotEmpty, IsOptional, IsDate } from 'class-validator';

export class UpdateEventDto {
  @IsString()
  @IsOptional()
  readonly name?: string;

  @IsString()
  @IsOptional()
  readonly category?: string;

  @IsString()
  @IsOptional()
  readonly venue?: string;

  @IsString()
  @IsOptional()
  readonly date_of_event?: string;

  @IsString()
  @IsOptional()
  readonly description?: string;

  @IsString()
  @IsOptional()
  readonly visibility: string;

  @IsDate()
  @IsOptional()
  updated_at: string;
}
