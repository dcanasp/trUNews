import {z} from 'zod';
import {hashPassword, verifyHash} from '../utils/createHash'
import {logger, permaLogger} from '../utils/logger';
import {redoToken, verifyJwt, decryptToken} from '../auth/jwtServices';
import {chechPasswordType, decryptJWT} from '../dto/user';
import {createUserType} from '../dto/user';
import {DatabaseErrors} from '../errors/database.errors'
import { injectable,inject } from 'tsyringe'
import {container} from "tsyringe";
import {DatabaseService} from '../db/databaseService';


@injectable()
export class UserService {
    private databaseService
    constructor(@inject(DatabaseService) databaseService: DatabaseService) {
        this.databaseService = databaseService.getClient()
    }

    public async getUsersProfile(userId : string) {
        let userId2 = parseInt(userId, 10);
        const user = await this.databaseService.user.findFirst({
            where: {
                id_user: userId2
            }
        })
        return user
    }

    public async deleteUsers(userId : number) {

        return await this.databaseService.user.delete({
            where: {
                id_user: userId
            }
        }).catch((err) => {
            try {
                throw new DatabaseErrors(err)
            }
            catch(err2){
                return ;
            }
        });

    }

    public async addUsers(body : createUserType) {
        const hash = await hashPassword(body.password);
        const userCreated = await this.databaseService.user.create({
            data: {
                name: body.name,
                lastname: body.lastname,
                username: body.username,
                hash: hash,
                rol: body.rol
            }
        }).catch((err) => {
            return;
        });
        // logger.log("info", userCreated)
        return userCreated
    }

    public async checkPassword(body : chechPasswordType) {
        try {
            const User = (await this.getUserByUsername(body.username));
            const hash = User.hash;
            const success = await verifyHash(body.password, hash);
            if (!success){throw new DatabaseErrors('se pudo regenerar el jwt')}
            const token = redoToken({"userId": User.id_user, "hash": hash, "rol": User.rol});
            return [success, token];
        } catch (err) {
            return;
        }

    }

    private async getUserByUsername(user : string) {
        const usuario = await this.databaseService.user.findUnique({
            where: {
                username: user
            }
        });
        if (usuario) {
            return usuario;
        }
        throw new DatabaseErrors('no hay usuario con ese nombre');

    }


    public async getUserById(user_id : number) {
        try {
            const usuario = await this.databaseService.user.findUnique({
                where: {
                    id_user: user_id
                }
            });
            if (! usuario) {
                throw new DatabaseErrors('no hay usuario con ese nombre o su rol es escritor');
            }
            return usuario;
        } catch {
            return;
        }}


    public async decryptJWT(body:decryptJWT){
        return await decryptToken(body.token)

    }

    public async updateProfile(userId: string, updatedProfileData: Partial<createUserType>) {
        try {
            const userId2 = parseInt(userId, 10);
    
            const existingUser = await this.databaseService.user.findFirst({
                where: {
                    id_user: userId2,
                },
            });
    
            if (!existingUser) {
                throw new DatabaseErrors('El usuario no existe');
            }
    
            const updatedUser = await this.databaseService.user.update({
                where: {
                    id_user: userId2,
                },
                data: {
                    name: updatedProfileData.name || existingUser.name,
                    lastname: updatedProfileData.lastname || existingUser.lastname,
                    username: updatedProfileData.username || existingUser.username,
                    rol: updatedProfileData.rol || existingUser.rol,
                },
            });
    
            return updatedUser;
        } catch (err) {
            throw new DatabaseErrors('Error al actualizar el perfil del usuario');
        }
    }

public async updatePassword(userId: string, newPassword: string) {
    try {
        const userId2 = parseInt(userId, 10);

        const existingUser = await this.databaseService.user.findFirst({
            where: {
                id_user: userId2,
            },
        });

        if (!existingUser) {
            throw new DatabaseErrors('El usuario no existe');
        }

        const newHashedPassword = await hashPassword(newPassword);

        const updatedUser = await this.databaseService.user.update({
            where: {
                id_user: userId2,
            },
            data: {
                hash: newHashedPassword,
            },
        });

        return updatedUser;
    } catch (err) {
        throw new DatabaseErrors('Error al actualizar la contraseña del usuario');
    }
}

}
