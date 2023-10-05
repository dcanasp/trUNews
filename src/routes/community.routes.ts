import "reflect-metadata";
import { Router,Request,Response,NextFunction } from 'express';
// import { UserModule } from '../user/user.module';
import {logger,permaLogger} from '../utils/logger';
// import { UserController } from '../user/user.controller';
import { validatePost } from '../middleware/dataValidation/zodValidation'
import { convertDateFields } from '../utils/convertDataTypes'
import { checkPasswordSchema, createUserSchema, decryptJWTSchema } from '../middleware/dataValidation/schemas'
import { generateJwt, verifyJwt } from '../auth/jwtServices'
import { Roles } from '../utils/roleDefinition'
import { inject, injectable } from 'tsyringe'
import { CommunityController } from '../community/community.controller'


@injectable()
export class CommunityRouter {
    private router: Router;
    constructor(@inject(CommunityController) private communityController:CommunityController){
        this.router = Router();
    }

    public routes(){
        
        this.router.get('/find',
        (req:Request, res:Response) => this.communityController.findAll(req, res));
        
        this.router.get('/find/:nombre',
        (req:Request, res:Response) => this.communityController.find(req, res));
        
        this.router.get('/related',
        (req:Request, res:Response) => this.communityController.related(req, res));
            
        this.router.get('/feed',
        (req:Request, res:Response) => this.communityController.feed(req, res));
        

        return this.router

            
    }
}


// export default userRouter