import { z } from "zod";

export const createUserSchema = z.object({
    username: z.string({required_error: "Debe haber un username UNICO"}),
    name: z.string({ required_error:"Debe haber name"}),
    password: z.string(),
    lastname: z.string({ required_error: "Debe haber lastname"}),
    rol: z.number().refine(value => value === 0 ||  value === 1 || value===2, {message: "Debe ser 1 o 2"}),
    profession: z.string().optional(),
    description: z.string().optional(),
    profile_image: z.string().optional(),
    image_extension: z.string().optional().default('.png'),
}).strict();


export const checkPasswordSchema = z.object({
    username: z.string({required_error:"debe haber username"}),
    password: z.string({required_error:"debe haber password"})
}).strict()

export const decryptJWTSchema = z.object({
  token: z.string({required_error:"debe haber token"})

})

export const addCategoriesSchema = z.object({
    id_writer: z.number(),
    article: z.number(),
    categories: z.string().array()
})


export const createArticleSchema = z.object({
    title: z.union([z.string(), z.null()]).optional(),
    date: z.date({
        invalid_type_error: "Debe ser una fecha",
        required_error: "Debe haber una fecha"
    }),
    views: z.number().optional(),
    id_writer: z.number(),
    text: z.string({ required_error: "Debe haber un texto" }),
    image_url: z.any({}).refine((val: any) => val !== undefined),
    image_extension: z.string(),
    ancho: z.number(),
    image_ratio: z.string()
    // z.number({ required_error: "Debe haber ua imagen" }),
}).strict();

export const createCommunitySchema = z.object({
    name: z.string({ required_error: "Debe haber un nombre de comunidad" }),
    description: z.string().optional(),
    creator_id: z.number({ required_error: "Debe haber un ID de creador" }),
    date: z.date({
      invalid_type_error: "Debe ser una fecha válida",
      required_error: "Debe haber una fecha",
    }),
    avatar_url: z.any({}).refine((val: any) => val !== undefined),
    avatar_extension: z.string(),
    avatar_ancho: z.number(),
    avatar_ratio: z.string(),
    banner_url: z.any({}).refine((val: any) => val !== undefined),
    banner_extension: z.string(),
    banner_ancho: z.number(),
    banner_ratio: z.string(),
    id_categories: z.number().array().optional(),
  }).strict();


export const checkArticleToAddSchema = z.object({
    userId: z.number({}),
    communityId: z.number({}),
})
export const addArticleCommunitySchema = z.object({
    articleId: z.number({}),
    communityId: z.number({}),
})