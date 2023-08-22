//npm run tsc
//node build/routes.js

//npx prisma db pull
//npx prisma generate// app.ts
import express, { Express } from "express";
import cors from 'cors';
import { UsersController } from './users/users.controller';

export class App {
  private app: Express;

  constructor(private usersController: UsersController) {
    this.app = express();
    this.app.use(express.json());
    this.app.use(cors());
    this.registerControllers();
  }

  private registerControllers() {
    this.app.get('/users/:id', (req, res) => this.usersController.getUsersProfile(req, res));
    this.app.post('/users/create', (req,res)=> this.usersController.addUsers(req,res)); //añadir middleware, pero pues bien, preguntar si toca cambiarla  
    this.app.delete('/users/:id', (req, res) => this.usersController.deleteUsers(req, res));
  
  }

  public listen(port: number) {
    this.app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  }
}
