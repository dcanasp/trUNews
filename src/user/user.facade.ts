import {Request} from 'express'
import {UserService} from './user.service';
import {logger, permaLogger} from '../utils/logger'
import {createUserType, chechPasswordType} from '../dto/user';
import { DatabaseErrors } from '../errors/database.errors';
export class UserFacade {
    constructor(private usersService : UserService) {}

    public async getUsersProfile(req : Request) {

        const userId = req.params.id;
        const user = await this.usersService.getUsersProfile(userId)
		if (!user){
            return false
		}
		//@ts-ignore
		delete user.hash
        return user
        // TODO: CAMBIAR ESTO, LA VALIDACION Y CASTEO DE DATOS VA EN UN MIDDLEWARE ACA NO
        // return await this.databaseService.getClient().user.findFirst({ where: { id_user: userId2 } });
    }

    public async deleteUsers(req : Request) {

        const userId = req.params.id;
        if(! await this.usersService.deleteUsers(parseInt(userId, 10)) ){
			return {"err":'no existe usuario! o no esta permitido eliminarlo'}
		}
        return {"message": "usuario eliminado correctamente!"}
    }

    public async addUsers(body : createUserType) { // const userCreated = await this.databaseService.getClient().user.create({data:{name:body.name,lastname:body.lastname,username:body.username,hash:hash,rol:body.rol} });
        const userCreated = await this.usersService.addUsers(body)
		if (!userCreated){
			throw new DatabaseErrors('')
			// return{value:'credenciales de username ya usadas',error: new DatabaseErrors('')};
		}
        return {userId: userCreated.id_user, rol: userCreated.rol}

    }

    public async checkPassword(body : chechPasswordType) {
        const checkPassword = await this.usersService.checkPassword(body);
		if(! checkPassword ){
			return {"err":'usuario ya no existe'}
		}
		return {"success": checkPassword[0], "token": checkPassword[1]}

    }

    // public async addImage(body:any){
    //     const urlS3 =await this.usersService.addImage(body);
    //     if(!urlS3){
    //         return{'err':'no se pudo subir a S3'}
    //     }
    //     return {"url":urlS3}
    // }
  
}
