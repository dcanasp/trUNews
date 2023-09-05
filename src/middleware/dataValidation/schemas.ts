import { z } from "zod";

export const createUserSchema = z.object({
    username: z.string({required_error: "Debe haber un username UNICO"}),
    name: z.string({ required_error:"Debe haber name"}),
    password: z.string(),
    lastname: z.string({ required_error: "Debe haber lastname"}),
    rol: z.number().refine(value => value === 0 ||  value === 1, {message: "Debe ser 0 o 1"}),
    NOMBREPARAMETRO: z.date( 
        {invalid_type_error: "Debe ser una fecha",
        required_error:"debe estar"} ),
    profession: z.string().optional(),
    description: z.string().optional()

}).strict();


export const checkPasswordSchema = z.object({
    username: z.string({required_error:"debe haber username"}),
    password: z.string({required_error:"debe haber username"})
}).strict()