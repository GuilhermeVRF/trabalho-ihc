import { ArrayMaxSize, ArrayUnique, IsArray, IsUUID } from 'class-validator';

export class SetChampionshipTeamsDto {
  @IsArray()
  @ArrayUnique()
  @ArrayMaxSize(100)
  @IsUUID('4', { each: true })
  teamIds!: string[];
}
