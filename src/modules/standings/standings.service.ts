import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../shared/database/prisma.service';

@Injectable()
export class StandingsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(ownerId: string, championshipId: string) {
    const championship = await this.prisma.championship.findFirst({
      where: { id: championshipId, ownerId },
      select: { id: true, name: true, season: true, format: true },
    });
    if (!championship) throw new NotFoundException('Campeonato não encontrado.');

    const standings = await this.prisma.standing.findMany({
      where: { championshipId },
      orderBy: { position: 'asc' },
      include: { team: { select: { id: true, name: true, crestUrl: true } } },
    });
    return { championship, standings };
  }
}
