import { DatabaseService } from '../conectionDB/databaseService';
import { checkPasswordSchema } from '../middleware/dataValidation/schemas'
import { redoToken } from '../auth/jwtServices';
import { verifyHash } from '../utils/createHash';
import { permaLogger } from '../utils/logger';
import { chechPasswordType } from '../types/user';
export class PrivateUserService{

    constructor(private databaseService: DatabaseService) {}

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

        if ( await verifyHash(body.password,hash) == true ){
            success = true;
        }
        return {"success":success,"token":redoToken({"userId": User.id_user,"hash":hash,"rol":User.rol})}
    }
}