import type { AppEnvSchema } from './env';
import type { AppConfig } from './types';

let appConfigInstance: AppConfig | null = null;

export function createAppConfig(env: AppEnvSchema): AppConfig {
  if (appConfigInstance) {
    throw new Error('App Config has been instantiated!');
  }
  appConfigInstance = {
    port: env.APP_PORT,
    environment: env.NODE_ENV,
    commitHash: env.COMMIT_HASH,
    origin: env.ORIGIN
  };

  return appConfigInstance;
}

export function getAppConfig() {
  if (!appConfigInstance) {
    throw new Error('AppConfig not instantiated! Call createAppConfig first!');
  }
  return appConfigInstance;
}
