import {Request} from 'express'
import {UserService} from './user.service';
import {logger, permaLogger} from '../utils/logger'
import {createUserType, chechPasswordType} from '../dto/user';
import { DatabaseErrors } from '../errors/database.errors';
import { injectable } from 'tsyringe'

@injectable()
export class UserFacade {
    constructor() {}

    public async getUsersProfile() {
        console.log('dentro de la segunda');
    }
  
}
