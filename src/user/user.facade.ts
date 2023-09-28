import "reflect-metadata";
import {Request} from 'express'
import {logger, permaLogger} from '../utils/logger'
import {createUserType, chechPasswordType, decryptJWT,imageType} from '../dto/user';
import { DatabaseErrors } from '../errors/database.errors';
import {injectable,inject} from 'tsyringe'
import { UserService } from './user.service'

@injectable()
export class UserFacade {
    constructor(@inject(UserService) private userService: UserService) {
    }

    public async getUsersProfile(req : Request) {

        const userId = req.params.id;
        const user = await this.userService.getUsersProfile(userId)
		if (!user){
            return false
		}
        const returnableUser:Partial<typeof user> = user 
		delete returnableUser.hash
        return returnableUser
        // return await this.databaseService.getClient().user.findFirst({ where: { id_user: userId2 } });
    }

    public async deleteUsers(req : Request) {

        const userId = req.params.id;
        if(! await this.userService.deleteUsers(parseInt(userId, 10)) ){
			return {"err":'no existe usuario! o no esta permitido eliminarlo'}
		}
        return {"message": "usuario eliminado correctamente!"}
    }

    public async addUsers(body : createUserType) { // const userCreated = await this.databaseService.getClient().user.create({data:{name:body.name,lastname:body.lastname,username:body.username,hash:hash,rol:body.rol} });
        const userCreated = await this.userService.addUsers(body)
		if (!userCreated){
			throw new DatabaseErrors('no se pudo crear el usuario')
		}
        return {userId: userCreated.id_user, rol: userCreated.rol}

    }

    public async checkPassword(body : chechPasswordType) {
        const checkPassword = await this.userService.checkPassword(body);
		if(! checkPassword ){
			return {"err":'usuario no existe'}
		}
		return {"success": checkPassword[0], "token": checkPassword[1]}

    }

    public async decryptJWT(body : decryptJWT) {
        const decripted = await this.userService.decryptJWT(body);
		if(! decripted ){
			return {"err":'el token ha fallado,es invalido o ha expirado'}
		}
		return {"userId":decripted["userId"],"rol":decripted["rol"]}

    }


    public async findAllUser() {
        const allUser = await this.userService.findAllUser();
		if(! allUser ){
			return {"err":'no se encontraron usuarios'}
		}
		return {allUser}

    }

    public async findUser(req: Request) {
        const users = await this.userService.findUser(req.params.nombre);
		if(! users ){
			return {"err":'no hay usuarios con ese nombre'}
		}
		return {users}

    }

    //TODO: pasar a perfil

    public async updateProfile(req: Request, body: createUserType) {
        const userId = req.params.id;
        
        const existingUser = await this.userService.getUsersProfile(userId);

        if (!existingUser) {
            return { error: 'El usuario no existe' };
        }

        const updatedUser = await this.userService.updateProfile(userId, body);

        return updatedUser;
    }
    
    
    public async updatePassword(userId: string, username: string, currentPassword: string, newPassword: string) {
        // Verifica la contraseña actual del usuario

        const checkPasswordResult = await this.userService.checkPassword({
            username: username,
            password: currentPassword,
        });
        if (!checkPasswordResult) {
            return { error: 'Contraseña actual incorrecta' };
        }

        const updatedUser = await this.userService.updatePassword(userId, newPassword);

        return { success: 'Contraseña actualizada correctamente', user: updatedUser };

    }

    public async tryImage(body:imageType) {
        // Verifica la contraseña actual del usuario

        const newImage = await this.userService.tryImage(body);
        if (!newImage) {
            return { error: 'no se pudo cortar la imagen' };
        }


        return { image: newImage};

    }


    //TODO: pasar a perfil fin

    public async allTrending(req: Request) {
        const trending = await this.userService.allTrending()
        if (!trending) {
          return { "err": 'no se pudieron traer Ultimos articulos' };
        }
        return trending;
      }
      
      
      public async trending(req: Request) {
        const cantidadArticulos = req.params.quantity;
        const trending = await this.userService.trending(parseInt(cantidadArticulos,10))
        if (!trending) {
          return { "err": 'no se pudieron traer Ultimos articulos' };
        }
        return trending;
      }
    
      public async followUser(userIdToFollow: string, currentUserId: string) {
        try {
            await this.userService.followUser(currentUserId, userIdToFollow);

            return { message: 'Ahora sigues a este usuario' };
        } catch (error) {
            throw new DatabaseErrors('Error al seguir al usuario');
        }
    }

    public async unfollowUser(userIdToUnfollow: string, currentUserId: string) {
        try {
            await this.userService.unfollowUser(currentUserId, userIdToUnfollow);

            return { message: 'Dejaste de seguir a este usuario' };
        } catch (error) {
            throw new DatabaseErrors('Error al dejar de seguir al usuario');
        }
    }

    public async getFollowers(userId: string) {
        try{
            const followers = await this.userService.getFollowers(userId);
            return followers;
        }
        catch (error) {
            throw new Error('Error al obtener los seguidores');
        }
    }

    public async getFollowing(userId: string) {
        try{
            const following =  await this.userService.getFollowing(userId);
            return following;  
        }
        catch (error) {
            throw new Error('Error al obtener a quiénes sigue el usuario');
        }
    }
    // public async addImage(body:any){
    //     const urlS3 =await this.userService.addImage(body);
    //     if(!urlS3){
    //         return{'err':'no se pudo subir a S3'}
    //     }
    //     return {"url":urlS3}
    // }
  
}
