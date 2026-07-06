import {
  Body,
  Controller,
  Get,
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
import { ListMatchesDto } from './dto/list-matches.dto';
import { RegisterResultDto } from './dto/register-result.dto';
import { UpdateMatchDto } from './dto/update-match.dto';
import { MatchesService } from './matches.service';

@UseGuards(JwtAuthGuard)
@Controller('matches')
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @Get()
  findAll(@CurrentUser() user: AuthenticatedUser, @Query() query: ListMatchesDto) {
    return this.matchesService.findAll(user.id, query);
  }

  @Post('generate/:championshipId')
  generate(
    @CurrentUser() user: AuthenticatedUser,
    @Param('championshipId', ParseUUIDPipe) id: string,
  ) {
    return this.matchesService.generate(user.id, id);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateMatchDto,
  ) {
    return this.matchesService.update(user.id, id, dto);
  }

  @Patch(':id/result')
  registerResult(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: RegisterResultDto,
  ) {
    return this.matchesService.registerResult(user.id, id, dto);
  }
}
