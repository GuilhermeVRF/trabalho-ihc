import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { hash } from 'bcryptjs';
import {
  ChampionshipFormat,
  ChampionshipStatus,
  MatchStatus,
  PlayerPosition,
} from '../src/generated/prisma/enums';
import { PrismaClient } from '../src/generated/prisma/client';

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
});

const teams = [
  ['Atlético Central', 'Campinas', 'SP', '#15803d', '#ffffff'],
  ['União da Serra', 'Jundiaí', 'SP', '#1d4ed8', '#facc15'],
  ['Estrela do Norte', 'Sorocaba', 'SP', '#dc2626', '#ffffff'],
  ['Real Primavera', 'Piracicaba', 'SP', '#7e22ce', '#ffffff'],
  ['Ferroviário FC', 'Bauru', 'SP', '#b91c1c', '#111827'],
  ['Vila Nova', 'Limeira', 'SP', '#ea580c', '#ffffff'],
  ['Independente', 'Americana', 'SP', '#0f766e', '#ffffff'],
  ['Olimpo Esporte', 'Rio Claro', 'SP', '#1e3a8a', '#eab308'],
] as const;

const firstNames = [
  'Lucas',
  'Gabriel',
  'Matheus',
  'Pedro',
  'Rafael',
  'Bruno',
  'Felipe',
  'Diego',
  'Caio',
  'Gustavo',
  'André',
  'Thiago',
  'Vitor',
  'Daniel',
  'Henrique',
];
const lastNames = ['Silva', 'Santos', 'Oliveira', 'Souza', 'Costa', 'Pereira', 'Almeida', 'Rocha'];

type TableRow = {
  teamId: string;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
};

async function main() {
  const email = 'admin@champmanager.com';
  const existingUser = await prisma.user.findUnique({ where: { email }, select: { id: true } });
  if (existingUser) {
    await prisma.goal.deleteMany({ where: { team: { ownerId: existingUser.id } } });
  }
  await prisma.user.deleteMany({ where: { email } });

  const user = await prisma.user.create({
    data: {
      name: 'Administrador ChampManager',
      email,
      passwordHash: await hash('Champ123!', 12),
    },
  });

  const createdTeams = [];
  for (let teamIndex = 0; teamIndex < teams.length; teamIndex++) {
    const [name, city, state, primaryColor, secondaryColor] = teams[teamIndex];
    const team = await prisma.team.create({
      data: {
        ownerId: user.id,
        name,
        city,
        state,
        primaryColor,
        secondaryColor,
        coach: `Técnico ${lastNames[teamIndex]}`,
      },
    });
    await prisma.player.createMany({
      data: firstNames.map((firstName, playerIndex) => ({
        teamId: team.id,
        name: `${firstName} ${lastNames[(teamIndex + playerIndex) % lastNames.length]}`,
        number: playerIndex + 1,
        position:
          playerIndex === 0
            ? PlayerPosition.GOALKEEPER
            : playerIndex < 6
              ? PlayerPosition.DEFENDER
              : playerIndex < 11
                ? PlayerPosition.MIDFIELDER
                : PlayerPosition.FORWARD,
        birthDate: new Date(
          Date.UTC(1994 + ((teamIndex + playerIndex) % 10), playerIndex % 12, 2 + playerIndex),
        ),
        isCaptain: playerIndex === 4,
      })),
    });
    createdTeams.push(team);
  }

  const championship = await prisma.championship.create({
    data: {
      ownerId: user.id,
      name: 'Liga Municipal ChampManager',
      season: '2026',
      description: 'Campeonato demonstrativo com oito equipes da região.',
      maxTeams: 8,
      format: ChampionshipFormat.LEAGUE,
      status: ChampionshipStatus.IN_PROGRESS,
      startDate: new Date('2026-07-05T00:00:00.000Z'),
      endDate: new Date('2026-12-06T00:00:00.000Z'),
      teams: { create: createdTeams.map((team) => ({ teamId: team.id })) },
    },
  });

  const schedule = roundRobin(createdTeams.map((team) => team.id));
  const table = new Map<string, TableRow>(
    createdTeams.map((team) => [
      team.id,
      {
        teamId: team.id,
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

  for (let index = 0; index < schedule.length; index++) {
    const item = schedule[index];
    const finished = index < 8;
    const homeScore = finished ? (index * 2 + 1) % 4 : null;
    const awayScore = finished ? (index + 1) % 3 : null;
    const scheduledAt = new Date('2026-07-05T18:00:00.000Z');
    scheduledAt.setUTCDate(scheduledAt.getUTCDate() + (item.round - 1) * 7);
    const match = await prisma.match.create({
      data: {
        championshipId: championship.id,
        homeTeamId: item.homeTeamId,
        awayTeamId: item.awayTeamId,
        round: item.round,
        scheduledAt,
        venue: `Campo Municipal ${1 + (index % 3)}`,
        status: finished ? MatchStatus.FINISHED : MatchStatus.SCHEDULED,
        homeScore,
        awayScore,
      },
    });

    if (finished && homeScore !== null && awayScore !== null) {
      updateTable(table, item.homeTeamId, item.awayTeamId, homeScore, awayScore);
      await createGoals(match.id, item.homeTeamId, homeScore, 12);
      await createGoals(match.id, item.awayTeamId, awayScore, 18);
    }
  }

  const sorted = [...table.values()].sort(
    (a, b) =>
      b.points - a.points ||
      b.goalsFor - b.goalsAgainst - (a.goalsFor - a.goalsAgainst) ||
      b.goalsFor - a.goalsFor,
  );
  await prisma.standing.createMany({
    data: sorted.map((row, index) => ({
      championshipId: championship.id,
      teamId: row.teamId,
      position: index + 1,
      played: row.played,
      wins: row.wins,
      draws: row.draws,
      losses: row.losses,
      goalsFor: row.goalsFor,
      goalsAgainst: row.goalsAgainst,
      goalDifference: row.goalsFor - row.goalsAgainst,
      points: row.points,
    })),
  });

  console.log('Seed concluído: admin@champmanager.com / Champ123!');
}

function roundRobin(teamIds: string[]) {
  const teams = [...teamIds];
  const matches: Array<{ homeTeamId: string; awayTeamId: string; round: number }> = [];
  for (let round = 1; round < teams.length; round++) {
    for (let index = 0; index < teams.length / 2; index++) {
      const first = teams[index];
      const second = teams[teams.length - 1 - index];
      matches.push({
        homeTeamId: round % 2 ? first : second,
        awayTeamId: round % 2 ? second : first,
        round,
      });
    }
    teams.splice(1, 0, teams.pop()!);
  }
  return matches;
}

function updateTable(
  table: Map<string, TableRow>,
  homeId: string,
  awayId: string,
  homeScore: number,
  awayScore: number,
) {
  const home = table.get(homeId)!;
  const away = table.get(awayId)!;
  home.played++;
  away.played++;
  home.goalsFor += homeScore;
  home.goalsAgainst += awayScore;
  away.goalsFor += awayScore;
  away.goalsAgainst += homeScore;
  if (homeScore > awayScore) {
    home.wins++;
    home.points += 3;
    away.losses++;
  } else if (awayScore > homeScore) {
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

async function createGoals(matchId: string, teamId: string, amount: number, baseMinute: number) {
  if (!amount) return;
  const players = await prisma.player.findMany({
    where: { teamId, position: PlayerPosition.FORWARD },
    orderBy: { number: 'asc' },
    take: 3,
  });
  await prisma.goal.createMany({
    data: Array.from({ length: amount }, (_, index) => ({
      matchId,
      teamId,
      playerId: players[index % players.length].id,
      minute: baseMinute + index * 19,
    })),
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => prisma.$disconnect());
