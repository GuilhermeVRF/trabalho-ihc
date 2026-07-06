import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsInt,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { PlayerPosition } from '../../../generated/prisma/enums';

export class CreatePlayerDto {
  @IsUUID()
  teamId!: string;

  @IsString()
  @MinLength(2)
  @MaxLength(120)
  name!: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(99)
  number!: number;

  @IsEnum(PlayerPosition)
  position!: PlayerPosition;

  @Type(() => Date)
  @IsDate()
  birthDate!: Date;

  @IsBoolean()
  isCaptain!: boolean;
}
