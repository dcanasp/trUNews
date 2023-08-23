import { hash,verify } from "argon2";
import { logger, permaLogger } from "./logger";

export async function hashPassword(password:string): Promise<string>{
    permaLogger.log("debug",await hash(password))
    return await hash(password);
    //TODO errores y guardarlos en permaLog
} 
export async function verifyHash(password:string, hash:string): Promise<boolean> {

    if (await verify(hash,password)) {
        return true
    } else {
        return false
    }
}