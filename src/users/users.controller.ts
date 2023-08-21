// user.controller.ts
import { UserService } from './users.service';

export class UserController {
  constructor(private userService: UserService) {}

  public getUserProfile(req:any, res:any) {
    const userId = req.params.id;
    this.userService.getUserProfile(userId)
      .then(profile => res.json(profile))
      .catch(err => res.status(400).json(err));
  }

  public deleteUser(req:any, res:any) {
    const userId = req.params.id;
    this.userService.deleteUser(userId)
      .then(() => res.json({ message: 'User deleted successfully' }))
      .catch(err => res.status(400).json(err));
  }

  // aca iran todas las rutas
}
