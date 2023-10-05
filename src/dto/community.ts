export interface communityHasUsersType {
    users_id_community: number;
    community_id_community: number;
  }
  
export interface communityType {
    id_community: number;
    name: string;
    description: string | null;
    creator_id: number;
    date: string;
    avatar_url: string;
    banner_url: string;
    community_has_users: communityHasUsersType[];
  }
  