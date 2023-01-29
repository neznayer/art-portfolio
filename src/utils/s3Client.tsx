import { S3Client } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  apiVersion: "2006-03-01",
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY || "",
    secretAccessKey: process.env.SECRET_KEY || "",
  },
});

export default s3;
