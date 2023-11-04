import express, { Express, Request, Response ,NextFunction } from "express";
import cors from 'cors';
import helmet from "helmet";
import {routes} from "./routes";
import { swaggerUi} from "./utils/swagger/swagger";
import {logger,permaLogger} from './utils/logger'
import { rateLimiter } from './utils/rateLimiter';
import { testConection } from './utils/testConection'

const fs = require('fs'); 
const rawdata = fs.readFileSync('./swagger-output.json');
const swaggerDocument = JSON.parse(rawdata);

export class App  {
  private app: Express;

  constructor() {
    this.app = express();
    
    this.app.use(express.json({limit: '50mb'})); //para que el post sea un json
    this.app.use(cors());
    this.app.use(helmet());
    this.app.use( rateLimiter );
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    
    testConection()
    
    this.loggerMiddleware()
    
    this.app.use(routes);//importa index por default
    
  }
  
  public listen(port: number) {
    this.app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
    return this.app
  }

  public loggerMiddleware(){
    this.app.use( 
      (req: Request, res: Response, next: NextFunction) => {   
          this.logRequest(req)
          next()} )
        }
  public logRequest(req: Request){
    let logData = {
        method: req.method,
        url: req.url,
        headers: req.headers,
        body: req.body,
    }
    if (req.body && req.body.password) {
        logData.body = 'Datos sencibles fueron eliminados de logs';
      } 
    
    permaLogger.log("info", { logData });
  }


}
