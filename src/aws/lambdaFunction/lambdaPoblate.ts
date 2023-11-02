import "reflect-metadata";
import {container} from 'tsyringe';
import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import {DatabaseService} from './databaseService';
import { hash } from "argon2";
import {sanitizeHtml} from './sanitizeHtml';
const database = container.resolve(DatabaseService).getClient();

const numberOfEntries = 20;

export async function hashPassword(password:string): Promise<string>{
    
    try {
        const hashPassword = await hash(password);
        return hashPassword;
    } catch (error:any) {
        console.log(error)
        return '';
    }

} 

console.log('funcion principal');
exports.main = async function (){
    console.log("entra a main");
    await crearUsuarios(database);
    console.log("crar usuarios funcion");
    await crearArticulos(database);
    await crearFollowers(database);
    await crearSaved(database);
    console.log("hasta saved");
    await crearArticleHasCategories(database);
    await crearCommunityHasArticle(database);
    await crearCommunityHasUsers(database);
}



async function crearUsuarios(databaseService: PrismaClient) {
    for (let i = 0; i < numberOfEntries; i++) {
        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();
        const username = faker.internet.displayName({ firstName, lastName });
        const hash = await hashPassword("password");

        const rol = Math.floor(Math.random() * 2)+1;
        const profession = Math.random() < 0.5 ? faker.person.jobTitle() : null; // 50% que sea nulo
        const description = Math.random() < 0.5 ? faker.lorem.sentence() : null; // 50% que sea nulo
        const profile_image = 'https://trunews.s3.us-east-2.amazonaws.com/profile/defaultProfile.jpg';
        console.log("antes de crear usuarios");
        await databaseService.users.create({
        data: {
            name: firstName,
            lastname: lastName,
            username,
            hash,
            rol,
            profession,
            description,
            profile_image
        }
        }).catch((err:any) => {
        console.error("Error creating user: ", err);
        });
    }
}


async function crearArticulos(databaseService: PrismaClient) {
    const numberOfEntriesArticle = numberOfEntries*3;  
    const allUserIds = await databaseService.users.findMany({
      where:{
        rol:1
      },
      select: {
        id_user: true
      }
    });
    
    for (let i = 0; i < numberOfEntriesArticle; i++) {
      const randomIndex = Math.floor(Math.random() * allUserIds.length);
      const id_writer = allUserIds[randomIndex].id_user;
  
      const title = faker.lorem.sentence();
      const date = faker.date.recent({ days: 15 });
      const views = Math.floor(Math.random()*1000);
      const text = `<div><h1>${faker.lorem.words()}</h1><p>${faker.lorem.paragraph()}</p><p>${faker.lorem.paragraph()}</p><p>${faker.lorem.paragraph()}</p><p>${faker.lorem.paragraph()}</p><p>${faker.lorem.paragraph()}</p><p>${faker.lorem.paragraph()}</p><p>${faker.lorem.paragraph()}</p><ul><li>${faker.lorem.word()}</li><li>${faker.lorem.word()}</li></ul><p>${faker.lorem.paragraph()}</p></div>`;
      const image_url = faker.image.url({height:1800,width:1920});
      const sanitizedText = sanitizeHtml(text);
  
      await databaseService.article.create({
        data: {
          id_writer,
          title,
          date,
          views,
          text,
          sanitizedText,
          image_url
        }
      }).catch((err:any) => {
        console.error("Error creating article: ", err);
      });
    }
  }


async function crearFollowers(databaseService : PrismaClient) {
    const localNumberOfEntries = numberOfEntries*2;
    const allUserIds = await databaseService.users.findMany({
        select: {
            id_user: true
        }
    });

    for (let i = 0; i < localNumberOfEntries; i++) {
        const id_follower = allUserIds[Math.floor(Math.random() * allUserIds.length)].id_user;
        let id_following = allUserIds[Math.floor(Math.random() * allUserIds.length)].id_user;

        while (id_follower === id_following) {
            id_following = allUserIds[Math.floor(Math.random() * allUserIds.length)].id_user;
        }

        await databaseService.follower.create({
            data: {
                id_follower,
                id_following
            }
        }).catch((err:any) => {
            console.error("Error creating follower: ", err); // va a fallar cuando por suerte vuelvan a salir 2 veces los mismos numeros
        });
    }
}

async function crearSaved(databaseService : PrismaClient) {

    const allUserIds = await databaseService.users.findMany({
        select: {
            id_user: true
        }
    });

    const allArticleIds = await databaseService.article.findMany({
        select: {
            id_article: true
        }
    });

    for (let i = 0; i < numberOfEntries; i++) {
        const id_user = allUserIds[Math.floor(Math.random() * allUserIds.length)].id_user;
        const id_article = allArticleIds[Math.floor(Math.random() * allArticleIds.length)].id_article;
        // const date = faker.date.recent({ days: 10 });
        const date = faker.date.recent({days: 10});

        await databaseService.saved.create({
            data: {
                id_user,
                id_article,
                date
            }
        }).catch((err:any) => {
            console.error("Error creating saved: ", err);
        });
    }
}

async function crearCategories(databaseService : PrismaClient) {
    const categories = ['U.S. NEWS','COMEDY','PARENTING','WORLD NEWS','ARTS & CULTURE','TECH','SPORTS','ENTERTAINMENT','POLITICS','WEIRD NEWS','ENVIRONMENT','EDUCATION','CRIME','SCIENCE','WELLNESS','BUSINESS','STYLE & BEAUTY','FOOD & DRINK','MEDIA','QUEER VOICES','HOME & LIVING','WOMEN','BLACK VOICES','TRAVEL','MONEY','RELIGION','LATINO VOICES','IMPACT','WEDDINGS & DIVORCES','GOOD NEWS','FIFTY']

    for (const cat of categories) {
        await databaseService.categories.create({
            data: {
                cat_name: cat
            }
        }).catch((err:any) => {
            console.error("Error creating saved: ", err);
        });
    };
}


async function crearArticleHasCategories(databaseService : PrismaClient) {
    const allCategoriesId = await databaseService.categories.findMany({
        select: {
            id_category: true
        }
    });

    const allArticleIds = await databaseService.article.findMany({
        orderBy: {
            id_article: 'desc',  // Order by id_article in descending order to get latest articles
        },
        take: numberOfEntries,
        select: {
            id_article: true
        },
    });
    for (const article of allArticleIds) {
        const cantidadCategorias = Math.ceil(Math.random() * 4);
        const usedCategories:number[] = [];
        for (let i = 0; i < cantidadCategorias; i++) {
            let id_category = allCategoriesId[Math.floor(Math.random() * allCategoriesId.length)].id_category;
        
            while (usedCategories.includes(id_category)) {
                id_category = allCategoriesId[Math.floor(Math.random() * allCategoriesId.length)].id_category;
            }
            usedCategories.push(id_category)
            await databaseService.article_has_categories.create({
                data: {
                    articles_id_article: article.id_article,
                    categories_id_categories: id_category
                }
            }).catch((err:any) => {
                console.error("Error creating saved: ",err);// falla cuando por suerte un articulo queda con 2 veces la misma categoria de la que ya esta en la db
            });
        };
    };
}

async function crearComunidades(databaseService : PrismaClient) {

    const numberOfEntries = 20;
    const allUserIds = await databaseService.users.findMany({
        select: {
            id_user: true
        }
    });
    const names:string[] = [];
    for (let i = 0; i < numberOfEntries; i++) {
        let nombre = `${faker.commerce.department()}-${faker.commerce.productAdjective()}-${Math.random().toString(36).substring(2, 8)}`;
        const creator = allUserIds[Math.floor(Math.random() * allUserIds.length)].id_user;
        const descripcion = Math.random() < 0.5 ? faker.commerce.productDescription() : null;
        const date = faker.date.recent({days: 10});
        const avatar = faker.image.avatar()
        const banner = faker.image.url({height:500,width:1500})
        
        while (names.includes(nombre)){
            nombre = `${faker.commerce.department()}-${faker.commerce.productAdjective()}-${Math.random().toString(36).substring(2, 8)}`;
        }
        names.push(nombre);
        try{

            const comunidadCreada = await databaseService.community.create({
                data: {
                name: nombre,
                description: descripcion,
                creator_id: creator,
                date: date,
                avatar_url: avatar,
                banner_url: banner,
            }
        })

        await databaseService.community_has_users.create({
            data: {
                users_id_community: creator,
                community_id_community: comunidadCreada.id_community
                
            }
        })
        }
        catch(err:any){
            console.error("Error creating saved: ", err);
        }

        

    };
}

async function crearCommunityHasArticle(databaseService : PrismaClient) {
    const localNumberOfEntries = Math.ceil(numberOfEntries/3)
    const allCommunitysId = await databaseService.community.findMany({
        select: {
            id_community: true
        }
    });

    const allArticleIds = await databaseService.article.findMany({
        select: {
            id_article: true
        }
    });

    const allUserIds = await databaseService.users.findMany({
        select: {
            id_user: true
        }
    });

    for (let i = 0; i < localNumberOfEntries; i++) {
        const id_article = allArticleIds[Math.floor(Math.random() * allArticleIds.length)].id_article
        const id_community = allCommunitysId[Math.floor(Math.random() * allCommunitysId.length)].id_community
        const id_user = allUserIds[Math.floor(Math.random() * allUserIds.length)].id_user
        await databaseService.community_has_articles.create({
            data: {
                article_id_community: id_article,
                community_id_community: id_community,
                users_id_community: id_user
            }
        }).catch((err:any) => {
            console.error("Error creating saved: ", err); // falla cuando por suerte un articulo queda con 2 veces la misma categoria
        });
    };
};

async function crearCommunityHasCategorys(databaseService : PrismaClient) {
    const localNumberOfEntries = Math.ceil(numberOfEntries/3)
    const allCommunitysId = await databaseService.community.findMany({
        select: {
            id_community: true
        }
    });

    const allCategoriesId = await databaseService.categories.findMany({
        select: {
            id_category: true
        }
    });

    for (let i = 0; i < localNumberOfEntries; i++) {
        let id_category = allCategoriesId[Math.floor(Math.random() * allCategoriesId.length)].id_category
        const id_community = allCommunitysId[Math.floor(Math.random() * allCommunitysId.length)].id_community
       
        await databaseService.community_has_categories.create({
            data: {
                categories_id_community: id_category,
                community_id_community: id_community
            }
        }).catch((err:any) => {
            console.error("Error creating saved: ", err); // falla cuando por suerte un articulo queda con 2 veces la misma categoria
        });
    };
};

async function crearCommunityHasUsers(databaseService : PrismaClient) {
    const allCommunitysId = await databaseService.community.findMany({
        select: {
            id_community: true
        }
    });

    const allUserIds = await databaseService.users.findMany({
        select: {
            id_user: true
        }
    });

    for (let i = 0; i < numberOfEntries; i++) {
        let id_user = allUserIds[Math.floor(Math.random() * allUserIds.length)].id_user;
        const id_community = allCommunitysId[Math.floor(Math.random() * allCommunitysId.length)].id_community;
        
        await databaseService.community_has_users.create({
            data: {
                users_id_community: id_user,
                community_id_community: id_community
            }
        }).catch((err:any) => {
            console.error("Error creating saved: ", err); // falla cuando por suerte un articulo queda con 2 veces la misma categoria
        });
    };
};
