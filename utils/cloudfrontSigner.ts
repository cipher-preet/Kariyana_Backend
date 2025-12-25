import { getSignedUrl } from "@aws-sdk/cloudfront-signer";
import fs from "fs";
import path from "path";

const CLOUDFRONT_URL = process.env.CLOUDFRONT_URL!;
const KEY_PAIR_ID = process.env.CLOUDFRONT_KEY_PAIR_ID!;

// const privateKeyPath = path.join(
//   __dirname,
//   "../config/cloudfront/private_key.pem"
// );

// const privateKey = fs.readFileSync(privateKeyPath, "utf8");
const privateKey = process.env.PRIVATE_KEY_PEM as string

export const generateCloudFrontSignedUrl = (objectKey: string) => {
  return getSignedUrl({
    url: `${CLOUDFRONT_URL}/${objectKey}`,
    keyPairId: KEY_PAIR_ID,
    privateKey,
    dateLessThan: new Date(Date.now() + 60 * 60 * 1000),
  });
};
