import { getSignedUrl } from "@aws-sdk/cloudfront-signer";

const cloudFrontUrl = process.env.CLOUDFRONT_URL?.trim();
const cloudFrontKeyPairId =
  process.env.CLOUDFRONT_KEY_PAIR_ID?.trim();

const cloudFrontPrivateKey = process.env.CLOUDFRONT_PRIVATE_KEY
  ?.replace(/\\n/g, "\n")
  .trim();

if (!cloudFrontUrl) {
  throw new Error(
    "CLOUDFRONT_URL environment variable is missing"
  );
}

if (!cloudFrontKeyPairId) {
  throw new Error(
    "CLOUDFRONT_KEY_PAIR_ID environment variable is missing"
  );
}

if (!cloudFrontPrivateKey) {
  throw new Error(
    "CLOUDFRONT_PRIVATE_KEY environment variable is missing"
  );
}

if (
  !cloudFrontPrivateKey.includes("-----BEGIN PRIVATE KEY-----") ||
  !cloudFrontPrivateKey.includes("-----END PRIVATE KEY-----")
) {
  throw new Error("CLOUDFRONT_PRIVATE_KEY has an invalid PEM format");
}

export const generateCloudFrontSignedUrl = (
  objectKey?: string | null,
  expiresInSeconds = 60 * 60
): string | null => {
  // Some database records may not contain an image.
  if (typeof objectKey !== "string" || !objectKey.trim()) {
    return null;
  }

  const normalizedBaseUrl = cloudFrontUrl.replace(/\/+$/, "");

  // Handle either an S3 object key or an existing full URL.
  let normalizedObjectKey = objectKey.trim();

  if (
    normalizedObjectKey.startsWith("http://") ||
    normalizedObjectKey.startsWith("https://")
  ) {
    try {
      const parsedUrl = new URL(normalizedObjectKey);
      normalizedObjectKey = parsedUrl.pathname;
    } catch {
      return null;
    }
  }

  normalizedObjectKey = normalizedObjectKey
    .replace(/^\/+/, "")
    .split("/")
    .map((part) => encodeURIComponent(decodeURIComponent(part)))
    .join("/");

  if (!normalizedObjectKey) {
    return null;
  }

  return getSignedUrl({
    url: `${normalizedBaseUrl}/${normalizedObjectKey}`,
    keyPairId: cloudFrontKeyPairId,
    privateKey: cloudFrontPrivateKey,
    dateLessThan: new Date(
      Date.now() + expiresInSeconds * 1000
    ),
  });
};