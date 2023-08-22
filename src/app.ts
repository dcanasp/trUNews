//npm run tsc
//node build/routes.js

//npx prisma db pull
//npx prisma generate// app.ts
import express, { Express } from "express";
import cors from 'cors';
import { UsersController } from './users/users.controller';
import {logger} from './utils/logger'
import routes from "./routes";
export class App {
  private app: Express;

  constructor(private usersController: UsersController) {
    this.app = express();
    this.app.use(express.json());
    this.app.use(cors());
    // this.registerControllers();
    this.app.use(routes);//importa index por default

  }

  private registerControllers() {

  }

  public listen(port: number) {
    this.app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  }
}
