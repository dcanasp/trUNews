import { Router } from 'express';
import { ArticleRouter } from './article.routes';
import {UserRouter} from './user.routes';
import { CommunityRouter} from './community.routes';
import {logger} from '../utils/logger';
import {container} from 'tsyringe'

export const routes = Router();

const userRouter = container.resolve(UserRouter);
const articleRouter = container.resolve(ArticleRouter);
const communityRouter = container.resolve(CommunityRouter);

routes.use('/articles', articleRouter.routes())
routes.use('/users', userRouter.routes());
routes.use('/communities', communityRouter.routes())
