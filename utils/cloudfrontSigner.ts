import { getSignedUrl } from "@aws-sdk/cloudfront-signer";


const CLOUDFRONT_URL = process.env.CLOUDFRONT_URL!;

const KEY_PAIR_ID = process.env.CLOUDFRONT_KEY_PAIR_ID!;

const privateKey = process.env.PRIVATE_KEY_PEM as string


export const generateCloudFrontSignedUrl = (objectKey: string) =>  {

  return getSignedUrl({
    url: `${CLOUDFRONT_URL}/${objectKey}`,
    keyPairId: KEY_PAIR_ID,
    privateKey,
    dateLessThan: new Date(Date.now() + 60 * 60 * 1000),
  });
};
