import { Router,Request,Response,NextFunction } from 'express';
import { UserModule } from '../user/user.module';
import {logger,permaLogger} from '../utils/logger';
import { UserController } from '../user/user.controller';
import { validatePost } from '../middleware/dataValidation/zodValidation'
import { convertDateFields } from '../utils/convertDataTypes'
import { checkPasswordSchema, createUserSchema } from '../middleware/dataValidation/schemas'
import { generateJwt, verifyJwt } from '../auth/jwtServices'
import { Roles } from '../utils/roleDefinition'
export class UserRouter {
    private router: Router;
    private userModule: UserModule;
    private userController: UserController;
    constructor(){
        this.router = Router();
        this.userModule = new UserModule();
        this.userController = this.userModule.getUserController(); 

        // this.defineRoutes();
    }

    public defineRoutes(){

        this.router.get('/:id',
            verifyJwt(),
            (req:Request, res:Response) => this.userController.getUsersProfile(req, res));
            
        this.router.post('/create',
            convertDateFields(['NOMBREPARAMETRO']) ,validatePost(createUserSchema),
            (req:Request,res:Response,next:NextFunction)=> { (this.userController.addUsers(req,res,next)) },
            generateJwt,
            (req: Request, res: Response) => {
                res.json({ user: res.locals.newUser, token: res.locals.token }); //es temporal mandarle el user, es para pruebas
                
            }
            );

        this.router.delete('/:id', 
            verifyJwt(Roles.escritor),
            (req:Request, res:Response) => this.userController.deleteUsers(req, res));
        
        this.router.post('/checkPassword',
              validatePost(checkPasswordSchema),
              (req:Request, res:Response) => this.userController.checkPassword(req, res));
        
        // this.router.post('/addImage',(req:Request,res:Response) => this.userController.addImage(req,res) )
     
        

        return this.router
    }
    public getUserRoutes(){
        return this.defineRoutes();
    }
    
}


// export default userRouter