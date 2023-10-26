import "reflect-metadata"
import {container,injectable,inject} from 'tsyringe';
import { Router, Request, Response, NextFunction } from 'express';
import { ArticleService } from '../articles/article.service'

export const countView = (req:Request) =>{
    const articleId = parseInt(req.params.id);

    const articleService = container.resolve(ArticleService);
    articleService.countView(articleId)



}