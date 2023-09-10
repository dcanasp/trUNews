import { DatabaseService } from '../db/databaseService'
import { UserService } from '../user/user.service';
export class ServiceRegistry {
    static databaseService = DatabaseService.getInstance();
    
    static userService = new UserService(ServiceRegistry.databaseService);

}

//para que los modulos puedan hablar entre si, todos llaman al registro y ese les da lo que quieren