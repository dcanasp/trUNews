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

 }
