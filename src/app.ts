//npm run tsc
//node build/routes.js

//npx prisma db pull
//npx prisma generate// app.ts
import express, { Express } from "express";
import cors from 'cors';
import {logger} from './utils/logger'
import {routes} from "./routes";
import { swaggerUi,specs } from "./swagger/swagger";
export class App {
  private app: Express;

  constructor() {
    this.app = express();
    this.app.use(express.json()); //para que el post sea un json
    this.app.use(cors());
    // this.registerControllers();
    this.app.use("/api-docs",swaggerUi.serve,swaggerUi.setup(specs));
  
    this.app.use(routes);//importa index por default
    // crearRutas(this.app)
  }


  public listen(port: number) {
    this.app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  }
}
