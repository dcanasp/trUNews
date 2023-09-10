import {UserFacade} from './user.facade';
import {Request, Response, NextFunction, response} from 'express';
import {logger, permaLogger} from '../utils/logger';
import { DatabaseErrors } from '../errors/database.errors';

export class UserController {
    constructor(private userFacade : UserFacade) {}

    public getUsersProfile(req : any, res : any) {

        this.userFacade.getUsersProfile(req).then(profile => res.json(profile)).catch(err => {
            res.status(400).json(err);
            permaLogger.log("error", "get=> user/:id // " + err)
        });
    }

    public deleteUsers(req : any, res : any) {
        this.userFacade.deleteUsers(req).then((message) => res.json(message)).catch(err => {
            res.status(400).json(err),
            permaLogger.log("error", "delete=> user/:id // " + err)
        });
    }

    public addUsers(req : Request, res : Response, next : NextFunction) {
        // const token = res.locals.token;
        // permaLogger.log('debug',token)
        this.userFacade.addUsers(req.body).then(userId => {
			res.locals.newUser = userId; // save user in res.locals to pass to next middleware
            next();
        }).catch(() => res.status(400).json({"err":"credenciales de username ya usadas"}));
    }

    public checkPassword(req : Request, res : Response) {
        this.userFacade.checkPassword(req.body).then(response => res.json(response)).catch(err => {
            permaLogger.log('error', "post=> user/chechPassword // " + err);
            res.status(400).json(err);
        });
    }

    // public addImage(req: Request, res:Response){
    //     this.userFacade.addImage(req.body).then(response => res.json(response)).catch(err => {
    //         permaLogger.log('error','post =>add image '+ err);
    //         res.status(400).json(err);

    //     });
    // }

}