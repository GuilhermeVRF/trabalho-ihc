import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcryptjs';
import { PrismaService } from '../../shared/database/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const email = dto.email.trim().toLowerCase();
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existingUser) throw new ConflictException('Este e-mail já está cadastrado.');

    const user = await this.prisma.user.create({
      data: {
        name: dto.name.trim(),
        email,
        passwordHash: await hash(dto.password, 12),
      },
      select: this.publicUserSelect,
    });

    return this.createSession(user);
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.trim().toLowerCase() },
    });

    if (!user || !(await compare(dto.password, user.passwordHash))) {
      throw new UnauthorizedException('E-mail ou senha inválidos.');
    }

    const publicUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
    return this.createSession(publicUser);
  }

  private async createSession<T extends { id: string; email: string }>(user: T) {
    return {
      accessToken: await this.jwtService.signAsync({ sub: user.id, email: user.email }),
      tokenType: 'Bearer',
      user,
    };
  }

  private readonly publicUserSelect = {
    id: true,
    name: true,
    email: true,
    avatarUrl: true,
    createdAt: true,
    updatedAt: true,
  } as const;
}
