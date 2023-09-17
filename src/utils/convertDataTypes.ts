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