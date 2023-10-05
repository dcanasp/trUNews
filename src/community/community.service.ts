import "reflect-metadata";
import {injectable, inject} from 'tsyringe';
import {DatabaseService} from '../db/databaseService';
import {logger, permaLogger} from '../utils/logger';
import {createArticleType,returnArticles} from '../dto/article';
import {uploadToS3} from '../aws/addS3';
import {DatabaseErrors} from '../errors/database.errors';
import {UserService} from '../user/user.service';
import {Roles} from '../utils/roleDefinition';
import {resizeImages} from '../utils/resizeImages';
import {communityType} from '../dto/community';
import {works} from '../utils/works';

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



            if (!works(comunidad)) {
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
            if (!works(comunidad)) {
                throw new DatabaseErrors('no hay comunidad con ese nombre');
            }
            return comunidad
        }catch{
            return;
        }

    }

    public async getUsersCountFromCommunities(comunidad: communityType[]){
        try{
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

            if (!works(communitiesWithFollowerCount) ) {
                throw new DatabaseErrors('fallo sacar usuarios de la comunidad');
            }
            return communitiesWithFollowerCount;
        }catch{
            return ;
        }
    }

    public async relatedWritter(articleId:number,communityId:number,weekAgo:Date) {
        try{
        const escritorId = (await this.databaseService.article.findMany({ 
            where:{id_article:articleId},  
            select:{ id_writer:true},
        }))[0].id_writer
        
        
        //articulos del mismo autor en la misma coumidad
        const relatedArticlesByWritter = await this.databaseService.community.findUnique({
            where:{id_community:communityId},
 
            select:{ 
                community_has_articles:{

                where:{article:{id_writer:escritorId,date:{gte: weekAgo}}},
                include:{article:{include:{writer:{select:{name:true,lastname:true,username:true}}}
                        
            }},
                orderBy:{article_id_community:"desc"}}
                
            }
        });
        if(!(relatedArticlesByWritter)){
            throw new DatabaseErrors("no encontro articulos de ese autor")
        }
        const flatArticlesByWritter: returnArticles[] = relatedArticlesByWritter?.community_has_articles.flatMap(communityArticle => {
            const {writer,...article} = communityArticle.article;
            return {
                ...article,...writer
            };
          });
        
        
        return flatArticlesByWritter;
        }catch{
            return ;
        }
    }


    public async relatedCategories(articleId:number,communityId:number,weekAgo:Date) {
    try{

        const articleCategories = await this.databaseService.article.findUnique({
            where: { id_article: articleId },
            select: {
              article_has_categories: {
                select: {
                  categories_id_categories: true,
                },
              },
            },
          });

        if (!(articleCategories)){
            throw new DatabaseErrors("fallo monumental, no encuentra categorias de un articulo")
        }
          const categoryIds = articleCategories.article_has_categories.map(
            (category) => category.categories_id_categories
          );
          
          // Find articles with the same categories in the given community
          const relatedArticlesByCategories = await this.databaseService.community.findUnique({
            where: { id_community: communityId },
            select: {
              community_has_articles: {
                where: {
                  article: {
                    date:{
                        gte: weekAgo
                    },
                    article_has_categories: {
                      some: {
                        categories_id_categories: {
                          in: categoryIds,
                        },
                      },
                    },
                  },
                },
                include: {
                  article: {
                    include: {
                      writer: {
                        select: { name: true, lastname: true, username: true },
                      },
                    },
                  },
                },
                orderBy: { article_id_community: 'desc' },
              },
            },
          });
        if (!relatedArticlesByCategories){
            throw new DatabaseErrors("fallo monumental, no encuentra categorias de un articulo")
        }
        const flatArticlesByCategories: returnArticles[] = relatedArticlesByCategories.community_has_articles.flatMap(communityArticle => {
            const {writer,...article} = communityArticle.article;
            return {
                ...article,...writer
            };
          });
        return flatArticlesByCategories
    }catch{
        return ;
    }
    
    }
    public async feed() {
        try{
            return await this.databaseService.article.findMany();
        }
        catch{
            return ;
        }
    }

}

