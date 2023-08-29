import { z } from "zod";

export const createUserSchema = z.object({
    // "name":"pruena","password":"david","rol":1,"profesion":"escritor"
    name: z.string({ required_error:"Debe haber name"}),
    password: z.string(),
    rol: z.number().refine(value => value === 0 ||  value === 1, {message: "Debe ser 0 o 1"}),
    NOMBREPARAMETRO: z.date( 
        {invalid_type_error: "Debe ser una fecha",
        required_error:"debe estar"} ),
    profession: z.string().optional()
}).strict();


export const checkPasswordSchema = z.object({
    username: z.string({required_error:"debe haber username"}),
    password: z.string({required_error:"debe haber username"})
}).strict()