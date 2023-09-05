import express, { Express, Request, Response ,NextFunction } from "express";
import cors from 'cors';
import helmet from "helmet";
import {permaLogger} from './utils/logger'
import {routes} from "./routes";
import { swaggerUi,specs } from "./utils/swagger/swagger";
export class App {
  private app: Express;

  constructor() {
    this.app = express();
    this.app.use(express.json()); //para que el post sea un json
    this.app.use(cors());
    this.app.use(helmet());
    this.app.use("/api-docs",swaggerUi.serve,swaggerUi.setup(specs));
  
    //no deberia
    // this.registerControllers();
    this.app.use(routes);//importa index por default
    this.loggerMiddleware()
    
  }


  public listen(port: number) {
    this.app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  }

  public loggerMiddleware(){
    this.app.use( 
      (req: Request, res: Response, next: NextFunction) => { 
      this.logRequest(req)
      next()} )
  }
  public logRequest(req: Request){
      permaLogger.log("request", {
      method: req.method,
      url: req.url,
      headers: req.headers,
      body: req.body,
    });
  }


}
