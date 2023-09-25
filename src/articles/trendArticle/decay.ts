import "reflect-metadata";
import {container,injectable,inject} from 'tsyringe';
import {DatabaseService} from '../../db/databaseService';
import { PrismaClient } from '@prisma/client';
import { DatabaseErrors } from "../../errors/database.errors";
import { permaLogger } from "../../utils/logger";

@injectable()
export class trendArticle {
    private databaseService;
    private threeMonthsAgo;
    private decayFactor;
    private powerLawFactor;
    constructor(@inject(DatabaseService) databaseService : DatabaseService) {
        this.databaseService = databaseService.getClient();
        this.decayFactor = 0.1; 
        this.powerLawFactor = 5;
        this.threeMonthsAgo = new Date();
        this.threeMonthsAgo.setMonth(this.threeMonthsAgo.getMonth() - 3);
    }

    public async weightedSumOfViews() {
        try {
            const deleteTrend = await this.databaseService.trend_article.deleteMany({});//elimina todo lo que hay
            if(!deleteTrend){
                throw new DatabaseErrors('no se pudo eliminar la tabla tendencia articulos');
            }
        } catch (error) {
            return;
        }
        // Fetch articles from the last 3 months
        const articles = await this.databaseService.article.findMany({
          where: {
            date: {
              gte: this.threeMonthsAgo,
            },
          },
          include:{ writer:true},
        });

        
        const now = new Date();
        let weightedSum = 0;
        for (const article of articles) {
            const ageInDays = (now.getTime() - article.date.getTime()) / (1000 * 60 * 60 * 24); //pasar unix a dias, divido en 1000 para que quede siempre menor a 0
            // const weight = Math.exp(-this.decayFactor * ageInDays) * article.views;
            const weight = 1/Math.pow(1+ageInDays,this.powerLawFactor) *article.views;
            weightedSum += weight * article.views; //la tengo para comparar algoritmos
            
            try{

                const trend_article = await this.databaseService.trend_article.create({
                    data: {
                        articles_id_article:article.id_article,
                        author: article.writer.username,
                        image_url: article.image_url,
                        date: article.date,
                        views: article.views,
                        title: article.title,
                        weight: weight
                    }
                });

                if (!trend_article){
                    throw new DatabaseErrors('Algoritmo de peso fallo !!!');
                }
            }
            catch{
                permaLogger.log("error",{
                        articles_id_article:article.id_article,
                        author: article.writer.username,
                        image_url: article.image_url,
                        date: article.date,
                        views: article.views,
                        title: article.title,
                        weight: weight
                    })
                return;                
            }
            
        }

        return weightedSum;
    }


}