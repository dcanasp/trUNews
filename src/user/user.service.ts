import {z} from 'zod';
import {DatabaseService} from '../db/databaseService';
import {hashPassword, verifyHash} from '../utils/createHash'
import {logger, permaLogger} from '../utils/logger';
import {redoToken} from '../auth/jwtServices';
import {chechPasswordType} from '../dto/user';
import {createUserType} from '../dto/user';
import {DatabaseErrors} from '../errors/database.errors'
export class UserService {
    constructor(private databaseService : DatabaseService) {
    }

    public async getUsersProfile(userId : string) {
        let userId2 = parseInt(userId, 10);
        // TODO: CAMBIAR ESTO, LA VALIDACION Y CASTEO DE DATOS VA EN UN MIDDLEWARE ACA NO
        const user = await this.databaseService.getClient().user.findFirst({
            where: {
                id_user: userId2
            }
        })
        return user
    }

    public async deleteUsers(userId : number) {

        return await this.databaseService.getClient().user.delete({
            where: {
                id_user: userId
            }
        }).catch((err) => {
            return ;
        });

    }

    public async addUsers(body : createUserType) {
        const hash = await hashPassword(body.password);
        const userCreated = await this.databaseService.getClient().user.create({
            data: {
                name: body.name,
                lastname: body.lastname,
                username: body.username,
                hash: hash,
                rol: body.rol
            }
        }).catch((err) => {
            return ;
        }) ;
        // logger.log("info", userCreated)
        return userCreated
    }

    public async checkPassword(body : chechPasswordType) {
        try {
            const User = ( await this.getUserByUsername(body.username) );
            const hash = User.hash
            const success = await verifyHash(body.password, hash)
            const token = redoToken({"userId": User.id_user, "hash": hash, "rol": User.rol})
            return [success, token];
        } catch (err) {
            return ;
        }

    }

    private async getUserByUsername(user : string) {
        const usuario = await this.databaseService.getClient().user.findUnique({
            where: {
                username: user
            }
        });
        if (usuario) {
            return usuario
        }
        throw new DatabaseErrors('no hay usuario con ese nombre')
        
    }


}
