import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { isValidObjectId, Model } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';
import { PaginationDto } from '../common/dto/pagination.dto';
import { off } from 'process';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PokemonService {

  private defaultLimit : number;
  constructor(

    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,

    private readonly configServices: ConfigService,


  ){
    this.defaultLimit = +this.configServices.get('default_limit')
    
  }

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name= createPokemonDto.name.toLowerCase();
    //Responder a errores especificos, dupluctermad en datos

    try {
      
      //Inserción a base de datos
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;

    } catch (error) {
     this.handleExceptions(error);
      
    }


  }

  findAll(paginationDto:PaginationDto) {
    const {limit =this.defaultLimit, offset=0} =paginationDto;
    return this.pokemonModel.find()
    .limit(limit)
    .skip(offset)
    .sort({
      no:1
    })
    .select('-__v')
  }

  async findOne(term: string) {

    let pokemon : Pokemon

    if(!isNaN(+term)){
      pokemon = await this.pokemonModel.findOne({no:term});
    }
    //Verificacion MongoID
    
    if ( !pokemon && isValidObjectId( term ) ){
      pokemon = await this.pokemonModel.findById(term);
    }
    
    
    //Verificacion Name

    if(!pokemon){
      pokemon = await this.pokemonModel.findOne({name:term.toLowerCase().trim()})
    }
    
    if(!pokemon) 
      throw new NotFoundException(`Pokemon with id, name or no "${term}" not found`)
    
    return pokemon

  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {

    const pokemon = await this.findOne(term);
    if(updatePokemonDto.name)
      updatePokemonDto.name = updatePokemonDto.name.toLowerCase();

    try {
      await pokemon.updateOne( updatePokemonDto);
      return {...pokemon.toJSON(), ...updatePokemonDto};
      
    } catch (error) {
      this.handleExceptions(error);
      
    }


  }

  async remove(term: string) {
    // const pokemon = await this.findOne(term);
    // await pokemon.deleteOne();


    // return {term};
    // const result= await this.pokemonModel.findByIdAndDelete(term);
    const {deletedCount, acknowledged} = await this.pokemonModel.deleteOne({_id:term});
    if(deletedCount===0)
      throw new BadRequestException(`Pokemon with id "${term}" not found`)


    return ;
  }

  private handleExceptions(error : any){
    if(error.code===11000){
      throw new BadRequestException(`Pokemon exists in DB ${JSON.stringify(error.keyValue)}`)
    }
    console.log(error);
     throw new InternalServerErrorException(`Can't create Pokemon - Check server logs`)
    
  }
}
