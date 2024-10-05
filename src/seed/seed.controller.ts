import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SeedService } from './seed.service';
import { CreatePokemonDto } from 'src/pokemon/dto/create-pokemon.dto';


@Controller('seed')
export class SeedController {


  constructor(private readonly seedService: SeedService) {}

  @Get()
  execuateSeed() {
    return this.seedService.executeSeed();
  }




}
