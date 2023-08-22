import { Router } from 'express';
import { UsersController } from '../users/users.controller';
import {logger} from '../utils/logger';
export class usersRouter {
    private enruttador: Router;
    constructor(private usersController: UsersController){
        this.enruttador = Router();
        // this.defineRoutes();
    }

    public defineRoutes(){
        logger.log("debug","entra a define routes")
        
        this.enruttador.get('/users/:id', (req:any, res:any) => this.usersController.getUsersProfile(req, res));
        this.enruttador.post('/users/create', (req:any,res:any)=> this.usersController.addUsers(req,res)); //añadir middleware, pero pues bien, preguntar si toca cambiarla  
        this.enruttador.delete('/users/:id', (req:any, res:any) => this.usersController.deleteUsers(req, res));
    
    }
    public getUserRoutes(){
        // logger.log("debug",this.defineRoutes())    
        return this.defineRoutes;
    }
    
}


// export default userRouter