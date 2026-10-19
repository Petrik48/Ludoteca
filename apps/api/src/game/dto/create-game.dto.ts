import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { GAME_TYPES } from '@ludoteca/types';
import type { CreateGameInput } from '@ludoteca/types';

export class CreateGameDto implements CreateGameInput {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  name!: string;

  @IsEnum(GAME_TYPES)
  type!: CreateGameInput['type'];

  @IsOptional()
  @IsInt()
  bggId?: number;
}
