import "reflect-metadata";
import {injectable, inject} from 'tsyringe';
import {DatabaseService} from '../db/databaseService';
import {logger, permaLogger} from '../utils/logger';
import {createArticleType} from '../dto/article';
import {uploadToS3} from '../aws/addS3';
import {DatabaseErrors} from '../errors/database.errors';
import {UserService} from '../user/user.service';
import {Roles} from '../utils/roleDefinition';
import {resizeImages} from '../utils/resizeImages';
import {communityType} from '../dto/community';

@injectable()
export class CommunityService {
    private databaseService
    constructor(@inject(DatabaseService) databaseService : DatabaseService) {
        this.databaseService = databaseService.getClient()
    }

    public async findAll() {

        try{
            const comunidad = await this.databaseService.community.findMany({
                include:{community_has_users:{
                    orderBy:{
                        community_id_community:"desc"
                    }
                }}
              });
            
            

            if (! comunidad || !comunidad[0] ) {
                throw new DatabaseErrors('no hay comunidades');
            }
            return comunidad;
        }catch{
            return;
        }
    }

    public async find(nombre:string) {
     
        try{
            const comunidad = await this.databaseService.community.findMany({
                where: {
                  OR: [
                    {
                      name: {
                        contains: nombre,
                        mode: 'insensitive',
                      }
                    },
                  ]
                },
                include:{community_has_users:{
                    orderBy:{
                        community_id_community:"desc"
                    }
                }}
              });
            if (! comunidad || !comunidad[0] ) {
                throw new DatabaseErrors('no hay comunidad con ese nombre');
            }
            return comunidad
        }catch{
            return;
        }

    }
        
    public async getUsersCountFromCommunities(comunidad: communityType[]){
        const communitiesWithFollowerCount = await Promise.all(
            comunidad.map(async ({community_has_users,...community}) => {
                const followerCount = await this.databaseService.community_has_users.count({
                where: {
                    community_id_community: community.id_community
                }
                });
                return {
                    ...community,
                    followerCount
                };
            })
            );            

            if (! communitiesWithFollowerCount ) {
                throw new DatabaseErrors('fallo sacar usuarios de la comunidad');
            }
            return communitiesWithFollowerCount;
    }

    public async related() {
        return await this.databaseService.article.findMany();
    }

    public async feed() {
        return await this.databaseService.article.findMany();
    }

}

