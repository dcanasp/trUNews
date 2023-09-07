import {z} from 'zod';
import {DatabaseService} from '../db/databaseService';
import {hashPassword, verifyHash} from '../utils/createHash'
import {logger, permaLogger} from '../utils/logger';
import {redoToken} from '../auth/jwtServices';
import {chechPasswordType} from '../dto/user';
import {createUserType, addImageType} from '../dto/user';
import {DatabaseErrors} from '../errors/database.errors'
import { uploadToS3 } from '../aws/addS3'
export class UserService {
    constructor(private databaseService : DatabaseService) {
    }

    public async getUsersProfile(userId : string) {
        let userId2 = parseInt(userId, 10);
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

public async addImage(body: addImageType){
    try {
    const ultimo = await this.databaseService.getClient().image.findMany({
        orderBy: {
            id_image: 'desc',
        },
        take: 1,
    });
    const imageBuffer = Buffer.from(body.contenido.split(',')[1], 'base64');
    //debe ser un buffer el contenido
    const ultimo_usuario = (ultimo[0].id_image +1).toString()
    const extension = '.png'
    
    const url = await uploadToS3((ultimo_usuario+extension),imageBuffer)//body.contenido);
    permaLogger.log('debug',imageBuffer)
    if (!url){
        throw new DatabaseErrors('no se pudo subir a s3');
    }
    //crear nuevo registro
    const crear = await this.databaseService.getClient().image.create({
        data:{"base":process.env.S3_url + ultimo_usuario + extension,
            // "nombre_archivo": body.nombreArchivo 
        }
    })
    return crear.base
    } catch (error) {
        return ;
    }
}

}
