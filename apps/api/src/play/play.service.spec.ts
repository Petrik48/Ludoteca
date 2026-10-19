import { PlayService } from './play.service';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

const NOW = new Date('2026-10-15T12:00:00.000Z');
const PLAYED_AT = new Date('2026-10-10');

function makePrismaPlay(overrides: Record<string, unknown> = {}) {
  return {
    id: 'play-1',
    gameId: 'game-1',
    playedAt: PLAYED_AT,
    note: null,
    createdAt: NOW,
    updatedAt: NOW,
    ...overrides,
  };
}

describe('PlayService', () => {
  let service: PlayService;
  let prisma: {
    play: {
      create: jest.Mock;
      findMany: jest.Mock;
      findUnique: jest.Mock;
      update: jest.Mock;
      delete: jest.Mock;
    };
    game: {
      findUnique: jest.Mock;
    };
  };

  beforeEach(async () => {
    prisma = {
      play: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      game: {
        findUnique: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [PlayService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get<PlayService>(PlayService);
  });

  describe('create', () => {
    it('creates a play and returns dto with YYYY-MM-DD playedAt', async () => {
      const dto = { gameId: 'game-1', playedAt: '2026-10-10' };
      const prismaPlay = makePrismaPlay();

      prisma.game.findUnique.mockResolvedValue({ id: 'game-1' });
      prisma.play.create.mockResolvedValue(prismaPlay);

      const result = await service.create(dto);

      expect(prisma.game.findUnique).toHaveBeenCalledWith({ where: { id: 'game-1' } });
      expect(prisma.play.create).toHaveBeenCalledWith({
        data: {
          gameId: 'game-1',
          playedAt: new Date('2026-10-10'),
          note: null,
        },
      });
      expect(result.playedAt).toBe('2026-10-10');
      expect(result.createdAt).toBe(NOW.toISOString());
    });

    it('creates a play with note', async () => {
      const dto = { gameId: 'game-1', playedAt: '2026-10-10', note: 'Great game!' };
      const prismaPlay = makePrismaPlay({ note: 'Great game!' });

      prisma.game.findUnique.mockResolvedValue({ id: 'game-1' });
      prisma.play.create.mockResolvedValue(prismaPlay);

      const result = await service.create(dto);

      expect(prisma.play.create).toHaveBeenCalledWith({
        data: {
          gameId: 'game-1',
          playedAt: new Date('2026-10-10'),
          note: 'Great game!',
        },
      });
      expect(result.note).toBe('Great game!');
    });

    it('throws NotFoundException when game does not exist', async () => {
      const dto = { gameId: 'nonexistent', playedAt: '2026-10-10' };

      prisma.game.findUnique.mockResolvedValue(null);

      await expect(service.create(dto)).rejects.toThrow(NotFoundException);
      await expect(service.create(dto)).rejects.toThrow('Game nonexistent not found');
      expect(prisma.play.create).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('returns all plays sorted by playedAt desc, createdAt desc', async () => {
      const plays = [makePrismaPlay({ id: 'p1' }), makePrismaPlay({ id: 'p2' })];
      prisma.play.findMany.mockResolvedValue(plays);

      const result = await service.findAll();

      expect(prisma.play.findMany).toHaveBeenCalledWith({
        where: undefined,
        orderBy: [{ playedAt: 'desc' }, { createdAt: 'desc' }],
      });
      expect(result).toHaveLength(2);
    });

    it('filters by gameId when provided', async () => {
      prisma.play.findMany.mockResolvedValue([]);

      await service.findAll('game-1');

      expect(prisma.play.findMany).toHaveBeenCalledWith({
        where: { gameId: 'game-1' },
        orderBy: [{ playedAt: 'desc' }, { createdAt: 'desc' }],
      });
    });

    it('returns empty list', async () => {
      prisma.play.findMany.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('returns a single play', async () => {
      const prismaPlay = makePrismaPlay();
      prisma.play.findUnique.mockResolvedValue(prismaPlay);

      const result = await service.findOne('play-1');

      expect(prisma.play.findUnique).toHaveBeenCalledWith({ where: { id: 'play-1' } });
      expect(result.id).toBe('play-1');
      expect(result.playedAt).toBe('2026-10-10');
    });

    it('throws NotFoundException when play does not exist', async () => {
      prisma.play.findUnique.mockResolvedValue(null);

      await expect(service.findOne('nonexistent')).rejects.toThrow(NotFoundException);
      await expect(service.findOne('nonexistent')).rejects.toThrow('Play nonexistent not found');
    });
  });

  describe('update', () => {
    it('updates an existing play', async () => {
      const dto = { note: 'Updated note' };
      const prismaPlay = makePrismaPlay();
      const updatedPlay = makePrismaPlay({ note: 'Updated note' });

      prisma.play.findUnique.mockResolvedValue(prismaPlay);
      prisma.play.update.mockResolvedValue(updatedPlay);

      const result = await service.update('play-1', dto);

      expect(prisma.play.update).toHaveBeenCalledWith({
        where: { id: 'play-1' },
        data: { note: 'Updated note' },
      });
      expect(result.note).toBe('Updated note');
    });

    it('validates game exists when gameId is changed', async () => {
      const dto = { gameId: 'game-2' };
      const prismaPlay = makePrismaPlay();

      prisma.play.findUnique.mockResolvedValue(prismaPlay);
      prisma.game.findUnique.mockResolvedValue({ id: 'game-2' });
      prisma.play.update.mockResolvedValue(makePrismaPlay({ gameId: 'game-2' }));

      await service.update('play-1', dto);

      expect(prisma.game.findUnique).toHaveBeenCalledWith({ where: { id: 'game-2' } });
    });

    it('throws NotFoundException when changing to nonexistent game', async () => {
      const dto = { gameId: 'nonexistent' };
      const prismaPlay = makePrismaPlay();

      prisma.play.findUnique.mockResolvedValue(prismaPlay);
      prisma.game.findUnique.mockResolvedValue(null);

      await expect(service.update('play-1', dto)).rejects.toThrow(NotFoundException);
      expect(prisma.play.update).not.toHaveBeenCalled();
    });

    it('throws NotFoundException when play does not exist', async () => {
      prisma.play.findUnique.mockResolvedValue(null);

      await expect(service.update('nonexistent', { note: 'x' })).rejects.toThrow(NotFoundException);
      expect(prisma.play.update).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('deletes an existing play', async () => {
      const prismaPlay = makePrismaPlay();

      prisma.play.findUnique.mockResolvedValue(prismaPlay);
      prisma.play.delete.mockResolvedValue(prismaPlay);

      const result = await service.remove('play-1');

      expect(prisma.play.delete).toHaveBeenCalledWith({ where: { id: 'play-1' } });
      expect(result.id).toBe('play-1');
    });

    it('throws NotFoundException when play does not exist', async () => {
      prisma.play.findUnique.mockResolvedValue(null);

      await expect(service.remove('nonexistent')).rejects.toThrow(NotFoundException);
      expect(prisma.play.delete).not.toHaveBeenCalled();
    });
  });
});
