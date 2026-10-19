import { GameService } from './game.service';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { GameType } from '../../generated/prisma-client';
import { ConflictException, NotFoundException } from '@nestjs/common';

const NOW = new Date('2026-10-15T12:00:00.000Z');

function makePrismaGame(overrides: Record<string, unknown> = {}) {
  return {
    id: 'g1',
    name: 'game-1',
    type: GameType.PNP,
    bggId: null,
    createdAt: NOW,
    updatedAt: NOW,
    ...overrides,
  };
}

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
    it('creates a game and returns a GameDto', async () => {
      const dto = { name: 'game-1', type: GameType.PNP as const };
      const prismaGame = makePrismaGame();
      prisma.game.create.mockResolvedValue(prismaGame);

      const result = await game.create(dto);

      expect(prisma.game.create).toHaveBeenCalledWith({ data: dto });
      expect(result.id).toBe('g1');
      expect(result.createdAt).toBe(NOW.toISOString());
      expect(typeof result.createdAt).toBe('string');
    });

    it('creates a PUBLISHED game without bggId', async () => {
      const dto = { name: 'game-1', type: GameType.PUBLISHED as const };
      const prismaGame = makePrismaGame({ type: GameType.PUBLISHED });
      prisma.game.create.mockResolvedValue(prismaGame);

      const result = await game.create(dto);

      expect(prisma.game.create).toHaveBeenCalledWith({ data: dto });
      expect(result.type).toBe('PUBLISHED');
    });
  });

  describe('findAll', () => {
    it('returns a list of GameDto', async () => {
      const games = [makePrismaGame({ id: 'g1' }), makePrismaGame({ id: 'g2' })];
      prisma.game.findMany.mockResolvedValue(games);

      const result = await game.findAll();

      expect(prisma.game.findMany).toHaveBeenCalled();
      expect(result).toHaveLength(2);
      expect(typeof result[0].createdAt).toBe('string');
    });

    it('returns empty list', async () => {
      prisma.game.findMany.mockResolvedValue([]);

      const result = await game.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('returns a single GameDto', async () => {
      const prismaGame = makePrismaGame();
      prisma.game.findUnique.mockResolvedValue(prismaGame);

      const result = await game.findOne('g1');

      expect(prisma.game.findUnique).toHaveBeenCalledWith({ where: { id: 'g1' } });
      expect(result.id).toBe('g1');
      expect(typeof result.updatedAt).toBe('string');
    });

    it('throws NotFoundException when game does not exist', async () => {
      prisma.game.findUnique.mockResolvedValue(null);

      await expect(game.findOne('nonexistent')).rejects.toThrow(NotFoundException);
      await expect(game.findOne('nonexistent')).rejects.toThrow('Game nonexistent not found');
    });
  });

  describe('update', () => {
    it('updates an existing game', async () => {
      const dto = { name: 'updated-name' };
      const existingGame = makePrismaGame();
      const updatedGame = makePrismaGame({ name: 'updated-name' });

      prisma.game.findUnique.mockResolvedValue(existingGame);
      prisma.game.update.mockResolvedValue(updatedGame);

      const result = await game.update('g1', dto);

      expect(prisma.game.findUnique).toHaveBeenCalledWith({ where: { id: 'g1' } });
      expect(prisma.game.update).toHaveBeenCalledWith({
        where: { id: 'g1' },
        data: dto,
      });
      expect(result.name).toBe('updated-name');
    });

    it('throws NotFoundException when updating a non-existent game', async () => {
      prisma.game.findUnique.mockResolvedValue(null);

      await expect(game.update('nonexistent', { name: 'x' })).rejects.toThrow(NotFoundException);
      expect(prisma.game.update).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('deletes an existing game', async () => {
      const existingGame = makePrismaGame();

      prisma.game.findUnique.mockResolvedValue(existingGame);
      prisma.game.delete.mockResolvedValue(existingGame);

      const result = await game.remove('g1');

      expect(prisma.game.findUnique).toHaveBeenCalledWith({ where: { id: 'g1' } });
      expect(prisma.game.delete).toHaveBeenCalledWith({ where: { id: 'g1' } });
      expect(result.id).toBe('g1');
    });

    it('throws NotFoundException when deleting a non-existent game', async () => {
      prisma.game.findUnique.mockResolvedValue(null);

      await expect(game.remove('nonexistent')).rejects.toThrow(NotFoundException);
      expect(prisma.game.delete).not.toHaveBeenCalled();
    });

    it('throws ConflictException (409) when game has plays (P2003)', async () => {
      const existingGame = makePrismaGame();
      prisma.game.findUnique.mockResolvedValue(existingGame);
      prisma.game.delete.mockRejectedValue({ code: 'P2003' });

      await expect(game.remove('g1')).rejects.toThrow(ConflictException);
      await expect(game.remove('g1')).rejects.toThrow('Cannot delete game g1: it has recorded plays');
    });
  });
});
