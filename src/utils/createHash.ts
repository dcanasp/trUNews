import { hash,verify } from "argon2";
import { logger, permaLogger } from "./logger";

export async function hashPassword(password:string): Promise<string>{
    
    try {
        const hashPassword = await hash(password);
        return hashPassword;
        
    } catch (error) {
        permaLogger.log("debug",error);
        return "fail";
    }

} 
export async function verifyHash(password:string, hash:string): Promise<boolean> {

    if (await verify(hash,password)) {
        return true;
    } else {
        return false;
    }
}