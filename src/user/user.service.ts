import { injectable,inject } from 'tsyringe'
import {hashPassword, verifyHash} from '../utils/createHash'
import {logger, permaLogger} from '../utils/logger';
import {redoToken, verifyJwt, decryptToken} from '../auth/jwtServices';
import {chechPasswordType, decryptJWT, imageType} from '../dto/user';
import {createUserType} from '../dto/user';
import {DatabaseErrors} from '../errors/database.errors'
import {DatabaseService} from '../db/databaseService';
import {resizeImages, convertBase64} from '../utils/resizeImages';
import {uploadToS3} from '../aws/addS3'

@injectable()
export class UserService {
    private databaseService
    constructor(@inject(DatabaseService) databaseService: DatabaseService) {
        this.databaseService = databaseService.getClient()
    }

    public async getUsersProfile(userId: number, authUserId: number) {
    
        const user = await this.databaseService.users.findFirst({
          where: {
            id_user: userId,
          },
        });
    
        if (!user) {
          throw new Error('Usuario no encontrado');
        }
    
        const followersCount = await this.databaseService.follower.count({
          where: {
            id_following: userId,
          },
        });
    
        const followingsCount = await this.databaseService.follower.count({
          where: {
            id_follower: userId,
          },
        });
        const savedArticles = await this.databaseService.saved.findMany({
            where: {
                id_user: userId,
            },
            select: {
                article: {
                    select: {
                        id_article: true,
                        title: true,
                        date: true,
                        image_url: true,
                        text: true,
                        writer: {
                            select: {
                                id_user: true,
                                username: true,
                            },
                        },
                    },
                },
            },
        });

        const isFollowing = await this.isUserFollowing(userId,authUserId);
        if (user.rol === 1) {
          const articlesByUser = await this.databaseService.article.findMany({
            where: {
              id_writer: userId,
            },
            select: {
              id_article: true,
              title: true,
              image_url: true,
            },
          });
    
          return {
            ...user,
            followersCount,
            followingsCount,
            isFollowing,
            articlesByUser,
            savedArticles
          };
        }
    
        return {
          ...user,
          followersCount,
          followingsCount,
          isFollowing,
          savedArticles
        };
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
                rol: body.rol,
                profile_image: 'https://trunews.s3.us-east-2.amazonaws.com/profile/defaultProfile.jpg'
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
            const token = redoToken({"userId": User.id_user, "rol": User.rol});
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
            const usuario = await this.databaseService.users.findMany({
                include:{followers:true,followings:true}
            });
            const sumaFollowers = await this.databaseService.follower.groupBy({
                by: ['id_follower', 'id_following'],
                _count: {
                  id_follower: true,
                  id_following: true,
                },
              });

            if (! usuario || !sumaFollowers || usuario.length==0 || sumaFollowers.length==0) {
                throw new DatabaseErrors('no hay usuarios');
            }

            return {"usuario": usuario, "follower": sumaFollowers};
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
                include:{followers:true,followings:true}
                ,orderBy:{
                        rol:'asc'
                    }
              });
            
              const sumaFollowers = await this.databaseService.follower.groupBy({
                by: ['id_follower', 'id_following'],
                _count: {
                  id_follower: true,
                  id_following: true,
                },
              });

            if (! usuario || usuario.length==0 || !sumaFollowers) {
                throw new DatabaseErrors('no hay usuarios con ese nombre');
            }
            return {"usuario": usuario, "follower": sumaFollowers};
        }catch{
            return;
        }

    }
    //TODO: pasar a perfil

    public async updateProfile(userId: number, updatedProfileData: Partial<createUserType>) {
        try {
    
            const existingUser = await this.databaseService.users.findFirst({
                where: {
                    id_user: userId,
                },
            });
    
            if (!existingUser) {
                throw new DatabaseErrors('El usuario no existe');
            }
            
            const updatedUser = await this.databaseService.users.update({
                where: {
                    id_user: userId,
                },
                data: {
                    name: updatedProfileData.name || existingUser.name,
                    lastname: updatedProfileData.lastname || existingUser.lastname,
                    username: updatedProfileData.username || existingUser.username,
                    rol: updatedProfileData.rol || existingUser.rol,
                    profession: updatedProfileData.profession || existingUser.profession,
                    description: updatedProfileData.description || existingUser.description,
                    profile_image: updatedProfileData.profile_image || existingUser.profile_image,
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

    public async addImage(contenido: string, extension:string) {
        try {
            const ultimo = await this.databaseService.article.findMany({
                orderBy: {
                    id_article: 'desc'
                },
                take: 1
            });
            const folder = 'profile';
            // const imageBuffer = contenido;
            const imageBuffer = Buffer.from(contenido.split(',')[1], 'base64');
            // debe ser un buffer el contenido
            let ultimo_usuario = (1).toString()
            if (ultimo[0]) {
                ultimo_usuario = (ultimo[0].id_article + 1).toString()
            }

            const link = process.env.S3_url
            const file_name = (ultimo_usuario + extension)
            
            // const resizedImageBuffer = await resizeImages(imageBuffer,ancho,ratio);

            const url = await uploadToS3(file_name, imageBuffer,folder) // body.contenido);
            if (! url) {
                throw new DatabaseErrors('no se pudo subir a s3');
            }
            // crear nuevo registro
            return `${link}${folder}/${file_name}`;
        } catch (error) {
            return;
        }
    }

    public async allTrending(){
        try {
            const trendUsers = await this.databaseService.trend_author.findMany({
                orderBy: {
                  weight: 'desc'
                },
            });
            if (! trendUsers || trendUsers.length==0) {
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
            if (! trendUsers || trendUsers.length==0) {
                throw new DatabaseErrors('no se encontraron articulos tendencia de cantidad dada');
            }
              return trendUsers;

        } catch (error) {
            return ;
        }

    }

    public async isUserFollowing(userId: number, targetUserId: number) {
        const follower = await this.databaseService.follower.findFirst({
            where: {
                id_follower: userId,
                id_following:targetUserId,
            },
        });

        return !!follower;
    }

    public async followUser(userId: number, userIdToFollow: number) {
        try {
            const user = await this.databaseService.users.findUnique({
                where: {
                    id_user: userId,
                },
            });

            if (!user) {
                throw new DatabaseErrors('El usuario no existe');
            }

            const userToFollow = await this.databaseService.users.findUnique({
                where: {
                    id_user: userIdToFollow,
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

    public async unfollowUser(userId: number, userIdToUnfollow: number) {
        try {
            const user = await this.databaseService.users.findUnique({
                where: {
                    id_user: userId,
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
                    id_user: userIdToUnfollow,
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
                            name: true,
                            lastname: true,
                            rol: true,
                            profile_image: true,
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
                            name: true,
                            lastname: true,
                            rol: true,
                            profile_image: true,
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
