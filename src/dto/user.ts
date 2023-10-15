import { z } from 'zod'
import { checkPasswordSchema, createUserSchema, decryptJWTSchema } from '../middleware/dataValidation/schemas'

export type createUserType = z.infer<typeof createUserSchema>
export type chechPasswordType = z.infer<typeof checkPasswordSchema>

export interface redoTokenType {
    userId:number,
    rol:number
}

export type decryptJWT = z.infer<typeof decryptJWTSchema>

export interface imageType{
    contenido:string,
    extension:string,
    width:number,
    ratio:string
}

export interface UserfollowerSum extends databaseUser {
    followersCount: number;
    followingsCount: number;
}

export interface databaseUser {
        id_user: number;
        username: string;
        name: string;
        lastname: string;
        rol: number;
        password?: string; 
        profession?: string | null;
        description?: string | null;
        image_url?: string | null;
}

export interface followerType {
    id_user: number;
    username: string;
    name: string;
    lastname: string;
    rol: number;
    profile_image: string;
  }
  

export interface decryptedToken {
    userId:number,
    rol:number,
    iat: number,
    exp: number

} 