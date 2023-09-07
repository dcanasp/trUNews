import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from "express";
import { logger, permaLogger } from '../utils/logger';
import { redoTokenType } from '../dto/user';

const secret = process.env.JWT_SECRET!;

export const generateJwt = (req: Request, res: Response, next: NextFunction) => {
    const { userId, hash, rol } = res.locals.newUser;
    const token = jwt.sign({ userId: userId, hash: hash, rol:rol }, secret , { expiresIn: '72h' });
    res.locals.token = token;
    permaLogger.log('debug',res.locals.token)
    next();
  };



export const verifyJwt = (req: any, res: Response, next: NextFunction) => {
    const token = req.headers['authorization'];
    // logger.log('debug',token)
    if (!token) return res.status(403).send({ auth: false, message: 'No token provided.' });

    jwt.verify(token, secret , (err: any, decoded: any) => {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    
    if (parseInt(req.params.id, 10) !== decoded.userId) {
        return res.status(403).send({ auth: false, message: 'User ID mismatch.' });
        }
    
        // roles pero no esta implementado hasta ver como es que se va a hacer bien
        //TODO: implementacion roles 
        // if (decoded.role !== 1) {
        // return res.status(403).send({ auth: false, message: 'Unauthorized role.' });
        // }
    
    // logger.log('debug',decoded)
    req.userId = decoded.userId;//pss no lo estoy usando pero ahi viene el token abierto
    next();
  });
};


export const redoToken = (data:redoTokenType) =>{
  const token = jwt.sign({ userId: data.userId, hash: data.hash, rol:data.rol }, secret , { expiresIn: '72h' });
  permaLogger.log('debug',token);
  return token;
}