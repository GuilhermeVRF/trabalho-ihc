import { Controller, Get, ParseUUIDPipe, Query, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';
import { StandingsService } from './standings.service';

@UseGuards(JwtAuthGuard)
@Controller('standings')
export class StandingsController {
  constructor(private readonly standingsService: StandingsService) {}

  @Get()
  findAll(
    @CurrentUser() user: AuthenticatedUser,
    @Query('championshipId', ParseUUIDPipe) championshipId: string,
  ) {
    return this.standingsService.findAll(user.id, championshipId);
  }
}
