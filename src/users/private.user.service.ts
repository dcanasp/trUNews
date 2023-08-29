import { DatabaseService } from '../conectionDB/databaseService';
import { checkPasswordSchema } from '../middleware/dataValidation/schemas'
import { verifyHash } from '../utils/createHash';
import { permaLogger } from '../utils/logger';
export class PrivateUserService{

    constructor(private databaseService: DatabaseService) {}

    private async getPassword(user:string){
        const usuario = await this.databaseService.getClient().users.findUnique({where:{username: user} })  ;
        if (usuario){
            return usuario.hash
        }
        permaLogger.log("debug","no hay usuario")
        throw Error("no hay usuario")
    }

    public async checkPassword(body:typeof checkPasswordSchema|any ){
        
        const hash= await this.getPassword(body.username); 
        verifyHash(body.password,hash)
        return
    }
}