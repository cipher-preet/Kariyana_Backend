import { getSecret } from "../Config/secretManager";

type AwsSecrets = {
  accessKeyId: string;
  secretAccessKey: string;
};

let cachedAwsSecrets: AwsSecrets | null = null;

export async function loadAwsSecrets(): Promise<AwsSecrets> {
  if (cachedAwsSecrets) return cachedAwsSecrets;

  const [accessKeyId, secretAccessKey] = await Promise.all([
    getSecret("ACCESS_KEY_ID"),
    getSecret("SECREATE_KEY_ACCESS"),
  ]);

  cachedAwsSecrets = {
    accessKeyId,
    secretAccessKey,
  };

  return cachedAwsSecrets;
}
