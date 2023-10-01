import "reflect-metadata";
import {container,injectable,inject} from 'tsyringe';
import {schedule} from 'node-cron';
import { logger,permaLogger } from "../../utils/logger";
import { trendAuthor } from "./create";


// schedule('*/1 * * * *', () => { //para probar
// schedule('* */8 * * *', () => {
//     permaLogger.log('info','hallando algoritmo de peso');
//     logger.log('info','hallando algoritmo de peso');
// });


const trend = container.resolve(trendAuthor);
trend.create().then(result => console.log("funciona usuarios tendencia"));