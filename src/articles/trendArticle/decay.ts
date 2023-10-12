import "reflect-metadata";
import {container,injectable,inject} from 'tsyringe';
import {DatabaseService} from '../../db/databaseService';
import { DatabaseErrors } from "../../errors/database.errors";
import { permaLogger } from "../../utils/logger";
import {sanitizeHtml} from '../../utils/sanitizeHtml';

@injectable()
export class trendArticle {
    private databaseService;
    private threeMonthsAgo;
    private decay_factor;
    private sigmoind_midpoint;
    private weightMinimo = 100;
    constructor(@inject(DatabaseService) databaseService : DatabaseService) {
        this.databaseService = databaseService.getClient();
        this.decay_factor = 0.6; //que tan rapido cae, entre mas grande mas directo cae
        this.sigmoind_midpoint = 4; //dice cuando es que se muere el algoritmo, para cuando tendra el aprox decay_factor del valor
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
            // const weight = 1/Math.pow(1+ageInDays,this.powerLawFactor) *article.views;
            const weight = (article.views +250) / (1 + Math.exp(( this.sigmoind_midpoint - ageInDays ) * -this.decay_factor))
            weightedSum += weight * article.views; //la tengo para comparar algoritmos
            if (weight<=this.weightMinimo){
                continue;
            }
            try{

                const trend_article = await this.databaseService.trend_article.create({
                    data: {
                        articles_id_article:article.id_article,
                        author: article.writer.username,
                        image_url: article.image_url,
                        date: article.date,
                        views: article.views,
                        title: article.title,
                        text: article.text,
                        sanitizedText: sanitizeHtml(article.text),
                        weight: weight
                    }
                });
                
                if (!trend_article){
                    throw new DatabaseErrors('Algoritmo de peso fallo !!!');
                }
            }
            catch(err){
                permaLogger.log("error",{
                        articles_id_article:article.id_article,
                        author: article.writer.username,
                        image_url: article.image_url,
                        date: article.date,
                        views: article.views,
                        title: article.title,
                        weight: weight,
                        error: err
                    })
                return;                
            }
            
        }

        return weightedSum;
    }


}