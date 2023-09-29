import "reflect-metadata";
import { NextFunction, Request, Response } from 'express';
import { injectable, inject } from 'tsyringe'
import { CommunityFacade } from './community.facade';
import { permaLogger } from "../utils/logger";
@injectable()
export class CommunityController {
  constructor(@inject(CommunityFacade) private communityFacade: CommunityFacade) {
  }

  public async getArticles(req: Request, res: Response) {
    this.communityFacade.getArticles(req)
      .then(articles => res.json(articles))
      .catch(err => {
        res.status(400).json(err);
      });
  }



 }
