import "reflect-metadata";
import { APIGatewayProxyHandler } from "aws-lambda";
import {container} from 'tsyringe';
import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import {DatabaseService} from '../../db/databaseService';
import {hashPassword} from '../createHash';
import {sanitizeHtml} from '../sanitizeHtml';
import {main} from './index';
const database = container.resolve(DatabaseService).getClient();
const numberOfEntries = 30;


export const handler: APIGatewayProxyHandler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;  // Important for DB connections
  try {
    await main();
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Data populated successfully",
      }),
    };
  } catch (e) {
    console.error("Error in Lambda: ", e);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Internal Server Error",
      }),
    };
  }
};