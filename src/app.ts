//npm run tsc
//node build/routes.js

//npx prisma db pull
//npx prisma generate// app.ts
import express, { Express } from "express";
import cors from 'cors';
import { UserController } from './users/users.controller';

export class App {
  private app: Express;

  constructor(private userController: UserController) {
    this.app = express();
    this.app.use(express.json());
    this.app.use(cors());
    this.registerControllers();
  }

  private registerControllers() {
    this.app.get('/user/:id', (req, res) => this.userController.getUserProfile(req, res));
    this.app.delete('/user/:id', (req, res) => this.userController.deleteUser(req, res));
    // Other routes
  }

  public listen(port: number) {
    this.app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  }
}
