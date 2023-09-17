import rateLimit from 'express-rate-limit';

export const rateLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hrs in milliseconds
  max: 200,
  message: 'has mandado mas de 200 request en 24 horas, sospechamos actividad invalida', 
  standardHeaders: true,
  legacyHeaders: false,
});