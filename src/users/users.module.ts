// import express, { NextFunction, Request, Response } from "express";
// const usersModule = express.Router();

// usersModule.get('/',function(req,res){
//     res.send("ayuda")
// })

// export default usersModule;

// user.module.ts
import { DatabaseService } from '../conectionDB/databaseService';
import { UserService } from './users.service';
import { UserController } from './users.controller';

export class UserModule {
    private userController: UserController;

    constructor() {
      const databaseService = new DatabaseService();
      const userService = new UserService(databaseService);
      this.userController = new UserController(userService);
  
      // Other wiring if needed
    }
  
    public getUserController(): UserController {
      return this.userController;
    }
  }