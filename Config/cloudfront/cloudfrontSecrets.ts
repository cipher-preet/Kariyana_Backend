import { getSecret } from "../secretManager";

export type CloudFrontSecrets = {
  CLOUDFRONT_URL: string;
  KEY_PAIR_ID: string;
  privateKey: string;
};

let cachedSecrets: CloudFrontSecrets | null = null;

export async function loadCloudFrontSecrets(): Promise<CloudFrontSecrets> {
  if (cachedSecrets) return cachedSecrets;

  const [CLOUDFRONT_URL, KEY_PAIR_ID, privateKey] = await Promise.all([
    getSecret("CLOUDFRONT_URL"),
    getSecret("CLOUDFRONT_KEY_PAIR_ID"),
    getSecret("PRIVATE_KEY_PEM"),
  ]);

  cachedSecrets = {
    CLOUDFRONT_URL,
    KEY_PAIR_ID,
    privateKey,
  };

  return cachedSecrets;
}
