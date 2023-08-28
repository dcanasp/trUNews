import { Request, Response, NextFunction } from "express";
import { logger } from './logger';

export const convertDateFields = (fields: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
      fields.forEach((field) => { //por si hay multiples fechas en un post
        if (req.body[field]) { //si existe
          req.body[field] = new Date(req.body[field]); //guarde en los parametros
          if (isNaN(req.body[field].getTime())) { //da el tiempo desde unix 
            res.status(400).json({ error: `es una fecha invalida` });
            return;
          }
        }
      });
      next();
    };
  };

  export const convertStringToInt = () => {
    return (req: Request, res: Response, next: NextFunction) => {
    if (req.params.id) { //si existe
        
        try {
            req.body.prueba = parseInt(req.params.id, 10); //guarde en los parametros
            
        } catch (error) {
            res.status(400).json({ error: `es una fecha invalida` });
            return;
        }
    }
    next();
    
    };
  };
