import { Router } from 'express';

import {usersRouter} from './user.routes';
import { UserModule } from '../users/users.module';
import {logger} from '../utils/logger';
import { UsersController } from '../users/users.controller';
import { App } from '../app';
import express, { Express } from "express";


export const routes = Router();

// const instanceUserRouter= new usersRouter()
// logger.log("debug",instanceUserRouter.getUserRoutes())


routes.use('/users', new usersRouter() .getUserRoutes())


// export function crearRutas (app:Express){
//     app.use( '/users', new usersRouter() .getUserRoutes() ) 

// }
