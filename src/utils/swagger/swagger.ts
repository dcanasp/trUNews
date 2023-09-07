const swaggerJsdoc = require("swagger-jsdoc");
export const swaggerUi = require("swagger-ui-express");
  
const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'My API',
    description: 'Description',
  },
  host: 'localhost:'+process.env.PORT,
  schemes: ['http'],
};

const outputFile = './swagger-output.json';

const endpointsFiles = ['./src/routes/user.routes.ts' ];

// PARA ACTUALIZAR SWAGGER quitar comentario abajo
// ACTIVAR SWAGGER
// swaggerAutogen(outputFile, endpointsFiles, doc);