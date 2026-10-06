import { GameService } from './game.service';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { GameType } from '../generated/client';
import { NotFoundException } from '@nestjs/common';

describe('GameService', () => {
  let game: GameService;
  let prisma: {
    game: {
      create: jest.Mock;
      findMany: jest.Mock;
      findUnique: jest.Mock;
      update: jest.Mock;
      delete: jest.Mock;
    };
  };

  beforeEach(async () => {
    prisma = {
      game: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [GameService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    game = module.get<GameService>(GameService);
  });

  describe('create', () => {
    it('creates a game with name and type', async () => {
      // Arrange
      const dto = {
        name: 'game-1',
        type: GameType.PNP,
      };
      const createdGame = {
        id: 'g1',
        name: 'game-1',
        type: GameType.PNP,
        createdAt: new Date(),
      };
      prisma.game.create.mockResolvedValue(createdGame);
      // Act
      const result = await game.create(dto);
      // Assert
      expect(prisma.game.create).toHaveBeenCalledWith({
        data: dto,
      });
      expect(result).toEqual(createdGame);
    });
    it('creates a PUBLISHED game without bggId', async () => {
      // Arrange
      const dto = {
        name: 'game-1',
        type: GameType.PUBLISHED,
      };
      const createdGame = {
        id: 'g1',
        name: 'game-1',
        type: GameType.PUBLISHED,
        createdAt: new Date(),
      };
      prisma.game.create.mockResolvedValue(createdGame);
      // Act
      const result = await game.create(dto);
      // Assert
      expect(prisma.game.create).toHaveBeenCalledWith({
        data: dto,
      });
      expect(result).toEqual(createdGame);
    });
  });

  describe('findAll', () => {
    it('returns a list of games', async () => {
      // Arrange
      const games = [{ id: 'game1' }, { id: 'game2' }];

      prisma.game.findMany.mockResolvedValue(games);
      // Act
      const result = await game.findAll();
      // Assert
      expect(prisma.game.findMany).toHaveBeenCalled();
      expect(result).toEqual(games);
    });
    it('returns empty list of games', async () => {
      // Arrange
      prisma.game.findMany.mockResolvedValue([]);
      // Act
      const result = await game.findAll();
      // Assert
      expect(prisma.game.findMany).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('returns a single game', async () => {
      // Arrange
      const id = 'game-1';
      const createdGame = {
        id: 'game-1',
        name: 'game-1',
        type: GameType.PNP,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prisma.game.findUnique.mockResolvedValue(createdGame);
      // Act
      const result = await game.findOne(id);
      // Assert
      expect(prisma.game.findUnique).toHaveBeenCalledWith({ where: { id } });
      expect(result).toEqual(createdGame);
    });

    it('throws NotFoundException when game does not exist', async () => {
      // Arrange
      const id = 'nonexistent-id';
      prisma.game.findUnique.mockResolvedValue(null);
      // Act & Assert
      await expect(game.findOne(id)).rejects.toThrow(NotFoundException);
      await expect(game.findOne(id)).rejects.toThrow(
        `Game ${id} not found`,
      );
    });
  });

  describe('update', () => {
    it('updates an existing game', async () => {
      // Arrange
      const id = 'game-1';
      const dto = { name: 'updated-name' };
      const existingGame = {
        id,
        name: 'game-1',
        type: GameType.PNP,
        createdAt: new Date(),
      };
      const updatedGame = { ...existingGame, ...dto };

      prisma.game.findUnique.mockResolvedValue(existingGame);
      prisma.game.update.mockResolvedValue(updatedGame);
      // Act
      const result = await game.update(id, dto);
      // Assert
      expect(prisma.game.findUnique).toHaveBeenCalledWith({ where: { id } });
      expect(prisma.game.update).toHaveBeenCalledWith({
        where: { id },
        data: dto,
      });
      expect(result).toEqual(updatedGame);
    });

    it('throws NotFoundException when updating a non-existent game', async () => {
      // Arrange
      const id = 'nonexistent-id';
      const dto = { name: 'updated-name' };
      prisma.game.findUnique.mockResolvedValue(null);
      // Act & Assert
      await expect(game.update(id, dto)).rejects.toThrow(NotFoundException);
      expect(prisma.game.update).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('deletes an existing game', async () => {
      // Arrange
      const id = 'game-1';
      const existingGame = {
        id,
        name: 'game-1',
        type: GameType.PNP,
        createdAt: new Date(),
      };

      prisma.game.findUnique.mockResolvedValue(existingGame);
      prisma.game.delete.mockResolvedValue(existingGame);
      // Act
      const result = await game.remove(id);
      // Assert
      expect(prisma.game.findUnique).toHaveBeenCalledWith({ where: { id } });
      expect(prisma.game.delete).toHaveBeenCalledWith({ where: { id } });
      expect(result).toEqual(existingGame);
    });

    it('throws NotFoundException when deleting a non-existent game', async () => {
      // Arrange
      const id = 'nonexistent-id';
      prisma.game.findUnique.mockResolvedValue(null);
      // Act & Assert
      await expect(game.remove(id)).rejects.toThrow(NotFoundException);
      expect(prisma.game.delete).not.toHaveBeenCalled();
    });
  });
});
