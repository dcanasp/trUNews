import { DatabaseService } from '../conectionDB/databaseService';
import { checkPasswordSchema } from '../middleware/dataValidation/schemas'
export class PrivateUserService{

    constructor(private databaseService: DatabaseService) {}

    private async getPassword(user:string){
    return await this.databaseService.getClient().users.findUnique({where:{username: user} });
    }

    public async checkPassword(body:typeof checkPasswordSchema|any ){
        this.getPassword(body.username) 
        
        return
    }
}