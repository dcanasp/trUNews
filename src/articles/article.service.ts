import { DatabaseService } from '../db/databaseService';
import { logger, permaLogger } from '../utils/logger';
import { createArticleSchema } from '../middleware/dataValidation/schemas';
import { z } from 'zod';
import { createArticleType } from '../dto/article'; 

export class ArticleService {
  constructor(private databaseService: DatabaseService) {}

  public async getArticles() {
    return await this.databaseService.getClient().article.findMany();
  }

  public async getArticleById(articleId: string) {
    const articleId2 = parseInt(articleId, 10);
    return await this.databaseService.getClient().article.findFirst({ where: { id_article: articleId2 } });
  }

  public async createArticle(body: createArticleType) {
    const articleCreated = await this.databaseService.getClient().article.create({
        data: {
            title: body.title,
            date: body.date,
            views: 0,
            id_writer: body.id_writer,
            id_text: body.id_text,
            id_image: body.id_image
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


}
