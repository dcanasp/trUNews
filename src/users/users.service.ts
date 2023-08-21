// user.service.ts
import { DatabaseService } from '../conectionDB/databaseService';

export class UserService {
  constructor(private databaseService: DatabaseService) {}

  public async getUserProfile(userId: string) {
    let userId2 = parseInt(userId, 10);
    //TODO: CAMBIAR ESTO, LA VALIDACION Y CASTEO DE DATOS VA EN UN MIDDLEWARE ACA NO
    return await this.databaseService.getClient().users.findFirst({ where: { id_users: userId2 } });
  }

  public async deleteUser(userId: number) {
    return await this.databaseService.getClient().users.delete({ where: { id_users: userId } });
  }

  // Other user-related methods
}
