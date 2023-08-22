import { Router } from 'express';

import {usersRouter} from './user.routes';
import { UserModule } from '../users/users.module';
import {logger} from '../utils/logger';
import { UsersController } from '../users/users.controller';

const routes = Router();
const userModule = new UserModule();
const userController = userModule.getUserController(); 

const instanceUserRouter= new usersRouter(userController)
// logger.log("debug",instanceUserRouter.getUserRoutes())

routes.use('/users', instanceUserRouter.getUserRoutes())


export default routes;