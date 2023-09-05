import { Router } from 'express';
import { UserModule } from '../users/users.module';
import {logger,permaLogger} from '../utils/logger';
import { UsersController } from '../users/users.controller';
import { validatePost } from '../middleware/dataValidation/zodValidation'
import { convertDateFields } from '../utils/convertDataTypes'
import { checkPasswordSchema, createUserSchema } from '../middleware/dataValidation/schemas'
import { generateJwt, verifyJwt } from '../auth/jwtServices'
export class UsersRouter {
    private router: Router;
    private userModule: UserModule;
    private userController: UsersController;
    constructor(){
        this.router = Router();
        this.userModule = new UserModule();
        this.userController = this.userModule.getUserController(); 

        // this.defineRoutes();
    }

    public defineRoutes(){

        this.router.get('/:id',
            verifyJwt,
            (req:any, res:any) => this.userController.getUsersProfile(req, res));
        this.router.post('/create',
            convertDateFields(['NOMBREPARAMETRO']) ,validatePost(createUserSchema),
            (req:any,res:any,next:any)=> this.userController.addUsers(req,res,next),
            generateJwt,(req: any, res: any) => {
                res.json({ user: res.locals.newUser, token: res.locals.token }); //es temporal mandarle el user, es para pruebas
              }
            );

        this.router.delete('/:id', 
            verifyJwt,
            (req:any, res:any) => this.userController.deleteUsers(req, res));
        
        this.router.post('/checkPassword',
              validatePost(checkPasswordSchema),
              (req:any, res:any) => this.userController.checkPassword(req, res));
        
        
        
        return this.router
    }
    public getUserRoutes(){
        // logger.log("debug",this.defineRoutes())    
        return this.defineRoutes();
    }
    
}


// export default userRouter