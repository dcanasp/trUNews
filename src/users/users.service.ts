// user.service.ts
import { DatabaseService } from '../conectionDB/databaseService';
import { hashPassword, verifyHash} from '../utils/createHash'
import { logger } from '../utils/logger';

export class UsersService {
  constructor(private databaseService: DatabaseService) {}

  public async getUsersProfile(userId: string) {
    let userId2 = parseInt(userId, 10);
    //TODO: CAMBIAR ESTO, LA VALIDACION Y CASTEO DE DATOS VA EN UN MIDDLEWARE ACA NO
    return true
    // return await this.databaseService.getClient().users.findFirst({ where: { id_users: userId2 } });
  }

  public async deleteUsers(userId: string) {
    let userId2 = parseInt(userId, 10);
    return await this.databaseService.getClient().users.delete({ where: { id_users: userId2 } });
  }

  public async addUsers(name1: string,password: string) {
    let hash = await hashPassword(password);
    return await this.databaseService.getClient().users.create({data:{name:"prueba",hash:hash,rol:1} });
    //return await verifyHash(password,hash) //PARA VERIFICAR SI LA CLAVE ES LA MISMA, TOCA SACAR LA CLAVE DE LA DB PRIMERO
  }

  // Other user-related methods
}
