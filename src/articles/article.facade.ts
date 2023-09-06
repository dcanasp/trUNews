import { Request } from 'express';
import { ArticleService } from './article.service';
import { createArticleType } from '../dto/article'; 
import { DatabaseErrors } from '../errors/database.errors';

export class ArticleFacade {
  constructor(private articleService: ArticleService) {}

  public async getArticles(req: Request) {
    try {
      const articles = await this.articleService.getArticles();
      return articles;
    } catch (error) {
      throw new DatabaseErrors('Error al obtener los artículos de la base de datos');
    }
  }

  public async getArticleById(req: Request) {
    const articleId = req.params.id;
    const article = await this.articleService.getArticleById(articleId);
    if (!article) {
      return { error: 'El artículo no existe' };
    }
    return article;
  }

  public async createArticle(req: Request, body: createArticleType) {
      const articleCreated = await this.articleService.createArticle(body);
      if (!articleCreated){
          throw new DatabaseErrors('')
          // return{value:'credenciales de username ya usadas',error: new DatabaseErrors('')};
      }
      return {articleId: articleCreated.id_article, title: articleCreated.title}
  }


  public async deleteArticle(req: Request) {
    const articleId = req.params.id;
    if (!await this.articleService.deleteArticle(parseInt(articleId,10))) {
      return { error: 'El artículo no existe o no se pudo eliminar' };
    }
    return { message: 'Artículo eliminado correctamente' };
  }

  // Otras funciones relacionadas con los artículos...

}
