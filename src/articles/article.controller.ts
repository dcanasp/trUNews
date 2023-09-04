import { ArticleService } from './article.service';
import { Request, Response } from 'express';

export class ArticleController {
  constructor(private articleService: ArticleService) {}

  public async getArticles(req: any, res: any) {
    this.articleService.getArticles()
      .then(articles => res.json(articles))
      .catch(err => {
        res.status(400).json(err);
      });
  }

  public getArticleById(req: Request, res: Response) {
    const articleId = req.params.id;
    this.articleService.getArticleById(articleId)
      .then(article => res.json(article))
      .catch(err => {
        res.status(400).json(err);
      });
  }

  public createArticle(req: Request, res: Response, next: any) {
    this.articleService.createArticle(req.body)
      .then(article => {
        res.locals.newArticle = article; // Guarda el artículo en res.locals para pasarlo al siguiente middleware
        next();
      })
      .catch(err => {
        res.status(400).json(err);
      });
  }

  public updateArticle(req: Request, res: Response) {
    const articleId = req.params.id;

    this.articleService.updateArticle(articleId, req.body)
      .then(updatedArticle => res.json(updatedArticle))
      .catch(err => {
        res.status(400).json(err);
      });
  }

  public deleteArticle(req: Request, res: Response) {
    const articleId = req.params.id;

    this.articleService.deleteArticle(articleId)
      .then(() => res.json({ message: 'Article deleted successfully' }))
      .catch(err => {
        res.status(400).json(err);
      });
  }

 }
