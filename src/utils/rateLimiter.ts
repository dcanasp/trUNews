import rateLimit from 'express-rate-limit';

export const rateLimiter = rateLimit({
  windowMs: 1 * 10 * 60 * 1000, // 30 mins in milliseconds
  max: 1000,
  message: 'has mandado mas de 1000 request en 1 hora, sospechamos actividad invalida', 
  standardHeaders: true,
  legacyHeaders: false,
});