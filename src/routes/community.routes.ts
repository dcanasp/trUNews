import "reflect-metadata";
import { Router,Request,Response,NextFunction } from 'express';
// import { UserModule } from '../user/user.module';
import {logger,permaLogger} from '../utils/logger';
// import { UserController } from '../user/user.controller';
import { validatePost } from '../middleware/dataValidation/zodValidation'
import { convertDateFields } from '../utils/convertDataTypes'
import { checkPasswordSchema, createCommunitySchema, createUserSchema, decryptJWTSchema,addArticleCommunitySchema, checkArticleToAddSchema, createEventSchema} from '../middleware/dataValidation/schemas'
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

        this.router.post('/addArticle/',
            validatePost(addArticleCommunitySchema),
            (req:Request, res:Response) =>  this.communityController.addArticle(req, res));

        this.router.delete('/removeArticle/:communityId([0-9]+)/:idArticle([0-9]+)',
            (req:Request, res:Response) =>  this.communityController.removeArticle(req, res));

        this.router.post('/checkArticleToAdd',
            validatePost(checkArticleToAddSchema),
            verifyJwtPost('userId'),
            (req:Request, res:Response) =>  this.communityController.checkArticleToAdd(req, res));
        
        this.router.post('/postedOnCommunity',
            validatePost(checkArticleToAddSchema),
            verifyJwtPost('userId'),
            (req:Request, res:Response) =>  this.communityController.postedOnCommunity(req, res));
        
        this.router.post('/createEvent',
            convertDateFields(['date']),
            validatePost(createEventSchema),
            verifyJwtPost('creator_id'),  
            (req:Request, res:Response) =>  this.communityController.createEvent(req, res));
        
        this.router.get('/communityEvents/:communityId([0-9]+)',
            (req:Request, res:Response) =>  this.communityController.getCommunityEvents(req, res));

        this.router.get('/event/:eventId([0-9]+)',
            (req:Request, res:Response) =>  this.communityController.getEvent(req, res));
        
        this.router.delete('/deleteEvent/:id([0-9]+)/:eventId([0-9]+)',
            verifyJwt(),
            (req:Request, res:Response) =>  this.communityController.deleteEvent(req, res));

        this.router.post('/attend/:id([0-9]+)/:idEvent([0-9]+)',
            verifyJwt(), 
            (req:Request, res:Response) =>  this.communityController.attendEvent(req, res));
            
        this.router.post('/undoAttend/:id([0-9]+)/:idEvent([0-9]+)', 
            verifyJwt(),
            (req:Request, res:Response) =>  this.communityController.undoAttendEvent(req, res));

        this.router.get('/recommended', (
            req:Request, res:Response) => this.communityController.recommended(req, res));
            
        this.router.get('/myCommunities/:id([0-9]+)', (
            req:Request, res:Response) => this.communityController.myCommunities(req, res));
            

        return this.router
    }
}


// export default userRouter