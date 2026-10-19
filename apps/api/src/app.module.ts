import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { GameModule } from './game/game.module';
import { PlayModule } from './play/play.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [PrismaModule, GameModule, PlayModule, HealthModule],
})
export class AppModule {}
