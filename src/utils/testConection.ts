import { injectable,inject,container } from "tsyringe";
import { DatabaseService } from "../db/databaseService";
import { logger,permaLogger } from "./logger";

const databaseService  = (container.resolve(DatabaseService)).getClient();
export const testConection = async () =>{
    try {
        await databaseService.$connect()
        await databaseService.$disconnect()
        return "funciona"
    } catch (error) {
        logger.log("error","ERROR FATAL, NO HAY DATABASE");
        permaLogger.log("error","ERROR FATAL, NO HAY DATABASE !!!!!");
        logger.log("error","NO FUNCIONARA");
        process.exit(1);
        return ;
    }
}