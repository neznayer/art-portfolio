import {
  GetObjectCommand,
  type GetObjectCommandInput,
} from "@aws-sdk/client-s3";
import s3 from "../../utils/s3Client";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { type NextApiRequest, type NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const key = req.query.key as string;
  const bucket = process.env.BUCKET_NAME as string;

  const bucketParams: GetObjectCommandInput = {
    Key: key,
    Bucket: bucket,
  };

  const command = new GetObjectCommand(bucketParams);

  try {
    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 60 });

    return res.status(200).json({ url: signedUrl });
  } catch (error) {
    return res.status(500).json({ message: "Some error has occurred" });
  }
}
