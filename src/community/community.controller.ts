import "reflect-metadata";
import { NextFunction, Request, Response } from 'express';
import { injectable, inject } from 'tsyringe';
import { CommunityFacade } from './community.facade';
import { permaLogger } from "../utils/logger";
@injectable()
export class CommunityController {
  constructor(@inject(CommunityFacade) private communityFacade: CommunityFacade) {
  }
  
  
  public async findAll(req: Request, res: Response) {
    this.communityFacade.findAll(req) .then(articles => res.json(articles)) 
    .catch(err => { res.status(400).json(err); });
  }
  public async find(req: Request, res: Response) {
    this.communityFacade.find(req) .then(articles => res.json(articles)) 
    .catch(err => { res.status(400).json(err); });
  }
  public async related(req: Request, res: Response) {
      this.communityFacade.related(req) .then(articles => res.json(articles)) 
      .catch(err => { res.status(400).json(err); });
  }

  public async feed(req: Request, res: Response) {
      this.communityFacade.feed(req) .then(articles => res.json(articles)) 
      .catch(err => { res.status(400).json(err); });
  }


 }
