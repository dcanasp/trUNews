import jwt from 'jsonwebtoken';
import {Request, Response, NextFunction} from "express";
import {logger, permaLogger} from '../utils/logger';
import {redoTokenType} from '../dto/user';
import {Roles} from '../utils/roleDefinition';
import {decryptedToken} from '../dto/user'

const secret = process.env.JWT_SECRET !;

export const generateJwt = (req : Request, res : Response, next : NextFunction) => {
    const {userId, hash, rol} = res.locals.newUser;
    const token = jwt.sign({
        userId: userId,
        hash: hash,
        rol: rol
    }, secret, {expiresIn: '72h'});
    res.locals.token = token;
    permaLogger.log('debug', res.locals.token)
    next();
};


export const verifyJwt = (rol? : number) => {
    return(req : any, res : Response, next : NextFunction) => {
        const token = req.headers['authorization'];
        // logger.log('debug',token)
        if (! token) 
            return res.status(403).send({auth: false, message: 'No token provided.'});
        

        jwt.verify(token, secret, (err : any, decoded : any) => {
            if (err) 
                return res.status(500).send({auth: false, message: 'Token expirado o error servidor'});
            


            if (parseInt(req.params.id, 10) !== decoded.userId) {
                return res.status(403).send({auth: false, message: 'User ID mismatch.'});
            }
			//si no le mande rol, puede ser cualquiera y salta este, si es admin se va
            if (rol && decoded.rol !== rol && decoded.rol !== Roles.admin) { 
                return res.status(403).send({auth: false, message: 'Unauthorized role.'});
            }

            // logger.log('debug',decoded)
            req.userId = decoded.userId; // pss no lo estoy usando pero ahi viene el token abierto
            next();
        });
    };
};

export const verifyJwtPost = (param: string) => {
    return(req : any, res : Response, next : NextFunction) => {
        const token = req.headers['authorization'];
        if (! token) 
            return res.status(403).send({auth: false, message: 'No token provided.'});
        jwt.verify(token, secret, (err : any, decoded : any) => {
            if (err) 
                return res.status(500).send({auth: false, message: 'Token expirado o error servidor'});

            if (parseInt(req.body[param], 10) !== decoded.userId) {
                console.log(req.body[param])
                return res.status(403).send({auth: false, message: 'User ID mismatch.'});
            }
            req.userId = decoded.userId; // pss no lo estoy usando pero ahi viene el token abierto
            next();
        });
    };
};


export const redoToken = (data : redoTokenType) => {
    const token = jwt.sign({
        userId: data.userId,
        rol: data.rol
    }, secret, {expiresIn: '72h'});
    permaLogger.log('debug', token);
    return token;
}


export const decryptToken = async (token:string) : Promise<decryptedToken|undefined> =>{
    let decriptedToken;
    const response = await jwt.verify(token, secret, (err : any, decoded : any) => {
        if (!err){
            decriptedToken = decoded
        } 
    })
    return  decriptedToken;
}