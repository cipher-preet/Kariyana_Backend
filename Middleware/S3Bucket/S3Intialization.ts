import {
  S3Client,
  GetObjectCommand,
  DeleteObjectCommand,
  DeleteObjectsCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

//---------------------------------------------------------------------------------------------
// Intialization of S3 client

const accesesKey = process.env.ACCESS_KEY_ID as string
const secretAccessKey = process.env.SECREATE_KEY_ACCESS as string

export const S3 = new S3Client({
     region: "ap-south-1",
  credentials: {
    accessKeyId: accesesKey,
    secretAccessKey: secretAccessKey
  }
})

//---------------------------------------------------------------------------------------------
