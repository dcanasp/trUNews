import "reflect-metadata";
import {Request} from 'express';
import {injectable, inject} from 'tsyringe'
import {ArticleService} from './article.service';
import {DatabaseErrors} from '../errors/database.errors';
import { decryptToken } from "../auth/jwtServices";
import {returnArticles,returnArticlesCategory,returnArticlesFeed,returnArticlesCategory_id,createArticleType,addCategoriesType} from '../dto/article';
import {decryptedToken} from "../dto/user"
import {sanitizeHtml} from '../utils/sanitizeHtml';

@injectable()
export class ArticleFacade {
    constructor(@inject(ArticleService)private articleService : ArticleService) {

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

        const formattedGet: returnArticlesCategory[] = [article].map(({ writer, ...article }) => ({
            ...article,
            username: writer.username,
            name: writer.name,
            lastname: writer.lastname
          }));
        return formattedGet;
    }

    
    public async aiModel(req : Request) {
        const body:createArticleType = req.body;
        const sanitizedText = sanitizeHtml(body.text);
        const modelos = await this.articleService.fetchModels(sanitizedText);
        if(!modelos){
            
            return {err:true,titulos:['mejor titulo existente','segundo mejor titulo','tercero'],categorias:[{"label": "EDUCATION","score": 0.34894150495529175 },{"label": "BUSINESS","score": 0.3029727041721344},{"label": "POLITICS","score": 0.08930222690105438},]};
        }
        return modelos;
        
    }
    public async createArticle(req : Request) {
        const body:createArticleType = req.body;
        const sanitizedText = sanitizeHtml(body.text);

        const articleCreated = await this.articleService.createArticle(body,sanitizedText);
        if (! articleCreated) {
            return {"err": "No se pudo crear el articulo"};
            // throw new DatabaseErrors('No se pudo crear el articulo')
        }
        return {articleId: articleCreated.id_article, title: articleCreated.title};
    }

    public async createArticleCategories(body : addCategoriesType) {
        
        let categorias = body.categories; 
        if (!categorias){
            return {err:"No me envio categorias"};
        }
        
        
        const categoriesCreated = await this.articleService.createCategories(body.id_writer,body.article,categorias);
        if (! categoriesCreated) {
            return {err: "No se pudo añadir las categorias"};
        }
        return {succes:"true"};
    }

    public async deleteArticle(req : Request) {
        if(!req.headers['authorization']){
			return {"err": 'no hay token para el feed'};
		}
		const decryptedToken:decryptedToken|undefined = await  decryptToken(req.headers['authorization']);

        if(!decryptedToken){
			return {"err": 'token invalido'};
		}
        const userId = decryptedToken.userId;

        const articleId = req.params.id;
        if (!await this.articleService.deleteArticle(parseInt(articleId, 10),userId)) {
            return {"err": 'El artículo no existe o no se pudo eliminar'};
        }
        return {message: 'Artículo eliminado correctamente'};
    }


    public async findAllArticle() {
        const allArticles = await this.articleService.findAllArticle();
        if (! allArticles) {
            return {"err": 'no se encontraron articulos'}
        }

        const formattedFind: returnArticles[] = allArticles.map(({ writer, ...article }) => ({
            ...article,
            username: writer.username,
            name: writer.name,
            lastname: writer.lastname
          }));

        return formattedFind;


    }

    public async findArticle(req : Request) {
        const articles = await this.articleService.findArticle(req.params.nombre);
        if (! articles) {
            return {"err": 'no hay articulos con ese nombre'}
        }

        let formated_find: any[] = [];
        for (let article of articles) {
//todo: cambiar esto a el typo
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
		const decryptedToken:decryptedToken|undefined = await  decryptToken(req.headers['authorization']);

        if(!decryptedToken){
			return {"err": 'token invalido'};
		}
        const userId = decryptedToken.userId;

        let weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 20);

        
        const articlesFromFollowed = await this.articleService.articlesFromFollowed(userId,weekAgo);
        // console.log(articlesFromFollowed[0].article_has_categories[0].category);
        let flatArticlesFromFollower:returnArticlesFeed[] =[];
        if(articlesFromFollowed){  
            flatArticlesFromFollower = articlesFromFollowed.map(({ article_has_categories, ...rest }) => ({
                ...rest,
                article_has_categories: article_has_categories,
            }));
            // flatArticlesFromFollower = articlesFromFollowed;
        }

        let flatArticlesFromCateogries:returnArticlesFeed[] =[];
        let flatArticlesFromSaved:returnArticlesFeed[] =[];
        
        if(articlesFromFollowed!=undefined){
            const articlesFromCateogries  = await this.articleService.articlesFromCateogries(articlesFromFollowed);
            if (articlesFromCateogries){
                flatArticlesFromCateogries = articlesFromCateogries.map(({ article_has_categories, ...rest }) => ({
                    ...rest,
                    article_has_categories: article_has_categories,
                }));;
            }
            //este tendra un nuevo tipo de dato, toca crearlo
            const articlesFromSaved = await this.articleService.articlesFromSaved(userId,weekAgo);
            if(articlesFromSaved){
                flatArticlesFromSaved = articlesFromSaved;
            }
        }
        		
        const feed = [...flatArticlesFromFollower, ...flatArticlesFromCateogries, ...flatArticlesFromSaved];

        if (! feed || feed.length<=10) {
            const latest = await this.articleService.getLatestFeed(15);
            if (! latest){
                return {"err": 'no hay feed ni articulos nuevos'};
            }
            
            const formattedLatest: returnArticlesFeed[] = latest.map(({writer,...article}) => ({
                ...article,
                 username: writer.username,
                 name: writer.name,
                 lastname: writer.lastname,
                 profile_image: writer.profile_image,
                 saved:false,
                 article_has_categories: article.article_has_categories
             }));
            if(feed!=undefined){
                return this.shuffleArray([...feed,...formattedLatest]);
            }
            return this.shuffleArray([formattedLatest]);
        }

        return this.shuffleArray(feed);
    }

	public async related(req : Request) {
		const articleId = req.params.id
        //TODO: pasar a 2 funciones lo de abajo
		const related = await this.articleService.related(parseInt(articleId));
		if (! related || !related[0]) {
		    return {"err": 'no se pudieron sacar relacionados'};
		}
        const formattedrelated = related.map(({ writer, ...article }) => ({
            ...article,
            username: writer?.username,
            name: writer?.name,
            lastname: writer?.lastname,
          })) as returnArticles[];
          

		return this.shuffleArray(formattedrelated);
    }


	private async shuffleArray(array: any[]){
		for (let i = array.length - 1; i > 0; i--) {
		  const j = Math.floor(Math.random() * (i + 1));
		  [array[i], array[j]] = [array[j], array[i]];
		}
		return array;
	  }
    public async isSaved(req: Request) {
        if(!req.headers['authorization']){
			return {"err": 'no hay token para el feed'};
		}
		const decryptedToken:decryptedToken|undefined = await  decryptToken(req.headers['authorization']);

        if(!decryptedToken){
			return {"err": 'token invalido'};
		}

        const { articleId } = req.params;
        const isSaved = await this.articleService.isSaved(decryptedToken.userId, parseInt(articleId, 10));
        
        if(!isSaved){
            return false;
        }
        return isSaved;
    }


    public async saveArticle(req: Request) {
        if(!req.headers['authorization']){
			return {"err": 'no hay token para el feed'};
		}
		const decryptedToken:decryptedToken|undefined = await  decryptToken(req.headers['authorization']);

        if(!decryptedToken){
			return {"err": 'token invalido'};
		}
        
        const { articleId } = req.params;

        return await this.articleService.saveArticle(decryptedToken.userId, parseInt(articleId, 10));
    }

    public async unsaveArticle(req: Request) {
        if(!req.headers['authorization']){
			return {"err": 'no hay token para el feed'};
		}
		const decryptedToken:decryptedToken|undefined = await  decryptToken(req.headers['authorization']);

        if(!decryptedToken){
			return {"err": 'token invalido'};
		}
        const { articleId } = req.params;

        return await this.articleService.unsaveArticle(decryptedToken.userId, parseInt(articleId, 10));
      }
      
    public async getSavedArticles(req: Request) {
        const userId = req.params.userId;
        return await this.articleService.getSavedArticles(parseInt(userId,10));
    }

    public async getArticlesByCategory(req: Request) {
        const { categoryId } = req.params;
        const articles = await this.articleService.getArticlesByCategory(categoryId);
        return articles;
    }
    
    public async getCategories(req: Request) {
        const categories = await this.articleService.getCategories();
        return categories;
    }

    public async getCategoryById(req: Request) {
        const { categoryId } = req.params;
        const category = await this.articleService.getCategoryById(categoryId);
        return category;
    }

    public async getQr(req: Request) {
        const url  = req.query.url;
        //@ts-ignore
        const qrCode = await this.articleService.getQr(url);
        if(!qrCode){
            return {"err":"no se pudo crear el codigo Qr"};
        }
        return {"qr":qrCode};
    }


    public async test(req: Request) {
        const broker = await this.articleService.test();

        return {"test":broker};
    }

}
