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

    
    // Rutas protegidas que requieren autenticación
    this.router.post(
      '/create',
      convertDateFields(['date']),
      validatePost(createArticleSchema),
      verifyJwtPost('id_writer'),  
      (req: Request, res: Response, next: NextFunction) =>
        this.articleController.createArticle(req, res),
    );

    this.router.get('/latest/:quantity([0-9]+)', (req:Request, res:Response) => {
      this.articleController.getLatest(req,res);
      
    });
    
    this.router.get('/trending/', (req:Request, res:Response) => {
      this.articleController.allTrending(req,res);
    });
    this.router.get('/trending/:quantity([0-9]+)', (req:Request, res:Response) => {
      this.articleController.trending(req,res);
    });

    this.router.get('/find/',
    (req:Request, res:Response) => this.articleController.findAllArticle(req, res));
    
    
    this.router.get('/find/:nombre',
    (req:Request, res:Response) => this.articleController.findArticle(req, res));

    this.router.get('/feed/',
    (req:Request, res:Response) => this.articleController.feed(req, res));

    this.router.get('/related/:id([0-9]+)',
    (req:Request, res:Response) => this.articleController.related(req, res));

    this.router.get('/:id([0-9]+)', (req:Request, res:Response) => {
          this.articleController.getArticleById(req, res)
    });
    this.router.delete(
      '/:id([0-9]+)',
      verifyJwt(),
      (req: Request, res: Response) => {
        this.articleController.deleteArticle(req, res);
      }
    );

    this.router.post('/save/:articleId', 
      (req:Request, res:Response) => this.articleController.saveArticle(req, res));

    this.router.post('/unsave/:articleId',
    (req: Request, res: Response) => this.articleController.unsaveArticle(req, res));
  
    this.router.get('/savedArticles', 
      (req:Request, res:Response) => this.articleController.getSavedArticles(req, res));

    this.router.get('/category/:categoryId', 
    (req:Request, res:Response) => this.articleController.getArticlesByCategory(req, res));

    return this.router;
  }

}
