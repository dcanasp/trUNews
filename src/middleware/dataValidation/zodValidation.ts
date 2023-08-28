import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import { logger } from "../../utils/logger";
export const validatePost = (schema: ZodSchema<any>) => {
    return (req: Request, res: Response, next: NextFunction) => {
      try {
        schema.parse(req.body);
        logger.log("debug",req.body);
        next();
      } catch (error:any) {
        res.status(400).json({ error: error.message });
      }
    };
  };


  