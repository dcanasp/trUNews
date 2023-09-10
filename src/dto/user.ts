import { z } from 'zod'
import { checkPasswordSchema, createUserSchema } from '../middleware/dataValidation/schemas'

export type createUserType = z.infer<typeof createUserSchema>
export type chechPasswordType = z.infer<typeof checkPasswordSchema>

export interface redoTokenType {
    userId:number,
    hash:string,
    rol:number
}