import { ConflictException, Injectable } from '@nestjs/common';
import { hash } from 'bcryptjs';
import { Prisma } from '../../generated/prisma/client';
import { PrismaService } from '../../shared/database/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  async update(userId: string, dto: UpdateProfileDto) {
    const email = dto.email?.trim().toLowerCase();
    try {
      return await this.prisma.user.update({
        where: { id: userId },
        data: {
          name: dto.name?.trim(),
          email,
          passwordHash: dto.password ? await hash(dto.password, 12) : undefined,
        },
        select: {
          id: true,
          name: true,
          email: true,
          avatarUrl: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002')
        throw new ConflictException('Este e-mail já está cadastrado.');
      throw error;
    }
  }
}
