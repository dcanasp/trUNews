// user.service.ts
import { DatabaseService } from '../conectionDB/databaseService';

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

  public async addUsers(name1: string) {

    return await this.databaseService.getClient().users.create({data:{name:"prueba",hash:"fd",rol:1} });
  }

  // Other user-related methods
}
