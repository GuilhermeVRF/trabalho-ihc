import { Type } from 'class-transformer';
import { IsDate, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateMatchDto {
  @Type(() => Date)
  @IsDate()
  scheduledAt!: Date;

  @IsString()
  @MinLength(2)
  @MaxLength(160)
  venue!: string;
}
