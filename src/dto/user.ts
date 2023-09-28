import { z } from 'zod'
import { checkPasswordSchema, createUserSchema, decryptJWTSchema } from '../middleware/dataValidation/schemas'

export type createUserType = z.infer<typeof createUserSchema>
export type chechPasswordType = z.infer<typeof checkPasswordSchema>

export interface redoTokenType {
    userId:number,
    hash:string,
    rol:number
}

export type decryptJWT = z.infer<typeof decryptJWTSchema>

export interface imageType{
    buffer:Buffer,
    extension:string,
    width:number,
    ratio:string
}