import { S3Client } from "@aws-sdk/client-s3";

class S3Singleton {
  private static instance: S3Client;
  private constructor() {
  }

  public static getInstance(): S3Client {
    if (!S3Singleton.instance) {
      const region = process.env.AWS_REGION;
      S3Singleton.instance = new S3Client({ region });
    }
    return S3Singleton.instance;
  }
}

export const client = S3Singleton.getInstance();

// import { S3Client } from "@aws-sdk/client-s3";
// const region = process.env.AWS_REGION;
// export const client = new S3Client({region:region});
