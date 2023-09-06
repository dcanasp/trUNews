import { DatabaseService } from '../db/databaseService';
import { ArticleService } from './article.service'; 
import { ArticleController } from './article.controller'; 
import { ArticleFacade } from './article.facade';

export class ArticleModule {
  private articleController: ArticleController;

  constructor() {
    const databaseService = new DatabaseService();
    const articleService = new ArticleService(databaseService); 
    const articleFacade = new ArticleFacade(articleService)
    this.articleController = new ArticleController(articleFacade); 
  }

  public getArticleController(): ArticleController {
    return this.articleController;
  }
}
