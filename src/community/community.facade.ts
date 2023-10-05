import "reflect-metadata";
import {Request} from 'express';
import {injectable, inject} from 'tsyringe'
import {CommunityService} from './community.service';
import {DatabaseErrors} from '../errors/database.errors';
import { decryptToken } from "../auth/jwtServices";
import {communityType} from '../dto/community';
import {works} from '../utils/works';
import {returnArticles} from '../dto/article';



@injectable()
export class CommunityFacade {
    constructor(@inject(CommunityService)private communityService : CommunityService) {

    }

    
    public async findAll(req : Request) {
        const communities = await this.communityService.findAll();
        if(! communities ){
			return {"err":'no hay comunidades'}
		}

        const communitiesWithUsersCount = await this.communityService.getUsersCountFromCommunities(communities);
        if(! communities ){
			return {"err":'no se puso sacar conteo de participantes'}
		}
        return communitiesWithUsersCount;


    }

    public async find(req : Request) {
        const communities = await this.communityService.find(req.params.nombre);
        if(! communities ){
			return {"err":'no hay comunidades con ese nombre'}
		}
        const communitiesWithUsersCount = await this.communityService.getUsersCountFromCommunities(communities);
        if(! communities ){
			return {"err":'no se puso sacar conteo de participantes'}
		}
        return communitiesWithUsersCount;

    }


    public async related(req : Request) {
        let weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 5);
        //@ts-ignore
        const relatedArticlesByWritter = await this.communityService.relatedWritter(parseInt(req.query.articleId),parseInt(req.query.communityId),weekAgo);
        //@ts-ignore
        const relatedArticlesByCategories = await this.communityService.relatedCategories(parseInt(req.query.articleId),parseInt(req.query.communityId),weekAgo);

        if (!works(relatedArticlesByWritter) || !relatedArticlesByWritter){
            if(!works(relatedArticlesByCategories) || !relatedArticlesByCategories){
                return {"err":'no se puso sacar conteo de participantes'}
            }
            return relatedArticlesByCategories;
        }
        if (!works(relatedArticlesByCategories) || !relatedArticlesByCategories){
            return relatedArticlesByWritter;
        }
        
        return [...relatedArticlesByWritter,...relatedArticlesByCategories];


    }


    public async feed(req : Request) {
        const communities = await this.communityService.feed();
        if(! communities ){
			return {"err":'no hay usuarios con ese nombre'}
		}

        return communities;

        }

}
