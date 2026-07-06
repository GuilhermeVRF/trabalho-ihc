import { Transform } from 'class-transformer';
import { IsHexColor, IsString, Length, MaxLength, MinLength } from 'class-validator';

export class CreateTeamDto {
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  name!: string;

  @IsString()
  @MinLength(2)
  @MaxLength(100)
  city!: string;

  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.toUpperCase() : value,
  )
  @IsString()
  @Length(2, 2)
  state!: string;

  @IsHexColor()
  primaryColor!: string;

  @IsHexColor()
  secondaryColor!: string;

  @IsString()
  @MinLength(2)
  @MaxLength(120)
  coach!: string;
}
