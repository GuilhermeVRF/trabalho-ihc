import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { ChampionshipsModule } from './modules/championships/championships.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { HealthModule } from './modules/health/health.module';
import { MatchesModule } from './modules/matches/matches.module';
import { PlayersModule } from './modules/players/players.module';
import { ProfileModule } from './modules/profile/profile.module';
import { StandingsModule } from './modules/standings/standings.module';
import { StatisticsModule } from './modules/statistics/statistics.module';
import { TeamsModule } from './modules/teams/teams.module';
import { PrismaModule } from './shared/database/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    HealthModule,
    AuthModule,
    DashboardModule,
    ChampionshipsModule,
    TeamsModule,
    PlayersModule,
    MatchesModule,
    StandingsModule,
    StatisticsModule,
    ProfileModule,
  ],
})
export class AppModule {}
