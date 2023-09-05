import { z } from 'zod';
import { DatabaseService } from '../db/databaseService';
import { hashPassword, verifyHash} from '../utils/createHash'
import { logger, permaLogger } from '../utils/logger';
import { createUserSchema, checkPasswordSchema } from '../middleware/dataValidation/schemas'
import { redoToken } from '../auth/jwtServices';
import { chechPasswordType } from '../dto/user';
import { createUserType } from '../dto/user';
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
  
  private async getUserByUsername(user:string){
        const usuario = await this.databaseService.getClient().user.findUnique({where:{username: user} })  ;
        if (usuario){
            return usuario
        }
        permaLogger.log("error","no hay usuario")
        throw Error("no hay usuario")
    }

    public async checkPassword(body: chechPasswordType ){
        let success = false;
        const User = await this.getUserByUsername(body.username); 
        const hash = User.hash

        if ( await verifyHash(body.password,hash) ){
            success = true;
        }
        return {"success":success,"token":redoToken({"userId": User.id_user,"hash":hash,"rol":User.rol})}
    }

}
