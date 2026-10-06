import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { GameType } from '../../generated/client';

export class CreateGameDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  name!: string;

  @IsEnum(GameType)
  type!: GameType;

  @IsOptional()
  @IsInt()
  bggId?: number;
}
