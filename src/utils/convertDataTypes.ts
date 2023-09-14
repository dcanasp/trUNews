import { Request, Response, NextFunction } from "express";
import { DateTime } from "luxon";
import { logger } from './logger';


export const convertDateFields = (fields: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
      fields.forEach((field) => { //por si hay multiples fechas en un post
        if (req.body[field]) { //si existe
            
            const luxonDateTime = DateTime.fromFormat(req.body[field], "yyyy-MM-dd'T'HH:mm:ss z" );
            if (!luxonDateTime.isValid) {
                // res.status(400).json({ error: `es una fecha invalida` });
                console.log("aaaaaaaaaaa")
            }
            console.log(luxonDateTime)
            const targetTimeZone = 'America/New_York'; // es la misma que nuestro aws
            // req.body[field] = luxonDateTime.setZone(targetTimeZone);
            console.log(req.body[field])
          
        }
      });
      next();
    };
  };

