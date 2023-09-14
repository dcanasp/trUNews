import "reflect-metadata";
import { Request, Response } from 'express';
import { injectable, inject } from 'tsyringe'
import { ArticleFacade } from './article.facade';

@injectable()
export class ArticleController {
  constructor(@inject(ArticleFacade) private articleFacade: ArticleFacade) {
  }

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
        // res.locals.newArticle = article; //???? 
        res.json(article);
      })
      .catch(err => {
        res.status(400).json(err);
      });
  }

  public deleteArticle(req: Request, res: Response) {
    this.articleFacade.deleteArticle(req)
      .then((response) => res.json(response))
      .catch(err => {
        res.status(400).json(err);
      });
  }

 }
