import "reflect-metadata"
import { Router, Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'tsyringe'
import { ArticleController } from '../articles/article.controller';
import { validatePost } from '../middleware/dataValidation/zodValidation';
import { convertDateFields } from '../utils/convertDataTypes';
import { createArticleSchema } from '../middleware/dataValidation/schemas';
import { verifyJwt, verifyJwtPost } from '../auth/jwtServices';


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
      verifyJwtPost('id_writer'),  
      (req: Request, res: Response, next: NextFunction) =>
        this.articleController.createArticle(req, res, next),
    );


    this.router.delete(
      '/:id',
      verifyJwt(),
      (req: Request, res: Response) => {
        this.articleController.deleteArticle(req, res);
      }
    );

    return this.router;
  }

}
