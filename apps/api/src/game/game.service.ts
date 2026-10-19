import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { toGameDto } from './game.mapper';
import type { GameDto } from '@ludoteca/types';

@Injectable()
export class GameService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateGameDto): Promise<GameDto> {
    const game = await this.prisma.game.create({
      data: dto,
    });
    return toGameDto(game);
  }

  async findAll(): Promise<GameDto[]> {
    const games = await this.prisma.game.findMany();
    return games.map(toGameDto);
  }

  async findOne(id: string): Promise<GameDto> {
    const game = await this.prisma.game.findUnique({ where: { id } });

    if (!game) {
      throw new NotFoundException(`Game ${id} not found`);
    }

    return toGameDto(game);
  }

  async update(id: string, dto: UpdateGameDto): Promise<GameDto> {
    await this.findOne(id);

    const game = await this.prisma.game.update({
      where: { id },
      data: dto,
    });
    return toGameDto(game);
  }

  async remove(id: string): Promise<GameDto> {
    await this.findOne(id);

    try {
      const game = await this.prisma.game.delete({
        where: { id },
      });
      return toGameDto(game);
    } catch (error: unknown) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        (error as { code: string }).code === 'P2003'
      ) {
        throw new ConflictException(
          `Cannot delete game ${id}: it has recorded plays`,
        );
      }
      throw error;
    }
  }
}
