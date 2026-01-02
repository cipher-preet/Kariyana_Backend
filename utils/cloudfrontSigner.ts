import { getSignedUrl } from "@aws-sdk/cloudfront-signer";
import path from "path";
import fs from "fs";


const CLOUDFRONT_URL = process.env.CLOUDFRONT_URL;

const KEY_PAIR_ID = process.env.CLOUDFRONT_KEY_PAIR_ID!;

const privateKey = fs.readFileSync(
  path.join(process.cwd(), "Config/cloudfront", "private_key.pem"),
  "utf8"
);
export const generateCloudFrontSignedUrl = (objectKey: string) => {
  return getSignedUrl({
    url: `${CLOUDFRONT_URL}/${objectKey}`,
    keyPairId: KEY_PAIR_ID,
    privateKey,
    dateLessThan: new Date(Date.now() + 60 * 60 * 1000),
  });
};
