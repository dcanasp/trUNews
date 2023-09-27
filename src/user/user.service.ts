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




}
