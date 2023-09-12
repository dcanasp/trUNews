import "reflect-metadata"
import { Router, Request, Response } from 'express';
import { injectable, inject } from 'tsyringe'
import { ArticleController } from '../articles/article.controller';
import { validatePost } from '../middleware/dataValidation/zodValidation';
import { convertDateFields } from '../utils/convertDataTypes';
import { createArticleSchema } from '../middleware/dataValidation/schemas';
import { generateJwt, verifyJwt } from '../auth/jwtServices';


@injectable()
export class ArticleRouter {
  private router: Router;
  private articleController; 

  constructor(@inject(ArticleController) articleController:ArticleController){
        this.router = Router();
        this.articleController = articleController    
  }

  public routes() {
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
        this.articleController.createArticle(req, res, next),
    );


    this.router.delete(
      '/:id',
      verifyJwt(),
      (req: any, res: any) => {
        this.articleController.deleteArticle(req, res);
      }
    );

    return this.router;
  }

}
