import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import { logger, permaLogger } from "../../utils/logger";
export const validatePost = (schema: ZodSchema<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
      try {
        schema.parse(req.body);
        next();
      } catch (error:any) {
        logger.log("error",error)
        permaLogger.log("error",error)
        res.status(400).json({ error: error.message });
      }
    };
  };


  