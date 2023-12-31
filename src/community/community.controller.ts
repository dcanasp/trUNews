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

  public createCommunity(req: Request, res: Response) {
    this.communityFacade.createCommunity(req)
      .then(community => {
        res.json(community);
      })
      .catch(err => {
        res.status(400).json(err);
      });
  }

  public getCommunityById(req: Request, res: Response) {
    this.communityFacade.getCommunityById(req)
      .then(communities => res.json(communities))
      .catch(err => {
        res.status(400).json(err);
      });
  }

  public async updateCommunity(req: Request, res: Response) {
    this.communityFacade.updateCommunity(req)
      .then(community => res.json(community))
      .catch(err => {
        res.status(400).json(err);
      });
  }

  public deleteCommunity(req: Request, res: Response) {
    this.communityFacade.deleteCommunity(req)
      .then(community => res.json(community))
      .catch(err => {
        res.status(400).json(err);
      });
  }

  public joinCommunity(req: Request, res: Response) {
    this.communityFacade.joinCommunity(req)
      .then(community => res.json(community))
      .catch(err => {
        res.status(400).json(err);
      });
  }

  public leaveCommunity(req: Request, res: Response) {
    this.communityFacade.leaveCommunity(req)
      .then(community => res.json(community))
      .catch(err => {
        res.status(400).json(err);
      });
  }

  public getMembers(req: Request, res: Response) {
    this.communityFacade.getCommunityMembers(req)
      .then(members => res.json(members))
      .catch(err => {
        res.status(400).json(err);
      });
  }

  public addArticle(req: Request, res: Response) {
    this.communityFacade.addArticle(req)
      .then(community => res.json(community))
      .catch(err => {
        res.status(400).json(err);
      });
  }

  public removeArticle(req: Request, res: Response) {
    this.communityFacade.removeArticle(req)
      .then(community => res.json(community))
      .catch(err => {
        res.status(400).json(err);
      });
  }

  public checkArticleToAdd(req: Request, res: Response) {
    this.communityFacade.checkArticleToAdd(req)
      .then(community => res.json(community))
      .catch(err => {
        res.status(400).json(err);
      });
  }


  public postedOnCommunity(req: Request, res: Response) {
    this.communityFacade.postedOnCommunity(req)
      .then(community => res.json(community))
      .catch(err => {
        res.status(400).json(err);
      });
  }

  public createEvent(req: Request, res: Response) {
    this.communityFacade.createEvent(req)
      .then(community => res.json(community))
      .catch(err => {
        res.status(400).json(err);
      });
  }

  public getCommunityEvents(req: Request, res: Response) {
    this.communityFacade.getCommunityEvents(req)
      .then(events => res.json(events))
      .catch(err => {
        res.status(400).json(err);
      });
  }

  public getEvent(req: Request, res: Response) {
    this.communityFacade.getEvent(req)
      .then(event => res.json(event))
      .catch(err => {
        res.status(400).json(err);
      });
  }

  public deleteEvent(req: Request, res: Response) {
    this.communityFacade.deleteEvent(req)
      .then(event => res.json(event))
      .catch(err => {
        res.status(400).json(err);
      });
  }
  
  public attendEvent(req: Request, res: Response) {
    this.communityFacade.attendEvent(req)
      .then(event => res.json(event))
      .catch(err => {
        res.status(400).json(err);
      });
  }

  public undoAttendEvent(req: Request, res: Response) {
    this.communityFacade.undoAttendEvent(req)
      .then(event => res.json(event))
      .catch(err => {
        res.status(400).json(err);
      });
  }
  
  public recommended(req: Request, res: Response) {
    this.communityFacade.recommended(req)
      .then(event => res.json(event))
      .catch(err => {
        res.status(400).json(err);
      });
  }

  public myCommunities(req: Request, res: Response) {
    this.communityFacade.myCommunities(req)
      .then(event => res.json(event))
      .catch(err => {
        res.status(400).json(err);
      });
  }

}
