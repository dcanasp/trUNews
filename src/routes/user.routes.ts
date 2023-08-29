import { Router } from 'express';
import { UserModule } from '../users/users.module';
import {logger,permaLogger} from '../utils/logger';
import { UsersController } from '../users/users.controller';
import { validatePost } from '../middleware/dataValidation/zodValidation'
import { convertDateFields } from '../utils/convertDataTypes'
import { checkPasswordSchema, createUserSchema } from '../middleware/dataValidation/schemas'
import { generateJwt, verifyJwt } from '../auth/jwtServices'
export class usersRouter {
    private enruttador: Router;
    private userModule: UserModule;
    private userController: UsersController;
    constructor(){
        this.enruttador = Router();
        this.userModule = new UserModule();
        this.userController = this.userModule.getUserController(); 

        // this.defineRoutes();
    }

    public defineRoutes(){

        this.enruttador.get('/:id',
            verifyJwt,
            (req:any, res:any) => this.userController.getUsersProfile(req, res));
        this.enruttador.post('/create',
            convertDateFields(['NOMBREPARAMETRO']) ,validatePost(createUserSchema),
            (req:any,res:any,next:any)=> this.userController.addUsers(req,res,next),
            generateJwt,(req: any, res: any) => {
                res.json({ user: res.locals.newUser, token: res.locals.token }); //es temporal mandarle el user, es para pruebas
              }
            );

        this.enruttador.delete('/:id', 
            verifyJwt,
            (req:any, res:any) => this.userController.deleteUsers(req, res));
        
        this.enruttador.post('/checkPassword',
              validatePost(checkPasswordSchema),
              (req:any, res:any) => this.userController.checkPassword(req, res));
        
        
        
        return this.enruttador
    }
    public getUserRoutes(){
        // logger.log("debug",this.defineRoutes())    
        return this.defineRoutes();
    }
    
}


// export default userRouter