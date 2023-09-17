import { z } from 'zod';
import { createArticleSchema } from '../middleware/dataValidation/schemas'; // Asegúrate de importar el esquema adecuado

export type createArticleType = z.infer<typeof createArticleSchema>;
