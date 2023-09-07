import { ArticleFacade } from './article.facade';
import { Request, Response } from 'express';

export class ArticleController {
  constructor(private articleFacade: ArticleFacade) {}

  public async getArticles(req: Request, res: Response) {
    this.articleFacade.getArticles(req)
      .then(articles => res.json(articles))
      .catch(err => {
        res.status(400).json(err);
      });
  }

  public getArticleById(req: Request, res: Response) {
    this.articleFacade.getArticleById(req)
      .then(article => res.json(article))
      .catch(err => {
        res.status(400).json(err);
      });
  }

  public createArticle(req: Request, res: Response, next: any) {
    this.articleFacade.createArticle(req)
      .then(article => {
        res.locals.newArticle = article; 
        res.json(article);
      })
      .catch(err => {
        res.status(400).json(err);
      });
  }

  public deleteArticle(req: Request, res: Response) {
    this.articleFacade.deleteArticle(req)
      .then(() => res.json({ message: 'Artículo eliminado exitosamente' }))
      .catch(err => {
        res.status(400).json(err);
      });
  }

 }
