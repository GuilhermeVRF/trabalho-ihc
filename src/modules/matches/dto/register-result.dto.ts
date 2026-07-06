import { Type } from 'class-transformer';
import { IsInt, Max, Min } from 'class-validator';

export class RegisterResultDto {
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(99)
  homeScore!: number;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(99)
  awayScore!: number;
}
