import "reflect-metadata";
import { Router,Request,Response,NextFunction } from 'express';
// import { UserModule } from '../user/user.module';
import {logger,permaLogger} from '../utils/logger';
// import { UserController } from '../user/user.controller';
import { validatePost } from '../middleware/dataValidation/zodValidation'
import { convertDateFields } from '../utils/convertDataTypes'
import { checkPasswordSchema, createCommunitySchema, createUserSchema, decryptJWTSchema } from '../middleware/dataValidation/schemas'
import { generateJwt, verifyJwt, verifyJwtPost } from '../auth/jwtServices'
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
        
        //necestia ?articleId,communityId
        this.router.get('/related',
        (req:Request, res:Response) => this.communityController.related(req, res));
            
        this.router.get('/feed',
        (req:Request, res:Response) => this.communityController.feed(req, res));
        
        this.router.post('/create',
            convertDateFields(['date']),
            validatePost(createCommunitySchema),
            verifyJwtPost('creator_id'),  
            (req: Request, res: Response, next: NextFunction) =>
            this.communityController.createCommunity(req, res),
        );

        this.router.get('/', (
            req:Request, res:Response) => this.communityController.findAll(req, res));

        this.router.get('/:id([0-9]+)', (
            req:Request, res:Response) => this.communityController.getCommunityById(req, res));

        this.router.put('/update/:id([0-9]+)/:idCommunity([0-9]+)',
            verifyJwtPost('creator_id'),
            (req, res) => this.communityController.updateCommunity(req, res));

        this.router.delete('/delete/:id([0-9]+)/:idCommunity([0-9]+)', 
            verifyJwt(),
            (req:Request, res:Response) => this.communityController.deleteCommunity(req, res));
        
        this.router.post('/join/:id([0-9]+)/:idCommunity([0-9]+)',
            verifyJwt(), 
            (req:Request, res:Response) =>  this.communityController.joinCommunity(req, res));
            
        this.router.post('/leave/:id([0-9]+)/:idCommunity([0-9]+)', 
            verifyJwt(),
            (req:Request, res:Response) =>  this.communityController.leaveCommunity(req, res));

        this.router.get('/members/:communityId([0-9]+)', 
            (req:Request, res:Response) =>  this.communityController.getMembers(req, res));

        this.router.post('/addArticle/:communityId([0-9]+)/:idArticle([0-9]+)',
            (req:Request, res:Response) =>  this.communityController.addArticle(req, res));

        this.router.delete('/removeArticle/:communityId([0-9]+)/:idArticle([0-9]+)',
            (req:Request, res:Response) =>  this.communityController.removeArticle(req, res));

        return this.router

    }
}


// export default userRouter