import { Injectable } from '@nestjs/common';
import { MatchStatus } from '../../generated/prisma/enums';
import { PrismaService } from '../../shared/database/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async get(ownerId: string) {
    const matchInclude = {
      championship: { select: { id: true, name: true } },
      homeTeam: { select: { id: true, name: true, crestUrl: true } },
      awayTeam: { select: { id: true, name: true, crestUrl: true } },
    } as const;

    const [championships, teams, players, upcomingMatches, latestResults] = await Promise.all([
      this.prisma.championship.count({ where: { ownerId } }),
      this.prisma.team.count({ where: { ownerId } }),
      this.prisma.player.count({ where: { team: { ownerId } } }),
      this.prisma.match.findMany({
        where: {
          championship: { ownerId },
          status: MatchStatus.SCHEDULED,
          scheduledAt: { gte: new Date() },
        },
        orderBy: { scheduledAt: 'asc' },
        take: 5,
        include: matchInclude,
      }),
      this.prisma.match.findMany({
        where: { championship: { ownerId }, status: MatchStatus.FINISHED },
        orderBy: { updatedAt: 'desc' },
        take: 5,
        include: matchInclude,
      }),
    ]);

    return {
      counts: { championships, teams, players, upcomingMatches: upcomingMatches.length },
      upcomingMatches,
      latestResults,
    };
  }
}
