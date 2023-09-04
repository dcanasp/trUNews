import { DatabaseService } from '../conectionDB/databaseService';
import { ArticleService } from './article.service'; 
import { ArticleController } from './article.controller'; 

export class ArticleModule {
  private articleController: ArticleController;

  constructor() {
    const databaseService = new DatabaseService();
    const articleService = new ArticleService(databaseService); 
    this.articleController = new ArticleController(articleService); 
  }

  public getArticleController(): ArticleController {
    return this.articleController;
  }
}
