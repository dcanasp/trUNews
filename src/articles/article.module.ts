import { DatabaseService } from '../conectionDB/databaseService';
import { ArticleService } from './article.service'; // Asegúrate de importar el servicio adecuado
import { ArticleController } from './article.controller'; // Asegúrate de importar el controlador adecuado

export class ArticleModule {
  private articleController: ArticleController;

  constructor() {
    const databaseService = new DatabaseService();
    const articleService = new ArticleService(databaseService); // Crea el servicio de artículo
    this.articleController = new ArticleController(articleService); // Crea el controlador de artículo
  }

  public getArticleController(): ArticleController {
    return this.articleController;
  }
}
