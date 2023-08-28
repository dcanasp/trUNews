// user.service.ts
import { DatabaseService } from '../conectionDB/databaseService';
import { hashPassword, verifyHash} from '../utils/createHash'
import { logger, permaLogger } from '../utils/logger';
import { createUserSchema } from '../middleware/dataValidation/schemas'

export class UsersService {
  constructor(private databaseService: DatabaseService) {}

  public async getUsersProfile(userId: string) {
    let userId2 = parseInt(userId, 10);
    //TODO: CAMBIAR ESTO, LA VALIDACION Y CASTEO DE DATOS VA EN UN MIDDLEWARE ACA NO
    return await this.databaseService.getClient().users.findFirst({ where: { id_users: userId2 } });
  }

  public async deleteUsers(userId: string) {
    let userId2 = parseInt(userId, 10);
    return await this.databaseService.getClient().users.delete({ where: { id_users: userId2 } });
  }

  public async addUsers(body:typeof createUserSchema|any) {
    const hash = await hashPassword(body.password);
    const userCreated = await this.databaseService.getClient().users.create({data:{name:body.name,hash:hash,rol:body.rol} });
    
    logger.log("debug",userCreated)
    return userCreated.id_users
    //return await verifyHash(password,hash) //PARA VERIFICAR SI LA CLAVE ES LA MISMA, TOCA SACAR LA CLAVE DE LA DB PRIMERO
  }

}
