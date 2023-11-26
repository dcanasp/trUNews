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
import {communityType,communityTypeExtended,communityTypeWithUsers, createCommunityType} from '../dto/community';
import {works} from '../utils/works';
import { json } from "stream/consumers";
import { CreateEventActionRequest } from "aws-sdk/clients/dataexchange";
import { createEventType } from "../dto/event";
import { get } from "http";

@injectable()
export class CommunityService {
    private databaseService
    constructor(@inject(DatabaseService) databaseService : DatabaseService) {
        this.databaseService = databaseService.getClient()
    }

    public async findAll() {

        try{
            const comunidad = await this.databaseService.community.findMany({
                include:{
                    community_has_users:{
                        orderBy:{
                            community_id_community:"desc"
                        }
                },
                    community_has_categories:{
                        select:{
                            category:{
                                select:{
                                    id_category:true,
                                    cat_name:true
                                }
                            }
                        }
                    }
                }
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
                include:{
                    community_has_users:{
                    orderBy:{
                        community_id_community:"desc"
                    }
                },
                community_has_categories:{
                    select:{
                        category:{
                            select:{
                                id_category:true,
                                cat_name:true
                            }
                        }
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

    public async getUsersCountFromCommunities(comunidad: communityTypeWithUsers[]){
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
    public async feed(communityId:number) {
        try{
            const idArticulosDeComunidad = await this.databaseService.community_has_articles.findMany({
                where:{
                    community_id_community: communityId,
                }
            });
            const categoriesNames = await this.databaseService.categories.findMany();
            const articles = [];
            for (const article of idArticulosDeComunidad){

                const articulosComunidad = await this.databaseService.article.findMany({
                    where:{
                        id_article:article.article_id_community,
                    },
                    orderBy:{date:'desc'},
                    include:{
                        writer: {
                            select: { name: true, lastname: true, username: true,profile_image:true },
                        },
                        article_has_categories:true
                    }

                }) 
                if (!articulosComunidad){
                    continue;
                }

                const categoriesNamesMap = new Map(
                    categoriesNames.map(({ id_category, cat_name }) => [id_category, cat_name])
                  );
                  
                  const modifiedArticles = articulosComunidad.map((article) => {
                    const { writer, article_has_categories, ...rest } = article;
                  
                    const modifiedCategories = article_has_categories.map((categoryRelation) => {
                      const categoryName = categoriesNamesMap.get(categoryRelation.categories_id_categories) || 'Unknown';
                      return {
                        categories_id_categories: categoryRelation.categories_id_categories,
                        category_name: categoryName,
                      };
                    });
                  
                    return {
                      ...rest,
                      ...writer,
                      article_has_categories: modifiedCategories,
                    };
                  });
                  
                if (!modifiedArticles||modifiedArticles.length===0){
                    continue;
                }
                articles.push(modifiedArticles)
                  
                  
                
            }
            
            const flatArticle: returnArticles[] = articles.flatMap( eachArticle =>{
                return [...eachArticle]
            })

            return flatArticle 

        }
        catch{
            return ;
        }
    }

  public async getCommunityById(communityId : number, userId : number) {
    try{

    const community = await this.databaseService.community.findFirst({
      where: {
          id_community: communityId
      },
      include:{community_has_categories:{
          select:{category:{select:{id_category:true, cat_name:true}}}
      },
      }
    });

    if (!community) {
      return {"err": 'La comunidad no existe'};
    }

    const membersCount = await this.databaseService.community_has_users.count({
      where: {
        community_id_community: communityId,
      },
    });

    const articlesCount = await this.databaseService.community_has_articles.count({
      where: {
        community_id_community: communityId,
      },
    });

    const isCreator = community.creator_id == userId;
    const isMember = await this.isMemberOfCommunity(userId, communityId);
    if (isMember || isCreator) {
              const articles = await this.databaseService.community_has_articles.findMany({
            where: {
                community_id_community: communityId,
            },
            select: {
                article: {
                    select: {
                        id_article: true,
                        title: true,
                        date: true,
                        image_url: true,
                        text: true,
                        writer: {
                            select: {
                                id_user: true,
                                username: true,
                            },
                        },
                    },
                },
                users: { // Usuario que posteó el artículo en la comunidad
                    select: {
                            id_user: true,
                            username: true,      
                            },
                        },
                },
            });

        return {
          ...community,
          isCreator,
          isMember,
          membersCount,
          articlesCount,
          articles,
        };
    }

    return {
      ...community,
      isCreator,
      isMember,
      membersCount,
      articlesCount,
    };
    }
    catch{
        return ;
    }

  }

  public async isMemberOfCommunity(userId: number, communityId: number) {
    const userMember = await this.databaseService.community_has_users.findFirst({
      where: {
        users_id_community: userId,
        community_id_community: communityId,
      },
    });
    return !!userMember;
  }

  public async createCommunity(body : createCommunityType) {
      try{ 
          let finalAvatarUrl= 'https://trunews.s3.us-east-2.amazonaws.com/profile/defaultProfile.jpg';
          if (body.avatar_url!=''){
            const urlAvatar = await this.addImageNew(body.avatar_url,body.avatar_extension,body.avatar_ancho,body.avatar_ratio,'avatar')
            if (! urlAvatar) {
                throw new DatabaseErrors('No se pudo crear avatar en s3.')
            }
            finalAvatarUrl = urlAvatar;
        }

        let finalBannerUrl= 'https://trunews.s3.us-east-2.amazonaws.com/community/banner/defaultBanner.jpg';
        if (body.banner_url!=''){
            const urlBanner = await this.addImageNew(body.banner_url,body.banner_extension,body.banner_ancho,body.banner_ratio,'banner')
            if (! urlBanner) {
                throw new DatabaseErrors('No se pudo crear banner en s3.')
            }
            finalBannerUrl = urlBanner;
        }

        const communityCreated = await this.databaseService.community.create({
          data: {
              name: body.name,
              description: body.description,
              creator_id: body.creator_id,
              date: body.date,
              avatar_url: finalAvatarUrl,//urlAvatar
              banner_url: finalBannerUrl,//urlBanner
          }
      })

    if (body.id_categories) {
        for (const category of body.id_categories) {
            await this.addCategoryToCommunity(communityCreated.id_community, category);
        }
    }

    if (!communityCreated){
        throw new DatabaseErrors('No se pudo crear la comunidad.')
    }
      this.joinCommunity(communityCreated.id_community, body.creator_id);
      return communityCreated
      }
      catch{
          return ;
      }
  }
  
  public async isCreator(communityId : number, userId : number) {
        const community = await this.databaseService.community.findFirst({
        where: {
                id_community: communityId
            },
        });
    
        if (!community) {
            return {"err": 'La comunidad no existe'};
        }
    
        return community.creator_id == userId;
    }

  public async updateCommunity(communityId : number, body : Partial<createCommunityType>) {
      try{
        const existingCommunity = await this.databaseService.community.findFirst({
          where: {
              id_community: communityId
          },
        });

        if (!existingCommunity) {
            throw new DatabaseErrors('La comunidad no existe');
        }

        let finalAvatarUrl= existingCommunity.avatar_url;
        if (body.avatar_url!=''){
            const urlAvatar = await this.addImageUpdate(communityId,body.avatar_url,body.avatar_extension,'banner')
            if (! urlAvatar) {
                throw new DatabaseErrors('No se pudo crear avatar en s3.')
            }
            finalAvatarUrl = urlAvatar;
        }    

        let finalBannerUrl= existingCommunity.banner_url;
        if (body.banner_url!=''){
            const urlBanner = await this.addImageUpdate(communityId,body.banner_url,body.banner_extension,'banner')
            if (! urlBanner) {
                throw new DatabaseErrors('No se pudo crear banner en s3.')
            }    
            finalBannerUrl = urlBanner;
        }

      const communityUpdated = await this.databaseService.community.update({
          where: {
              id_community: communityId
          },
          data: {
              name: body.name || existingCommunity.name,
              description: body.description || existingCommunity.description,
              creator_id: body.creator_id || existingCommunity.creator_id,
              avatar_url: body.avatar_url || existingCommunity.avatar_url,
              banner_url: body.banner_url || existingCommunity.banner_url,
          }
      });


      if (body.id_categories && body.id_categories.length!==0){
        
        const deleteCategories = await this.databaseService.community_has_categories.deleteMany({
            where:{
                community_id_community: communityId
            },
        });
        
        for (const category of body.id_categories){
            const newCat = await this.databaseService.community_has_categories.create({
                data: {
                    community_id_community: communityId,
                    categories_id_community: category,
                }
            });
        }


      }
      
      if (!communityUpdated){
          throw new DatabaseErrors('No se pudo actualizar la comunidad.')
        }
      return communityUpdated
      }
      catch{
          return ;
      }
  }

  public async deleteCommunity(communityId : number) {
      try{
      const communityDeleted = await this.databaseService.community.delete({
          where: {
              id_community: communityId
          }
      })

      if (!communityDeleted){
          throw new DatabaseErrors('No se pudo eliminar la comunidad.')
      }
      return communityDeleted
      }
      catch{
          return ;
      }
  }

  public async getCommunityMembers(communityId : number) {
      return await this.databaseService.community_has_users.findMany({
          where: {
              community_id_community: communityId
          }
      });
  }

  public async countMembers(communityId : number) {
      return await this.databaseService.community_has_users.count({
          where: {
              community_id_community: communityId
          }
      });
  }

  public async joinCommunity(communityId : number, userId : number) {
      try{
      const communityJoined = await this.databaseService.community_has_users.create({
          data: {
              community_id_community: communityId,
              users_id_community: userId
          }
      })

      if (!communityJoined){
          throw new DatabaseErrors('No se pudo unir al usuario a la comunidad.')
      }
      return communityJoined;
      }
      catch{
          return ;
      }
  }

  public async leaveCommunity(communityId : number, userId : number) {
      try{
      const communityLeft = await this.databaseService.community_has_users.deleteMany({
          where: {
              community_id_community: communityId,
              users_id_community: userId
          }
      })

      if (!communityLeft){
          throw new DatabaseErrors('No se pudo eliminar al usuario como miembro de la comunidad.')
      }
      return communityLeft
      }
      catch{
          return ;
      }
  }

    public async addImageUpdate(communityId:number,contenido: string, extension:string='.png',subFolder:string) {
        try {
            const folder = `community/${subFolder}`;
            // const imageBuffer = contenido;
            const imageBuffer = Buffer.from(contenido.split(',')[1], 'base64');
            // debe ser un buffer el contenido
            
            const link = process.env.S3_url
            const file_name = (communityId + extension)
            
            // const resizedImageBuffer = await resizeImages(imageBuffer,ancho,ratio);

            const url = await uploadToS3(file_name, imageBuffer,folder) // body.contenido);
            if (! url) {
                throw new DatabaseErrors('no se pudo subir a s3');
            }
            // crear nuevo registro
            return `${link}${folder}/${file_name}`;
        } catch (error) {
            return;
        }
    }

    public async addImageNew(contenido: string, extension:string,ancho:number,ratio:string,subFolder:string) {
        try {
            const ultimo = await this.databaseService.community.findMany({
                orderBy: {
                    id_community: 'desc'
                },
                take: 1
            });
            const folder = `community/${subFolder}`;
            // const imageBuffer = contenido;
            const imageBuffer = Buffer.from(contenido.split(',')[1], 'base64');
            // debe ser un buffer el contenido
            let ultimo_usuario = (1).toString()
            if (ultimo[0]) {
                ultimo_usuario = (ultimo[0].id_community + 1).toString()
            }

            const link = process.env.S3_url
            const file_name = (ultimo_usuario + extension)
            // console.log(file_name);
            const resizedImageBuffer = await resizeImages(imageBuffer,ancho,ratio);

            const url = await uploadToS3(file_name, resizedImageBuffer,folder) // body.contenido);
            if (! url) {
                throw new DatabaseErrors('no se pudo subir a s3');
            }
            // crear nuevo registro
            return `${link}${folder}/${file_name}`;
        } catch (error) {
            return;
        }
    }

    public async getCommunityCategories(communityId : number) {
        try{
        const communityCategories = await this.databaseService.community_has_categories.findMany({
            where: {
                community_id_community: communityId
            },
            select: {
                categories_id_community: true
            }
        });

        if (!communityCategories){
            throw new DatabaseErrors('No se pudo encontrar las categorias de la comunidad.')
        }
        return communityCategories
        }
        catch{
            return ;
        }
    }

    public async addArticleToCommunity(communityId: number, articleId: number, userId: number) {
        try{

        const article = await this.databaseService.article.findUnique({
            where: { id_article: articleId },
            include: { article_has_categories: { include: { category: true } }},
            });

        const community = await this.databaseService.community.findUnique({
            where: { id_community: communityId },
            include: { community_has_categories: { include: { category: true } }},
        });

    
        if (!article || !community) {
            throw new DatabaseErrors('No se pudo encontrar el artículo o la comunidad.');
        }
        // console.log(article.article_has_categories)
        // console.log(community.community_has_categories)
        // Comprueba si hay al menos una categoría en común entre el artículo y la comunidad
        const commonCategories = article.article_has_categories.map(ac => ac.category.id_category)
            .filter(categoryId => community.community_has_categories.some(cc => cc.category.id_category === categoryId));
        if (commonCategories.length === 0) {
            return  ;
        }
    

        const crearArticulo =await this.databaseService.community_has_articles.create({
            data: {
                community_id_community: communityId,
                article_id_community: articleId,
                users_id_community: userId
            }
        });
        return {"succes":true}        
        }
        catch{
            return {"err":"ya existe el articulo en la comunidad"};
        }

    }
    

    public async addCategoryToCommunity(communityId : number, categoryId : number) {
        try{
        const communityCategory = await this.databaseService.community_has_categories.create({
            data: {
                community_id_community: communityId,
                categories_id_community: categoryId
            }
        });

        if (!communityCategory){
            throw new DatabaseErrors('No se pudo agregar la categoria a la comunidad.')
        }
        return communityCategory
        }
        catch{
            return ;
        }
    }

    public async removeArticle(communityId : number, articleId : number, userId : number) {
        try{
            const communityArticle = await this.databaseService.community_has_articles.deleteMany({
            where: {
                community_id_community: communityId,
                article_id_community: articleId,
                users_id_community: userId
            }
        });

        if (communityArticle.count === 0){
            return ;
        }
        return communityArticle
        }
        catch{
            return ;
        }
       }

       public async checkArticleToAdd(userId: number,communityId: number) {
        try{
            const article = await this.databaseService.article.findMany({
                where: { id_writer:userId },
                include: { 
                    writer:{select:{
                        username:true,
                        name:true,
                        lastname:true,
                    }},
                    article_has_categories: { select: { category: true } },
            },
            });
            
            const saved = await this.databaseService.saved.findMany({
                where: { id_user:userId },
                include: { 
                    article:{include:{

                            writer:{select:{
                                username:true,
                                name:true,
                                lastname:true,}},
                            article_has_categories: { select: { category: true } },
                            
                        },
                        

                    }
                
                },
            });

            
            if (!article && !saved) {
                throw new DatabaseErrors('No tiene nada escrito, ni guardado');
            }
            
            const isInCommunity = await this.databaseService.community_has_articles.findMany({
                where: {users_id_community:userId,community_id_community:communityId},
            });

            const hasCategoriesSimilar = await this.databaseService.community_has_categories.findMany({
                where:{ community_id_community: communityId}
            })            
            
            const communityCategoryIds = hasCategoriesSimilar.map(cat => cat.categories_id_community);
            const filterArticle = article.filter((art) => {
                const notInCommunity = !isInCommunity.some((communityArt) => art.id_article === communityArt.article_id_community);
                const sharesCategory = art.article_has_categories.some(artCat => communityCategoryIds.includes(artCat.category.id_category));
    
                return notInCommunity && sharesCategory;
            });
    
            const filterSaved = saved.filter((sav) => {
                const notInCommunity = !isInCommunity.some(communityArt => sav.id_article === communityArt.article_id_community);
                const sharesCategory = sav.article.article_has_categories.some(artCat => communityCategoryIds.includes(artCat.category.id_category));
    
                return notInCommunity && sharesCategory;
            });

            const flatArticle = filterArticle.map((art) => {
                const { writer, article_has_categories, sanitizedText, ...articleData } = art;
                const categories = article_has_categories.map(cat => ({
                category: {
                    cat_name: cat.category.cat_name
                }
                }));
                return {
                ...articleData,
                ...writer,
                article_has_categories: categories
                };
            });
            
            const flatSaved = filterSaved.map((art) => {
                const { article,...rest } = art;
                const {article_has_categories,sanitizedText,...restArticle} =article;
                const {writer,...articleData} = restArticle;
                const categories = article_has_categories.map(cat => ({
                category: {
                    cat_name: cat.category.cat_name
                }
                }));
                return {
                ...articleData,
                ...writer,
                article_has_categories: categories
                };
            });

            return [...flatArticle,...flatSaved];
        }catch{
            return [];
        }

    }


    public async postedOnCommunity(userId: number,communityId: number) {
        try {
            const isInCommunity = await this.databaseService.community_has_articles.findMany({
                where: {users_id_community:userId,community_id_community:communityId}
            });
            
            if(!isInCommunity || isInCommunity.length===0){
                throw new DatabaseErrors("no tiene articulos en la comunidad publicados");
            }

            const allArticles:any = [];
            for (const article of isInCommunity){
                const eachArticle = await this.databaseService.article.findUnique({
                    where:{id_article:article.article_id_community},
                    include: { 
                        writer:{select:{
                            username:true,
                            name:true,
                            lastname:true,
                        }},
                        article_has_categories: { select: { category: true } },
                },
                });
                allArticles.push(eachArticle);
            }

            const flatArticle = allArticles.map((art:any) => {
                const { writer, article_has_categories, sanitizedText, ...articleData } = art;
                const categories = article_has_categories.map((cat:any) => ({
                category: {
                    cat_name: cat.category.cat_name
                }
                }));
                return {
                ...articleData,
                ...writer,
                article_has_categories: categories
                };
            });
            return flatArticle;
        }
        catch{
            return;
        }
    }

    public async createEvent(body : createEventType) {
        try{ 
            const isMember = await this.isMemberOfCommunity(body.creator_id,body.community_id);
            if (!isMember) {
                throw new DatabaseErrors('El usuario no pertenece a la comunidad.');
            }

            let finalImageUrl= 'https://trunews.s3.us-east-2.amazonaws.com/profile/defaultProfile.jpg';
            if (body.image_url!=''){
              const urlImage = await this.addImageNew(body.image_url,body.image_extension,body.image_ancho,body.image_ratio,'eventImage')
              if (! urlImage) {
                  throw new DatabaseErrors('No se pudo crear avatar en s3.')
              }
              finalImageUrl = urlImage;
          }
  
          const eventCreated = await this.databaseService.event.create({
            data: {
                name: body.name,
                description: body.description,
                creator_id: body.creator_id,
                community_id: body.community_id,
                place: body.place,
                date: body.date,
                image_url: finalImageUrl,
            }
        })
  
      if (!eventCreated){
          throw new DatabaseErrors('No se pudo crear el evento.')
      }
        return eventCreated
        }
        catch{
            return ;
        }
    }

    public async getEvent(eventId: number, userId: number) {
        try {
            const eventDetails = await this.databaseService.event.findUnique({
                where: { id_event: eventId },
                select: {
                    id_event: true,
                    name: true,
                    description: true,
                    creator_id: true,
                    place: true,
                    date: true,
                    image_url: true,
                    attendees: {
                        where: {
                            user_id_attendee: userId
                        },
                        select: {
                            user_id_attendee: true
                        }
                    }
                }
            });
    
            if (!eventDetails) {
                throw new DatabaseErrors('No se pudo encontrar el evento.');
            }
    
            // Procesa la información para calcular el número de asistentes, si el usuario es asistente y si es el creador
            const isAttendee = eventDetails.attendees.length > 0;
            const isCreator = eventDetails.creator_id === userId;
    
            const eventInfo = {
                id_event: eventDetails.id_event,
                name: eventDetails.name,
                description: eventDetails.description,
                creator_id: eventDetails.creator_id,
                place: eventDetails.place,
                date: eventDetails.date,
                image_url: eventDetails.image_url,
                attendeesCount: eventDetails.attendees.length,
                isAttendee,
                isCreator
            };
    
            return eventInfo;
        }catch{
            return;
        }
    }

    public async isAttendee(eventId: number, userId: number) {
        const event = await this.databaseService.event_attendee.findFirst({
        where: {
                event_id_attendee: eventId,
                user_id_attendee: userId
            },
        });

        return !!event;
    }

    public async isCreatorEvent(eventId : number, userId : number) {
        const event = await this.databaseService.event.findFirst({
        where: {
                id_event: eventId
            },
        });
    
        if (!event) {
            return {"err": 'El evento no existe'};
        }
    
        return event.creator_id == userId;
    }

    public async getAttendeesCount(eventId: number){
        try{
            const attendeesCount = await this.databaseService.event_attendee.count({
                where: { event_id_attendee: eventId }
            });
            if (!attendeesCount) {
                throw new DatabaseErrors('No se pudo encontrar el evento.');
            }
            return attendeesCount;
        }catch{
            return;
        }
    }

    

    public async getCommunityEvents(communityId: number, userId: number){
        try {
            const eventsWithAttendees = await this.databaseService.event.findMany({
                where: { community_id: communityId },
                select: {
                    id_event: true,
                    name: true,
                    description: true,
                    creator_id: true,
                    place: true,
                    date: true,
                    image_url: true,
                    attendees: {
                        select: {
                            user_id_attendee: true
                        }
                    }
                }
            });
    
            const eventsInfo = eventsWithAttendees.map((event) => ({
                id_event: event.id_event,
                name: event.name,
                description: event.description,
                creator_id: event.creator_id,
                place: event.place,
                date: event.date,
                image_url: event.image_url,
                attendeesCount: event.attendees.length,
                isAttendee: event.attendees.some((attendee) => attendee.user_id_attendee === userId),
                isCreator: event.creator_id === userId
            }));
    
            return eventsInfo;
        }
        catch{
            return;
        }
    }

    public async deleteEvent(eventId : number) {
        try{
        const eventDeleted = await this.databaseService.event.delete({
            where: {
                id_event: eventId
            }
        })

        if (!eventDeleted){
            throw new DatabaseErrors('No se pudo eliminar el evento.')
        }
        return eventDeleted
        }
        catch{
            return ;
        }
    }

    public async attendEvent(eventId: number, userId: number){
        try{
            const eventAttendee = await this.databaseService.event_attendee.create({
                data: {
                    event_id_attendee: eventId,
                    user_id_attendee: userId
                }
            });
            return eventAttendee;
        }catch (error){
            return ;
        }
    }

    public async undoAttendEvent(eventId: number, userId: number){
        try{
            const eventAttendee = await this.databaseService.event_attendee.deleteMany({
                where: {
                    event_id_attendee: eventId,
                    user_id_attendee: userId
                }
            });
            return eventAttendee;
        }catch{
            return;
        }
    }

    public async myCommunities(userId: number){
        try{
            const myCommunitiesId = await this.databaseService.community_has_users.findMany({
                where:{
                    users_id_community:userId
                },
            });
            if(!myCommunitiesId){
                throw new DatabaseErrors('no hay comunidades');
            }
            // const myCommunities:communityTypeExtended[] = [];
            const myCommunities = [];
            for (const currentCommunityId of myCommunitiesId){

                const eachCommunity = await this.databaseService.community.findFirst({
                    where:{
                        id_community:currentCommunityId.community_id_community
                    },
                    include:{community_has_categories:{ select: { category: true } }}
                });
                if (eachCommunity){
                    const membersCount = await this.countMembers(currentCommunityId.community_id_community)
                    myCommunities.push({...eachCommunity,'followerCount':membersCount })
                }

            }
            const finalMyCommunities = myCommunities.map((comm)=>{
                const{community_has_categories,...rest}=comm;
                const categorias = community_has_categories.flatMap((cat)=>{
                    return cat.category.cat_name;
                })
                return {...rest,categorias}
            })

            return finalMyCommunities;
        }catch{
            return;
        }
    }

    public async recommended(userId: number){
        try{
            
            let weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 20);
            const allCommunityFull = await this.findAll();
            if (!allCommunityFull){
                throw new DatabaseErrors('No hay comunidades para recomendaciones')
            }
            const allCommunity = allCommunityFull.flatMap((com)=>{
                const categorias = com.community_has_categories.flatMap((cat)=>{
                    return cat.category.id_category;
                })
                return {"community_id":com.id_community,"categories":categorias}
            })

            const userData = await this.databaseService.users.findUnique({
                where:{
                    id_user: userId
                },
                select:{
                    community_has_users:{select:{community_id_community:true,community:{select:{community_has_categories:true}} }},
                    saved:{select:{article:{select:{article_has_categories:true}}}},
                    followers:{select:{following:{select:{article:{select:{article_has_categories:true},where:{date:{gte:weekAgo} } } }}}},
                    article:{select:{views:true,article_has_categories:true}},
                }
            });
            if(!userData){
                throw new DatabaseErrors('Fallaron recomendaciones de comunidad pero barbaro');
            }

            //saca las comunidades en las que ya esta
            const communities_already_in: number[] = userData.community_has_users.map((com)=>{
                const communitiesId = com.community_id_community;
                return communitiesId;
            });
            //categorias de estas comunidades en las que ya esta
            const categories_of_his_communities = Array.from(new Set(
                userData.community_has_users.flatMap((com)=>{
                const categories = com.community.community_has_categories.map((cat)=>{
                    return cat.categories_id_community;
                });
                return categories;
            })
            ));
            //categorias de los articulos salvados
            const categories_of_his_saved_articles = Array.from(new Set(
                userData.saved.flatMap((sav)=>{
                const categories =  sav.article.article_has_categories.map((cat)=>{
                    return cat.categories_id_categories;
                });

                return categories;
            })
            ));
            //categorias de los articulos escritos por los que el sigue
            const categories_of_following_articles = Array.from(new Set(
                userData.followers.flatMap((following)=>{
                const categories = following.following.article.flatMap((art_has_cat)=>{
                    return art_has_cat.article_has_categories.map((cat)=>{
                        return cat.categories_id_categories;
                    });
                });
                return categories
            })
            ));
            //categorias de los articulos escritos 
            const categories_of_his_articles = userData.article.map((art)=>{
                const views = art.views;
                const categories = art.article_has_categories.map((cat)=>{
                    return cat.categories_id_categories
                })
                return {views,categories}
            })
                

            const categoryWeights: Map<number, number> = new Map();

            const updateWeight = (category: number, weight: number) => {
                const currentWeight = categoryWeights.get(category) || 0;
                categoryWeights.set(category, currentWeight + weight);
            };
        
            // Assign weights for joined communities, saved and following articles
            const basicWeight = 1; // Basic weight for joined, saved, and followed categories
            categories_of_his_communities.forEach(cat => updateWeight(cat, basicWeight));
            categories_of_his_saved_articles.forEach(cat => updateWeight(cat, basicWeight));
            categories_of_following_articles.forEach(cat => updateWeight(cat, basicWeight));
        
            // First, calculate the mean and standard deviation of views
            const viewCounts = categories_of_his_articles.map(article => article.views);
            const meanViews = viewCounts.reduce((a, b) => a + b, 0) / viewCounts.length;
            const stdDevViews = Math.sqrt(viewCounts.map(view => Math.pow(view - meanViews, 2)).reduce((a, b) => a + b, 0) / viewCounts.length);

            // Modified Gaussian-like function for weighting
            const gaussianLikeWeight = (views: number): number => {
                const deviationMultiplier = -0.5;
                let weight = Math.exp(deviationMultiplier * Math.pow((views - meanViews) / stdDevViews, 2));
                return weight * 20; // Scale up to a maximum of 20
            };

            // Apply this function to each article's views
            categories_of_his_articles.forEach(article => {
                const viewWeight = gaussianLikeWeight(article.views);
                article.categories.forEach(cat => updateWeight(cat, viewWeight));
            });
            // Convert Map to Array of Objects and then sort it
            const sortedCategories = Array.from(categoryWeights, ([category, weight]) => ({ category, weight }))
            .sort((a, b) => b.weight - a.weight);


            // Convert sortedCategories to a Map for efficient lookup
            const categoryWeightMap = new Map(sortedCategories.map(cat => [cat.category, cat.weight]));

            // Function to calculate the sum of weights for a community
            const calculateWeightSum = (categories:any) => {
                return categories.reduce((sum:number, category:number) => {
                    return sum + (categoryWeightMap.get(category) || 0);
                }, 0);
            };

            // Calculate and store the sum of weights for each community
            const communityWeightSums = allCommunity.map(community => ({
                community_id: community.community_id,
                weightSum: calculateWeightSum(community.categories)
            }));

            const sortedCommunityWeightSums = communityWeightSums
            .sort((a, b) => b.weightSum - a.weightSum)
            .filter(community => !communities_already_in.includes(community.community_id));
        
            console.log(sortedCommunityWeightSums)
            const orderedCommunities = sortedCommunityWeightSums.map(weightSum => {
                return allCommunityFull.find(community => community.id_community === weightSum.community_id);
            });

            return orderedCommunities;
        }catch{
            return;
        }
    }

}
