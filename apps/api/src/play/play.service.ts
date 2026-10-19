import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePlayDto } from './dto/create-play.dto';
import { UpdatePlayDto } from './dto/update-play.dto';
import { toPlayDto } from './play.mapper';
import type { PlayDto } from '@ludoteca/types';

@Injectable()
export class PlayService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreatePlayDto): Promise<PlayDto> {
    await this.assertGameExists(dto.gameId);

    const play = await this.prisma.play.create({
      data: {
        gameId: dto.gameId,
        playedAt: new Date(dto.playedAt),
        note: dto.note ?? null,
      },
    });
    return toPlayDto(play);
  }

  async findAll(gameId?: string): Promise<PlayDto[]> {
    const plays = await this.prisma.play.findMany({
      where: gameId ? { gameId } : undefined,
      orderBy: [{ playedAt: 'desc' }, { createdAt: 'desc' }],
    });
    return plays.map(toPlayDto);
  }

  async findOne(id: string): Promise<PlayDto> {
    const play = await this.prisma.play.findUnique({ where: { id } });

    if (!play) {
      throw new NotFoundException(`Play ${id} not found`);
    }

    return toPlayDto(play);
  }

  async update(id: string, dto: UpdatePlayDto): Promise<PlayDto> {
    await this.findOne(id);

    if (dto.gameId) {
      await this.assertGameExists(dto.gameId);
    }

    const play = await this.prisma.play.update({
      where: { id },
      data: {
        ...(dto.gameId !== undefined && { gameId: dto.gameId }),
        ...(dto.playedAt !== undefined && { playedAt: new Date(dto.playedAt) }),
        ...(dto.note !== undefined && { note: dto.note ?? null }),
      },
    });
    return toPlayDto(play);
  }

  async remove(id: string): Promise<PlayDto> {
    await this.findOne(id);

    const play = await this.prisma.play.delete({ where: { id } });
    return toPlayDto(play);
  }

  private async assertGameExists(gameId: string): Promise<void> {
    const game = await this.prisma.game.findUnique({ where: { id: gameId } });
    if (!game) {
      throw new NotFoundException(`Game ${gameId} not found`);
    }
  }
}
