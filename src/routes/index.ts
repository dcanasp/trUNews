import { Router } from 'express';
import {usersRouter} from './user.routes';
import { ArticleRouter } from './article.routes';
import {logger} from '../utils/logger';


export const routes = Router();

// const instanceUserRouter= new usersRouter()
// logger.log("debug",instanceUserRouter.getUserRoutes())

routes.use('/users', new usersRouter() .getUserRoutes())
routes.use('/articles', new ArticleRouter() .getArticleRoutes())

// export function crearRutas (app:Express){
//     app.use( '/users', new usersRouter() .getUserRoutes() ) 

// }
