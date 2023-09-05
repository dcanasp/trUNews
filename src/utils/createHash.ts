import {DatabaseErrors} from '../errors/database.errors'
import { hash,verify } from "argon2";
import { logger, permaLogger } from "./logger";

export async function hashPassword(password:string): Promise<string>{
    
    try {
        const hashPassword = await hash(password);
        return hashPassword;
        
    } catch (error:any) {
        throw new DatabaseErrors(error.message)
    }

} 
export async function verifyHash(password:string, hash:string): Promise<boolean> {

    if (await verify(hash,password)) {
        return true;
    } else {
        return false;
    }
}