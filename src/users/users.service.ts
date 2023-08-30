import { DatabaseService } from '../conectionDB/databaseService';
import { hashPassword, verifyHash} from '../utils/createHash'
import { logger, permaLogger } from '../utils/logger';
import { createUserSchema } from '../middleware/dataValidation/schemas'
import { PrivateUserService } from './private.user.service'
import { z } from 'zod';
import { createUserType } from '../types/user';
export class UsersService {
  constructor(private databaseService: DatabaseService) {
    
  }

  
  
  public async getUsersProfile(userId: string) {
    let userId2 = parseInt(userId, 10);
    //TODO: CAMBIAR ESTO, LA VALIDACION Y CASTEO DE DATOS VA EN UN MIDDLEWARE ACA NO
    return await this.databaseService.getClient().user.findFirst({ where: { id_user: userId2 } });
  }

  public async deleteUsers(userId: string) {
    let userId2 = parseInt(userId, 10);
    return await this.databaseService.getClient().user.delete({ where: { id_user: userId2 } });
  }

  public async addUsers(body:createUserType) {
    const hash = await hashPassword(body.password);
    logger.log("debug",hash);
    const userCreated = await this.databaseService.getClient().user.create({data:{name:body.name,lastname:body.lastname,username:body.username,hash:hash,rol:body.rol} });
    
    // logger.log("debug",userCreated)
    return { userId:userCreated.id_user,hash:userCreated.hash,rol:userCreated.rol }
    //return await verifyHash(password,hash) //PARA VERIFICAR SI LA CLAVE ES LA MISMA, TOCA SACAR LA CLAVE DE LA DB PRIMERO
  }
  
  public async checkPassword(user:number){
    
    return await this.databaseService.getClient().user.findUnique({where:{id_user: user} });
  }
  

}
