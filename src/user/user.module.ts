import {DatabaseService} from '../db/databaseService';
import {UserService} from './user.service';
import {UserController} from './user.controller';
import {UserFacade} from './user.facade';

export class UserModule {
    private userController : UserController;

    constructor() {
		const databaseService = new DatabaseService();
		const userService = new UserService(databaseService);
        const userFacade = new UserFacade(userService)
        this.userController = new UserController(userFacade);


        // otra parametro instanciado
    }

    public getUserController(): UserController {
        return this.userController;
    }
}
