import { SecretManagerServiceClient } from '@google-cloud/secret-manager';

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const client = new SecretManagerServiceClient();

const projectId = process.env.GCP_PROJECT;

if (!projectId) {
  throw new Error('GCP_PROJECT environment variable is not set');
}

/**
 * Get secret from:
 * - .env in local/dev
 * - Google Secret Manager in production
 */
export async function getSecret(name: string): Promise<string> {
  if (process.env.NODE_ENV !== 'production') {
    const localValue = process.env[name];

    if (!localValue) {
      throw new Error(`Missing local env variable: ${name}`);
    }

    return localValue;
  }

  const [version] = await client.accessSecretVersion({
    name: `projects/${projectId}/secrets/${name}/versions/latest`,
  });

  const payload = version.payload?.data;

  if (!payload) {
    throw new Error(`No payload found for secret: ${name}`);
  }

  return payload.toString();
}
