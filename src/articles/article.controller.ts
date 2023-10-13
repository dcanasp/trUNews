import "reflect-metadata";
import { NextFunction, Request, Response } from 'express';
import { injectable, inject } from 'tsyringe'
import { ArticleFacade } from './article.facade';
import { logger, permaLogger } from "../utils/logger";
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
  
  public aiModel(req: Request, res: Response) {
    this.articleFacade.aiModel(req)
      .then(article => {
        res.json(article);
      })
      .catch(err => {
        res.status(400).json(err);
      });
  }
  public createArticle(req: Request, res: Response) {
    this.articleFacade.createArticle(req)
      .then(article => {
        res.json(article);
      })
      .catch(err => {
        res.status(400).json(err);
      });
  }

  public createArticleCategories(req: Request, res: Response) {
    this.articleFacade.createArticleCategories(req.body)
      .then(article => {
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

  public getLatest(req: Request, res: Response) {
    this.articleFacade.getLatest(req)
      .then((response) => res.json(response))
      .catch(err => {
        res.status(400).json(err);
      });
  }

  public findAllArticle(req:Request,res:Response){
    this.articleFacade.findAllArticle().then(response => res.json(response)).catch(err => {
        permaLogger.log('error', "get=> Article/findAllArticle // " + err);
        res.status(400).json(err);
    });
}

  public findArticle(req:Request,res:Response){
      this.articleFacade.findArticle(req).then(response => res.json(response)).catch(err => {
          permaLogger.log('error', "get=> Article/findArticle // " + err);
          res.status(400).json(err);
      });
  }

  public allTrending(req: Request, res: Response) {
    this.articleFacade.allTrending(req)
      .then((response) => res.json(response))
      .catch(err => {
        res.status(400).json(err);
      });
  }

  public trending(req: Request, res: Response) {
    this.articleFacade.trending(req)
      .then((response) => res.json(response))
      .catch(err => {
        res.status(400).json(err);
      });
  }

  public feed(req: Request, res: Response) {
    this.articleFacade.feed(req)
      .then((response) => res.json(response))
      .catch(err => {
        res.status(400).json(err);
      });
  }

  public async isSaved(req: Request, res: Response) {
    this.articleFacade.isSaved(req)
      .then((response) => res.json(response))
      .catch(err => {
        res.status(400).json(err);
      });
  }

  public async saveArticle(req: Request, res: Response) {
    this.articleFacade.saveArticle(req)
      .then((response) => res.json(response))
      .catch(err => {
        res.status(400).json(err);
      });
  }

  public async unsaveArticle(req: Request, res: Response) {
    this.articleFacade.unsaveArticle(req)
      .then((response) => res.json(response))
      .catch(err => {
        res.status(400).json(err);
      });
  }    

  public async getSavedArticles(req: Request, res: Response) {
      this.articleFacade.getSavedArticles(req)
        .then((response) => res.json(response))
        .catch(err => {
          res.status(400).json(err);
        });
  }

  public related(req: Request, res: Response) {
    this.articleFacade.related(req)
      .then((response) => res.json(response))
      .catch(err => {
        res.status(400).json(err);
      });
    } 
    
  public async getArticlesByCategory(req: Request, res: Response) {
    try {
      const articles = await this.articleFacade.getArticlesByCategory(req);
      res.json(articles);
    } catch (error) {
      res.status(500).json({ error: 'Error al buscar artículos por categoría' });
    }
  }

  public async getCategories(req: Request, res: Response) {
    try {
      const categories = await this.articleFacade.getCategories(req);
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: 'Error al buscar categorías' });
    }
  }

  public async getCategoryById(req: Request, res: Response) {
    try {
      const categories = await this.articleFacade.getCategoryById(req);
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: 'Error al buscar categoría por Id' });
    }
  }
 }
