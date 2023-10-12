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
                return {"err":'no se pudo encontrar los articulos de la comunidad'}
            }
            return relatedArticlesByCategories;
        }
        if (!works(relatedArticlesByCategories) || !relatedArticlesByCategories){
            return relatedArticlesByWritter;
        }
        
        return [...relatedArticlesByWritter,...relatedArticlesByCategories];


    }


    public async feed(req : Request) {
        let weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 10);
        //@ts-ignore
        const communities = await this.communityService.feed(parseInt(req.query.communityId),weekAgo);

        if(! communities ){
			return {"err":'no hay feed de esta comunidad'}
		}

        return communities;

        }

    public async getCommunityById(req : Request) {
        const articleId = req.params.id;
		//@ts-ignore
        const userId = decryptToken(req.headers['authorization']).userId;

        const article = await this.communityService.getCommunityById(parseInt(articleId, 10), userId);
        if (! article) {
            return {"err": 'La comunidad no existe'};
        }
        return article;
    }

    public async createCommunity(req : Request) {
        const communityCreated = await this.communityService.createCommunity(req.body);
        if (! communityCreated) {
            return {"err": "No se pudo crear la comunidad"}
        }
        return {communityId: communityCreated.id_community, name: communityCreated.name}
    }

    public async updateCommunity(req : Request) {
        const communityId = req.params.idCommunity;
		//@ts-ignore
        const userId = decryptToken(req.headers['authorization']).userId;
        if(! await this.communityService.isCreator(parseInt(communityId, 10), userId)){
            return {"err": "No es el creador de la comunidad"}
        }
        const communityUpdated = await this.communityService.updateCommunity(parseInt(communityId, 10), req.body);
        if (! communityUpdated) {
            return {"err": "No se pudo actualizar la comunidad"}
        }
        return {communityId: communityUpdated.id_community, name: communityUpdated.name}
    }

    public async deleteCommunity(req : Request) {
        const communityId = req.params.idCommunity;		//@ts-ignore
        const userId = decryptToken(req.headers['authorization']).userId;
        if(! await this.communityService.isCreator(parseInt(communityId, 10), userId)){
            return {"err": "No es el creador de la comunidad"}
        }
        const communityDeleted = await this.communityService.deleteCommunity(parseInt(communityId, 10));
        if (! communityDeleted) {
            return {"err": "No se pudo eliminar la comunidad"}
        }
        return {communityId: communityDeleted.id_community, name: communityDeleted.name}
    }

    public async joinCommunity(req : Request) {
        const communityId = req.params.idCommunity;
        
		//@ts-ignore
        const userId = decryptToken(req.headers['authorization']).userId;
        const communityJoined = await this.communityService.joinCommunity(parseInt(communityId, 10), userId);
        if (! communityJoined) {
            return {"err": "No se pudo unirse a la comunidad"}
        }
        return ;
    }

    public async leaveCommunity(req : Request) {
        const communityId = req.params.idCommunity;
        
		//@ts-ignore
        const userId = decryptToken(req.headers['authorization']).userId;
        const communityLeft = await this.communityService.leaveCommunity(parseInt(communityId, 10), userId);
        if (! communityLeft) {
            return {"err": "No se pudo salir de la comunidad"}
        }
        return ;
    }

    public async getCommunityMembers(req : Request) {
        const communityId = req.params.communityId;
        const members = await this.communityService.getCommunityMembers(parseInt(communityId, 10));
        if (! members) {
            return {"err": "No se pudo obtener los miembros de la comunidad"}
        }
        return members;
    }

    
}
