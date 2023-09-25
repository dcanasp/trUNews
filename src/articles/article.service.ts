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
        return await this.databaseService.article.findFirst({
            where: {
                id_article: articleId
            }
        });
    }

    public async createArticle(body : createArticleType) {
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

    public async addImage(contenido : any, extension:string = '.png',ancho:number=200,ratio:string='1:2') {
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
                select: {
                  date: true,
                  image_url: true,
                  title: true
                }
              });
            if (! articles) {
                throw new DatabaseErrors('no se encontraron ultimos articulos');
            }
              return articles;

        } catch (error) {
            return ;
        }

    }

    public async allTrending(){
        try {
            const articles = await this.databaseService.trend_article.findMany({
                orderBy: {
                  weight: 'desc'
                },
            });
            if (! articles) {
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
            if (! articles) {
                throw new DatabaseErrors('no se encontraron articulos tendencia de cantidad dada');
            }
              return articles;

        } catch (error) {
            return ;
        }

    }



}

