import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { GameModule } from './game/game.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [PrismaModule, GameModule, HealthModule],
})
export class AppModule {}
