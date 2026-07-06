import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';
import { ChampionshipsService } from './championships.service';
import { CreateChampionshipDto } from './dto/create-championship.dto';
import { ListChampionshipsDto } from './dto/list-championships.dto';
import { UpdateChampionshipDto } from './dto/update-championship.dto';
import { SetChampionshipTeamsDto } from './dto/set-championship-teams.dto';

@UseGuards(JwtAuthGuard)
@Controller('championships')
export class ChampionshipsController {
  constructor(private readonly championshipsService: ChampionshipsService) {}

  @Get()
  findAll(@CurrentUser() user: AuthenticatedUser, @Query() query: ListChampionshipsDto) {
    return this.championshipsService.findAll(user.id, query);
  }

  @Get(':id')
  findOne(@CurrentUser() user: AuthenticatedUser, @Param('id', ParseUUIDPipe) id: string) {
    return this.championshipsService.findOne(user.id, id);
  }

  @Post()
  create(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateChampionshipDto) {
    return this.championshipsService.create(user.id, dto);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateChampionshipDto,
  ) {
    return this.championshipsService.update(user.id, id, dto);
  }

  @Get(':id/teams')
  findTeams(@CurrentUser() user: AuthenticatedUser, @Param('id', ParseUUIDPipe) id: string) {
    return this.championshipsService.findTeams(user.id, id);
  }

  @Patch(':id/teams')
  setTeams(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: SetChampionshipTeamsDto,
  ) {
    return this.championshipsService.setTeams(user.id, id, dto.teamIds);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@CurrentUser() user: AuthenticatedUser, @Param('id', ParseUUIDPipe) id: string) {
    return this.championshipsService.remove(user.id, id);
  }
}
