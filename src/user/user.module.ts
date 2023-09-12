import {DatabaseService} from '../db/databaseService';
import {UserService} from './user.service';
import {UserController} from './user.controller';
import {UserFacade} from './user.facade';

//puta: porque esta clase? que hace?
export class UserModule {
    private userController : UserController;

    constructor() {
		const databaseService = DatabaseService.getInstance();
		const userService = new UserService(databaseService);
        const userFacade = new UserFacade(userService)
        this.userController = new UserController(userFacade);


        // otra parametro instanciado
    }

    public getUserController(): UserController {
        return this.userController;
    }
}
