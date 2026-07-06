import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ChampionshipFormat, MatchStatus } from '../../generated/prisma/enums';
import { PrismaService } from '../../shared/database/prisma.service';
import { ListMatchesDto } from './dto/list-matches.dto';
import { RegisterResultDto } from './dto/register-result.dto';
import { UpdateMatchDto } from './dto/update-match.dto';

type GeneratedMatch = {
  championshipId: string;
  homeTeamId: string;
  awayTeamId: string;
  round: number;
  groupName?: string;
  scheduledAt: Date;
  venue: string;
};

@Injectable()
export class MatchesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(ownerId: string, query: ListMatchesDto) {
    const where = {
      championship: { ownerId },
      ...(query.championshipId && { championshipId: query.championshipId }),
      ...(query.status && { status: query.status }),
    };
    const [data, total] = await this.prisma.$transaction([
      this.prisma.match.findMany({
        where,
        orderBy: [{ scheduledAt: 'asc' }, { round: 'asc' }],
        skip: (query.page - 1) * query.pageSize,
        take: query.pageSize,
        include: {
          championship: { select: { id: true, name: true, season: true } },
          homeTeam: { select: { id: true, name: true, crestUrl: true } },
          awayTeam: { select: { id: true, name: true, crestUrl: true } },
        },
      }),
      this.prisma.match.count({ where }),
    ]);
    return {
      data,
      meta: {
        page: query.page,
        pageSize: query.pageSize,
        total,
        totalPages: Math.ceil(total / query.pageSize),
      },
    };
  }

  async generate(ownerId: string, championshipId: string) {
    const championship = await this.prisma.championship.findFirst({
      where: { id: championshipId, ownerId },
      include: { teams: { orderBy: { createdAt: 'asc' } } },
    });
    if (!championship) throw new NotFoundException('Campeonato não encontrado.');
    if (championship.teams.length < 2)
      throw new BadRequestException('Adicione pelo menos dois times ao campeonato.');
    if (await this.prisma.match.count({ where: { championshipId } }))
      throw new BadRequestException('A tabela deste campeonato já foi gerada.');

    const ids = championship.teams.map((item) => item.teamId);
    let matches: GeneratedMatch[] = [];
    if (championship.format === ChampionshipFormat.LEAGUE)
      matches = this.roundRobin(ids, championshipId, championship.startDate);
    if (championship.format === ChampionshipFormat.GROUPS) {
      const groups = [
        ids.filter((_, index) => index % 2 === 0),
        ids.filter((_, index) => index % 2 === 1),
      ];
      matches = groups.flatMap((teams, index) =>
        this.roundRobin(
          teams,
          championshipId,
          championship.startDate,
          String.fromCharCode(65 + index),
        ),
      );
      await this.prisma.$transaction(
        championship.teams.map((item, index) =>
          this.prisma.championshipTeam.update({
            where: { championshipId_teamId: { championshipId, teamId: item.teamId } },
            data: { groupName: String.fromCharCode(65 + (index % 2)) },
          }),
        ),
      );
    }
    if (championship.format === ChampionshipFormat.KNOCKOUT)
      matches = this.knockout(ids, championshipId, championship.startDate);

    await this.prisma.$transaction([
      this.prisma.match.createMany({ data: matches }),
      this.prisma.standing.createMany({
        data: ids.map((teamId, index) => ({ championshipId, teamId, position: index + 1 })),
      }),
      this.prisma.championship.update({
        where: { id: championshipId },
        data: { status: 'SCHEDULED' },
      }),
    ]);
    return { created: matches.length };
  }

  async update(ownerId: string, id: string, dto: UpdateMatchDto) {
    await this.findOwned(ownerId, id);
    return this.prisma.match.update({ where: { id }, data: dto });
  }

  async registerResult(ownerId: string, id: string, dto: RegisterResultDto) {
    const match = await this.findOwned(ownerId, id);
    const updated = await this.prisma.match.update({
      where: { id },
      data: { ...dto, status: MatchStatus.FINISHED },
    });
    await this.recalculateStandings(match.championshipId);
    return updated;
  }

  private async findOwned(ownerId: string, id: string) {
    const match = await this.prisma.match.findFirst({ where: { id, championship: { ownerId } } });
    if (!match) throw new NotFoundException('Jogo não encontrado.');
    return match;
  }

  private roundRobin(
    teamIds: string[],
    championshipId: string,
    startDate: Date,
    groupName?: string,
  ) {
    const teams: Array<string | null> = [...teamIds];
    if (teams.length % 2) teams.push(null);
    const matches: GeneratedMatch[] = [];
    for (let round = 1; round < teams.length; round++) {
      for (let index = 0; index < teams.length / 2; index++) {
        const first = teams[index];
        const second = teams[teams.length - 1 - index];
        if (first && second)
          matches.push(
            this.matchData(
              championshipId,
              round % 2 ? first : second,
              round % 2 ? second : first,
              round,
              startDate,
              groupName,
            ),
          );
      }
      teams.splice(1, 0, teams.pop()!);
    }
    return matches;
  }

  private knockout(teamIds: string[], championshipId: string, startDate: Date) {
    const matches: GeneratedMatch[] = [];
    for (let index = 0; index + 1 < teamIds.length; index += 2)
      matches.push(
        this.matchData(championshipId, teamIds[index], teamIds[index + 1], 1, startDate),
      );
    return matches;
  }

  private matchData(
    championshipId: string,
    homeTeamId: string,
    awayTeamId: string,
    round: number,
    startDate: Date,
    groupName?: string,
  ): GeneratedMatch {
    const scheduledAt = new Date(startDate);
    scheduledAt.setUTCDate(scheduledAt.getUTCDate() + (round - 1) * 7);
    scheduledAt.setUTCHours(18, 0, 0, 0);
    return {
      championshipId,
      homeTeamId,
      awayTeamId,
      round,
      ...(groupName && { groupName }),
      scheduledAt,
      venue: 'A definir',
    };
  }

  private async recalculateStandings(championshipId: string) {
    const [members, matches] = await Promise.all([
      this.prisma.championshipTeam.findMany({
        where: { championshipId },
        include: { team: { select: { name: true } } },
      }),
      this.prisma.match.findMany({ where: { championshipId, status: MatchStatus.FINISHED } }),
    ]);
    const table = new Map(
      members.map((member) => [
        member.teamId,
        {
          teamId: member.teamId,
          name: member.team.name,
          played: 0,
          wins: 0,
          draws: 0,
          losses: 0,
          goalsFor: 0,
          goalsAgainst: 0,
          points: 0,
        },
      ]),
    );
    for (const match of matches) {
      const home = table.get(match.homeTeamId)!;
      const away = table.get(match.awayTeamId)!;
      const hs = match.homeScore!;
      const as = match.awayScore!;
      home.played++;
      away.played++;
      home.goalsFor += hs;
      home.goalsAgainst += as;
      away.goalsFor += as;
      away.goalsAgainst += hs;
      if (hs > as) {
        home.wins++;
        home.points += 3;
        away.losses++;
      } else if (as > hs) {
        away.wins++;
        away.points += 3;
        home.losses++;
      } else {
        home.draws++;
        away.draws++;
        home.points++;
        away.points++;
      }
    }
    const sorted = [...table.values()].sort(
      (a, b) =>
        b.points - a.points ||
        b.goalsFor - b.goalsAgainst - (a.goalsFor - a.goalsAgainst) ||
        b.goalsFor - a.goalsFor ||
        a.name.localeCompare(b.name),
    );
    await this.prisma.$transaction(
      sorted.map((row, index) =>
        this.prisma.standing.update({
          where: { championshipId_teamId: { championshipId, teamId: row.teamId } },
          data: {
            position: index + 1,
            played: row.played,
            wins: row.wins,
            draws: row.draws,
            losses: row.losses,
            goalsFor: row.goalsFor,
            goalsAgainst: row.goalsAgainst,
            goalDifference: row.goalsFor - row.goalsAgainst,
            points: row.points,
          },
        }),
      ),
    );
  }
}
