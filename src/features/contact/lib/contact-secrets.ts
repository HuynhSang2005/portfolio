import { getCloudflareContext } from "@opennextjs/cloudflare";

type ContactSecrets = {
  TURNSTILE_SECRET_KEY?: string;
  RESEND_API_KEY?: string;
  CONTACT_TO_EMAIL?: string;
};

/**
 * Resolve contact secrets from Cloudflare Worker bindings first, then `process.env`.
 * Wrangler `secret put` values live on `env`, not automatically on `process.env`.
 */
export async function getContactSecrets(): Promise<ContactSecrets> {
  const fromProcess: ContactSecrets = {
    TURNSTILE_SECRET_KEY: process.env.TURNSTILE_SECRET_KEY,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    CONTACT_TO_EMAIL: process.env.CONTACT_TO_EMAIL,
  };

  try {
    const { env } = await getCloudflareContext({ async: true });
    const cf = env as ContactSecrets;
    return {
      TURNSTILE_SECRET_KEY: cf.TURNSTILE_SECRET_KEY ?? fromProcess.TURNSTILE_SECRET_KEY,
      RESEND_API_KEY: cf.RESEND_API_KEY ?? fromProcess.RESEND_API_KEY,
      CONTACT_TO_EMAIL: cf.CONTACT_TO_EMAIL ?? fromProcess.CONTACT_TO_EMAIL,
    };
  } catch {
    return fromProcess;
  }
}
