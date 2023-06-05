import { IsString, IsNotEmpty, IsDate, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({ type: String, description: 'comment' })
  @IsString()
  @IsNotEmpty()
  readonly comment: string;
}

export class UpdateCommentDto extends CreateCommentDto {
  //   constructor() {
  //     super();
  //   }
  @IsDate()
  @IsOptional()
  readonly updated_at: string;
}
