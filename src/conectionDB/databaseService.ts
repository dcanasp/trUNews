
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
//es un llamado normal pero si quiero cambiar de orm o cualquier cosa, solo cambio este archivo
export class DatabaseService {
    private client = prisma;
  
    public getClient() {
      return this.client;
    }
  
}