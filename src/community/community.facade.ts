import "reflect-metadata";
import {Request} from 'express';
import {injectable, inject} from 'tsyringe'
import {CommunityService} from './community.service';
import {DatabaseErrors} from '../errors/database.errors';
import { decryptToken } from "../auth/jwtServices";

@injectable()
export class CommunityFacade {
    constructor(@inject(CommunityService)private communityService : CommunityService) {

    }

    
    public async getArticles(req : Request) {
        try {
            const articles = await this.communityService.getArticles();
            return articles;
        } catch (error) {
            throw new DatabaseErrors('Error al obtener los artículos de la base de datos');
        }
    }

}
