import { UsersService } from './users.service';
import {logger, permaLogger} from '../utils/logger';

export class UsersController {
  constructor(private usersService: UsersService) {}

  public getUsersProfile(req:any, res:any) {
    const userId = req.params.id;

    this.usersService.getUsersProfile(userId)
      .then(profile => res.json(profile))
      .catch(err => res.status(400).json(err));
  }

  public deleteUsers(req:any, res:any) {
    const userId = req.params.id;
    this.usersService.deleteUsers(userId)
      .then(() => res.json({ message: 'User deleted successfully' }))
      .catch(err => res.status(400).json(err));
  }

  public addUsers(req:any,res:any,next:any){
    // const token = res.locals.token;
    // permaLogger.log("debug",token)
    this.usersService.addUsers(req.body)
    .then(userId => {
      logger.log("debug",userId)
      res.locals.newUser = userId; // save user in res.locals to pass to next middleware
      next();})
    .catch(err => res.status(400).json(err));
  }

  // aca iran todas las rutas
}
