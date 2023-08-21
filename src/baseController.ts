import { Express } from 'express';

//crea una app de express que todos usaran
export interface baseController {
  registerRoutes(app: Express): void;
}