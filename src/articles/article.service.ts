import "reflect-metadata";
import {injectable, inject} from 'tsyringe';
import {DatabaseService} from '../db/databaseService';
import {logger, permaLogger} from '../utils/logger';
import {uploadToS3} from '../aws/addS3';
import {DatabaseErrors} from '../errors/database.errors';
import {UserService} from '../user/user.service';
import {Roles} from '../utils/roleDefinition';
import {resizeImages} from '../utils/resizeImages';
import {returnArticles,createArticleType,createArticleUserType,returnArticlesFeed,returnArticlesCategory,returnArticlesCategory_id} from '../dto/article';
import axios from 'axios';
import qr from 'qr-image';
import fs from 'fs';
import sharp from 'sharp';

@injectable()
export class ArticleService {
    private databaseService
    constructor(@inject(DatabaseService) databaseService : DatabaseService, @inject(UserService) private userService : UserService) {
        this.databaseService = databaseService.getClient()
    }

    public async getArticles() {
        return await this.databaseService.article.findMany();
    }

    public async getArticleById(articleId : number) {
        return await this.databaseService.article.findUnique({
            where: {
                id_article: articleId
            },
            include:{article_has_categories:{
                select:{category:{select:{cat_name:true}}}
            },writer:{select:{name:true,username:true,lastname:true}}
            }
        });
    }

    
    public async fetchModels(sanitizedText: string) {
        try {
        const encodedText = encodeURIComponent(sanitizedText);
        const titleUrl = `${process.env.Ai_model_title}${encodedText}`;
        const categoriesUrl = `${process.env.Ai_model_categories}${encodedText}`;
    
        const [titleResponse, categoriesResponse] = await Promise.all([
            axios.get(titleUrl),
            axios.get(categoriesUrl),
        ]);
    
        const titulos = titleResponse.data;
        const categorias = categoriesResponse.data;

        if (!titulos||!categorias){
            throw new DatabaseErrors("no se pudieron cargar los modelos");
        }
        return {
            titulos,
            categorias,
        };
        } catch (error) {
            console.error('no hay modelos');
            return ;
        }
    }

    public async createArticle(body : createArticleType,sanitizedText:string) {
        try{
        const user = await this.userService.getUserById(body.id_writer)
        if (! user || user.rol === Roles.lector) {
            throw new DatabaseErrors('no es un escritor')
            return;
        }
        const url = await this.addImage(body.image_url,body.image_extension,body.ancho,body.image_ratio)
        if (! url) {
            throw new DatabaseErrors('no se pudo crear en s3')
        }
            const articleCreated = await this.databaseService.article.create({
                data: {
                    title: body.title,
                    date: body.date,
                    views: 0,
                    id_writer: body.id_writer,
                    text: body.text,
                    sanitizedText,
                    image_url: url
                }
            })

            if (!articleCreated){
                throw new DatabaseErrors('no se pudo crear el articulo')
            }
            return articleCreated
        }
        catch{
            return ;
        }
    }

    public async createCategories(writerId:number,articleId:number,categories:string[]) {
        try{
            const article = await this.databaseService.article.findUnique({
                where:{
                    id_article:articleId
                }
            });
            if(!article){
                throw new DatabaseErrors('no existe ese articulo');
            }
            if(article.id_writer!=writerId){
                throw new DatabaseErrors('no tiene permiso para editar categorias');
            }
            for (const category of categories){
                try{

                const categoryId = await this.databaseService.categories.findUnique({
                    where:{
                        cat_name:category
                    }
                });
                if(!categoryId){
                    throw new DatabaseErrors('no existe esa categoria');
                }
                const articleCreated = await this.databaseService.article_has_categories.create({
                    data: {
                        articles_id_article:articleId,
                        categories_id_categories:categoryId.id_category
                    }
                })

                }catch(err){
                    permaLogger.log("err",err);
                    return ;
                };
            }

            return {succes:"true"}
        }
        catch{
            return ;
        }
    }


    public async deleteArticle(articleId : number) {
        try {
            const result = await this.databaseService.article.delete({
                where: {
                    id_article: articleId
                }
            });
            if (result) {
                return {message: 'Artículo eliminado exitosamente'};
            }
        } catch (error) {
            throw error;
        }
    }

    public async addImage(contenido: string, extension:string,ancho:number,ratio:string) {
        try {
            const ultimo = await this.databaseService.article.findMany({
                orderBy: {
                    id_article: 'desc'
                },
                take: 1
            });
            const folder = 'image';
            // const imageBuffer = contenido;
            const imageBuffer = Buffer.from(contenido.split(',')[1], 'base64');
            // debe ser un buffer el contenido
            let ultimo_usuario = (1).toString()
            if (ultimo[0]) {
                ultimo_usuario = (ultimo[0].id_article + 1).toString()
            }

            const link = process.env.S3_url
            const file_name = (ultimo_usuario + extension)

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

    public async getLatest(quantity:number){
        try {
            const articles = await this.databaseService.article.findMany({
                take: quantity,
                orderBy: {
                    date: 'desc'
                },
                include:{writer:true}
              });
            if (!articles || articles.length==0) {
                throw new DatabaseErrors('no se encontraron ultimos articulos');
            }
              return articles;

        } catch (error) {
            return ;
        }

    }

    public async findAllArticle(){
        try {

            const article = await this.databaseService.article.findMany({
                include:{ writer:true}
            });
            if (!article || article.length==0) {
                throw new DatabaseErrors('no hay articulos');
            }
            return article;
        } catch {
            return;
        }}

    public async findArticle(nombre:string){
        try{
            const article = await this.databaseService.article.findMany({
                where: {
                    title: {
                        contains: nombre,
                        mode: 'insensitive',
                    }
                },
                include:{
                    writer:true,
                    article_has_categories:{select:{category:{select:{cat_name:true}}}},
                },
                orderBy:{
                        date:'desc'
                    }
              });
            if (! article || !article[0]) {
                throw new DatabaseErrors('no hay articulos con ese nombre');
            }
            return article;
        }catch{
            return;
        }

    }

    public async allTrending(){
        try {
            const articles = await this.databaseService.trend_article.findMany({
                orderBy: {
                  weight: 'desc'
                },
            });
            if (!articles || articles.length==0) {
                throw new DatabaseErrors('no se encontraron articlos tendencia');
            }
              return articles;

        } catch (error) {
            return ;
        }

    }

    public async trending(quantity:number){
        try {
            const articles = await this.databaseService.trend_article.findMany({
                take: quantity,
                orderBy: {
                  weight: 'desc'
                },
              });
            if (! articles || articles.length==0) {
                throw new DatabaseErrors('no se encontraron articulos tendencia de cantidad dada');
            }
              return articles;

        } catch (error) {
            return ;
        }

    }

    //!feed
    public async articlesFromFollowed (user_id:number,weekAgo:Date){
        try{
        const articlesFromFollowedUsers = await this.databaseService.follower.findMany({
            where: {
              id_follower: user_id,
            },
            select: {
                
              following: {
                select: {
                    username:true,
                    name:true,
                    lastname:true,
                    profile_image:true,
                    article: {
                        include:{article_has_categories:{select:{categories_id_categories:true,
                            category:{select:{cat_name:true}}
                        
                        }}},
                        where: {
                        date: {
                            gte: weekAgo,
                        },
                        },

                    },
                },
              },
            },
        });
        const flatArticles = articlesFromFollowedUsers.flatMap(follower => 
        follower.following.article.map(article => ({
            ...article,
            username: follower.following.username,
            name: follower.following.name,
            lastname: follower.following.lastname,
            profile_image: follower.following.profile_image,
            saved:false,
        }))
        );
        return flatArticles;    
    }
        catch(err){
            permaLogger.log("err",err);
            return ;
        }
    }
    
    public async articlesFromCateogries (flatArticles:returnArticlesCategory_id[]){
        try{
        
            if(!flatArticles){
                return;
            }
        const categoriesOfArticles = flatArticles.flatMap(follower => follower.article_has_categories);
        let articlesForCategory = flatArticles.length;
        
        if(flatArticles.length<6){
            articlesForCategory = 15            
        }
        else{
            articlesForCategory = articlesForCategory * 3;
        }

        if (!categoriesOfArticles){
            return ;
        }

        const categoriesId = await this.softmaxForFeed(categoriesOfArticles);

        //y los de guardados
        const articlesByCategory:returnArticlesFeed[] = [];
        let counter = 0
        for (const categoryId of categoriesId){
            const id_eachCategory = categoryId.category_id;
            const weight = categoryId.weight;
            let articlesToFetchForThisCategory = Math.ceil(weight * articlesForCategory);

            counter += articlesToFetchForThisCategory;
            const getArticlesByCategory = await this.databaseService.article_has_categories.findMany({
                where: {
                    categories_id_categories: id_eachCategory,
                },
                include:{
                    article:{
                        include:{

                        writer:{select:{
                            username:true,
                            name:true,
                            lastname:true,
                            profile_image:true,
                            }},
                        article_has_categories:{
                            select:{categories_id_categories:true,
                                category:{select:{cat_name:true}  } }
                        }

                        },
                    },
                },
                take:articlesToFetchForThisCategory,
            })

            getArticlesByCategory.flatMap(temporal => {                 
                const { writer, ...articleWithoutWriter } = temporal.article;
                articlesByCategory.push({ ...articleWithoutWriter, ...writer ,saved:false});              
            })
            

        }
        
        return articlesByCategory;
    }
    catch(err){
        permaLogger.log("err",err);
        return ;
    }
    }

    public async articlesFromSaved (userId:number,weekAgo:Date){
        try{
            const followers= await this.databaseService.follower.findMany({
                where:{
                    id_follower:userId,
                },
                include:{
                    following:{
                        select:{
                            username:true,
                        }
                    }
                }
            }) 
        //saved de la gente a la que sigo,
        const savedArticles = []; 
        for(const currentFollower of followers){
            
            const getArticlesBySaved = await this.databaseService.saved.findMany({
                where: {
                    id_user: currentFollower.id_following,
                    date:{
                        gte:weekAgo
                    }
                },
                include:{
                    user:{
                        select:{
                            username:true,
                        }
                    }
                    ,article:{
                        include:{

                            writer:{select:{
                                username:true,
                                name:true,
                                lastname:true,
                                profile_image:true,
                            }},
                            article_has_categories:{
                                select:{categories_id_categories:true,
                                    category:{select:{cat_name:true}  } }
                            }

                        },
                    },
                },
            })   
          
            const flatArticlesSaved = getArticlesBySaved.flatMap(temporal => {
                    const { writer, article_has_categories,...articleWithoutWriter } = temporal.article;
                    return {
                    ...writer,
                    ...articleWithoutWriter,
                    saved: true,
                    article_has_categories: article_has_categories,
                    savedUsername: temporal.user.username,
                    savedId: temporal.id_user
                    };
            });
            savedArticles.push(...flatArticlesSaved);

        }

        return savedArticles
        // const flatArticlesSaved = getArticlesBySaved.flatMap(temporal => {                 
        //     const { writer, ...articleWithoutWriter } = temporal.article;
        //     return { ...writer, ...articleWithoutWriter }
        // })
        
        // return flatArticlesSaved;
    }
    catch(err){
        permaLogger.log("err",err);
        return ;
    }
    }

    private async softmaxForFeed(categoriesOfArticles: {categories_id_categories: number;}[]) {
        
        const sumaCategorias:Record<number,number> = {};

        let categoriasTotal=0;
        categoriesOfArticles.forEach(element => {
            categoriasTotal +=1;
            if(sumaCategorias[element.categories_id_categories]){
                sumaCategorias[element.categories_id_categories] += 1;
            }
            else{
                sumaCategorias[element.categories_id_categories] = 1;
            }
        });
        const pesosCategorias : { category_id: number; weight: number }[]= []
        let softmaxDivision = 0;
        for (const key in sumaCategorias){
            softmaxDivision += Math.exp(sumaCategorias[key])
        }

        for (const key in sumaCategorias){
            const tempCategorias:{category_id:number,weight:number} = {'category_id':0,weight:0};
            tempCategorias['category_id']=parseInt(key);
            tempCategorias['weight'] = Math.exp(sumaCategorias[key])/softmaxDivision ;
            pesosCategorias.push(tempCategorias)
        }
        
        return pesosCategorias.sort((a, b) => b.weight - a.weight);
        
   
    }


    public async getLatestFeed(quantity:number){
        try {
            const articles = await this.databaseService.article.findMany({
                take: quantity,
                orderBy: {
                    date: 'desc'
                },
                include:{writer:true,
                    article_has_categories:{
                    select:{categories_id_categories:true,
                        category:{select:{cat_name:true}  } }
                    }
                }
              });
            if (!articles || articles.length==0) {
                throw new DatabaseErrors('no se encontraron ultimos articulos');
            }
              return articles;

        } catch (error) {
            return ;
        }

    }
    //!feed

    public async isSaved(userId: number, articleId: number) {
        try {
            const isSaved = await this.databaseService.saved.findFirst({
                where: {
                    id_user: userId,
                    id_article: articleId,
                },
            });

            if (!isSaved) {
                throw new Error('no hay articulo guardado ');
            }

            return true
        } catch (error) {
            return ;
        }
    }

    public async saveArticle(userId: number, articleId: number) {
        try {
            const existingSave = await this.databaseService.saved.findFirst({
                where: {
                    id_user: userId,
                    id_article: articleId,
                },
            });

            if (existingSave) {
                throw new Error('El artículo ya está guardado');
            }

            return await this.databaseService.saved.create({
                data: {
                    id_user: userId,
                    id_article: articleId,
                    date: new Date().toISOString(),
                },
            });
        } catch (error) {
            throw new DatabaseErrors('Error al guardar el artículo');
        }
    }

    public async unsaveArticle(userId: number, articleId: number) {
        try {
          const existingSave = await this.databaseService.saved.findFirst({
            where: {
              id_user: userId,
              id_article: articleId,
            },
          });

          if (!existingSave) {
            throw new Error('El artículo no está guardado, no se puede eliminar');
          }

          return await this.databaseService.saved.deleteMany({
            where: {
              id_user: userId,
              id_article: articleId,
            },
          });

        } catch (error) {
          throw new DatabaseErrors('Error al eliminar el artículo de guardados');
        }
      }

    public async getSavedArticles(userId: number) {
        try {
            const savedArticles = await this.databaseService.saved.findMany({
                where: {
                    id_user: userId,
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
                },
            });

            return savedArticles.map((save) => save.article);
        } catch (error) {
            throw new DatabaseErrors('Error al obtener los artículos guardados');
        }
    }

    public async related (articleId:number){

        try {
            let relatedByWriter: Partial<createArticleUserType>[] = [];
            let relatedByCategory: Partial<createArticleUserType>[] = [];
        
            const article = await this.databaseService.article.findUnique({
            where: { id_article: articleId },
            select: { id_writer: true },
            });
        
            if (!article) {
            throw new Error("Article not found");
            }
        
            // Get related articles by the writer
            relatedByWriter = await this.databaseService.article.findMany({
            where: {
                id_writer: article.id_writer,
                id_article: { not: articleId },
            },
            take: 5,
            orderBy: { date: "desc" },
            include: { writer: true }  // Include writer object along with all article fields
            });
        
            // Get related articles by the categories
            const articleCategories = await this.databaseService.article_has_categories.findMany({
            where: { articles_id_article: articleId },
            select: { categories_id_categories: true },
            });
        
            for (const { categories_id_categories } of articleCategories) {
            const articlesInCategory = await this.databaseService.article.findMany({
                where: {
                article_has_categories: {
                    some: {
                    categories_id_categories,
                    },
                },
                id_article: { not: articleId },
                },
                take: 5,
                orderBy: { date: "desc" },
                include: { writer: true } 
            });
        
            relatedByCategory = [...relatedByCategory, ...articlesInCategory];
            }
        
            const allRelatedArticles = [...relatedByWriter, ...relatedByCategory];
        
            return allRelatedArticles;
        } catch (err) {
            return;
        }
  
    }
    
    public async getArticlesByCategory(categoryId: string): Promise<returnArticlesCategory[]> {
        const categoryIdNumber = parseInt(categoryId, 10);
      
        try {
          const articles = await this.databaseService.article_has_categories.findMany({
            where: {
              categories_id_categories: categoryIdNumber,
            },
            include: {
              article: {
                include: {
                  writer: {
                    select: {
                      username: true,
                      name: true,
                      lastname: true,
                      profile_image: true,
                    },
                  },
                  article_has_categories: {
                    include: {
                      category: {
                        select: {
                          id_category: true,
                          cat_name: true
                        },
                      },
                    },
                  },
                },
              },
            },
          });
      
          return articles.flatMap((article) => {
            const {
              writer,
              id_article,
              id_writer,
              title,
              date,
              views,
              image_url,
              text,
              sanitizedText,
              article_has_categories,
            } = article.article;
      
            return {
              ...writer,
              id_article,
              id_writer,
              title: title || null,
              date,
              views,
              image_url,
              text,
              sanitizedText,
              article_has_categories: article_has_categories.map((category) => {
                return {
                  category: category.category,
                };
              }),
            };
          });
        } catch (error) {
          throw new Error('Error al buscar artículos por categoría');
        }
      }


    public async getCategories() {
        try {
          const categories = await this.databaseService.categories.findMany();
          return categories;
        } catch (error) {
          throw new Error('Error al buscar categorías');
        }
    }

    public async getCategoryById(categoryId: string) {
        const categoryIdNumber = parseInt(categoryId,10);
        try {
          const category = await this.databaseService.categories.findUnique({
            where: {
              id_category: categoryIdNumber,
            },
          });
          return category;
        } catch (error) {
          throw new Error('Error al buscar categoría');
        }
    }

    public async getQr(url: string) {
        try {          
            // Step 1: Generate the QR code and save it to a file
            const qrPng = qr.imageSync(url, { type: 'png', ec_level: 'H' });  // Set Error Correction Level to 'H'
            fs.writeFileSync('tempQR.png', qrPng);

            // Step 2 & 3: Overlay the logo on top of the QR code
            const logoBuffer: Buffer = fs.readFileSync('./src/public/logo.jpg');

            const resizedLogoBuffer = await sharp(logoBuffer)
                .resize(40, 40)
                .toBuffer();
            await sharp('tempQR.png')
                .composite([    
                {
                    input: resizedLogoBuffer,
                    gravity: 'centre'
                }
                ])
                .toFile('QRWithLogo.png', (err, info) => {
                if (err) {
                    throw new DatabaseErrors(`Error during composite: ${info}`);
                } else {
                    // console.log('QR code generated with logo', info);
                    // Step 4: Delete the temporary QR code image
                    fs.unlinkSync('tempQR.png');
                }
                });
                
            const fullQrBuffer: Buffer = fs.readFileSync('QrWithLogo.png');
            const fullQr = fullQrBuffer.toString('base64');
            fs.unlinkSync('QrWithLogo.png');
            return `data:image/jpeg;base64,${fullQr}`;

        } catch (error) {
          throw new Error('Error al buscar artículos por categoría');
        }
    }

}

