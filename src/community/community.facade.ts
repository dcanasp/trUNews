import "reflect-metadata";
import {Request} from 'express';
import {injectable, inject} from 'tsyringe'
import {CommunityService} from './community.service';
import {DatabaseErrors} from '../errors/database.errors';
import { decryptToken } from "../auth/jwtServices";
import {communityType,checkArticleToAddType,addArticleCommunityType} from '../dto/community';
import {works} from '../utils/works';
import {returnArticles,returnArticlesCategory} from '../dto/article';
import {decryptedToken} from '../dto/user';


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
        //@ts-ignore
        const communities = await this.communityService.feed(parseInt(req.query.communityId));

        if(! communities ){
			return {"err":'no hay feed de esta comunidad'}
		}

        return communities;

        }

    public async getCommunityById(req : Request) {
        const articleId = req.params.id;
        if(!req.headers['authorization']){
			return {"err": 'no hay token para el feed'};
		}
		const decryptedToken:decryptedToken|undefined = await  decryptToken(req.headers['authorization']);

        if(!decryptedToken){
			return {"err": 'token invalido'};
		}
        const userId = decryptedToken.userId;


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
        const communityId = parseInt( req.params.idCommunity ,10);
		
        if(!req.headers['authorization']){
			return {"err": 'no hay token para el feed'};
		}
		const decryptedToken:decryptedToken|undefined = await  decryptToken(req.headers['authorization']);

        if(!decryptedToken){
			return {"err": 'token invalido'};
		}
        const userId = decryptedToken.userId;

        
        if(! await this.communityService.isCreator(communityId, userId)){
            return {"err": "No es el creador de la comunidad"}
        }
        const communityUpdated = await this.communityService.updateCommunity(communityId, req.body);
        if (! communityUpdated) {
            return {"err": "No se pudo actualizar la comunidad"}
        }
        return {communityId: communityUpdated.id_community, name: communityUpdated.name}
    }

    public async deleteCommunity(req : Request) {
        const communityId = parseInt(req.params.idCommunity,10);
        if(!req.headers['authorization']){
			return {"err": 'no hay token para el feed'};
		}
		const decryptedToken:decryptedToken|undefined = await  decryptToken(req.headers['authorization']);

        if(!decryptedToken){
			return {"err": 'token invalido'};
		}
        const userId = decryptedToken.userId;


        if(! await this.communityService.isCreator(communityId, userId)){
            return {"err": "No es el creador de la comunidad"}
        }
        const communityDeleted = await this.communityService.deleteCommunity(communityId);
        if (! communityDeleted) {
            return {"err": "No se pudo eliminar la comunidad"}
        }
        return {communityId: communityDeleted.id_community, name: communityDeleted.name}
    }

    public async joinCommunity(req : Request) {
        const communityId = parseInt( req.params.idCommunity,10 );
        if(!req.headers['authorization']){
			return {"err": 'no hay token para el feed'};
		}
		const decryptedToken:decryptedToken|undefined = await  decryptToken(req.headers['authorization']);

        if(!decryptedToken){
			return {"err": 'token invalido'};
		}
        const userId = decryptedToken.userId;

		
        const communityJoined = await this.communityService.joinCommunity( communityId, userId);
        if (! communityJoined) {
            return {"err": "No se pudo unirse a la comunidad"}
        }
        return {"success":true};
    }

    public async leaveCommunity(req : Request) {
        const communityId = req.params.idCommunity;
        
		if(!req.headers['authorization']){
			return {"err": 'no hay token para el feed'};
		}
		const decryptedToken:decryptedToken|undefined = await  decryptToken(req.headers['authorization']);

        if(!decryptedToken){
			return {"err": 'token invalido'};
		}
        const userId = decryptedToken.userId;

        const communityLeft = await this.communityService.leaveCommunity(parseInt(communityId, 10), userId);
        if (! communityLeft) {
            return {"err": "No se pudo salir de la comunidad"}
        }
        return {"success":true};
    }

    public async getCommunityMembers(req : Request) {
        const communityId = req.params.communityId;
        const members = await this.communityService.getCommunityMembers(parseInt(communityId, 10));
        if (! members) {
            return {"err": "No se pudo obtener los miembros de la comunidad"}
        }
        return members;
    }

    public async addArticle(req : Request) {
        if(!req.headers['authorization']){
			return {"err": 'No hay token para añadir artículo.'};
		}
		const decryptedToken:decryptedToken|undefined = await  decryptToken(req.headers['authorization']);

        if(!decryptedToken){
			return {"err": 'token invalido'};
		}
        const body:addArticleCommunityType = req.body;
        const communityId = body.communityId;
        const userInCommunity = this.communityService.isMemberOfCommunity(decryptedToken.userId,communityId)
        if (!userInCommunity){
            return {"err": "Usuario no pertenece a la comunidad"};
        }
        const articleId = body.articleId;
        const articleAdded = await this.communityService.addArticleToCommunity(communityId,articleId ,decryptedToken.userId);
        if (! articleAdded) {
            return {"err": "No se pudo agregar el articulo a la comunidad, verifique que posea una categoría en común con la comunidad."}
        }
        return articleAdded;
    }

    public async removeArticle(req : Request) {
        if(!req.headers['authorization']){
			return {"err": 'No hay token para añadir artículo.'};
		}
		const decryptedToken:decryptedToken|undefined = await  decryptToken(req.headers['authorization']);

        if(!decryptedToken){
			return {"err": 'token invalido'};
		}
    
        const communityId = req.params.communityId;
        const articleId = req.params.idArticle;
        const articleRemoved = await this.communityService.removeArticle(parseInt(communityId, 10), parseInt(articleId, 10),decryptedToken.userId);
        if (! articleRemoved) {
            return {"err": "No se pudo eliminar el articulo de la comunidad"}
        }
        return {"success":true};
    }
 
    public async checkArticleToAdd(req : Request) {
        const body:checkArticleToAddType = req.body;
        const userInCommunity = await this.communityService.isMemberOfCommunity(body.userId,body.communityId);
        if (!userInCommunity){
            return {"err": "Usuario no pertenece a la comunidad"};
        }
        const articleAdded: returnArticlesCategory[] = await this.communityService.checkArticleToAdd(body.userId,body.communityId);
        if (! articleAdded || articleAdded.length===0) {
            return {"err": "No tiene articulos publicados"}
        }

        return articleAdded;
    }

    public async postedOnCommunity(req : Request) {
        const body:checkArticleToAddType = req.body;
        const userInCommunity = await this.communityService.isMemberOfCommunity(body.userId,body.communityId);
        if (!userInCommunity){
            return {"err": "Usuario no pertenece a la comunidad"};
        }
        const articleAdded:returnArticlesCategory[] = await this.communityService.postedOnCommunity(body.userId,body.communityId);
        if (! articleAdded) {
            return {"err": "No tiene articulos publicados en la comunidad"}
        }

        return articleAdded;
    }

    public async createEvent(req : Request) {
        const body = req.body;
        const eventCreated = await this.communityService.createEvent(body);
        if (! eventCreated) {
            return {"err": "No se pudo crear el evento"}
        }
        return eventCreated;
    }

    public async getCommunityEvents(req : Request) {
        if(!req.headers['authorization']){
			return {"err": 'No hay token para añadir artículo.'};
		}
		const decryptedToken:decryptedToken|undefined = await  decryptToken(req.headers['authorization']);

        if(!decryptedToken){
			return {"err": 'token invalido'};
		}
        const communityId = req.params.communityId;
        const events = await this.communityService.getCommunityEvents(parseInt(communityId, 10), decryptedToken.userId);
        if (! events) {
            return {"err": "No se pudo obtener los eventos de la comunidad"}
        }
        return events;
    }

    public async getEvent(req : Request) {
        if(!req.headers['authorization']){
			return {"err": 'No hay token para añadir artículo.'};
		}
		const decryptedToken:decryptedToken|undefined = await  decryptToken(req.headers['authorization']);

        if(!decryptedToken){
			return {"err": 'token invalido'};
		}
        const eventId = req.params.eventId;
        const event = await this.communityService.getEvent(parseInt(eventId, 10), decryptedToken.userId);
        if (! event) {
            return {"err": "No se pudo obtener el evento"}
        }
        return event;
    }

    public async deleteEvent(req : Request) {
        const eventId = parseInt(req.params.idCommunity,10);
        if(!req.headers['authorization']){
			return {"err": 'no hay token'};
		}
		const decryptedToken:decryptedToken|undefined = await  decryptToken(req.headers['authorization']);

        if(!decryptedToken){
			return {"err": 'token invalido'};
		}
        const userId = decryptedToken.userId;


        if(! await this.communityService.isCreatorEvent(eventId, userId)){
            return {"err": "No es el creador del evento"}
        }
        const eventDeleted = await this.communityService.deleteEvent(eventId);
        if (! eventDeleted) {
            return {"err": "No se pudo eliminar el evento"}
        }
        return {eventId: eventDeleted.id_event, name: eventDeleted.name}
    }

    public async attendEvent(req : Request) {
        const eventId = parseInt( req.params.idEvent,10 );
        if(!req.headers['authorization']){
			return {"err": 'no hay token'};
		}
		const decryptedToken:decryptedToken|undefined = await  decryptToken(req.headers['authorization']);

        if(!decryptedToken){
			return {"err": 'token invalido'};
		}
        const userId = decryptedToken.userId;
		
        const eventAttended = await this.communityService.attendEvent(eventId, userId);
        if (! eventAttended) {
            return {"err": "No se pudo asistir al evento"}
        }
        return {"success":true};
    }

    public async undoAttendEvent(req : Request) {
        const eventId = parseInt( req.params.idEvent,10 );
        if(!req.headers['authorization']){
			return {"err": 'no hay token'};
		}
		const decryptedToken:decryptedToken|undefined = await  decryptToken(req.headers['authorization']);

        if(!decryptedToken){
			return {"err": 'token invalido'};
		}
        const userId = decryptedToken.userId;
        
        const eventAttended = await this.communityService.undoAttendEvent(eventId, userId);
        if (! eventAttended) {
            return {"err": "No se pudo asistir al evento"}
        }
        return {"success":true};
    }
}
