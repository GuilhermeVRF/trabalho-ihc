import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { mkdir, rm, writeFile } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import { join } from 'node:path';
import { PrismaService } from '../../shared/database/prisma.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { ListTeamsDto } from './dto/list-teams.dto';
import { UpdateTeamDto } from './dto/update-team.dto';

@Injectable()
export class TeamsService {
  private readonly uploadDirectory = join(process.cwd(), 'uploads', 'teams');

  constructor(private readonly prisma: PrismaService) {}

  async findAll(ownerId: string, query: ListTeamsDto) {
    const term = query.search?.trim();
    const where = {
      ownerId,
      ...(term && {
        OR: [
          { name: { contains: term, mode: 'insensitive' as const } },
          { city: { contains: term, mode: 'insensitive' as const } },
        ],
      }),
    };
    const [data, total] = await this.prisma.$transaction([
      this.prisma.team.findMany({
        where,
        orderBy: { [query.sortBy]: query.sortOrder },
        skip: (query.page - 1) * query.pageSize,
        take: query.pageSize,
        include: { _count: { select: { players: true, championships: true } } },
      }),
      this.prisma.team.count({ where }),
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
    const team = await this.prisma.team.findFirst({
      where: { id, ownerId },
      include: { _count: { select: { players: true, championships: true } } },
    });
    if (!team) throw new NotFoundException('Time não encontrado.');
    return team;
  }

  create(ownerId: string, dto: CreateTeamDto) {
    return this.prisma.team.create({ data: { ...this.normalize(dto), ownerId } });
  }

  async update(ownerId: string, id: string, dto: UpdateTeamDto) {
    await this.findOne(ownerId, id);
    return this.prisma.team.update({ where: { id }, data: this.normalize(dto) });
  }

  async uploadCrest(ownerId: string, id: string, file?: Express.Multer.File) {
    if (!file) throw new BadRequestException('Envie uma imagem JPG, PNG ou WebP de até 2 MB.');
    const team = await this.findOne(ownerId, id);
    const extension = { 'image/jpeg': '.jpg', 'image/png': '.png', 'image/webp': '.webp' }[
      file.mimetype
    ];
    if (!extension) throw new BadRequestException('Formato de imagem inválido.');
    const filename = `${randomUUID()}${extension}`;
    await mkdir(this.uploadDirectory, { recursive: true });
    await writeFile(join(this.uploadDirectory, filename), file.buffer);
    await this.removeCrestFile(team.crestUrl);
    return this.prisma.team.update({
      where: { id },
      data: { crestUrl: `/uploads/teams/${filename}` },
    });
  }

  async remove(ownerId: string, id: string) {
    const team = await this.findOne(ownerId, id);
    await this.prisma.team.delete({ where: { id } });
    await this.removeCrestFile(team.crestUrl);
  }

  private normalize<T extends UpdateTeamDto>(dto: T) {
    return {
      ...dto,
      name: dto.name?.trim(),
      city: dto.city?.trim(),
      state: dto.state?.toUpperCase(),
      coach: dto.coach?.trim(),
    };
  }

  private async removeCrestFile(crestUrl: string | null) {
    if (!crestUrl?.startsWith('/uploads/teams/')) return;
    await rm(join(this.uploadDirectory, crestUrl.replace('/uploads/teams/', '')), { force: true });
  }
}
