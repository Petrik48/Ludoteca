import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { PlayService } from './play.service';
import { CreatePlayDto } from './dto/create-play.dto';
import { UpdatePlayDto } from './dto/update-play.dto';

@Controller('plays')
export class PlayController {
  constructor(private readonly playService: PlayService) {}

  @Post()
  create(@Body() dto: CreatePlayDto) {
    return this.playService.create(dto);
  }

  @Get()
  findAll(@Query('gameId') gameId?: string) {
    return this.playService.findAll(gameId);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.playService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdatePlayDto) {
    return this.playService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.playService.remove(id);
  }
}
