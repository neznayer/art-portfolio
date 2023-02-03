import {
  PutObjectCommand,
  type PutObjectCommandInput,
} from "@aws-sdk/client-s3";
import s3 from "../../utils/s3Client";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "crypto";
import { type NextApiRequest, type NextApiResponse } from "next";

// AWS sdk v3 uses signatureVersion 4 by default

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const ext = (req.query.fileType as string).split("/")[1] as string;
  const Key = `${randomUUID()}.${ext}`;
  const bucket = process.env.BUCKET_NAME as string;
  const region = process.env.REGION as string;

  const putObjectParams: PutObjectCommandInput = {
    Key,
    Bucket: process.env.BUCKET_NAME,
    ContentType: `image/${ext}`,
  };

  try {
    const command = new PutObjectCommand(putObjectParams);
    const putUrl = await getSignedUrl(s3, command, { expiresIn: 60 });

    return res.status(200).json({
      putUrl,
      getUrl: `https://${bucket}.s3.${region}.amazonaws.com/${Key}`,
      key: Key,
    });
  } catch (error) {
    return res.status(500).json({ message: "Some error has occurred" });
  }
}
