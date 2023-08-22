// import express, { NextFunction, Request, Response } from "express";
// const usersModule = express.Router();

// usersModule.get('/',function(req,res){
//     res.send("ayuda")
// })

// export default usersModule;

// user.module.ts
import { DatabaseService } from '../conectionDB/databaseService';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

export class UserModule {
    private usersController: UsersController;

    constructor() {
      const databaseService = new DatabaseService();
      const userService = new UsersService(databaseService);
      this.usersController = new UsersController(userService);
  
      // Other wiring if needed
    }
  
    public getUserController(): UsersController {
      return this.usersController;
    }
  }