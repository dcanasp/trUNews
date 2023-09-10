import { DatabaseService } from '../db/databaseService';
import { ArticleService } from './article.service'; 
import { ArticleController } from './article.controller'; 
import { ArticleFacade } from './article.facade';
import { ServiceRegistry } from '../servicesRegistry/ServiceRegistry'

export class ArticleModule {
  private articleController: ArticleController;

  constructor() {
    const databaseService = DatabaseService.getInstance(); //podria mandar misma db que la del serviceRegistry, pero como es un singleton no importa
    const userService = ServiceRegistry.userService;
    const articleService = new ArticleService(databaseService,userService); 
    const articleFacade = new ArticleFacade(articleService)
    this.articleController = new ArticleController(articleFacade); 
  }

  public getArticleController(): ArticleController {
    return this.articleController;
  }
}
