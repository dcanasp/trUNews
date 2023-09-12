import "reflect-metadata";
import { PrismaClient } from '@prisma/client';
import { injectable } from 'tsyringe'
const prisma = new PrismaClient();
@injectable()
export class DatabaseService {
  private static instance: DatabaseService | null = null;
  private client = prisma;

  public constructor() {
  
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

// const dbService = DatabaseService.getInstance();
// const prismaClient = dbService.getClient();
