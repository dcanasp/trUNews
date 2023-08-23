import { Router } from 'express';
import { UserModule } from '../users/users.module';
import {logger} from '../utils/logger';
import { UsersController } from '../users/users.controller';
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
        logger.log("debug","entra a define routes")

        //al controlador le llega antes el modelo validado, ACA se valida                        //, middleware ,
        this.enruttador.get('/:id', (req:any, res:any) => this.userController.getUsersProfile(req, res));
        this.enruttador.post('/create', (req:any,res:any)=> this.userController.addUsers(req,res)); //añadir middleware, pero pues bien, preguntar si toca cambiarla  
        this.enruttador.delete('/:id', (req:any, res:any) => this.userController.deleteUsers(req, res));
    
        return this.enruttador
    }
    public getUserRoutes(){
        // logger.log("debug",this.defineRoutes())    
        return this.defineRoutes();
    }
    
}


// export default userRouter