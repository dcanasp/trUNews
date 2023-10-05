import { z } from 'zod';
import { createArticleSchema } from '../middleware/dataValidation/schemas'; // Asegúrate de importar el esquema adecuado

export type createArticleType = z.infer<typeof createArticleSchema>;

export interface returnArticles {
    id_article: number;
    id_writer: number;
    title: string;
    date: Date;
    views: number;
    image_url: string;
    text: string;
    username: string;
    name: string;
    lastname: string;
  }