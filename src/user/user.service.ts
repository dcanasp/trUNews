import {z} from 'zod';
import {hashPassword, verifyHash} from '../utils/createHash'
import {logger, permaLogger} from '../utils/logger';
import {redoToken} from '../auth/jwtServices';
import {chechPasswordType} from '../dto/user';
import {createUserType} from '../dto/user';
import {DatabaseErrors} from '../errors/database.errors'
import { injectable,inject } from 'tsyringe'
import {container} from "tsyringe";
import {DatabaseService} from '../db/databaseService';


const databaseService = (container.resolve(DatabaseService)).getClient();
@injectable()
export class UserService {
    private databaseService;
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
}
