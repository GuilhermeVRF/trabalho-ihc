import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { StandingsController } from './standings.controller';
import { StandingsService } from './standings.service';

@Module({
  imports: [AuthModule],
  controllers: [StandingsController],
  providers: [StandingsService],
})
export class StandingsModule {}
