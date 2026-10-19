import { IsNotEmpty, IsOptional, IsString, IsUUID, Matches, MaxLength } from 'class-validator';
import type { CreatePlayInput } from '@ludoteca/types';

export class CreatePlayDto implements CreatePlayInput {
  @IsUUID()
  gameId!: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'playedAt must be a date in YYYY-MM-DD format',
  })
  playedAt!: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  note?: string;
}
