import { Min, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PaginationOptionsDto {
  @ApiProperty({ example: 1, description: 'Page number' })
  @IsInt()
  @Min(1)
  page: number;

  @ApiProperty({ example: 10, description: 'Number of items per page' })
  @IsInt()
  @Min(1)
  pageSize: number;
}
