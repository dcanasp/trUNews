import { ArticleService } from './article.service';
import { Request, Response } from 'express';
import { logger, permaLogger } from '../utils/logger';

export class ArticleController {
  constructor(private articleService: ArticleService) {}

  public getArticleById(req: Request, res: Response) {
    const articleId = req.params.id;

    this.articleService.getArticleById(articleId)
      .then(article => res.json(article))
      .catch(err => {
        res.status(400).json(err);
        permaLogger.log("error", "get=> article/:id // " + err);
      });
  }

  public createArticle(req: Request, res: Response, next: any) {
    this.articleService.createArticle(req.body)
      .then(article => {
        logger.log("debug", article);
        res.locals.newArticle = article; // Guarda el artículo en res.locals para pasarlo al siguiente middleware
        next();
      })
      .catch(err => {
        res.status(400).json(err);
        permaLogger.log("error", "post=> article/create // " + err);
      });
  }

  public updateArticle(req: Request, res: Response) {
    const articleId = req.params.id;

    this.articleService.updateArticle(articleId, req.body)
      .then(updatedArticle => res.json(updatedArticle))
      .catch(err => {
        res.status(400).json(err);
        permaLogger.log("error", "put=> article/:id // " + err);
      });
  }

  public deleteArticle(req: Request, res: Response) {
    const articleId = req.params.id;

    this.articleService.deleteArticle(articleId)
      .then(() => res.json({ message: 'Article deleted successfully' }))
      .catch(err => {
        res.status(400).json(err);
        permaLogger.log("error", "delete=> article/:id // " + err);
      });
  }

  // Aquí irán todas las rutas relacionadas con artículos, incluyendo las operaciones de actualizar y eliminar
}
