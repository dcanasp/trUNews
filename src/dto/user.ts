import { z } from 'zod'
import { checkPasswordSchema, createUserSchema,addImageSchema } from '../middleware/dataValidation/schemas'

export type createUserType = z.infer<typeof createUserSchema>
export type chechPasswordType = z.infer<typeof checkPasswordSchema>

export interface redoTokenType {
    userId:number,
    hash:string,
    rol:number
}

export type addImageType = z.infer<typeof addImageSchema>