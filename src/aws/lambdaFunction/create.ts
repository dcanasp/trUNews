import "reflect-metadata";
import {container,injectable,inject} from 'tsyringe';
import {DatabaseService} from './databaseService';


@injectable()
export class trendAuthor {
    private databaseService;
    constructor(@inject(DatabaseService) databaseService : DatabaseService) {
        this.databaseService = databaseService.getClient();    
    }

    public async create(){
        try {
            const deleteTrend = await this.databaseService.trend_author.deleteMany({});//elimina todo lo que hay
            const addedWeight = await this.databaseService.trend_article.groupBy({
                by: ['author'],
                _sum: {
                  weight: true,
                },
              })

            if(!addedWeight){
                console.log('no se pudo sumar los pesos');
                throw new Error();
            }

            for (const article of addedWeight){
                // addedWeight[0]._sum.weight
                const userWeighted = await this.databaseService.users.findUnique({
                    where:{username:article.author}
                })
                if(!userWeighted){
                    continue;
                }
                let weight = article._sum.weight ?? 0;
                const crearTrend = await this.databaseService.trend_author.create({
                    data:{
                        users_id_user:userWeighted.id_user,
                        name:userWeighted.name,
                        lastname:userWeighted.lastname,
                        profession: userWeighted.profession ??='',
                        username: userWeighted.username,
                        profile_image: userWeighted.profile_image,
                        weight: weight
                    }
                    
                })
            }
        } catch (error) {
            return;
        }



    }

}
