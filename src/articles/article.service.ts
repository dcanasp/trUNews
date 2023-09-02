import { DatabaseService } from '../conectionDB/databaseService';
import { logger, permaLogger } from '../utils/logger';
import { createArticleSchema } from '../middleware/dataValidation/schemas';
import { z } from 'zod';
import { createArticleType } from '../types/article'; // Asegúrate de importar el tipo adecuado

export class ArticleService {
  constructor(private databaseService: DatabaseService) {}

  public async getArticleById(articleId: string) {
    const articleId2 = parseInt(articleId, 10);
    return await this.databaseService.getClient().article.findFirst({ where: { id_article: articleId2 } });
  }

  public async createArticle(body: createArticleType) {
    // Aquí debes implementar la lógica para crear un artículo en la base de datos
    // Esto puede implicar la creación de registros en múltiples tablas si es necesario
    // Debes retornar el artículo creado o los datos relevantes del artículo
  }

  public async updateArticle(articleId: string, body: any) {
    const articleId2 = parseInt(articleId, 10);
    // Implementa la lógica para actualizar un artículo en la base de datos
    // Debes retornar el artículo actualizado o los datos relevantes del artículo actualizado
  }

  public async deleteArticle(articleId: string) {
    const articleId2 = parseInt(articleId, 10);
    // Implementa la lógica para eliminar un artículo de la base de datos
    // Puedes retornar un mensaje de éxito o cualquier otra información relevante
  }

  // Puedes agregar más métodos de servicio relacionados con los artículos según sea necesario
}
