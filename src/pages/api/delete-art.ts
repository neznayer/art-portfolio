import {
  DeleteObjectCommand,
  type DeleteObjectCommandInput,
} from "@aws-sdk/client-s3";
import s3 from "../../utils/s3Client";
import { type NextApiRequest, type NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const Key = req.query.key as string;
  const bucket = process.env.BUCKET_NAME as string;

  const deleteObjectParams: DeleteObjectCommandInput = {
    Key,
    Bucket: bucket,
  };

  try {
    const command = new DeleteObjectCommand(deleteObjectParams);

    const response = await s3.send(command);

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ message: "Some error has occurred" });
  }
}
