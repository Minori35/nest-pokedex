import { Inject, Injectable } from "@nestjs/common";
import axios,{ AxiosInstance } from "axios";
import { HttpAdapter } from "../interfaces/http-adapter.interface";

@Injectable()
export class AxiosAdapter implements HttpAdapter{
    private  axios : AxiosInstance 
    async get<T>(url: string): Promise<T> {
        try {

            const {data} = await axios.get<T>(url)
            return data
        } catch (error) {
                throw new Error('This is an error -Check logs')
        }

    }


    
}