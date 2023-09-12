import "reflect-metadata";
// import {UserFacade} from './user.facade';
// import {Request, Response, NextFunction, response} from 'express';
// import {logger, permaLogger} from '../utils/logger';
// import { DatabaseErrors } from '../errors/database.errors';
import {container} from "tsyringe";
import {UserFacade} from "./segundaPrueba";

const instance = container.resolve(UserFacade);

class UserController {
    // instance : UserFacade
    constructor() {
        this.deleteUsers()
    }

    public deleteUsers() {
        instance.getUsersProfile()
    }


}

new UserController