import { Injectable } from '@nestjs/common';
import { PokeResponse } from './interfaces/poke-respinse.interfa';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';



@Injectable()
export class SeedService {

  constructor(

    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly http: AxiosAdapter

  ){  }

  
 
 async executeSeed(){

  await this.pokemonModel.deleteMany();

   const data=  await this.http.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=650')
  
  //  const insertPromesesArray  =[];
  const pokemonToInsert:{name:string, no:number}[]=[]
   
   data.results.forEach(({name, url}) => {
    const segments=url.split('/')
    const no:number = +segments.at(-2)

    // const pokemon = await this.pokemonModel.create({name,no});
    // insertPromesesArray.push(this.pokemonModel.create({name,no}))
    pokemonToInsert.push({name,no})
    
   });

  //  await Promise.all(insertPromesesArray);
  await this.pokemonModel.insertMany(pokemonToInsert);


   return 'Seed executed';
  }
  

}
