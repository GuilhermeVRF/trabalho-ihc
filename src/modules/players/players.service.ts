import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { mkdir, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { Prisma } from '../../generated/prisma/client';
import { PrismaService } from '../../shared/database/prisma.service';
import { CreatePlayerDto } from './dto/create-player.dto';
import { ListPlayersDto } from './dto/list-players.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';

@Injectable()
export class PlayersService {
  private readonly uploadDirectory = join(process.cwd(), 'uploads', 'players');

  constructor(private readonly prisma: PrismaService) {}

  async findAll(ownerId: string, query: ListPlayersDto) {
    const where = {
      team: { ownerId },
      ...(query.teamId && { teamId: query.teamId }),
      ...(query.position && { position: query.position }),
      ...(query.search?.trim() && {
        name: { contains: query.search.trim(), mode: 'insensitive' as const },
      }),
    };
    const [data, total] = await this.prisma.$transaction([
      this.prisma.player.findMany({
        where,
        orderBy: [{ team: { name: 'asc' } }, { number: 'asc' }],
        skip: (query.page - 1) * query.pageSize,
        take: query.pageSize,
        include: {
          team: { select: { id: true, name: true, crestUrl: true } },
          _count: { select: { goals: true } },
        },
      }),
      this.prisma.player.count({ where }),
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
    const player = await this.prisma.player.findFirst({
      where: { id, team: { ownerId } },
      include: {
        team: { select: { id: true, name: true, crestUrl: true } },
        _count: { select: { goals: true } },
      },
    });
    if (!player) throw new NotFoundException('Jogador não encontrado.');
    return player;
  }

  async create(ownerId: string, dto: CreatePlayerDto) {
    await this.ensureOwnedTeam(ownerId, dto.teamId);
    try {
      return await this.prisma.player.create({
        data: { ...dto, name: dto.name.trim() },
        include: { team: { select: { id: true, name: true, crestUrl: true } } },
      });
    } catch (error) {
      this.handleNumberConflict(error);
      throw error;
    }
  }

  async update(ownerId: string, id: string, dto: UpdatePlayerDto) {
    await this.findOne(ownerId, id);
    if (dto.teamId) await this.ensureOwnedTeam(ownerId, dto.teamId);
    try {
      return await this.prisma.player.update({
        where: { id },
        data: { ...dto, name: dto.name?.trim() },
        include: { team: { select: { id: true, name: true, crestUrl: true } } },
      });
    } catch (error) {
      this.handleNumberConflict(error);
      throw error;
    }
  }

  async uploadPhoto(ownerId: string, id: string, file?: Express.Multer.File) {
    if (!file) throw new BadRequestException('Envie uma imagem JPG, PNG ou WebP de até 3 MB.');
    const player = await this.findOne(ownerId, id);
    const extension = { 'image/jpeg': '.jpg', 'image/png': '.png', 'image/webp': '.webp' }[
      file.mimetype
    ];
    if (!extension) throw new BadRequestException('Formato de imagem inválido.');
    const filename = `${randomUUID()}${extension}`;
    await mkdir(this.uploadDirectory, { recursive: true });
    await writeFile(join(this.uploadDirectory, filename), file.buffer);
    await this.removePhotoFile(player.photoUrl);
    return this.prisma.player.update({
      where: { id },
      data: { photoUrl: `/uploads/players/${filename}` },
    });
  }

  async remove(ownerId: string, id: string) {
    const player = await this.findOne(ownerId, id);
    await this.prisma.player.delete({ where: { id } });
    await this.removePhotoFile(player.photoUrl);
  }

  private async ensureOwnedTeam(ownerId: string, teamId: string) {
    const team = await this.prisma.team.findFirst({
      where: { id: teamId, ownerId },
      select: { id: true },
    });
    if (!team) throw new BadRequestException('Time inválido.');
  }

  private handleNumberConflict(error: unknown) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002')
      throw new ConflictException('Este número já está em uso no time.');
  }

  private async removePhotoFile(photoUrl: string | null) {
    if (!photoUrl?.startsWith('/uploads/players/')) return;
    await rm(join(this.uploadDirectory, photoUrl.replace('/uploads/players/', '')), {
      force: true,
    });
  }
}
