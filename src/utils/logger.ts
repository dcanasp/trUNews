import { createLogger, transports, format } from "winston"

export const logger = createLogger({
  format: format.json(),
  transports: [
    new transports.Console({
      level: "debug",
    }),
    new transports.Console({
      level: "error",
    }),
  ],
});
    
  
export const permaLogger = createLogger({
  format: format.json(),
  //logger method...
  transports: [
    new transports.File({
      filename: "logs/error.log",
      level: "error",
      maxsize: 5000000,
      maxFiles: 2,
    }),
    new transports.File({
      filename: "logs/debug.log",
      level: "debug",
      maxsize: 5000000,
      maxFiles: 2,
    }),
    new transports.File({
      filename: "logs/request.log",
      level: "info",
      maxsize: 5000000,
      maxFiles: 2,
    }),
  ],
  });


  