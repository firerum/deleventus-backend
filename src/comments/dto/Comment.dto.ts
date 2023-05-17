import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({ type: String, description: 'comment' })
  @IsString()
  @IsNotEmpty()
  readonly comment: string;

  @ApiProperty({ type: String, description: 'event_id' })
  @IsString()
  @IsNotEmpty()
  readonly event_id: string;

  @ApiProperty({ type: String, description: 'user_id' })
  @IsString()
  @IsNotEmpty()
  readonly user_id: string;
}
