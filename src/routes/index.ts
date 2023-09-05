import { Router } from 'express';
import {UserRouter} from './user.routes';
import {logger} from '../utils/logger';


export const routes = Router();

// const instanceUserRouter= new usersRouter()
// logger.log('debug',instanceUserRouter.getUserRoutes())

routes.use('/users', new UserRouter() .getUserRoutes());


// export function crearRutas (app:Express){
//     app.use( '/users', new usersRouter() .getUserRoutes() ) 

// }
