import { permaLogger } from "../utils/logger";

export class DatabaseErrors extends Error {
    constructor(message: string) {
        super(message);
        permaLogger.log('error', message);
    }
}


