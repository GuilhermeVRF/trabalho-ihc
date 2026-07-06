import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../shared/database/prisma.service';
import { CreateChampionshipDto } from './dto/create-championship.dto';
import { ListChampionshipsDto } from './dto/list-championships.dto';
import { UpdateChampionshipDto } from './dto/update-championship.dto';

@Injectable()
export class ChampionshipsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(ownerId: string, query: ListChampionshipsDto) {
    const where = {
      ownerId,
      ...(query.search?.trim() && {
        OR: [
          { name: { contains: query.search.trim(), mode: 'insensitive' as const } },
          { season: { contains: query.search.trim(), mode: 'insensitive' as const } },
        ],
      }),
    };
    const [data, total] = await this.prisma.$transaction([
      this.prisma.championship.findMany({
        where,
        orderBy: { [query.sortBy]: query.sortOrder },
        skip: (query.page - 1) * query.pageSize,
        take: query.pageSize,
        include: { _count: { select: { teams: true, matches: true } } },
      }),
      this.prisma.championship.count({ where }),
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

  async findOne(ownerId: string, id: string) {
    const championship = await this.prisma.championship.findFirst({
      where: { id, ownerId },
      include: { _count: { select: { teams: true, matches: true } } },
    });
    if (!championship) throw new NotFoundException('Campeonato não encontrado.');
    return championship;
  }

  async create(ownerId: string, dto: CreateChampionshipDto) {
    this.validateDates(dto.startDate, dto.endDate);
    return this.prisma.championship.create({
      data: {
        ...dto,
        name: dto.name.trim(),
        season: dto.season.trim(),
        description: dto.description?.trim() || null,
        ownerId,
      },
    });
  }

  async update(ownerId: string, id: string, dto: UpdateChampionshipDto) {
    const current = await this.findOne(ownerId, id);
    this.validateDates(dto.startDate ?? current.startDate, dto.endDate ?? current.endDate);
    return this.prisma.championship.update({
      where: { id },
      data: {
        ...dto,
        name: dto.name?.trim(),
        season: dto.season?.trim(),
        description: dto.description === undefined ? undefined : dto.description.trim() || null,
      },
    });
  }

  async remove(ownerId: string, id: string) {
    await this.findOne(ownerId, id);
    await this.prisma.championship.delete({ where: { id } });
  }

  async findTeams(ownerId: string, id: string) {
    await this.findOne(ownerId, id);
    return this.prisma.championshipTeam.findMany({
      where: { championshipId: id },
      orderBy: { team: { name: 'asc' } },
      include: { team: true },
    });
  }

  async setTeams(ownerId: string, id: string, teamIds: string[]) {
    const championship = await this.findOne(ownerId, id);
    if (teamIds.length > championship.maxTeams)
      throw new BadRequestException('Quantidade de times acima do limite do campeonato.');
    const existingMatches = await this.prisma.match.count({ where: { championshipId: id } });
    if (existingMatches > 0)
      throw new BadRequestException('Não é possível alterar os times após gerar os jogos.');
    const ownedTeams = await this.prisma.team.count({ where: { id: { in: teamIds }, ownerId } });
    if (ownedTeams !== teamIds.length)
      throw new BadRequestException('Um ou mais times são inválidos.');

    await this.prisma.$transaction([
      this.prisma.championshipTeam.deleteMany({ where: { championshipId: id } }),
      this.prisma.championshipTeam.createMany({
        data: teamIds.map((teamId) => ({ championshipId: id, teamId })),
      }),
    ]);
    return this.findTeams(ownerId, id);
  }

  private validateDates(startDate: Date, endDate: Date) {
    if (endDate < startDate)
      throw new BadRequestException('A data final deve ser posterior à data inicial.');
  }
}
