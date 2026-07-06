import { Controller, Get, ParseUUIDPipe, Query, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';
import { StatisticsService } from './statistics.service';

@UseGuards(JwtAuthGuard)
@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get()
  get(
    @CurrentUser() user: AuthenticatedUser,
    @Query('championshipId', ParseUUIDPipe) championshipId: string,
  ) {
    return this.statisticsService.get(user.id, championshipId);
  }
}
