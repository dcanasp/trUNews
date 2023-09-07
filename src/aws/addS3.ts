// npx aws-sdk-js-codemod -t v2-to-v3 'src/aws/addS3.ts' // para pasar a v3
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { permaLogger } from "../utils/logger";
import {client} from './s3Instance'

const bucket = process.env.S3_BUCKET;

export const uploadToS3 = async (fileName: string, fileContent: Buffer) => {
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: fileName,
    Body: fileContent,
  });

  try {
    const response = await client.send(command);
    permaLogger.log('info',response);
    return response.$metadata.requestId;
} catch (err) {
    permaLogger.log('error',err);
    return ;
  }
};


