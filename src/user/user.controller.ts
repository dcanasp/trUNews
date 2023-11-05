import "reflect-metadata";
import {Request, Response, NextFunction, response} from 'express';
import {logger, permaLogger} from '../utils/logger';
import { DatabaseErrors } from '../errors/database.errors';
// import {container} from "tsyringe";
import { injectable, inject } from 'tsyringe';
import { UserFacade } from './user.facade';


// const userFacade = (container.resolve(UserFacade)); //es una forma de resolverlo manualmente, pero mejor inyectar
@injectable()
export class UserController {
    constructor( @inject(UserFacade) private userFacade: UserFacade ) {
    }

    public getUsersProfile(req : Request, res : Response) {

        this.userFacade.getUsersProfile(req).then(profile => res.json(profile)).catch(err => {
            res.status(400).json(err);
            permaLogger.log("error", "get=> user/:id // " + err)
        });
    }

    public deleteUsers(req : Request, res : Response) {
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

    public decryptJWT(req:Request,res:Response){
        this.userFacade.decryptJWT(req.body).then(response => res.json(response)).catch(err => {
            permaLogger.log('error', "post=> user/decryptJWT // " + err);
            res.status(400).json(err);
        });
    }
    //TODO: pasar a perfil

    public updatePassword = async (req: Request, res: Response) => {
        try {
            const userId = req.params.id;
            const { username, currentPassword, newPassword } = req.body; //mal uso de facada
            const result = await this.userFacade.updatePassword(userId, username, currentPassword, newPassword);
            res.json(result);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al actualizar la contraseña del usuario' });
        }
    };
    
    public updateProfile = async (req: Request, res: Response) => {
        try {
            const updatedProfileData = req.body;

            const result = await this.userFacade.updateProfile(req, updatedProfileData);
            res.status(200).json(result);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al actualizar el perfil del usuario' });
        }
    };

    public tryImage = async (req: Request, res: Response) => {
        try {

            const resizedImage = await this.userFacade.tryImage(req.body);
            res.status(200).json(resizedImage);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error imagenes' });
        }
    };

    
    //TODO: pasar a perfil fin


    public findAllUser(req:Request,res:Response){
        this.userFacade.findAllUser().then(response => res.json(response)).catch(err => {
            permaLogger.log('error', "get=> user/findAllUser // " + err);
            res.status(400).json(err);
        });
    }

    public findUser(req:Request,res:Response){
        this.userFacade.findUser(req).then(response => res.json(response)).catch(err => {
            permaLogger.log('error', "get=> user/findUser // " + err);
            res.status(400).json(err);
        });
    }

    public allTrending(req: Request, res: Response) {
        this.userFacade.allTrending(req)
          .then((response) => res.json(response))
          .catch(err => {
            res.status(400).json(err);
          });
      }
    
      public trending(req: Request, res: Response) {
        this.userFacade.trending(req)
          .then((response) => res.json(response))
          .catch(err => {
            res.status(400).json(err);
          });
      }    

      public followUser(req: Request, res: Response) {
        this.userFacade.followUser(req.params.id, req.params.idToFollow)
          .then((response) => res.json(response))
          .catch(err => {
            res.status(400).json(err);
          });
    }
    
    public unfollowUser(req: Request, res: Response) {
        this.userFacade.unfollowUser(req.params.id, req.params.idToUnfollow)
          .then((response) => res.json(response))
          .catch(err => {
            res.status(400).json(err);
          });
    }

    public async getFollowers(req: Request, res: Response) {
        const userId = req.params.userId;
        const followers = await this.userFacade.getFollowers(userId);
        res.json(followers);
    }

    public async getFollowing(req: Request, res: Response) {
        const userId = req.params.userId;
        const following = await this.userFacade.getFollowing(userId);
        res.json(following);
    }
    
    public async monthlyViews(req: Request, res: Response) {
        //@ts-ignore
        const userId = req.userId;
        this.userFacade.monthlyViews(userId)
          .then((response) => res.json(response))
          .catch(err => {
            res.status(400).json(err);
          });
    }


}
