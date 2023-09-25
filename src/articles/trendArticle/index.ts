import "reflect-metadata";
import {container,injectable,inject} from 'tsyringe';
import {schedule} from 'node-cron';
import {trendArticle} from './decay'
import { logger,permaLogger } from "../../utils/logger";


// schedule('*/1 * * * *', () => { //para probar
// schedule('* */8 * * *', () => {
//     permaLogger.log('info','hallando algoritmo de peso');
//     logger.log('info','hallando algoritmo de peso');
//     const trend = container.resolve(trendArticle);
//     trend.weightedSumOfViews().then(result => console.log(`suma de pesos: ${result}`));
// });


const trend = container.resolve(trendArticle);
trend.weightedSumOfViews().then(result => console.log(`suma de pesos: ${result}`));