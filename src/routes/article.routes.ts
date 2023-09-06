import { Router } from 'express';
import { ArticleModule } from '../articles/article.module';
import { ArticleController } from '../articles/article.controller';
import { validatePost } from '../middleware/dataValidation/zodValidation';
import { convertDateFields } from '../utils/convertDataTypes';
import { createArticleSchema } from '../middleware/dataValidation/schemas';
import { generateJwt, verifyJwt } from '../auth/jwtServices';
import { Request, Response } from 'express';

export class ArticleRouter {
  private router: Router;
  private articleModule: ArticleModule;
  private articleController: ArticleController; 

  constructor() {
    this.router = Router();
    this.articleModule = new ArticleModule();
    this.articleController = this.articleModule.getArticleController();

    this.defineRoutes();
  }

  public defineRoutes() {
    // Rutas públicas para ver artículos sin autenticación
    this.router.get('/', (req:Request, res:Response) => {
        this.articleController.getArticles(req,res);
        
    });

    this.router.get('/:id', (req:Request, res:Response) => {
          this.articleController.getArticleById(req, res)
    });

    // Rutas protegidas que requieren autenticación
    this.router.post(
      '/create',
      convertDateFields(['date']),
      validatePost(createArticleSchema),
      (req: Request, res: Response, next: any) =>
        this.articleModule.getArticleController().createArticle(req, res, next),
    );


    this.router.delete(
      '/:id',
      (req: any, res: any) => {
        this.articleController.deleteArticle(req, res);
      }
    );

    return this.router;
  }

  public getArticleRoutes() {
    return this.defineRoutes();
  }
}
