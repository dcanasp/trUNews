import { DatabaseService } from '../conectionDB/databaseService';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrivateUserService } from './private.user.service';

export class UserModule {
    private usersController: UsersController;

    constructor() {
      const databaseService = new DatabaseService();
      const userService = new UsersService(databaseService);
      const privateUserService = new PrivateUserService(databaseService)
      this.usersController = new UsersController(userService,privateUserService);
  
      // otra parametro instanciado
    }
  
    public getUserController(): UsersController {
      return this.usersController;
    }
  }