const swaggerJsdoc = require("swagger-jsdoc");
export const swaggerUi = require("swagger-ui-express");
  
const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Trunews',
    description: 'Back rutas',
  },
  host: 'd14b8hrwh6v3h8.cloudfront.net:'+process.env.PORT,
  schemes: ['http'],
};

const outputFile = './swagger-output.json';

const endpointsFiles = ['./src/routes/user.routes.ts' ];

// PARA ACTUALIZAR SWAGGER quitar comentario abajo
// ACTIVAR SWAGGER
// swaggerAutogen(outputFile, endpointsFiles, doc);