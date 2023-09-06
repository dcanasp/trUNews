import { Router } from 'express';
import { ArticleRouter } from './article.routes';
import {UserRouter} from './user.routes';
import {logger} from '../utils/logger';


export const routes = Router();

// const instanceUserRouter= new usersRouter()
// logger.log('debug',instanceUserRouter.getUserRoutes())

routes.use('/articles', new ArticleRouter() .getArticleRoutes())
routes.use('/users', new UserRouter() .getUserRoutes());


// export function crearRutas (app:Express){
//     app.use( '/users', new usersRouter() .getUserRoutes() ) 

// }
