import { injectable,inject } from 'tsyringe'
import {hashPassword, verifyHash} from '../utils/createHash'
import {logger, permaLogger} from '../utils/logger';
import {redoToken, verifyJwt, decryptToken} from '../auth/jwtServices';
import {chechPasswordType, decryptJWT, imageType} from '../dto/user';
import {createUserType} from '../dto/user';
import {DatabaseErrors} from '../errors/database.errors'
import {DatabaseService} from '../db/databaseService';
import {resizeImages, convertBase64} from '../utils/resizeImages';

@injectable()
export class UserService {
    private databaseService
    constructor(@inject(DatabaseService) databaseService: DatabaseService) {
        this.databaseService = databaseService.getClient()
    }

    public async getUsersProfile(userId : string) {
        let userId2 = parseInt(userId, 10);
        const user = await this.databaseService.users.findFirst({
            where: {
                id_user: userId2
            }
        })
        return user
    }

    public async deleteUsers(userId : number) {

        return await this.databaseService.users.delete({
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
        const userCreated = await this.databaseService.users.create({
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
        const usuario = await this.databaseService.users.findUnique({
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
            const usuario = await this.databaseService.users.findUnique({
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

    public async findAllUser(){
        try {
            
            const usuario = await this.databaseService.users.findMany({});
            if (! usuario) {
                throw new DatabaseErrors('no hay usuarios');
            }
            return usuario;
        } catch {
            return;
        }}

    public async findUser(nombre:string){
        try{
            const usuario = await this.databaseService.users.findMany({
                where: {
                  OR: [
                    {
                      name: {
                        contains: nombre,
                        mode: 'insensitive',
                      }
                    },
                    {
                      lastname: {
                        contains: nombre,
                        mode: 'insensitive',
                      }
                    },
                    {
                        username: {
                          contains: nombre,
                          mode: 'insensitive',
                        }
                      }
                  ]
                },
                select: {
                  id_user: true,
                  name: true,
                  lastname: true,
                  username: true,
                  rol: true,
                },
                orderBy:{
                        rol:'asc'
                    }
              });
            if (! usuario || !usuario[0]) {
                throw new DatabaseErrors('no hay usuarios con ese nombre');
            }
            return usuario;
        }catch{
            return;
        }

    }
    //TODO: pasar a perfil

    public async updateProfile(userId: string, updatedProfileData: Partial<createUserType>) {
        try {
            const userId2 = parseInt(userId, 10);
    
            const existingUser = await this.databaseService.users.findFirst({
                where: {
                    id_user: userId2,
                },
            });
    
            if (!existingUser) {
                throw new DatabaseErrors('El usuario no existe');
            }
    
            const updatedUser = await this.databaseService.users.update({
                where: {
                    id_user: userId2,
                },
                data: {
                    name: updatedProfileData.name || existingUser.name,
                    lastname: updatedProfileData.lastname || existingUser.lastname,
                    username: updatedProfileData.username || existingUser.username,
                    rol: updatedProfileData.rol || existingUser.rol,
                    profession: updatedProfileData.profession || existingUser.profession,
                    description: updatedProfileData.description || existingUser.description,
                    image_url: updatedProfileData.image_url || existingUser.image_url,
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
        const existingUser = await this.databaseService.users.findFirst({
            where: {
                id_user: userId2,
            },
        });

        if (!existingUser) {
            throw new DatabaseErrors('El usuario no existe');
        }

        const newHashedPassword = await hashPassword(newPassword);

        const updatedUser = await this.databaseService.users.update({
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

    public async tryImage(body:imageType){
        try{

            const imageBuffer = Buffer.from(body.contenido.split(',')[1], 'base64');
            const resizedImageBuffer = await resizeImages(imageBuffer,body.width,body.ratio);
        if(!resizedImageBuffer){
            throw new DatabaseErrors(' NO se pudo re cortar la imagen')
        }
        const base64Imagen =await convertBase64(resizedImageBuffer);
        if(!base64Imagen){
            throw new DatabaseErrors(' NO se pasar a base 64 la imagen ')
        }
        return base64Imagen;
        }
        catch{
            return;
        }
    }
    

    //TODO: pasar a perfil fin

    public async allTrending(){
        try {
            const trendUsers = await this.databaseService.trend_author.findMany({
                orderBy: {
                  weight: 'desc'
                },
            });
            if (! trendUsers) {
                throw new DatabaseErrors('no se encontraron usuarios tendencia');
            }
              return trendUsers;

        } catch (error) {
            return ;
        }

    }

    public async trending(quantity:number){
        try {
            const trendUsers = await this.databaseService.trend_author.findMany({
                take: quantity,
                orderBy: {
                  weight: 'desc'
                },
              });
            if (! trendUsers) {
                throw new DatabaseErrors('no se encontraron articulos tendencia de cantidad dada');
            }
              return trendUsers;

        } catch (error) {
            return ;
        }

    }

    public async isUserFollowing(userId: string, targetUserId: string) {
        const follower = await this.databaseService.follower.findFirst({
            where: {
                id_follower: parseInt(userId, 10),
                id_following: parseInt(targetUserId, 10),
            },
        });

        return !!follower;
    }

    public async followUser(userId: string, userIdToFollow: string) {
        try {
            const user = await this.databaseService.users.findUnique({
                where: {
                    id_user: parseInt(userId, 10),
                },
            });

            if (!user) {
                throw new DatabaseErrors('El usuario no existe');
            }

            const userToFollow = await this.databaseService.users.findUnique({
                where: {
                    id_user: parseInt(userIdToFollow, 10),
                },
            });

            if (!userToFollow) {
                throw new DatabaseErrors('El usuario a seguir no existe');
            }

            if (await this.isUserFollowing(userId, userIdToFollow)) {
                throw new DatabaseErrors('Ya sigues a este usuario');
            }

            await this.databaseService.follower.create({
                data: {
                    id_follower: user.id_user,
                    id_following: userToFollow.id_user,
                },
            });

            return { message: 'Usuario seguido exitosamente' };
        } catch (error) {
            throw new DatabaseErrors('Error al seguir al usuario');
        }
    }

    public async unfollowUser(userId: string, userIdToUnfollow: string) {
        try {
            const user = await this.databaseService.users.findUnique({
                where: {
                    id_user: parseInt(userId, 10),
                },
            });

            if (!user) {
                throw new DatabaseErrors('El usuario no existe');
            }
            if (!await this.isUserFollowing(userId, userIdToUnfollow)) {
                throw new DatabaseErrors('No sigues a este usuario');
            }
            const userToUnfollow = await this.databaseService.users.findUnique({
                where: {
                    id_user: parseInt(userIdToUnfollow, 10),
                },
            });

            if (!userToUnfollow) {
                throw new DatabaseErrors('El usuario a dejar de seguir no existe');
            }

            await this.databaseService.follower.deleteMany({
                where: {
                    id_follower: user.id_user,
                    id_following: userToUnfollow.id_user,
                },
            });

            return { message: 'Usuario dejado de seguir exitosamente' };
        } catch (error) {
            throw new DatabaseErrors('Error al dejar de seguir al usuario');
        }
    }

    public async getFollowers(userId: string) {
        try {
            const userId2 = parseInt(userId, 10);
            const followers = await this.databaseService.follower.findMany({
                where: {
                    id_following: userId2,
                },
                select: {
                    follower: {
                        select: {
                            id_user: true,
                            username: true,
                            image_url: true,
                        },
                    },
                },
            });

            return followers.map((follower) => follower.follower);
        } catch (error) {
            throw new Error('Error al obtener los seguidores');
        }
    }

    public async getFollowing(userId: string) {
        try {
            const userId2 = parseInt(userId, 10);
            const following = await this.databaseService.follower.findMany({
                where: {
                    id_follower: userId2,
                },
                select: {
                    following: {
                        select: {
                            id_user: true,
                            username: true,
                            image_url: true,
                        },
                    },
                },
            });

            return following.map((follow) => follow.following);
        } catch (error) {
            throw new Error('Error al obtener a quiénes sigue el usuario');
        }
    }




}
