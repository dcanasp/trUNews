// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();
// //es un llamado normal pero si quiero cambiar de orm o cualquier cosa, solo cambio este archivo
// export class DatabaseService {
//     private client = prisma;
  
//     public getClient() {
//       return this.client;
//     }
  
// }



import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class DatabaseService {
  private static instance: DatabaseService | null = null;
  private client = prisma;

  private constructor() {
    // Private constructor to restrict new instances
  }

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  public getClient() {
    return this.client;
  }
}

// Usage
const dbService = DatabaseService.getInstance();
const prismaClient = dbService.getClient();
