import { Router } from 'express';
import { ArticleModule } from '../articles/article.module';
import { ArticleController } from '../articles/article.controller';
import { validatePost } from '../middleware/dataValidation/zodValidation';
import { convertDateFields } from '../utils/convertDataTypes';
import { createArticleSchema } from '../middleware/dataValidation/schemas';
import { generateJwt, verifyJwt } from '../auth/jwtServices';

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
    this.router.get('/all', (req:any, res:any) => {
        this.articleController.getArticles(req,res);
        
    });

    this.router.get('/articles/:id', (req, res) => {
        (req:any, res:any) => this.articleController.getArticleById(req, res)
    });

    // Rutas protegidas que requieren autenticación
    this.router.post(
      '/articles',
      verifyJwt, // Middleware de autenticación (requiere autenticación)
      convertDateFields(['NOMBREPARAMETRO']),
      validatePost(createArticleSchema),
      (req: any, res: any, next: any) =>
        this.articleModule.getArticleController().createArticle(req, res, next),
      generateJwt, // Si es necesario generar un token
      (req: any, res: any) => {
        // Respuesta después de crear el artículo y generar un token (si es necesario)
        res.json({ article: res.locals.newArticle, token: res.locals.token }); // Cambia 'article' al objeto adecuado
      }
    );

    // Otras rutas protegidas para actualizar, eliminar, etc.
    this.router.put(
      '/articles/:id',
      verifyJwt, // Middleware de autenticación (requiere autenticación)
      (req: any, res: any) => {
        // Lógica para actualizar un artículo (requiere autenticación)
      }
    );

    this.router.delete(
      '/articles/:id',
      verifyJwt, // Middleware de autenticación (requiere autenticación)
      (req: any, res: any) => {
        // Lógica para eliminar un artículo (requiere autenticación)
      }
    );

    return this.router;
  }

  public getArticleRoutes() {
    return this.defineRoutes();
  }
}
