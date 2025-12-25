import { getSignedUrl } from "@aws-sdk/cloudfront-signer";
import { loadCloudFrontSecrets } from "../Config/cloudfront/cloudfrontSecrets";


const CLOUDFRONT_URL = process.env.CLOUDFRONT_URL!;
// const CLOUDFRONT_URL = getSecret("CLOUDFRONT_URL")

const KEY_PAIR_ID = process.env.CLOUDFRONT_KEY_PAIR_ID!;
// const KEY_PAIR_ID = getSecret("KEY_PAIR_ID")

// const privateKeyPath = path.join(
//   __dirname,
//   "../config/cloudfront/private_key.pem"
// );

// const privateKey = fs.readFileSync(privateKeyPath, "utf8");
const privateKey = process.env.PRIVATE_KEY_PEM as string

// const privateKey = getSecret("privateKey")

export const generateCloudFrontSignedUrl = (objectKey: string) =>  {
  // const { CLOUDFRONT_URL, KEY_PAIR_ID, privateKey } = await loadCloudFrontSecrets();
  // console.log(CLOUDFRONT_URL,KEY_PAIR_ID,privateKey,"99999999999")

  return getSignedUrl({
    url: `${CLOUDFRONT_URL}/${objectKey}`,
    keyPairId: KEY_PAIR_ID,
    privateKey,
    dateLessThan: new Date(Date.now() + 60 * 60 * 1000),
  });
};
