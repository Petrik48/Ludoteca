import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';

@Injectable()
export class GameService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateGameDto) {
    return this.prisma.game.create({
      data: dto,
    });
  }

  async findAll() {
    return this.prisma.game.findMany();
  }

  async findOne(id: string) {
    const game = await this.prisma.game.findUnique({ where: { id } });

    if (!game) {
      throw new NotFoundException(`Game ${id} not found`);
    }

    return game;
  }

  async update(id: string, dto: UpdateGameDto) {
    await this.findOne(id);

    return this.prisma.game.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.game.delete({
      where: { id },
    });
  }
}
