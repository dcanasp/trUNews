import "reflect-metadata";
import { Request } from 'express';
import { injectable, inject } from 'tsyringe'
import { ArticleService } from './article.service';
import { DatabaseErrors } from '../errors/database.errors';

@injectable()
export class ArticleFacade {
  private articleService;
  constructor(@inject(ArticleService) articleService: ArticleService) {
    this.articleService = articleService
  }

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
    const article = await this.articleService.getArticleById(parseInt(articleId, 10));
    if (!article) {
      return { "err": 'El artículo no existe' };
    }
    return article;
  }

  public async createArticle(req: Request) {
      const articleCreated = await this.articleService.createArticle(req.body);
      if (!articleCreated){
        return {"err":"No se pudo crear el articulo"}  
        // throw new DatabaseErrors('No se pudo crear el articulo')
      }
      return {articleId: articleCreated.id_article, title: articleCreated.title}
  }


  public async deleteArticle(req: Request) {
    const articleId = req.params.id;
    if (!await this.articleService.deleteArticle(parseInt(articleId,10))) {
      return { "err": 'El artículo no existe o no se pudo eliminar' };
    }
    return { message: 'Artículo eliminado correctamente' };
  }

  public async getLatest(req: Request) {
    const cantidadNoticias = req.params.quantity;
    const latest = await this.articleService.getLatest(parseInt(cantidadNoticias,10))
    if (!latest) {
      return { "err": 'no se pudieron traer Ultimos articulos' };
    }
    const now = new Date();
    let formated_latest:any[] = [];
    for (let article of latest) {
      const ageInDays = (now.getTime() - new Date(article.date).getTime()) / (1000 * 60 * 60 * 24);
      let formated_date;
      if (ageInDays < 1) {
        formated_date = "Today";
      } else {
        formated_date = `Created ${Math.floor(ageInDays)} days ago`;
      }
      formated_latest.push({
        "date": formated_date,
        image_url: article.image_url,
        title: article.title
      })
      console.log(formated_latest);
    }


    return formated_latest;
  }

  public async allTrending(req: Request) {
    const trending = await this.articleService.allTrending()
    if (!trending) {
      return { "err": 'no se pudieron traer Ultimos articulos' };
    }
    return trending;
  }
  
  
  public async trending(req: Request) {
    const cantidadArticulos = req.params.quantity;
    const trending = await this.articleService.trending(parseInt(cantidadArticulos,10))
    if (!trending) {
      return { "err": 'no se pudieron traer Ultimos articulos' };
    }
    return trending;
  }


}
