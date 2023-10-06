import { z } from 'zod';
import { createCommunitySchema } from '../middleware/dataValidation/schemas'; // Asegúrate de importar el esquema adecuado

export type createCommunityType = z.infer<typeof createCommunitySchema>;

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
    community_has_users: communityHasUsersType[];
  }
  