import { Router } from 'express';
import {UsersRouter} from './user.routes';
import {logger} from '../utils/logger';


export const routes = Router();

// const instanceUserRouter= new usersRouter()
// logger.log("debug",instanceUserRouter.getUserRoutes())

routes.use('/users', new UsersRouter() .getUserRoutes());


// export function crearRutas (app:Express){
//     app.use( '/users', new usersRouter() .getUserRoutes() ) 

// }
