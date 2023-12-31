import { z } from 'zod';
import { createCommunitySchema,checkArticleToAddSchema,addArticleCommunitySchema } from '../middleware/dataValidation/schemas'; // Asegúrate de importar el esquema adecuado

export type createCommunityType = z.infer<typeof createCommunitySchema>;
export type checkArticleToAddType = z.infer<typeof checkArticleToAddSchema>;
export type addArticleCommunityType = z.infer<typeof addArticleCommunitySchema>;

export interface communityHasUsersType {
    users_id_community: number;
    community_id_community: number;
  }
  
export interface communityType {
    id_community: number;
    name: string;
    description: string | null;
    creator_id: number;
    date: Date;
    avatar_url: string;
    banner_url: string;
  }
  export interface communityTypeWithUsers extends communityType{
    community_has_users: communityHasUsersType[]; 
  }  

export interface communityTypeExtended extends communityType {
  followerCount: number,
  isMember: boolean
  isCreator?: false,
  membersCount?: number,
  articlesCount?: number
}