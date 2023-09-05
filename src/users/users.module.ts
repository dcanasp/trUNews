import { DatabaseService } from '../db/databaseService';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

export class UserModule {
    private usersController: UsersController;

    constructor() {
      const databaseService = new DatabaseService();
      const userService = new UsersService(databaseService);
      this.usersController = new UsersController(userService);
  
      // otra parametro instanciado
    }
  
    public getUserController(): UsersController {
      return this.usersController;
    }
  }