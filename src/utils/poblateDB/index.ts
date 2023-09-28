import "reflect-metadata";
import {container} from 'tsyringe';
import {DatabaseService} from '../../db/databaseService';
import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import {hashPassword} from '../createHash'


const database = container.resolve(DatabaseService).getClient();
const numberOfEntries = 300;
main()
async function main(){
  await crearUsuarios(database);
  await crearArticulos(database);
  await crearFollowers(database);
  await crearSaved(database);
  await crearCategories(database);
  await crearArticleHasCategories(database);
}
async function crearUsuarios(databaseService: PrismaClient) {
  for (let i = 0; i < numberOfEntries; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const username = faker.internet.displayName({ firstName, lastName });
    const hash = await hashPassword("password");
    
    const rol = Math.floor(Math.random() * 3);
    const profession = Math.random() < 0.5 ? faker.person.jobTitle() : null; // 50% que sea nulo
    const description = Math.random() < 0.5 ? faker.lorem.sentence() : null; // 50% que sea nulo
    
    await databaseService.users.create({
      data: {
        name: firstName,
        lastname: lastName,
        username,
        hash,
        rol,
        profession,
        description
      }
    }).catch((err) => {
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
    const date = faker.date.recent({ days: 60 });
    const views = Math.floor(Math.random()*1000);
    const text = `<div><h1>${faker.lorem.words()}</h1><p>${faker.lorem.paragraph()}</p><ul><li>${faker.lorem.word()}</li><li>${faker.lorem.word()}</li></ul><p>${faker.lorem.paragraph()}</p></div>`;
    const image_url = faker.image.url();

    await databaseService.article.create({
      data: {
        id_writer,
        title,
        date,
        views,
        text,
        image_url
      }
    }).catch((err) => {
      console.error("Error creating article: ", err);
    });
  }
}


async function crearFollowers(databaseService: PrismaClient) {
  const numberOfEntries = 500;
  const allUserIds = await databaseService.users.findMany({
    select: {
      id_user: true
    }
  });

  for (let i = 0; i < numberOfEntries; i++) {
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
    }).catch((err) => {
      console.error("Error creating follower: ", err); //va a fallar cuando por suerte vuelvan a salir 2 veces los mismos numeros 
    });
  }
}

async function crearSaved(databaseService: PrismaClient) {

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
    const date = faker.date.recent().toISOString().split('T')[0]; 

    await databaseService.saved.create({
      data: {
        id_user,
        id_article,
        date
      }
    }).catch((err) => {
      console.error("Error creating saved: ", err);
    });
  }
}

async function crearCategories(databaseService: PrismaClient) {
  const categories = ['U.S. NEWS', 'COMEDY', 'PARENTING', 'WORLD NEWS', 'ARTS & CULTURE','TECH', 'SPORTS', 'ENTERTAINMENT', 'POLITICS', 'WEIRD NEWS','ENVIRONMENT', 'EDUCATION', 'CRIME', 'SCIENCE', 'WELLNESS','BUSINESS', 'STYLE & BEAUTY', 'FOOD & DRINK', 'MEDIA','QUEER VOICES', 'HOME & LIVING', 'WOMEN', 'BLACK VOICES', 'TRAVEL','MONEY', 'RELIGION', 'LATINO VOICES', 'IMPACT','WEDDINGS & DIVORCES', 'GOOD NEWS', 'FIFTY']
  
  for (const cat of categories) {
    await databaseService.categories.create({
      data: {
        cat_name:cat
        }
    }).catch((err) => {
      console.error("Error creating saved: ", err);
    });
  };
}


async function crearArticleHasCategories(databaseService: PrismaClient) {
  const allCategoriesId = await databaseService.categories.findMany({
    select: {
      id_category: true
    }
  });

  const allArticleIds = await databaseService.article.findMany({
    select: {
      id_article: true
    }
  });
  for (const article of allArticleIds) {
    const cantidadCategorias = Math.ceil(Math.random()*4);
    for (let i=0;i<cantidadCategorias;i++){
      const id_category = allCategoriesId[Math.floor(Math.random() * allCategoriesId.length)].id_category;
      await databaseService.article_has_categories.create({
        data: {
          articles_id_article: article.id_article,
          categories_id_categories: id_category
        }
      }).catch((err) => {
        console.error("Error creating saved: ", err);//falla cuando por suerte un articulo queda con 2 veces la misma categoria
      });
    };
  };
}