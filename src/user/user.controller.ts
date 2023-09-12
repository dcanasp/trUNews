import "reflect-metadata";
import {Request, Response, NextFunction, response} from 'express';
import {logger, permaLogger} from '../utils/logger';
import { DatabaseErrors } from '../errors/database.errors';
import { injectable } from 'tsyringe'
import {container} from "tsyringe";
import {UserFacade} from './user.facade'


const userFacade = (container.resolve(UserFacade));
@injectable()
class UserController {
    constructor(

    ) {}

    public getUsersProfile(req : any, res : any) {

        userFacade.getUsersProfile(req).then(profile => res.json(profile)).catch(err => {
            res.status(400).json(err);
            permaLogger.log("error", "get=> user/:id // " + err)
        });
    }

    public deleteUsers(req : any, res : any) {
        userFacade.deleteUsers(req).then((message) => res.json(message)).catch(err => {
            res.status(400).json(err),
            permaLogger.log("error", "delete=> user/:id // " + err)
        });
    }

    public addUsers(req : Request, res : Response, next : NextFunction) {
        // const token = res.locals.token;
        // permaLogger.log('debug',token)
        userFacade.addUsers(req.body).then(userId => {
			res.locals.newUser = userId; // save user in res.locals to pass to next middleware
            next();
        }).catch(() => res.status(400).json({"err":"credenciales de username ya usadas"}));
    }

    public checkPassword(req : Request, res : Response) {
        userFacade.checkPassword(req.body).then(response => res.json(response)).catch(err => {
            permaLogger.log('error', "post=> user/chechPassword // " + err);
            res.status(400).json(err);
        });
    }

    // public addImage(req: Request, res:Response){
    //     userFacade.addImage(req.body).then(response => res.json(response)).catch(err => {
    //         permaLogger.log('error','post =>add image '+ err);
    //         res.status(400).json(err);

    //     });
    // }

}
