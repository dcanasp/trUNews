import { Router } from 'express';
import { ArticleRouter } from './article.routes';
import {UserRouter} from './user.routes';
import {logger} from '../utils/logger';
import {container} from 'tsyringe'

export const routes = Router();

const userRouter = container.resolve(UserRouter);
const articleRouter = container.resolve(ArticleRouter)

routes.use('/articles', articleRouter.routes())
routes.use('/users', userRouter.routes());
