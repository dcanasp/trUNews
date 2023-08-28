import winston,{ createLogger, transports, format } from "winston"

export const logger = winston.createLogger({
      level: "debug",
      format: winston.format.json(),
      transports: [new winston.transports.Console()],
    });
    
  
export const permaLogger = createLogger({
    level: "debug",
    format: format.json(),
    //logger method...
    transports: [
      //new transports:
      new transports.File({
        filename: "logs/request.log",
      }),
    ],
    //...
  });