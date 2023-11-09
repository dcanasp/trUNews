import { z } from 'zod';
import { createEventSchema } from '../middleware/dataValidation/schemas'; // Asegúrate de importar el esquema adecuado

export type createEventType = z.infer<typeof createEventSchema>;
  
export interface eventType {
    id_event: number;
    creator_id: number;
    community_id: number;
    name: string;
    description: string | null;
    place: string;
    date: Date;
    image_url: string;
}

export interface returnEvent {
    id_event: number;
    creator_id: number;
    community_id: number;
    name: string;
    description: string | null;
    place: string;
    date: Date;
    image_url: string;
    attending: boolean;
    attending_count: number;
}
