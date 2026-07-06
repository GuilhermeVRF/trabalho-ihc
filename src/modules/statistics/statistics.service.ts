import { Injectable, NotFoundException } from '@nestjs/common';
import { MatchStatus } from '../../generated/prisma/enums';
import { PrismaService } from '../../shared/database/prisma.service';

@Injectable()
export class StatisticsService {
  constructor(private readonly prisma: PrismaService) {}

  async get(ownerId: string, championshipId: string) {
    const championship = await this.prisma.championship.findFirst({
      where: { id: championshipId, ownerId },
      select: { id: true, name: true, season: true },
    });
    if (!championship) throw new NotFoundException('Campeonato não encontrado.');

    const [standings, matches, scorerGroups] = await Promise.all([
      this.prisma.standing.findMany({
        where: { championshipId },
        include: { team: { select: { id: true, name: true, crestUrl: true } } },
      }),
      this.prisma.match.findMany({
        where: { championshipId, status: MatchStatus.FINISHED },
        select: { homeScore: true, awayScore: true },
      }),
      this.prisma.goal.groupBy({
        by: ['playerId'],
        where: { match: { championshipId }, isOwnGoal: false },
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
        take: 1,
      }),
    ]);

    const played = standings.filter((item) => item.played > 0);
    const bestAttack = [...played].sort((a, b) => b.goalsFor - a.goalsFor)[0] ?? null;
    const bestDefense = [...played].sort((a, b) => a.goalsAgainst - b.goalsAgainst)[0] ?? null;
    const totalGoals = matches.reduce(
      (total, match) => total + (match.homeScore ?? 0) + (match.awayScore ?? 0),
      0,
    );
    const scorerGroup = scorerGroups[0];
    const scorer = scorerGroup
      ? await this.prisma.player.findUnique({
          where: { id: scorerGroup.playerId },
          select: { id: true, name: true, photoUrl: true, team: { select: { name: true } } },
        })
      : null;

    return {
      championship,
      finishedMatches: matches.length,
      totalGoals,
      averageGoals: matches.length ? Number((totalGoals / matches.length).toFixed(2)) : 0,
      bestAttack: bestAttack ? { team: bestAttack.team, goals: bestAttack.goalsFor } : null,
      bestDefense: bestDefense ? { team: bestDefense.team, goals: bestDefense.goalsAgainst } : null,
      topScorer: scorerGroup && scorer ? { player: scorer, goals: scorerGroup._count.id } : null,
    };
  }
}
