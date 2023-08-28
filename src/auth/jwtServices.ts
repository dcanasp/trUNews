import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from "express";
import { logger } from '../utils/logger';

export const generateJwt = (req: Request, res: Response, next: NextFunction) => {
  // You might pull these values from `req.body` or database
    const { userId, password, rol } = req.body;
    logger.log('debug',req.body)
    
    const token = jwt.sign({ userId: userId, hash: password, rol:rol }, 'yourSecretKey', { expiresIn: '1h' });
    res.locals.token = token;
    next();
  };



export const verifyJwt = (req: any, res: Response, next: NextFunction) => {
    const token = req.headers['authorization'];
    logger.log("debug",token)
    if (!token) return res.status(403).send({ auth: false, message: 'No token provided.' });

    jwt.verify(token, 'yourSecretKey', (err: any, decoded: any) => {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    logger.log("debug",decoded)
    req.userId = decoded.userId;//pss no lo estoy usando pero ahi viene el token abierto
    next();
  });
};
