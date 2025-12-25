import { getSecret } from "../secretManager";

export type CloudFrontSecrets = {
  CLOUDFRONT_URL: string;
  KEY_PAIR_ID: string;
  privateKey: string;
};

let cachedSecrets: CloudFrontSecrets | null = null;
let secretsPromise: Promise<CloudFrontSecrets> | null = null;

export async function loadCloudFrontSecrets(): Promise<CloudFrontSecrets> {
  if (cachedSecrets) return cachedSecrets;

  // prevent parallel secret fetches
  if (!secretsPromise) {
    secretsPromise = (async () => {
      const [CLOUDFRONT_URL, KEY_PAIR_ID, privateKeyRaw] =
        await Promise.all([
          getSecret("CLOUDFRONT_URL"),
          getSecret("CLOUDFRONT_KEY_PAIR_ID"),
          getSecret("PRIVATE_KEY_PEM"),
        ]);

      if (!CLOUDFRONT_URL || !KEY_PAIR_ID || !privateKeyRaw) {
        throw new Error("Missing CloudFront secrets");
      }

      // 🔥 FIX PEM formatting
      const privateKey = privateKeyRaw.replace(/\\n/g, "\n");

      cachedSecrets = {
        CLOUDFRONT_URL,
        KEY_PAIR_ID,
        privateKey,
      };

      return cachedSecrets;
    })();
  }

  return secretsPromise;
}
