import { DatabaseService } from '../db/databaseService';
import { logger, permaLogger } from '../utils/logger';
import { createArticleSchema } from '../middleware/dataValidation/schemas';
import { z } from 'zod';
import { createArticleType } from '../dto/article'; 
import { uploadToS3 } from '../aws/addS3'
import { DatabaseErrors } from '../errors/database.errors'
import { UserService }  from '../user/user.service'
import { Roles } from '../utils/roleDefinition'


export class ArticleService {
  constructor(private databaseService: DatabaseService, private userService:UserService) {}

  public async getArticles() {
    return await this.databaseService.getClient().article.findMany();
  }

  public async getArticleById(articleId: number) {
    return await this.databaseService.getClient().article.findFirst({ where: { id_article: articleId } });
  }

  public async createArticle(body: createArticleType) {
    const user = await this.userService.getUserById(body.id_writer)
    if (!user || user.rol===Roles.lector){
        return ;
    }
    const url = await this.addImage(body.image_url)
    if (!url){
        throw new DatabaseErrors('no se pudo crear en s3')
    }
    const articleCreated = await this.databaseService.getClient().article.create({
        data: {
            title: body.title,
            date: body.date,
            views: 0,
            id_writer: body.id_writer,
            text: body.text,
            image_url: url
        }
    }).catch((err) => {
        return ;
    }) ;
    return articleCreated
  }

  public async deleteArticle(articleId: number) {
    try {
        const result = await this.databaseService.getClient().article.delete({
            where: {
                id_article: articleId
            }
        });
        if (result) {
            return { message: 'Artículo eliminado exitosamente' };
        }
    } catch (error) {
        throw error;
    }
}

public async addImage(contenido: any){
    try {
    const ultimo = await this.databaseService.getClient().article.findMany({
        orderBy: {
            id_article: 'desc',
        },
        take: 1,
    });
    const imageBuffer = Buffer.from(contenido.split(',')[1], 'base64');
    //debe ser un buffer el contenido
    let ultimo_usuario = (1).toString()
    if (ultimo[0]){
        ultimo_usuario = (ultimo[0].id_article +1).toString()
    }

    const link = process.env.S3_url
    const extension = '.png'
    const file_name = (ultimo_usuario+extension)
    const url = await uploadToS3(file_name,imageBuffer)//body.contenido);
    permaLogger.log('debug',imageBuffer)
    if (!url){
        throw new DatabaseErrors('no se pudo subir a s3');
    }
    //crear nuevo registro
    return link+file_name;
    } catch (error) {
        return ;
    }
}


}
