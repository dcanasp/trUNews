import "reflect-metadata";
import {Request} from 'express';
import {injectable, inject} from 'tsyringe'
import {ArticleService} from './article.service';
import {DatabaseErrors} from '../errors/database.errors';
import { decryptToken } from "../auth/jwtServices";

@injectable()
export class ArticleFacade {
    private articleService;
    constructor(@inject(ArticleService)articleService : ArticleService) {
        this.articleService = articleService
    }

    public async getArticles(req : Request) {
        try {
            const articles = await this.articleService.getArticles();
            return articles;
        } catch (error) {
            throw new DatabaseErrors('Error al obtener los artículos de la base de datos');
        }
    }

    public async getArticleById(req : Request) {
        const articleId = req.params.id;
        const article = await this.articleService.getArticleById(parseInt(articleId, 10));
        if (! article) {
            return {"err": 'El artículo no existe'};
        }
        return article;
    }

    public async createArticle(req : Request) {
        const articleCreated = await this.articleService.createArticle(req.body);
        if (! articleCreated) {
            return {"err": "No se pudo crear el articulo"}
            // throw new DatabaseErrors('No se pudo crear el articulo')
        }
        return {articleId: articleCreated.id_article, title: articleCreated.title}
    }


    public async deleteArticle(req : Request) {
        const articleId = req.params.id;
        if (!await this.articleService.deleteArticle(parseInt(articleId, 10))) {
            return {"err": 'El artículo no existe o no se pudo eliminar'};
        }
        return {message: 'Artículo eliminado correctamente'};
    }


    public async findAllArticle() {
        const allArticles = await this.articleService.findAllArticle();
        if (! allArticles) {
            return {"err": 'no se encontraron articulos'}
        }

        // let formated_find:  Partial<typeof allArticles> &{ id_article: number,id_writer: number } [] = [];
        let formated_find: any[] = [];


        for (let article of allArticles) {

            formated_find.push({
                id_article: article.id_article,
                id_writer: article.id_writer,
                title: article.title,
                date: article.date,
                views: article.views,
                image_url: article.image_url,
                username: article.writer.username,
                name: article.writer.name
            })

        }
        return formated_find


    }

    public async findArticle(req : Request) {
        const articles = await this.articleService.findArticle(req.params.nombre);
        if (! articles) {
            return {"err": 'no hay articulos con ese nombre'}
        }

        let formated_find: any[] = [];
        for (let article of articles) {

            formated_find.push({
                id_article: article.id_article,
                id_writer: article.id_writer,
                title: article.title,
                date: article.date,
                views: article.views,
                image_url: article.image_url,
                username: article.writer.username,
                name: article.writer.name,
				category: article.article_has_categories
            })

        }
        return formated_find


    }

    public async getLatest(req : Request) {
        const cantidadNoticias = req.params.quantity;
        const latest = await this.articleService.getLatest(parseInt(cantidadNoticias, 10))
        if (! latest) {
            return {"err": 'no se pudieron traer Ultimos articulos'};
        }
        const now = new Date();
        let formated_latest: any[] = [];
		// select: {
		// 	date: true,
		// 	image_url: true,
		// 	title: true
		//   }
        for (let article of latest) {
            const ageInDays = (now.getTime() - new Date(article.date).getTime()) / (1000 * 60 * 60 * 24);
            let formated_date;
            if (ageInDays < 1) {
                formated_date = "Today";
            } else {
                formated_date = `Created ${
                    Math.floor(ageInDays)
                } days ago`;
            }; 
			formated_latest.push({article_id:article.id_article,date: formated_date, image_url: article.image_url, title: article.title});
		
        }


        return formated_latest;
    }

    public async allTrending(req : Request) {
        const trending = await this.articleService.allTrending()
        if (! trending) {
            return {"err": 'no se pudieron traer Ultimos articulos'};
        }
        return trending;
    }


    public async trending(req : Request) {
        const cantidadArticulos = req.params.quantity;
        const trending = await this.articleService.trending(parseInt(cantidadArticulos, 10))
        if (! trending) {
            return {"err": 'no se pudieron traer Ultimos articulos'};
        }
        return trending;
    }


	public async feed(req : Request) {
		if(!req.headers['authorization']){
			return {"err": 'no hay token para el feed'};
		}

		const decryptedToken = decryptToken(req.headers['authorization'])
		if(!decryptedToken){
			return {"err": 'token invalido'};
		}
		//@ts-ignore
		const feed = await this.articleService.feed(decryptedToken.userId);
		if (! feed || !feed[0]) {
		    return {"err": 'no hay feed'};
		}
		return this.shuffleArray(feed);
    }

	public async related(req : Request) {
		const articleId = req.params.id
		const related = await this.articleService.related(parseInt(articleId));
		if (! related || !related[0]) {
		    return {"err": 'no se pudieron sacar relacionados'};
		}
		return this.shuffleArray(related);
    }


	private async shuffleArray(array: any[]){
		for (let i = array.length - 1; i > 0; i--) {
		  const j = Math.floor(Math.random() * (i + 1));
		  [array[i], array[j]] = [array[j], array[i]];
		}
		return array;
	  }
    
    public async saveArticle(req: Request) {
        if(!req.headers['authorization']){
			return {"err": 'no hay token'};
		}

		const decryptedToken = decryptToken(req.headers['authorization'])
		if(!decryptedToken){
			return {"err": 'token invalido'};
		}
        
        const { articleId } = req.params;
		//@ts-ignore
        return await this.articleService.saveArticle(decryptedToken.userId, parseInt(articleId, 10));
    }

    public async unsaveArticle(req: Request) {
        if (!req.headers['authorization']) {
          return { "err": 'no hay token' };
        }
      
        const decryptedToken = decryptToken(req.headers['authorization']);
        if (!decryptedToken) {
          return { "err": 'token invalido' };
        }
      
        const { articleId } = req.params;
        //@ts-ignore
        return await this.articleService.unsaveArticle(decryptedToken.userId, parseInt(articleId, 10));
      }
      
    public async getSavedArticles(req: Request) {
        const userId = req.params.userId;
        console.log(userId);
        return await this.articleService.getSavedArticles(parseInt(userId,10));
    }

    public async getArticlesByCategory(req: Request) {
        const { categoryId } = req.params;
        const articles = await this.articleService.getArticlesByCategory(categoryId);
        return articles;
      }
}
